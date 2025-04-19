
import React from "react";
import { motion } from "framer-motion";
import { Star, Award } from "lucide-react";

interface Testimonial {
  id: number;
  text: string;
  author: string;
  location: string;
  verified: boolean;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
  isMobile: boolean;
}

export default function TestimonialSection({ testimonials, isMobile }: TestimonialSectionProps) {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="py-12 md:py-16 bg-gradient-to-tr from-accent/10 to-background"
    >
      <div className="container mx-auto px-4">
        <motion.div variants={fadeIn} className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">What Our Customers Say</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            We pride ourselves on quality and customer satisfaction. Here's what our customers have to say.
          </p>
        </motion.div>
        
        <div className={`grid grid-cols-1 ${isMobile ? 'snap-x snap-mandatory overflow-x-auto flex' : 'md:grid-cols-3'} gap-6`}>
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
              className={`${isMobile ? 'snap-center min-w-[85vw]' : ''} bg-gradient-to-br from-card to-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow relative`}
            >
              {testimonial.verified && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <Award className="h-3 w-3" />
                  <span>Verified</span>
                </div>
              )}
              
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-sm md:text-base text-muted-foreground mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mr-3">
                  <span className="text-sm font-medium">{testimonial.author.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
