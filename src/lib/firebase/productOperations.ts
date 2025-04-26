
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Product } from "@/types";

// Add new product to Firestore
export const addProductToFirestore = async (productData: Omit<Product, 'id'>): Promise<string> => {
  try {
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
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date()
    });
    
    console.log("Product updated: ", productId);
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

// Delete product from Firestore
export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "products", productId));
    console.log("Product deleted: ", productId);
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};
