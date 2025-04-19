
import React from "react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
  variant?: "circle" | "dots" | "beer";
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
  variant = "circle",
  className,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const colorClasses = {
    primary: "border-primary border-t-transparent text-primary",
    secondary: "border-secondary border-t-transparent text-secondary",
    white: "border-white border-t-transparent text-white",
  };

  if (variant === "circle") {
    return (
      <div
        className={cn(
          "relative inline-block animate-spin rounded-full",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  if (variant === "dots") {
    const dotSize = {
      sm: "h-1.5 w-1.5",
      md: "h-2.5 w-2.5",
      lg: "h-3 w-3",
    };
    
    return (
      <div className={cn("flex items-center gap-1", className)} {...props}>
        <motion.div
          className={cn("rounded-full bg-current", dotSize[size], colorClasses[color])}
          animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={cn("rounded-full bg-current", dotSize[size], colorClasses[color])}
          animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className={cn("rounded-full bg-current", dotSize[size], colorClasses[color])}
          animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  // Beer variant for fun loading animation
  if (variant === "beer") {
    const beerSvgSize = {
      sm: "h-6 w-6",
      md: "h-10 w-10",
      lg: "h-16 w-16",
    };
    
    // SVG animation variants
    const brewingAnimation: Variants = {
      initial: { pathLength: 0, pathOffset: 0 },
      animate: { 
        pathLength: 1,
        pathOffset: 0,
      }
    };

    const liquidAnimation: Variants = {
      initial: { y: 20, opacity: 0 },
      animate: { 
        y: 0,
        opacity: 1,
      }
    };
    
    return (
      <div className={cn("relative", className)} {...props}>
        <motion.svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("text-current", beerSvgSize[size], colorClasses[color])}
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
            style={{ opacity: 0.5 }}
          />
          
          {/* Beer foam */}
          <motion.path
            d="M25 40C25 40 30 35 35 38C40 41 45 35 50.2 38C55 41 60 38 65 40"
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
          />
        </motion.svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  
  return null;
}
