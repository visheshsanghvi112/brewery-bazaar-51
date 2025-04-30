
import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster 
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 5000,
      }}
    />
  );
}
