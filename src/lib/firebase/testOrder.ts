
import { createTestOrder } from './collections';

export async function runTestOrder() {
  try {
    console.log('Creating test order in Firestore...');
    const result = await createTestOrder();
    console.log('Test order created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in test order:', error);
    throw error;
  }
}
