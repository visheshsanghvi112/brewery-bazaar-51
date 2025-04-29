
// This file re-exports all the functions from the different modules
// for backward compatibility
export { COLLECTIONS } from './constants';
export { saveShippingDetails, getShippingDetails } from './shippingOperations';
export { saveCustomer } from './customerOperations';
export { createReturnRequest, getReturnRequests } from './returnOperations';
export { updateSequenceCounter } from './sequenceOperations';
export { saveOrder, getOrders, createTestOrder } from './orderOperations';

// This file is kept for backward compatibility.
// New code should import directly from the specific operation files.
