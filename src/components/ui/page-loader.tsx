
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface PageLoaderProps {
  loading?: boolean;
}

export function PageLoader({ loading = true }: PageLoaderProps) {
  const [isVisible, setIsVisible] = useState(loading);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // Wait a bit before hiding to complete animation
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [loading]);

  // SVG animation variants
  const brewingAnimation: Variants = {
    initial: { pathLength: 0, pathOffset: 0 },
    animate: {
      pathLength: 1,
      pathOffset: 0,
    }
  };

  const liquidAnimation: Variants = {
    initial: { y: 50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col items-center"
          >
            {/* Custom beer mug loader animation */}
            <div className="relative w-24 h-24">
              <motion.svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute"
              >
                {/* Beer mug outline */}
                <motion.path
                  d="M30 30H60C65 30 70 35 70 45V75C70 80 65 85 60 85H30C25 85 20 80 20 75V45C20 35 25 30 30 30Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial="initial"
                  animate="animate"
                  variants={brewingAnimation}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 0.2
                  }}
                  className="text-primary"
                />
                
                {/* Beer mug handle */}
                <motion.path
                  d="M70 40H80C85 40 90 45 90 50C90 55 85 60 80 60H70"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial="initial"
                  animate="animate"
                  variants={brewingAnimation}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 0.2
                  }}
                  className="text-primary"
                />
                
                {/* Beer liquid */}
                <motion.rect
                  x="25"
                  y="40"
                  width="40"
                  height="40"
                  rx="5"
                  fill="currentColor"
                  initial="initial"
                  animate="animate"
                  variants={liquidAnimation}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 0.2
                  }}
                  className="text-primary/50"
                />
                
                {/* Beer foam */}
                <motion.path
                  d="M25 40C25 40 30 35 35 38C40 41 45 35 50.2 38C55 41 60 38 65 40"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial="initial"
                  animate="animate"
                  variants={brewingAnimation}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 0.2
                  }}
                />
              </motion.svg>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 font-bold text-2xl text-primary"
            >
              BREWERY
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.2
              }}
              className="mt-3 text-sm text-muted-foreground"
            >
              Crafting your experience...
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
