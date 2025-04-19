
import React, { useState } from "react";
import { motion } from "framer-motion";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="aspect-square bg-secondary rounded-md overflow-hidden"
      >
        <img
          src={images[activeImageIndex]}
          alt={productName}
          className="object-cover w-full h-full"
        />
      </motion.div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`aspect-square rounded-md overflow-hidden bg-secondary cursor-pointer border-2 ${
              index === activeImageIndex ? "border-primary" : "border-transparent"
            }`}
            onClick={() => setActiveImageIndex(index)}
          >
            <img
              src={image}
              alt={`${productName} ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
