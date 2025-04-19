
import { motion } from "framer-motion";

export const RotatingImage = () => {
  return (
    <div 
      className="w-full h-full flex items-center justify-center"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full"
        animate={{ 
          rotateY: [0, 180, 360],
          rotateX: [0, 30, 0, -30, 0],
          rotateZ: [0, 45, 0, -45, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.5, 1]
        }}
      >
        <img
          src="/lovable-uploads/e9172a4d-1e44-40b1-a649-030edcd433a3.png"
          alt="Rotating design"
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
};

