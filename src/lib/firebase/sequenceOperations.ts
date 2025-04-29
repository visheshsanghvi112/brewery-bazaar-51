import { db } from "@/integrations/firebase/client";
import { doc, getDoc, updateDoc, runTransaction } from "firebase/firestore";
import { COLLECTIONS } from "./constants";

// Update the sequence counter in Firestore
export async function updateSequenceCounter(sequenceName: string, value: number) {
  try {
    const sequenceRef = doc(db, COLLECTIONS.SEQUENCES, sequenceName);
    const sequenceDoc = await getDoc(sequenceRef);
    
    if (!sequenceDoc.exists()) {
      // Create new sequence
      await updateDoc(sequenceRef, { value });
    } else {
      // Update existing sequence
      await updateDoc(sequenceRef, { value });
    }
    
    console.log(`Sequence ${sequenceName} updated to ${value}`);
    return value;
  } catch (error) {
    console.error(`Error updating sequence ${sequenceName}:`, error);
    throw error;
  }
}

// Function to get the next sequence number
export async function getNextSequence(sequenceName: string): Promise<number> {
  const sequenceRef = doc(db, "sequences", sequenceName);
  
  try {
    // Use a transaction to ensure we get a unique number even with concurrent requests
    const result = await runTransaction(db, async (transaction) => {
      const sequenceDoc = await transaction.get(sequenceRef);
      
      // If the sequence document doesn't exist, create it with initial value 1
      if (!sequenceDoc.exists()) {
        transaction.set(sequenceRef, { value: 1 });
        return 1;
      }
      
      // Otherwise increment the existing value
      const newValue = (sequenceDoc.data().value || 0) + 1;
      transaction.update(sequenceRef, { value: newValue });
      return newValue;
    });
    
    return result;
  } catch (error) {
    console.error("Error getting next sequence:", error);
    // Fallback to timestamp if transaction fails
    return Date.now();
  }
}

// Function to pad the sequence number with leading zeros
export const formatSequenceNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};
