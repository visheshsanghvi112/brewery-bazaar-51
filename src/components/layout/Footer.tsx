import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, ChevronRight, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AnnouncementBar } from "@/components/ui/announcement-bar";
import { useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

export default function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Check if email already exists
      const q = query(
        collection(db, "contact_submissions"),
        where("email", "==", email),
        where("type", "==", "newsletter")
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast({
          title: "Already Subscribed",
          description: "This email is already subscribed to our newsletter",
          variant: "destructive",
        });
        return;
      }
      
      // Add new subscription
      await addDoc(collection(db, "contact_submissions"), {
        email: email.trim(),
        type: "newsletter",
        createdAt: new Date(),
      });
      
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
      });
      
      setEmail("");
      
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: "Error",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-border bg-background">
      {/* Features Banner */}
      <div className="bg-secondary py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm"
            >
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-semibold">Free Shipping</h4>
                <p className="text-sm text-muted-foreground">On orders above ₹999</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center justify-center gap-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm"
            >
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-semibold">Secure Payment</h4>
                <p className="text-sm text-muted-foreground">UPI, Cards & More</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center justify-center md:justify-end gap-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm"
            >
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-semibold">Quality Assurance</h4>
                <p className="text-sm text-muted-foreground">1-Year Warranty</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Newsletter */}
      <div className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3">Join Our Newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Stay updated with the latest releases and exclusive offers
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="sm:w-auto"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <motion.div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter text-primary hover:text-primary/90 transition-colors">
              BREWERY
            </h2>
            <p className="text-sm text-muted-foreground">
              Premium streetwear brand offering stylish and affordable clothing inspired by Mumbai's vibrant culture.
            </p>
            <div className="pt-2 space-y-2">
              <div className="flex items-center group hover:text-primary transition-colors">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <a href="mailto:breweryfit@gmail.com" className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  breweryfit@gmail.com
                </a>
              </div>
              <div className="flex items-center group hover:text-primary transition-colors">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <a href="tel:+919876543210" className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center group hover:text-primary transition-colors">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm text-muted-foreground">
                  42 Fashion Street, Mumbai - 400001
                </span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=t-shirts" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/products?category=shorts" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Shorts
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support/faqs" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/support/shipping" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/support/returns" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/support/size-guide" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/support/track-order" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground flex items-center group">
                  <ChevronRight className="h-3 w-3 mr-1 invisible group-hover:visible text-primary transition-all" />
                  Support Home
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Brewery. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
