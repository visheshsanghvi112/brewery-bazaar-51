
import { ReturnRequest, Order } from "@/types";

/**
 * Simulates sending an email notification (in a real app, this would connect to an email service API)
 */
export const sendEmail = async (
  to: string,
  subject: string,
  content: string
): Promise<{ success: boolean; message: string }> => {
  console.log(`Sending email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${content}`);
  
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would be an actual API call to an email service
  return { success: true, message: "Email sent successfully" };
};

/**
 * Send return status update notification to customer
 */
export const sendReturnStatusUpdateEmail = async (
  returnRequest: ReturnRequest
): Promise<{ success: boolean; message: string }> => {
  let subject = "";
  let content = "";
  
  switch (returnRequest.status) {
    case "Approved":
      subject = "Your Return Request Has Been Approved";
      content = `
        <h1>Return Request Approved</h1>
        <p>Dear ${returnRequest.customerName},</p>
        <p>Good news! Your return request for order #${returnRequest.orderId} has been approved.</p>
        <p>Please use the attached return label to send the items back to us. We've scheduled a pickup for ${new Date(returnRequest.scheduledDate).toLocaleDateString()}.</p>
        <p>Return ID: ${returnRequest.id}</p>
        <p>Thank you for your patience!</p>
        <p>Best regards,<br>Customer Service Team</p>
      `;
      break;
    case "In Progress":
      subject = "Your Return is Being Processed";
      content = `
        <h1>Return In Progress</h1>
        <p>Dear ${returnRequest.customerName},</p>
        <p>We've received your returned items for order #${returnRequest.orderId} and have begun processing them.</p>
        <p>Our team will inspect the items and process your refund shortly. We'll notify you once the refund has been issued.</p>
        <p>Return ID: ${returnRequest.id}</p>
        <p>Thank you for your patience!</p>
        <p>Best regards,<br>Customer Service Team</p>
      `;
      break;
    case "Completed":
      subject = "Your Return Has Been Completed";
      content = `
        <h1>Return Completed</h1>
        <p>Dear ${returnRequest.customerName},</p>
        <p>Good news! Your return for order #${returnRequest.orderId} has been completed.</p>
        <p>Return ID: ${returnRequest.id}</p>
        ${returnRequest.refundStatus === "Completed" 
          ? `<p>Your refund of $${(returnRequest.refundAmount! / 100).toFixed(2)} has been processed and should appear on your original payment method within 3-5 business days.</p>` 
          : '<p>Your refund is being processed and should be completed shortly.</p>'}
        <p>Thank you for your patience throughout this process.</p>
        <p>Best regards,<br>Customer Service Team</p>
      `;
      break;
    case "Rejected":
      subject = "Your Return Request Could Not Be Processed";
      content = `
        <h1>Return Request Rejected</h1>
        <p>Dear ${returnRequest.customerName},</p>
        <p>We regret to inform you that your return request for order #${returnRequest.orderId} could not be processed.</p>
        <p>${returnRequest.processingNotes || "Please contact our customer service team for more information."}</p>
        <p>Return ID: ${returnRequest.id}</p>
        <p>If you have any questions, please don't hesitate to contact our customer support team.</p>
        <p>Best regards,<br>Customer Service Team</p>
      `;
      break;
    default:
      subject = "Update on Your Return Request";
      content = `
        <h1>Return Request Update</h1>
        <p>Dear ${returnRequest.customerName},</p>
        <p>There has been an update to your return request for order #${returnRequest.orderId}.</p>
        <p>Current status: ${returnRequest.status}</p>
        <p>Return ID: ${returnRequest.id}</p>
        <p>If you have any questions, please don't hesitate to contact our customer support team.</p>
        <p>Best regards,<br>Customer Service Team</p>
      `;
  }
  
  return sendEmail(returnRequest.customerEmail, subject, content);
};

/**
 * Send order status update notification to customer
 */
export const sendOrderStatusUpdateEmail = async (
  order: any // Using any here since we may pass a partial order object
): Promise<{ success: boolean; message: string }> => {
  const customerEmail = order.customer?.email || order.customerEmail;
  if (!customerEmail) {
    console.error("Missing customer email, cannot send notification");
    return { success: false, message: "Missing customer email address" };
  }

  const customerName = order.customer?.name || order.customerName || "Customer";
  
  let subject = "";
  let content = "";
  
  switch (order.status) {
    case "Shipped":
      subject = "Your Order Has Been Shipped";
      content = `
        <h1>Order Shipped</h1>
        <p>Dear ${customerName},</p>
        <p>Great news! Your order #${order.id} has been shipped and is on its way to you.</p>
        ${order.trackingNumber 
          ? `<p>You can track your package using the following tracking number: ${order.trackingNumber}</p>` 
          : ''}
        <p>Expected delivery: 3-5 business days</p>
        <p>Thank you for shopping with us!</p>
        <p>Best regards,<br>Customer Service Team</p>
      `;
      break;
    case "Delivered":
      subject = "Your Order Has Been Delivered";
      content = `
        <h1>Order Delivered</h1>
        <p>Dear ${customerName},</p>
        <p>Your order #${order.id} has been delivered!</p>
        <p>We hope you enjoy your purchase. If there's any issue with your order, please let us know within 7 days.</p>
        <p>Thank you for shopping with us!</p>
        <p>Best regards,<br>Customer Service Team</p>
      `;
      break;
    case "Cancelled":
      subject = "Your Order Has Been Cancelled";
      content = `
        <h1>Order Cancellation</h1>
        <p>Dear ${customerName},</p>
        <p>Your order #${order.id} has been cancelled.</p>
        <p>If you did not request this cancellation, please contact our customer support team immediately.</p>
        <p>Any payment made will be refunded within 5-7 business days.</p>
        <p>Thank you for your understanding.</p>
        <p>Best regards,<br>Customer Service Team</p>
      `;
      break;
    default:
      subject = `Update on Your Order: ${order.status}`;
      content = `
        <h1>Order Update</h1>
        <p>Dear ${customerName},</p>
        <p>There has been an update to your order #${order.id}.</p>
        <p>Current status: ${order.status}</p>
        <p>If you have any questions, please don't hesitate to contact our customer support team.</p>
        <p>Thank you for shopping with us!</p>
        <p>Best regards,<br>Customer Service Team</p>
      `;
  }
  
  return sendEmail(customerEmail, subject, content);
};
