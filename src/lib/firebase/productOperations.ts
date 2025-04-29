
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
    const cleanUpdateData = Object.entries(dataToUpdate).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        // Convert empty strings to null for specific fields
        if (value === "" && key !== "name" && key !== "description" && key !== "category") {
          acc[key] = null;
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Special handling for originalPrice
    if (cleanUpdateData.originalPrice === 0 || cleanUpdateData.originalPrice === "") {
      cleanUpdateData.originalPrice = null;
    }
    
    // Add the updated timestamp
    cleanUpdateData.updatedAt = new Date();
    
    console.log("Clean update data for Firestore:", cleanUpdateData);
    await updateDoc(productRef, cleanUpdateData);
    
    console.log("Product updated successfully: ", productId);
    return Promise.resolve(); // Explicitly return resolved promise for better handling
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

// Delete product from Firestore
export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  if (!productId) {
    console.error("Invalid product ID provided for deletion");
    throw new Error("Invalid product ID");
  }

  try {
    console.log("Deleting product from Firestore:", productId);
    const productRef = doc(db, "products", productId);
    
    // Check if document exists before attempting to delete
    const docSnap = await getDoc(productRef);
    if (!docSnap.exists()) {
      throw new Error(`Product with ID ${productId} does not exist`);
    }
    
    await deleteDoc(productRef);
    console.log("Product deleted successfully: ", productId);
    return Promise.resolve(); // Explicitly return resolved promise for better handling
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};

// Get all products from Firestore with improved error handling and retries
export const getProductsFromFirestore = async (retryCount = 0): Promise<Product[]> => {
  try {
    console.log("Fetching products from Firestore - attempt:", retryCount + 1);
    const querySnapshot = await getDocs(collection(db, "products"));
    
    if (querySnapshot.empty && retryCount < 3) {
      console.log("No products found, retrying...");
      // Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getProductsFromFirestore(retryCount + 1);
    }
    
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const product: Product = {
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        originalPrice: data.originalPrice || null,
        category: data.category || '',
        images: data.images || [],
        variants: data.variants || [],
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        inStock: data.inStock !== undefined ? data.inStock : true,
        featured: data.featured || false
      };
      
      products.push(product);
      console.log(`Loaded product: ${product.id} - ${product.name}`);
    });
    
    console.log(`Found ${products.length} products in Firestore`);
    return products;
  } catch (error) {
    console.error("Error getting products from Firestore: ", error);
    
    // If we've tried less than 3 times, retry
    if (retryCount < 3) {
      console.log(`Retrying product fetch. Attempt ${retryCount + 2}/4`);
      // Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getProductsFromFirestore(retryCount + 1);
    }
    
    throw error;
  }
};
