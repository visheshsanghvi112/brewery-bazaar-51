
import { db } from "@/integrations/firebase/client";
import { doc, collection, addDoc, updateDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { Notification } from "@/types";

// Get user notifications
export const getUserNotifications = async (userId: string, limitCount: number = 20): Promise<Notification[]> => {
  try {
    if (!userId) {
      console.warn("No userId provided to fetch notifications");
      return [];
    }
    
    const notificationCollection = collection(db, "notifications");
    const q = query(
      notificationCollection,
      where("userId", "==", userId),
      orderBy("date", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("No notifications found for user", userId);
      return [];
    }
    
    const notifications: Notification[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        read: data.read || false,
        date: data.date || new Date().toISOString(),
        link: data.link,
        firestoreId: doc.id
      } as Notification;
    });
    
    return notifications;
  } catch (error) {
    console.error("Error getting notifications from Firestore:", error);
    throw error;
  }
};

// Add notification
export const addNotification = async (notification: Omit<Notification, 'id' | 'firestoreId'>): Promise<string> => {
  try {
    const notificationCollection = collection(db, "notifications");
    
    // Generate a unique ID
    const uniqueId = `NOTIF-${Date.now().toString(36)}`;
    
    const docRef = await addDoc(notificationCollection, {
      ...notification,
      id: uniqueId,
      read: false,
      date: notification.date || new Date().toISOString()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding notification to Firestore:", error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    if (!notificationId) {
      throw new Error("Notification ID is required to mark as read");
    }
    
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.error("Error marking notification as read in Firestore:", error);
    throw error;
  }
};

// Send system notification to all users
export const sendSystemNotificationToAllUsers = async (title: string, message: string, link?: string): Promise<void> => {
  try {
    // This would typically be implemented with a cloud function to avoid client-side performance issues
    // For demonstration purposes, we'll implement it here
    console.log("Sending system notification to all users:", { title, message });
    
    // In a real implementation, you would query all users and send a notification to each one
    // or use a cloud function to handle this more efficiently
  } catch (error) {
    console.error("Error sending system notification to all users:", error);
    throw error;
  }
};

// Create order notification
export const createOrderNotification = async (userId: string, orderId: string, orderStatus: string): Promise<string> => {
  try {
    let title: string;
    let message: string;
    
    switch (orderStatus.toLowerCase()) {
      case 'processing':
        title = "Order Received";
        message = `Your order #${orderId} has been received and is being processed.`;
        break;
      case 'shipped':
        title = "Order Shipped";
        message = `Your order #${orderId} has been shipped and is on the way.`;
        break;
      case 'delivered':
        title = "Order Delivered";
        message = `Your order #${orderId} has been delivered. Enjoy your purchase!`;
        break;
      case 'cancelled':
        title = "Order Cancelled";
        message = `Your order #${orderId} has been cancelled. Contact support if you have any questions.`;
        break;
      default:
        title = "Order Update";
        message = `Your order #${orderId} status has been updated to ${orderStatus}.`;
    }
    
    return await addNotification({
      userId,
      type: 'order',
      title,
      message,
      read: false,
      date: new Date().toISOString(),
      link: `/orders/${orderId}`
    });
  } catch (error) {
    console.error("Error creating order notification:", error);
    throw error;
  }
};
