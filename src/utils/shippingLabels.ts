
import { Order } from "@/types";
import { jsPDF } from "jspdf";

// Generate a tracking number
const generateTrackingNumber = () => {
  const prefix = "TN";
  const timestamp = Date.now().toString().substring(5, 13);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// Generate a shipping label as PDF and return the data URL
export const generateShippingLabel = async (order: Order): Promise<string> => {
  console.log("Generating shipping label for order:", order.id);
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a6'
  });
  
  // Set font
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  
  // Add title
  doc.text("SHIPPING LABEL", 15, 15);
  
  // Set normal font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
  // Generate tracking number if not exists
  const trackingNumber = order.trackingNumber || generateTrackingNumber();
  
  // Add shipping information
  doc.setFontSize(10);
  doc.text("From:", 15, 25);
  doc.text("FashionTrend", 15, 30);
  doc.text("123 Commerce St.", 15, 35);
  doc.text("Mumbai, MH 400001", 15, 40);
  doc.text("India", 15, 45);
  
  // Add recipient information
  doc.text("To:", 15, 55);
  doc.text(order.customer.name, 15, 60);
  doc.text(order.shippingAddress.street, 15, 65);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 15, 70);
  doc.text(order.shippingAddress.country, 15, 75);
  
  // Add tracking number
  doc.setFont('helvetica', 'bold');
  doc.text("Tracking #:", 15, 85);
  doc.setFont('helvetica', 'normal');
  doc.text(trackingNumber, 45, 85);
  
  // Add order details
  doc.setFont('helvetica', 'bold');
  doc.text("Order #:", 15, 95);
  doc.setFont('helvetica', 'normal');
  doc.text(order.id, 45, 95);
  
  // Add current date
  const currentDate = new Date().toLocaleDateString();
  doc.text("Date:", 15, 105);
  doc.text(currentDate, 45, 105);
  
  // Add barcode (simulated with a rectangle)
  doc.setDrawColor(0);
  doc.setFillColor(0);
  doc.rect(15, 115, 70, 15, "F");
  doc.setTextColor(255);
  doc.setFontSize(8);
  doc.text(trackingNumber, 30, 122);
  doc.setTextColor(0);
  
  // Save as data URL
  const dataUrl = doc.output('datauristring');
  
  console.log("Generated shipping label with tracking number:", trackingNumber);
  
  // Return data URL with tracking number appended
  return `${dataUrl}-${trackingNumber}`;
};

// Print shipping label
export const printShippingLabel = (labelUrl: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Shipping Label</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
          img { max-width: 100%; max-height: 100vh; }
        </style>
      </head>
      <body>
        <img src="${labelUrl.split('-')[0]}" onload="window.print(); window.close();" />
      </body>
    </html>
  `);
  
  printWindow.document.close();
};

// Function to generate multiple shipping labels in batch
export const generateBatchShippingLabels = async (orders: Order[]): Promise<{
  trackingNumbers: { [orderId: string]: string };
  combinedPdfUrl: string;
}> => {
  console.log("Generating batch shipping labels for orders:", orders.map(o => o.id));
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a6'
  });
  
  const trackingNumbers: { [orderId: string]: string } = {};
  
  // Generate labels for each order
  orders.forEach((order, index) => {
    // Add new page for all orders except the first one
    if (index > 0) {
      doc.addPage('a6', 'portrait');
    }
    
    // Generate tracking number
    const trackingNumber = order.trackingNumber || generateTrackingNumber();
    trackingNumbers[order.id] = trackingNumber;
    
    // Set font
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    
    // Add title
    doc.text("SHIPPING LABEL", 15, 15);
    
    // Set normal font
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    // Add shipping information
    doc.setFontSize(10);
    doc.text("From:", 15, 25);
    doc.text("FashionTrend", 15, 30);
    doc.text("123 Commerce St.", 15, 35);
    doc.text("Mumbai, MH 400001", 15, 40);
    doc.text("India", 15, 45);
    
    // Add recipient information
    doc.text("To:", 15, 55);
    doc.text(order.customer.name, 15, 60);
    doc.text(order.shippingAddress.street, 15, 65);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 15, 70);
    doc.text(order.shippingAddress.country, 15, 75);
    
    // Add tracking number
    doc.setFont('helvetica', 'bold');
    doc.text("Tracking #:", 15, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(trackingNumber, 45, 85);
    
    // Add order details
    doc.setFont('helvetica', 'bold');
    doc.text("Order #:", 15, 95);
    doc.setFont('helvetica', 'normal');
    doc.text(order.id, 45, 95);
    
    // Add current date
    const currentDate = new Date().toLocaleDateString();
    doc.text("Date:", 15, 105);
    doc.text(currentDate, 45, 105);
    
    // Add barcode (simulated with a rectangle)
    doc.setDrawColor(0);
    doc.setFillColor(0);
    doc.rect(15, 115, 70, 15, "F");
    doc.setTextColor(255);
    doc.setFontSize(8);
    doc.text(trackingNumber, 30, 122);
    doc.setTextColor(0);
  });
  
  // Save as data URL
  const dataUrl = doc.output('datauristring');
  
  console.log("Generated batch shipping labels with tracking numbers:", trackingNumbers);
  
  return {
    trackingNumbers,
    combinedPdfUrl: dataUrl
  };
};
