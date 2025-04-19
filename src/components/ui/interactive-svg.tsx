
import { motion } from "framer-motion";

export const InteractiveSVG = () => {
  const pathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const circleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: 1,
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const rectangleVariants = {
    initial: { rotate: 0, opacity: 0 },
    animate: {
      rotate: 360,
      opacity: 1,
      transition: {
        duration: 4,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full max-w-[200px] max-h-[200px]"
      >
        {/* Abstract path */}
        <motion.path
          d="M100 20C120 20 140 40 140 60C140 80 120 100 100 100C80 100 60 80 60 60C60 40 80 20 100 20Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary"
          variants={pathVariants}
          initial="initial"
          animate="animate"
        />

        {/* Rotating rectangle */}
        <motion.rect
          x="90"
          y="90"
          width="20"
          height="20"
          className="fill-primary/30"
          variants={rectangleVariants}
          initial="initial"
          animate="animate"
        />

        {/* Pulsing circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="40"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary/50"
          variants={circleVariants}
          initial="initial"
          animate="animate"
        />

        {/* Additional decorative elements */}
        <motion.path
          d="M60 140C80 160 120 160 140 140"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary"
          variants={pathVariants}
          initial="initial"
          animate="animate"
        />
      </svg>
    </motion.div>
  );
};
