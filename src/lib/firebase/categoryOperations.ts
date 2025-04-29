
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Category } from "@/types";

// Get all categories
export const getCategoriesFromFirestore = async (): Promise<Category[]> => {
  try {
    const categoriesCollection = collection(db, "categories");
    const querySnapshot = await getDocs(categoriesCollection);
    
    if (querySnapshot.empty) {
      console.warn("No categories found in Firestore");
      return [];
    }
    
    const categories: Category[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        image: data.image || '',
      } as Category;
    });
    
    return categories;
  } catch (error) {
    console.error("Error getting categories from Firestore:", error);
    throw error;
  }
};

// Add or update category
export const updateCategoryInFirestore = async (category: Partial<Category>): Promise<string> => {
  try {
    if (category.id) {
      // Update existing category
      const categoriesCollection = collection(db, "categories");
      const q = query(categoriesCollection, where("id", "==", category.id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error(`Category with ID ${category.id} not found`);
      }
      
      const categoryDoc = querySnapshot.docs[0];
      const categoryRef = doc(db, "categories", categoryDoc.id);
      
      await updateDoc(categoryRef, category);
      return categoryDoc.id;
    } else {
      // Add new category
      const categoriesCollection = collection(db, "categories");
      
      // Create slug from name if not provided
      if (!category.slug && category.name) {
        category.slug = category.name.toLowerCase().replace(/\s+/g, '-');
      }
      
      // Generate a unique ID
      const uniqueId = `CAT-${Date.now().toString(36)}`;
      
      const docRef = await addDoc(categoriesCollection, {
        ...category,
        id: uniqueId,
      });
      
      return docRef.id;
    }
  } catch (error) {
    console.error("Error updating category in Firestore:", error);
    throw error;
  }
};

// Delete category
export const deleteCategoryFromFirestore = async (categoryId: string): Promise<void> => {
  try {
    const categoriesCollection = collection(db, "categories");
    const q = query(categoriesCollection, where("id", "==", categoryId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }
    
    const categoryDoc = querySnapshot.docs[0];
    await deleteDoc(doc(db, "categories", categoryDoc.id));
  } catch (error) {
    console.error("Error deleting category from Firestore:", error);
    throw error;
  }
};

// Seed default categories if none exist
export const seedDefaultCategories = async (): Promise<void> => {
  try {
    const existingCategories = await getCategoriesFromFirestore();
    
    if (existingCategories.length === 0) {
      const defaultCategories = [
        {
          name: "T-Shirts",
          slug: "t-shirts",
          description: "Comfortable and stylish t-shirts for everyday wear",
          image: "https://img.freepik.com/free-photo/black-t-shirt-with-word-ultra-it_1340-37775.jpg"
        },
        {
          name: "Shorts",
          slug: "shorts",
          description: "Casual and athletic shorts perfect for summer",
          image: "https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-young-man-model-dressed-red-checkered-shirt-fashion-man-wearing-sunglasses_158538-19179.jpg"
        },
        {
          name: "Hoodies",
          slug: "hoodies",
          description: "Warm and cozy hoodies for cooler weather",
          image: "https://img.freepik.com/free-photo/blue-hoodie-sweatshirt-mockup_1409-4040.jpg"
        },
        {
          name: "Caps",
          slug: "caps",
          description: "Stylish caps and hats for any occasion",
          image: "https://img.freepik.com/free-photo/white-cap-still-life_23-2149552318.jpg"
        }
      ];
      
      for (const category of defaultCategories) {
        await updateCategoryInFirestore(category);
      }
      
      console.log("Default categories seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding default categories:", error);
    throw error;
  }
};
