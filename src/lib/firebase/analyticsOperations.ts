
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, updateDoc, getDoc, getDocs, query, where, increment } from "firebase/firestore";
import { ProductAnalytics } from "@/types";

// Track product view
export const trackProductView = async (productId: string): Promise<void> => {
  try {
    if (!productId) {
      console.warn("No product ID provided to track view");
      return;
    }
    
    // Find the analytics record for this product
    const analyticsCollection = collection(db, "productAnalytics");
    const q = query(analyticsCollection, where("productId", "==", productId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Create a new analytics record
      await addDoc(analyticsCollection, {
        productId,
        viewCount: 1,
        conversionRate: 0,
        totalSold: 0,
        revenue: 0,
        lastUpdated: new Date().toISOString()
      });
    } else {
      // Update existing record
      const analyticsDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "productAnalytics", analyticsDoc.id), {
        viewCount: increment(1),
        lastUpdated: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error tracking product view in Firestore:", error);
    // Don't throw error as this is non-critical functionality
  }
};

// Track product purchase
export const trackProductPurchase = async (productId: string, quantity: number, revenue: number): Promise<void> => {
  try {
    if (!productId) {
      console.warn("No product ID provided to track purchase");
      return;
    }
    
    // Find the analytics record for this product
    const analyticsCollection = collection(db, "productAnalytics");
    const q = query(analyticsCollection, where("productId", "==", productId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Create a new analytics record
      await addDoc(analyticsCollection, {
        productId,
        viewCount: 0,
        conversionRate: 100, // First view resulted in purchase
        totalSold: quantity,
        revenue: revenue,
        lastUpdated: new Date().toISOString()
      });
    } else {
      // Update existing record
      const analyticsDoc = querySnapshot.docs[0];
      const data = analyticsDoc.data();
      const newTotalSold = (data.totalSold || 0) + quantity;
      const newRevenue = (data.revenue || 0) + revenue;
      
      // Calculate conversion rate if views > 0
      let conversionRate = data.conversionRate || 0;
      if (data.viewCount > 0) {
        conversionRate = (newTotalSold / data.viewCount) * 100;
      }
      
      await updateDoc(doc(db, "productAnalytics", analyticsDoc.id), {
        totalSold: newTotalSold,
        revenue: newRevenue,
        conversionRate: conversionRate,
        lastUpdated: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error tracking product purchase in Firestore:", error);
    // Don't throw error as this is non-critical functionality
  }
};

// Get product analytics
export const getProductAnalytics = async (productId: string): Promise<ProductAnalytics | null> => {
  try {
    if (!productId) {
      console.warn("No product ID provided to get analytics");
      return null;
    }
    
    const analyticsCollection = collection(db, "productAnalytics");
    const q = query(analyticsCollection, where("productId", "==", productId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      productId: data.productId,
      viewCount: data.viewCount || 0,
      conversionRate: data.conversionRate || 0,
      totalSold: data.totalSold || 0,
      revenue: data.revenue || 0,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      firestoreId: doc.id
    } as ProductAnalytics;
  } catch (error) {
    console.error("Error getting product analytics from Firestore:", error);
    return null;
  }
};
