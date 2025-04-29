
import { useEffect } from 'react';
import { auth, db } from '@/integrations/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Order, ReturnRequest, Address } from '@/types';
import { 
  getShippingDetails, 
  getReturnRequests,
  COLLECTIONS 
} from '@/lib/firebase/collections';
import { CartAction } from '@/contexts/cart/cartReducer';

export function useUserDataLoader(
  orders: Order[],
  setOrders: (orders: Order[]) => void,
  returnRequests: ReturnRequest[],
  setReturnRequests: (requests: ReturnRequest[]) => void,
  dispatch: React.Dispatch<CartAction>
) {
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (auth.currentUser) {
        try {
          const userId = auth.currentUser.uid;
          const ordersRef = collection(db, COLLECTIONS.ORDERS);
          const q = query(ordersRef, where("userId", "==", userId));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userOrders = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                ...data,
                id: data.id || doc.id,
                firestoreId: doc.id
              } as Order;
            });
            
            // Merge orders from local storage with orders from Firestore
            const existingOrderIds = orders.map(o => o.id);
            const newOrders = userOrders.filter(o => !existingOrderIds.includes(o.id));
            
            if (newOrders.length > 0) {
              setOrders([...orders, ...newOrders]);
            }
          }
          
          // Also fetch user's return requests
          const userReturnRequests = await getReturnRequests(userId);
          if (userReturnRequests.length > 0) {
            // Merge with local storage return requests
            const existingRequestIds = returnRequests.map(r => r.id);
            const newRequests = userReturnRequests.filter(r => !existingRequestIds.includes(r.id));
            
            if (newRequests.length > 0) {
              setReturnRequests([...returnRequests, ...newRequests]);
            }
          }
          
          // Load shipping details if available
          const shippingDetails = await getShippingDetails(userId);
          if (shippingDetails && 'shippingAddress' in shippingDetails && 'billingAddress' in shippingDetails) {
            dispatch({ 
              type: 'SET_SHIPPING_ADDRESS', 
              payload: shippingDetails.shippingAddress as Address 
            });
            
            dispatch({ 
              type: 'SET_BILLING_ADDRESS', 
              payload: shippingDetails.billingAddress as Address 
            });
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      }
    };
    
    fetchUserOrders();
  }, [auth.currentUser]);
}
