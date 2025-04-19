
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUs() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with 3D-like gradient background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_40%)] mix-blend-overlay"></div>
        
        {/* Animated floating shapes */}
        <motion.div 
          className="absolute top-20 left-[10%] w-32 h-32 bg-pink-500/10 rounded-full blur-xl"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        ></motion.div>
        
        <motion.div 
          className="absolute bottom-20 right-[15%] w-40 h-40 bg-blue-500/10 rounded-full blur-xl"
          animate={{ 
            y: [0, 40, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        ></motion.div>

        <div className="container relative mx-auto px-4 py-28 md:py-36">
          <motion.div 
            className="max-w-3xl mx-auto text-center text-white"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
              variants={fadeIn}
            >
              About Brewery
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-blue-100 mb-8"
              variants={fadeIn}
            >
              Crafting premium streetwear inspired by Mumbai's vibrant urban culture
            </motion.p>
            <motion.div variants={fadeIn}>
              <Button asChild size="lg" className="bg-white text-indigo-900 hover:bg-blue-100">
                <Link to="/products">
                  Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
          >
            <motion.div variants={fadeIn}>
              <span className="inline-block text-sm font-semibold text-primary mb-2">OUR JOURNEY</span>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Brewery was born in 2020 from a passion for authentic streetwear that reflects 
                the dynamic energy of Mumbai. What started as a small collection of graphic tees 
                has evolved into a comprehensive streetwear brand celebrating urban culture.
              </p>
              <p className="text-muted-foreground mb-4">
                Our founders, a group of fashion enthusiasts and street culture advocates, noticed 
                a gap in the market for affordable yet high-quality streetwear that resonates with 
                the youth of India.
              </p>
              <p className="text-muted-foreground mb-6">
                Today, Brewery stands at the intersection of comfort, style, and cultural expression, 
                offering premium streetwear that doesn't compromise on quality or break the bank.
              </p>
              <Button asChild className="mt-4">
                <Link to="/products">
                  Shop Our Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <div className="relative">
              <motion.div 
                className="rounded-lg overflow-hidden shadow-xl"
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Brewery team" 
                  className="w-full h-auto object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent mix-blend-overlay rounded-lg"></div>
              </motion.div>
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <p className="font-bold">Since 2020</p>
                <p className="text-sm">Mumbai, India</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm font-semibold text-primary mb-2">OUR PURPOSE</span>
              <h2 className="text-3xl font-bold mb-6">Mission & Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're committed to creating clothing that empowers individual expression while supporting local communities and promoting sustainable practices.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-background p-8 rounded-lg shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Quality</h3>
              <p className="text-muted-foreground">
                We source only the finest materials and work with skilled craftspeople to ensure 
                our products meet the highest standards of quality and durability.
              </p>
            </motion.div>
            <motion.div 
              className="bg-background p-8 rounded-lg shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Authenticity</h3>
              <p className="text-muted-foreground">
                Every design tells a story that's rooted in real urban experiences and cultural 
                narratives, bringing authenticity to every piece we create.
              </p>
            </motion.div>
            <motion.div 
              className="bg-background p-8 rounded-lg shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Accessibility</h3>
              <p className="text-muted-foreground">
                We believe great style should be accessible to all, which is why we offer premium 
                quality at prices that don't exclude the very audience we design for.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-semibold text-primary mb-2">OUR CREW</span>
            <h2 className="text-3xl font-bold mb-6">The Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the passionate individuals behind Brewery's creative vision and business operations.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Arjun Sharma",
                position: "Creative Director",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              },
              {
                name: "Meera Patel",
                position: "Head Designer",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              },
              {
                name: "Vikram Singh",
                position: "Operations Manager",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              }
            ].map((member, index) => (
              <motion.div 
                key={member.name}
                className="bg-secondary/30 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have questions or feedback? We'd love to hear from you!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-10">
              <div className="p-6">
                <Mail className="mx-auto h-8 w-8 mb-4 text-primary" />
                <h3 className="text-lg font-medium mb-2">Email Us</h3>
                <a href="mailto:breweryfit@gmail.com" className="text-primary hover:underline">
                  breweryfit@gmail.com
                </a>
              </div>
              <div className="p-6">
                <Phone className="mx-auto h-8 w-8 mb-4 text-primary" />
                <h3 className="text-lg font-medium mb-2">Call Us</h3>
                <a href="tel:+919876543210" className="text-primary hover:underline">
                  +91 98765 43210
                </a>
              </div>
              <div className="p-6">
                <MapPin className="mx-auto h-8 w-8 mb-4 text-primary" />
                <h3 className="text-lg font-medium mb-2">Visit Us</h3>
                <p className="text-muted-foreground">
                  42 Fashion Street, Mumbai, India - 400001
                </p>
              </div>
            </div>
            
            <Button asChild size="lg">
              <Link to="/contact">
                Contact Us Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
