
import { useToast } from '@/hooks/use-toast';
import { Customer, Order, ReturnRequest, ReturnStatus, OrderStatus } from '@/types';
import { auth, db } from '@/integrations/firebase/client';
import { doc, setDoc } from 'firebase/firestore';
import { CartState } from '@/contexts/cart/cartReducer';
import { createOrder, updateCustomer } from '@/contexts/cart/orderManager';
import { 
  saveCustomer, 
  createReturnRequest,
  saveOrder,
  COLLECTIONS 
} from '@/lib/firebase/collections';
import { getNextSequence, formatSequenceNumber } from '@/lib/firebase/sequenceOperations';

export function useOrderOperations(
  state: CartState,
  orders: Order[],
  setOrders: (orders: Order[]) => void,
  customers: any[],
  setCustomers: (customers: any[]) => void,
  returnRequests: ReturnRequest[],
  setReturnRequests: (requests: ReturnRequest[]) => void,
  clearCart: () => void
) {
  const { toast } = useToast();
  
  const placeOrder = async (customer: Customer, paymentMethod: string) => {
    try {
      if (!auth.currentUser) {
        toast({
          title: 'Authentication required',
          description: 'Please login to place an order',
          variant: 'destructive',
        });
        return null;
      }
      
      // Check if user is admin and prevent checkout
      const userRole = localStorage.getItem("userRole");
      if (userRole === "admin") {
        toast({
          title: 'Admin checkout restricted',
          description: 'Admin users cannot place orders. Please use a regular user account to checkout.',
          variant: 'destructive',
        });
        return null;
      }
      
      // Update customer ID with auth user ID if available
      const enhancedCustomer = {
        ...customer,
        id: auth.currentUser.uid || customer.id,
      };
      
      // Save customer details to Firestore
      await saveCustomer(enhancedCustomer);
      
      const { newOrder, orderId } = await createOrder(state, enhancedCustomer, paymentMethod, orders);
      
      // Save order to Firestore
      await saveOrder({
        ...newOrder,
        userId: auth.currentUser.uid,
      });
      
      // Save order to local state
      setOrders([...orders, newOrder]);
      
      // Update customer information
      const updatedCustomers = updateCustomer(enhancedCustomer, customers, newOrder.total);
      setCustomers(updatedCustomers);
      
      // Clear cart after successful order
      clearCart();
      
      toast({
        title: 'Order placed successfully',
        description: `Your order #${orderId} has been placed and is being processed.`,
      });
      
      return orderId;
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: 'Order placement failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  const requestReturn = async (orderId: string, items: any[], reason: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast({
        title: 'Error',
        description: 'Order not found',
        variant: 'destructive',
      });
      return {} as ReturnRequest;
    }

    try {
      const sequenceNumber = await getNextSequence("return_sequence");
      const returnId = `BREW-RET-${formatSequenceNumber(sequenceNumber)}`;
      
      const returnRequest: ReturnRequest = {
        id: returnId,
        orderId,
        orderDate: order.date,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        items,
        reason,
        status: 'Requested' as ReturnStatus,
        createdAt: new Date().toISOString(),
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      };

      // Save return request to Firestore if user is authenticated
      if (auth.currentUser) {
        try {
          // Add userId to return request
          (returnRequest as any).userId = auth.currentUser.uid;
          
          // Save to Firestore collection
          const firestoreId = await createReturnRequest(returnRequest);
          
          // Add the Firestore ID to the return request
          (returnRequest as any).firestoreId = firestoreId;
          
          // Also update the order to mark it as having a return request
          if (order.firestoreId) {
            const orderRef = doc(db, COLLECTIONS.ORDERS, order.firestoreId);
            await setDoc(orderRef, {
              status: 'Return Requested' as OrderStatus,
              returnRequest: returnId,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
          
          console.log(`Return request ${returnId} saved to Firestore`);
        } catch (error) {
          console.error("Error saving return request to Firestore:", error);
        }
      }

      const updatedOrders = orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Return Requested' as OrderStatus,
            returnRequest: returnRequest.id
          };
        }
        return o;
      });

      setReturnRequests([...returnRequests, returnRequest]);
      setOrders(updatedOrders);

      toast({
        title: 'Return requested',
        description: `Your return for order #${orderId} has been requested and will be picked up on ${new Date(returnRequest.scheduledDate).toLocaleDateString()}.`,
      });

      return returnRequest;
    } catch (error) {
      console.error("Error requesting return:", error);
      toast({
        title: 'Return request failed',
        description: 'There was an error processing your return request. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };
  
  return {
    placeOrder,
    requestReturn
  };
}
