import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";

export const AnnouncementBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    if (containerRef.current) {
      setContentWidth(containerRef.current.scrollWidth);
    }
  }, []);

  return (
    <div className={`relative overflow-hidden py-3 backdrop-blur-md border-b border-primary/10 ${isDarkTheme ? "bg-white/5" : "bg-black/5"}`}>
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex relative whitespace-nowrap">
        {/* Loop once, but stretch across width twice for seamless loop */}
        <motion.div
          ref={containerRef}
          className="flex items-center gap-x-16 px-4 shrink-0"
          animate={{ x: [0, -contentWidth] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {Array.from({ length: 2 }).map((_, loopIndex) => (
            <div key={loopIndex} className="flex items-center gap-x-16">
              {["SHIPPING ALL OVER INDIA", "SHIPPING WORLDWIDE", "FREE RETURNS", "COD AVAILABLE","SHIPPING ALL OVER INDIA", "SHIPPING WORLDWIDE", "FREE RETURNS", "COD AVAILABLE"].map((text, i) => (
                <Link
                  key={`${text}-${i}`}
                  to="/support/shipping"
                  className="group flex items-center text-primary hover:opacity-80 transition-all"
                >
                  <Globe className="w-5 h-5 mr-2 text-primary animate-spin-slow group-hover:animate-none transition-transform duration-300" />
                  <span className="text-sm sm:text-base font-semibold tracking-wider group-hover:underline transition-all">
                    {text}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
