
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, updateDoc, deleteDoc, getDoc, getDocs } from "firebase/firestore";
import { Product } from "@/types";

// Add new product to Firestore
export const addProductToFirestore = async (productData: Omit<Product, 'id'>): Promise<string> => {
  try {
    console.log("Adding product to Firestore:", productData);
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log("Product added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
};

// Update existing product in Firestore
export const updateProductInFirestore = async (productId: string, productData: Partial<Product>): Promise<void> => {
  try {
    console.log("Updating product in Firestore:", { productId, productData });
    const productRef = doc(db, "products", productId);
    
    // Verify the document exists first
    const docSnap = await getDoc(productRef);
    if (!docSnap.exists()) {
      throw new Error(`Product with ID ${productId} does not exist`);
    }
    
    // Remove id if present to avoid overwriting it
    const { id, ...dataToUpdate } = productData as any;
    
    // Create a clean update object without undefined values
    // Also convert empty strings to null for Firestore
    const cleanUpdateData = Object.entries(dataToUpdate).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        // Convert empty strings to null
        if (value === "" && key !== "name" && key !== "description" && key !== "category") {
          acc[key] = null;
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Special handling for originalPrice - make sure it's either a number or null
    if (cleanUpdateData.originalPrice === 0 || cleanUpdateData.originalPrice === "") {
      cleanUpdateData.originalPrice = null;
    }
    
    // Add the updated timestamp
    cleanUpdateData.updatedAt = new Date();
    
    console.log("Clean update data for Firestore:", cleanUpdateData);
    await updateDoc(productRef, cleanUpdateData);
    
    console.log("Product updated successfully: ", productId);
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

// Delete product from Firestore
export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  try {
    console.log("Deleting product from Firestore:", productId);
    const productRef = doc(db, "products", productId);
    
    // Verify the document exists first
    const docSnap = await getDoc(productRef);
    if (!docSnap.exists()) {
      throw new Error(`Product with ID ${productId} does not exist`);
    }
    
    await deleteDoc(productRef);
    console.log("Product deleted successfully: ", productId);
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};

// Get all products from Firestore
export const getProductsFromFirestore = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        originalPrice: data.originalPrice,
        category: data.category || '',
        images: data.images || [],
        variants: data.variants || [],
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        inStock: data.inStock !== undefined ? data.inStock : true,
        featured: data.featured || false
      });
    });
    
    return products;
  } catch (error) {
    console.error("Error getting products: ", error);
    throw error;
  }
};
