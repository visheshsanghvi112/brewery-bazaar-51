
import { db } from "@/integrations/firebase/client";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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
      await updateDoc(userRef, data);
    } else {
      await setDoc(userRef, data);
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
