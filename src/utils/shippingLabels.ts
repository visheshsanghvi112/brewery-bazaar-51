
import { Order } from "@/types";
import { jsPDF } from "jspdf";

// Type for tracking numbers
interface TrackingNumbers {
  [orderId: string]: string;
}

/**
 * Generates a shipping label for an order
 */
export const generateShippingLabel = (order: Order): string => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add company logo and header
  doc.setFontSize(22);
  doc.text("SHIPPING LABEL", 105, 20, { align: "center" });
  
  // Add shipping information
  doc.setFontSize(12);
  doc.text(`Order #${order.id}`, 20, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
  
  // Add shipping address
  doc.text("Ship To:", 20, 70);
  doc.text(order.customer.name, 20, 80);
  doc.text(order.shippingAddress.street, 20, 90);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 20, 100);
  doc.text(order.shippingAddress.country, 20, 110);
  
  // Add barcode placeholder
  doc.setFillColor(0, 0, 0);
  // Mock barcode as a series of rectangles
  let x = 20;
  for (let i = 0; i < 30; i++) {
    const width = Math.random() > 0.5 ? 3 : 1;
    doc.rect(x, 130, width, 30, "F");
    x += width + 1;
  }
  doc.text(`TRACKING: ${order.trackingNumber || generateTrackingNumber()}`, 20, 170);
  
  // Add package information
  doc.text("Package Information:", 20, 190);
  doc.setFontSize(10);
  doc.text(`Weight: ${Math.floor(Math.random() * 5) + 1} lbs`, 20, 200);
  doc.text(`Items: ${order.items.length}`, 20, 210);
  doc.text(`Service: Standard Shipping`, 20, 220);
  
  // Convert to data URL
  return doc.output("datauristring");
};

/**
 * Generates a random tracking number
 */
const generateTrackingNumber = (): string => {
  const prefix = "TRK";
  const number = Math.floor(Math.random() * 10000000).toString().padStart(7, "0");
  return `${prefix}${number}`;
};

/**
 * Generates shipping labels for multiple orders
 */
export const generateBatchShippingLabels = async (
  orders: Order[]
): Promise<{ trackingNumbers: TrackingNumbers; combinedPdfUrl: string }> => {
  console.log(`Generating ${orders.length} shipping labels`);
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Object to store tracking numbers
  const trackingNumbers: TrackingNumbers = {};
  
  // Generate a shipping label for each order
  orders.forEach((order, index) => {
    // Add a new page for each order except the first one
    if (index > 0) {
      doc.addPage();
    }
    
    // Generate or use existing tracking number
    const trackingNumber = order.trackingNumber || generateTrackingNumber();
    trackingNumbers[order.id] = trackingNumber;
    
    // Add company logo and header
    doc.setFontSize(22);
    doc.text("SHIPPING LABEL", 105, 20, { align: "center" });
    
    // Add shipping information
    doc.setFontSize(12);
    doc.text(`Order #${order.id}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    // Add shipping address
    doc.text("Ship To:", 20, 70);
    doc.text(order.customer.name, 20, 80);
    doc.text(order.shippingAddress.street, 20, 90);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 20, 100);
    doc.text(order.shippingAddress.country, 20, 110);
    
    // Add barcode placeholder
    doc.setFillColor(0, 0, 0);
    // Mock barcode as a series of rectangles
    let x = 20;
    for (let i = 0; i < 30; i++) {
      const width = Math.random() > 0.5 ? 3 : 1;
      doc.rect(x, 130, width, 30, "F");
      x += width + 1;
    }
    doc.text(`TRACKING: ${trackingNumber}`, 20, 170);
    
    // Add package information
    doc.text("Package Information:", 20, 190);
    doc.setFontSize(10);
    doc.text(`Weight: ${Math.floor(Math.random() * 5) + 1} lbs`, 20, 200);
    doc.text(`Items: ${order.items.length}`, 20, 210);
    doc.text(`Service: Standard Shipping`, 20, 220);
  });
  
  // Convert to data URL
  const combinedPdfUrl = doc.output("datauristring");
  
  return { trackingNumbers, combinedPdfUrl };
};
