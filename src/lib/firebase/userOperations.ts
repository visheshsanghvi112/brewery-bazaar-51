
import { db, auth } from "@/integrations/firebase/client";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Order, OrderStatus, Product } from "@/types";

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UserProfile {
  email: string;
  displayName: string;
  phone?: string;
  addresses?: UserAddress[];
  notificationPreferences?: {
    emailMarketing: boolean;
    orderUpdates: boolean;
    priceAlerts: boolean;
  };
  wishlist?: string[]; // Array of product IDs
  role?: 'user' | 'admin'; // Added role field
}

export interface UserOrder extends Order {
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } else {
      await setDoc(userRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const saveOrder = async (userId: string, order: Order): Promise<string> => {
  try {
    // The order should already have been created in the orders collection
    // Here we're just ensuring it's linked to the user's profile
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Add the order ID to the user's orders array
      await updateDoc(userRef, {
        orderIds: arrayUnion(order.id),
        updatedAt: new Date().toISOString()
      });
    } else {
      // If the user document doesn't exist yet, create it with this order
      await setDoc(userRef, {
        email: auth.currentUser?.email || '',
        displayName: auth.currentUser?.displayName || '',
        orderIds: [order.id],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return order.id;
  } catch (error) {
    console.error("Error saving order reference to user:", error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<UserOrder[]> => {
  try {
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: data.id || doc.id,
        firestoreId: doc.id
      } as UserOrder;
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (firestoreId: string, status: OrderStatus): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", firestoreId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const addToWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    // First ensure the user document exists with a wishlist array
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create a new user document with wishlist if it doesn't exist
      await setDoc(userRef, {
        wishlist: [productId],
        email: auth.currentUser?.email || '',
        displayName: auth.currentUser?.displayName || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      // Update existing user document
      await updateDoc(userRef, {
        wishlist: arrayUnion(productId),
        updatedAt: new Date().toISOString()
      });
    }
    console.log(`Product ${productId} added to wishlist for user ${userId}`);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

export const removeFromWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      wishlist: arrayRemove(productId),
      updatedAt: new Date().toISOString()
    });
    console.log(`Product ${productId} removed from wishlist for user ${userId}`);
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};

export const getWishlist = async (userId: string): Promise<Product[]> => {
  try {
    console.log(`Getting wishlist for user ${userId}`);
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log(`User ${userId} does not exist`);
      return [];
    }
    
    const userData = userSnap.data();
    if (!userData.wishlist) {
      console.log(`Wishlist not found for user ${userId}, initializing empty wishlist`);
      // Initialize wishlist if it doesn't exist
      await updateDoc(userRef, { 
        wishlist: [],
        updatedAt: new Date().toISOString()
      });
      return [];
    }
    
    const wishlistIds = userData.wishlist as string[];
    console.log(`Found ${wishlistIds.length} wishlist IDs:`, wishlistIds);
    
    if (wishlistIds.length === 0) {
      console.log(`Wishlist is empty for user ${userId}`);
      return [];
    }
    
    // Get each product individually
    const products: Product[] = [];
    
    for (const productId of wishlistIds) {
      try {
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          products.push({
            id: productSnap.id,
            ...productSnap.data()
          } as Product);
        }
      } catch (err) {
        console.error(`Error getting product ${productId}:`, err);
      }
    }
    
    console.log(`Retrieved ${products.length} products from wishlist`);
    return products;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

export const updateNotificationPreferences = async (userId: string, preferences: UserProfile['notificationPreferences']): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      notificationPreferences: preferences,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    throw error;
  }
};

export const changeUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      await updatePassword(user, newPassword);
    } else {
      throw new Error("User not found or missing email");
    }
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const deleteUserAccount = async (password: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      if (user.uid) {
        const userRef = doc(db, "users", user.uid);
        await deleteDoc(userRef);
      }
      
      await deleteUser(user);
    } else {
      throw new Error("User not found or missing email");
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export const addReview = async (userId: string, productId: string, rating: number, content: string): Promise<void> => {
  try {
    const reviewsCollection = collection(db, "reviews");
    const timestamp = new Date().toISOString();
    
    await addDoc(reviewsCollection, {
      userId,
      productId,
      rating,
      content,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const updateReview = async (reviewId: string, rating: number, content: string): Promise<void> => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await updateDoc(reviewRef, {
      rating,
      content,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

export const getUserReviews = async (userId: string): Promise<UserReview[]> => {
  try {
    const reviewsCollection = collection(db, "reviews");
    const q = query(reviewsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...(doc.data() as UserReview),
      id: doc.id
    }));
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
};

// Check if a user is an admin
export const checkUserAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.role === 'admin';
    }
    
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
