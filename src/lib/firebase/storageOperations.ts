import { storage } from "@/integrations/firebase/client";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Upload an image file to Firebase Storage
 * @param file The file to upload
 * @param path Optional subpath, defaults to purely "products" folder
 * @returns The public download URL of the uploaded image
 */
export const uploadImageToStorage = async (file: File, path: string = "products"): Promise<string> => {
  try {
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uniqueFileName = `${timestamp}_${safeFileName}`;
    const storageRef = ref(storage, `${path}/${uniqueFileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Storage:", error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage using its URL
 * @param imageUrl The full public download URL of the image
 */
export const deleteImageFromStorage = async (imageUrl: string): Promise<void> => {
  try {
    // Only attempt to delete if it's a firebase storage URL
    if (imageUrl.includes('firebasestorage.googleapis.com')) {
      // Create a reference from the HTTPS URL
      const fileRef = ref(storage, imageUrl);
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.error("Error deleting image from Storage:", error);
    // Don't throw, let failure gracefully proceed since it's just cleanup
  }
};
