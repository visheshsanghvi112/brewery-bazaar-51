
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { InventoryEntry, Product, ProductVariant } from "@/types";

// Get all inventory
export const getInventoryFromFirestore = async (): Promise<InventoryEntry[]> => {
  try {
    const inventoryCollection = collection(db, "inventory");
    const querySnapshot = await getDocs(inventoryCollection);
    
    if (querySnapshot.empty) {
      console.warn("No inventory entries found in Firestore");
      return [];
    }
    
    const inventoryEntries: InventoryEntry[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        productId: data.productId || '',
        variantId: data.variantId || '',
        quantity: data.quantity || 0,
        lowStockThreshold: data.lowStockThreshold || 5,
        location: data.location,
        lastRestocked: data.lastRestocked,
        updatedAt: data.updatedAt || new Date().toISOString(),
        firestoreId: doc.id
      } as InventoryEntry;
    });
    
    return inventoryEntries;
  } catch (error) {
    console.error("Error getting inventory from Firestore:", error);
    throw error;
  }
};

// Get inventory for a specific product variant
export const getProductVariantInventory = async (productId: string, variantId: string): Promise<InventoryEntry | null> => {
  try {
    const inventoryCollection = collection(db, "inventory");
    const q = query(
      inventoryCollection, 
      where("productId", "==", productId),
      where("variantId", "==", variantId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.warn(`No inventory entry found for product ${productId}, variant ${variantId}`);
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      productId: data.productId,
      variantId: data.variantId,
      quantity: data.quantity,
      lowStockThreshold: data.lowStockThreshold,
      location: data.location,
      lastRestocked: data.lastRestocked,
      updatedAt: data.updatedAt,
      firestoreId: doc.id
    } as InventoryEntry;
    
  } catch (error) {
    console.error("Error getting product variant inventory from Firestore:", error);
    throw error;
  }
};

// Add or update inventory
export const updateInventoryInFirestore = async (inventory: Partial<InventoryEntry>): Promise<string> => {
  try {
    if (inventory.firestoreId) {
      // Update existing inventory
      const inventoryRef = doc(db, "inventory", inventory.firestoreId);
      const { firestoreId, id, ...dataToUpdate } = inventory as any;
      
      // Add updated timestamp
      const dataWithTimestamp = {
        ...dataToUpdate,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(inventoryRef, dataWithTimestamp);
      return inventory.firestoreId;
    } else {
      // Add new inventory entry
      const inventoryCollection = collection(db, "inventory");
      const { firestoreId, id, ...dataToAdd } = inventory as any;
      
      const docRef = await addDoc(inventoryCollection, {
        ...dataToAdd,
        updatedAt: new Date().toISOString()
      });
      
      return docRef.id;
    }
  } catch (error) {
    console.error("Error updating inventory in Firestore:", error);
    throw error;
  }
};

// Update inventory after order AND directly inside Product document for frontend sync
export const updateInventoryAfterOrder = async (items: {productId: string, variantId: string, quantity: number}[]): Promise<void> => {
  try {
    for (const item of items) {
      // 1. Update standalone inventory collection
      const inventory = await getProductVariantInventory(item.productId, item.variantId);
      
      if (inventory) {
        const newQuantity = Math.max(0, inventory.quantity - item.quantity);
        await updateInventoryInFirestore({
          firestoreId: inventory.firestoreId,
          quantity: newQuantity,
        });
      } else {
        console.warn(`No inventory found for product ${item.productId}, variant ${item.variantId}`);
      }

      // 2. E-Commerce Core: Sync Stock subtraction securely inside the Product Document Variants Tree
      try {
        const productRef = doc(db, "products", item.productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const productData = productSnap.data();
          if (productData.variants) {
            let totalRemainingStock = 0;
            const updatedVariants = productData.variants.map((v: any) => {
              let variantStock = v.stock;
              if (v.id === item.variantId || v.id === "") { // Some variants might lack ID in prototype structure
                variantStock = Math.max(0, (v.stock || 0) - item.quantity);
              }
              totalRemainingStock += variantStock;
              return { ...v, stock: variantStock };
            });

            await updateDoc(productRef, { 
              variants: updatedVariants,
              inStock: totalRemainingStock > 0
            });
            console.log(`Core Product Sync: Master variant stock successfully deduced for ${item.productId}`);
          }
        }
      } catch (productSyncErr) {
        console.error("FATAL: Inventory isolated successfully but Product Doc variant sync failed.", productSyncErr);
      }
    }
  } catch (error) {
    console.error("Error updating inventory after order:", error);
    throw error;
  }
};

// Initialize inventory from products
export const initializeInventoryFromProducts = async (products: Product[]): Promise<void> => {
  try {
    const existingInventory = await getInventoryFromFirestore();
    
    for (const product of products) {
      for (const variant of product.variants) {
        const existingEntry = existingInventory.find(
          entry => entry.productId === product.id && entry.variantId === variant.id
        );
        
        if (!existingEntry) {
          await updateInventoryInFirestore({
            productId: product.id,
            variantId: variant.id,
            quantity: variant.stock,
            lowStockThreshold: 5,
            updatedAt: new Date().toISOString()
          });
        }
      }
    }
    
    console.log("Inventory initialized from products");
  } catch (error) {
    console.error("Error initializing inventory from products:", error);
    throw error;
  }
};
