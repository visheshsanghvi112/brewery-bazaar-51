
import { ReturnRequest, ReturnStatus, RefundStatus } from "@/types";
import { sendReturnStatusUpdateEmail } from "./emailService";

/**
 * Process multiple return requests with the same status update
 */
export const bulkUpdateReturnStatus = async (
  returnRequests: ReturnRequest[],
  newStatus: ReturnStatus,
  processingNotes?: string,
  sendEmails = true
): Promise<{ 
  success: boolean;
  updatedReturns: ReturnRequest[];
  failedEmails: string[];
}> => {
  const updatedReturns = returnRequests.map(request => {
    // Update return status
    const updatedReturn = {
      ...request,
      status: newStatus,
      processingNotes: processingNotes || request.processingNotes
    };
    
    // If status is Completed, update refund status if applicable
    if (newStatus === 'Completed' && !updatedReturn.refundDate) {
      updatedReturn.refundStatus = 'Completed';
      updatedReturn.refundDate = new Date().toISOString();
    }
    
    // If status is Approved and label not generated, mark for generation
    if (newStatus === 'Approved' && !updatedReturn.labelGenerated) {
      updatedReturn.labelGenerated = false;
    }
    
    return updatedReturn;
  });
  
  // Send emails if required
  const failedEmails: string[] = [];
  
  if (sendEmails) {
    for (const returnRequest of updatedReturns) {
      try {
        const emailResult = await sendReturnStatusUpdateEmail(returnRequest);
        if (!emailResult.success) {
          failedEmails.push(returnRequest.id);
        } else {
          // Update notification status
          returnRequest.lastNotificationStatus = 'Sent';
          returnRequest.lastNotificationDate = new Date().toISOString();
        }
      } catch (error) {
        console.error(`Failed to send email for return ${returnRequest.id}:`, error);
        failedEmails.push(returnRequest.id);
        returnRequest.lastNotificationStatus = 'Failed';
      }
    }
  }
  
  return {
    success: true,
    updatedReturns,
    failedEmails
  };
};

/**
 * Generate return labels in bulk
 */
export const bulkGenerateReturnLabels = (
  returnRequests: ReturnRequest[]
): ReturnRequest[] => {
  return returnRequests.map(request => {
    if (!request.labelGenerated) {
      // In a real app, this would call an API to generate a real shipping label
      return {
        ...request,
        labelGenerated: true,
        labelUrl: `https://example.com/labels/${request.id}.pdf`
      };
    }
    return request;
  });
};

/**
 * Process refunds in bulk
 */
export const bulkProcessRefunds = (
  returnRequests: ReturnRequest[]
): ReturnRequest[] => {
  return returnRequests.map(request => {
    // Only process if not already completed
    if (request.refundStatus !== 'Completed') {
      // Calculate refund amount if not set
      let refundAmount = request.refundAmount;
      if (!refundAmount) {
        refundAmount = request.items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
          0
        );
      }
      
      return {
        ...request,
        refundStatus: 'Completed',
        refundAmount,
        refundDate: new Date().toISOString()
      };
    }
    return request;
  });
};
