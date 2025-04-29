
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Coupon } from "@/types";

// Get all coupons
export const getCouponsFromFirestore = async (): Promise<Coupon[]> => {
  try {
    const couponsCollection = collection(db, "coupons");
    const querySnapshot = await getDocs(couponsCollection);
    
    if (querySnapshot.empty) {
      console.warn("No coupons found in Firestore");
      return [];
    }
    
    const coupons: Coupon[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        code: data.code || '',
        type: data.type || 'percentage',
        value: data.value || 0,
        minPurchase: data.minPurchase,
        maxDiscount: data.maxDiscount,
        validFrom: data.validFrom || '',
        validUntil: data.validUntil || '',
        usageLimit: data.usageLimit,
        usageCount: data.usageCount || 0,
        applicableProducts: data.applicableProducts || [],
        applicableCategories: data.applicableCategories || [],
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: data.createdAt || new Date().toISOString(),
        firestoreId: doc.id
      } as Coupon;
    });
    
    return coupons;
  } catch (error) {
    console.error("Error getting coupons from Firestore:", error);
    throw error;
  }
};

// Validate coupon
export const validateCoupon = async (code: string, subtotal: number, productIds: string[], categories: string[]): Promise<Coupon | null> => {
  try {
    const couponsCollection = collection(db, "coupons");
    const q = query(
      couponsCollection,
      where("code", "==", code),
      where("isActive", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.warn(`No valid coupon found for code ${code}`);
      return null;
    }
    
    const couponDoc = querySnapshot.docs[0];
    const coupon = {
      ...couponDoc.data(),
      firestoreId: couponDoc.id
    } as Coupon;
    
    // Check if coupon is valid
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    
    if (now < validFrom || now > validUntil) {
      console.warn(`Coupon ${code} is not valid at the current time`);
      return null;
    }
    
    // Check if coupon has reached its usage limit
    if (coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
      console.warn(`Coupon ${code} has reached its usage limit`);
      return null;
    }
    
    // Check minimum purchase requirement
    if (coupon.minPurchase !== undefined && subtotal < coupon.minPurchase) {
      console.warn(`Subtotal ${subtotal} is less than coupon minimum purchase ${coupon.minPurchase}`);
      return null;
    }
    
    // Check if applicable to the products/categories in the cart
    if (coupon.applicableProducts?.length || coupon.applicableCategories?.length) {
      const productMatch = productIds.some(id => coupon.applicableProducts?.includes(id));
      const categoryMatch = categories.some(category => coupon.applicableCategories?.includes(category));
      
      if (!productMatch && !categoryMatch) {
        console.warn(`Coupon ${code} is not applicable to the items in the cart`);
        return null;
      }
    }
    
    return coupon;
  } catch (error) {
    console.error("Error validating coupon from Firestore:", error);
    throw error;
  }
};

// Add or update coupon
export const updateCouponInFirestore = async (coupon: Partial<Coupon>): Promise<string> => {
  try {
    if (coupon.firestoreId) {
      // Update existing coupon
      const couponRef = doc(db, "coupons", coupon.firestoreId);
      const { firestoreId, id, ...dataToUpdate } = coupon as any;
      
      await updateDoc(couponRef, dataToUpdate);
      return coupon.firestoreId;
    } else {
      // Add new coupon
      const couponsCollection = collection(db, "coupons");
      
      // Generate a unique ID
      const uniqueId = `COUP-${Date.now().toString(36)}`;
      const { firestoreId, id, ...dataToAdd } = coupon as any;
      
      const docRef = await addDoc(couponsCollection, {
        ...dataToAdd,
        id: uniqueId,
        createdAt: new Date().toISOString()
      });
      
      return docRef.id;
    }
  } catch (error) {
    console.error("Error updating coupon in Firestore:", error);
    throw error;
  }
};

// Increment coupon usage
export const incrementCouponUsage = async (couponCode: string): Promise<void> => {
  try {
    const couponsCollection = collection(db, "coupons");
    const q = query(couponsCollection, where("code", "==", couponCode));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.warn(`No coupon found with code ${couponCode}`);
      return;
    }
    
    const couponDoc = querySnapshot.docs[0];
    const couponRef = doc(db, "coupons", couponDoc.id);
    const couponData = couponDoc.data();
    
    await updateDoc(couponRef, {
      usageCount: (couponData.usageCount || 0) + 1
    });
    
  } catch (error) {
    console.error("Error incrementing coupon usage:", error);
    throw error;
  }
};
