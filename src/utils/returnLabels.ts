
import { ReturnRequest } from "@/types";
import { jsPDF } from "jspdf";

/**
 * Generates a PDF return label for a return request
 */
export const generateReturnLabel = (returnRequest: ReturnRequest): string => {
  const doc = new jsPDF();
  
  // Add company logo and header
  doc.setFontSize(22);
  doc.text("RETURN LABEL", 105, 20, { align: "center" });
  
  // Add return information
  doc.setFontSize(12);
  doc.text(`Return ID: ${returnRequest.id}`, 20, 40);
  doc.text(`Order ID: ${returnRequest.orderId}`, 20, 50);
  doc.text(`Customer: ${returnRequest.customerName}`, 20, 60);
  
  // Add shipping address
  doc.text("Return To:", 20, 80);
  doc.text("Fashion Store Returns Department", 20, 90);
  doc.text("123 Commerce Street", 20, 100);
  doc.text("Warehouse District", 20, 110);
  doc.text("New York, NY 10001", 20, 120);
  
  // Add barcode placeholder
  doc.setFillColor(0, 0, 0);
  // Mock barcode as a series of rectangles
  let x = 20;
  for (let i = 0; i < 30; i++) {
    const width = Math.random() > 0.5 ? 3 : 1;
    doc.rect(x, 140, width, 30, "F");
    x += width + 1;
  }
  doc.text(returnRequest.id, 60, 180);
  
  // Add instructions
  doc.text("Instructions:", 20, 200);
  doc.setFontSize(10);
  doc.text("1. Print this label and affix it to your package", 20, 210);
  doc.text("2. Drop off the package at any postal service location", 20, 220);
  doc.text("3. Keep the receipt for your records", 20, 230);
  
  // Convert to data URL
  return doc.output("datauristring");
};

/**
 * Downloads a return label as PDF
 */
export const downloadReturnLabel = (returnRequest: ReturnRequest) => {
  const doc = new jsPDF();
  
  // Add company logo and header
  doc.setFontSize(22);
  doc.text("RETURN LABEL", 105, 20, { align: "center" });
  
  // Add return information
  doc.setFontSize(12);
  doc.text(`Return ID: ${returnRequest.id}`, 20, 40);
  doc.text(`Order ID: ${returnRequest.orderId}`, 20, 50);
  doc.text(`Customer: ${returnRequest.customerName}`, 20, 60);
  
  // Add shipping address
  doc.text("Return To:", 20, 80);
  doc.text("Fashion Store Returns Department", 20, 90);
  doc.text("123 Commerce Street", 20, 100);
  doc.text("Warehouse District", 20, 110);
  doc.text("New York, NY 10001", 20, 120);
  
  // Add barcode placeholder
  doc.setFillColor(0, 0, 0);
  // Mock barcode as a series of rectangles
  let x = 20;
  for (let i = 0; i < 30; i++) {
    const width = Math.random() > 0.5 ? 3 : 1;
    doc.rect(x, 140, width, 30, "F");
    x += width + 1;
  }
  doc.text(returnRequest.id, 60, 180);
  
  // Add instructions
  doc.text("Instructions:", 20, 200);
  doc.setFontSize(10);
  doc.text("1. Print this label and affix it to your package", 20, 210);
  doc.text("2. Drop off the package at any postal service location", 20, 220);
  doc.text("3. Keep the receipt for your records", 20, 230);
  
  // Download the PDF
  doc.save(`return-label-${returnRequest.id}.pdf`);
};
