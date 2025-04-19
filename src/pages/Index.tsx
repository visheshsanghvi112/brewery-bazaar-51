import React, { useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/lib/data";
import { useProducts } from "@/hooks/use-products";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import BrandFeatures from "@/components/home/BrandFeatures";
import { RotatingImage } from "@/components/ui/rotating-image";

const TestimonialSection = lazy(() => import('@/components/home/TestimonialSection'));
const FeaturedProducts = lazy(() => import('@/components/home/FeaturedProducts'));
const WhyChooseUs = lazy(() => import('@/components/home/WhyChooseUs'));
const CategorySection = lazy(() => import('@/components/home/CategorySection'));

export default function Index() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const buttonHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  const { toast } = useToast();
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const isMobile = useIsMobile();
  const { showConsent, acceptCookies, declineCookies } = useCookieConsent();
  const { products, loading } = useProducts();

  const [email, setEmail] = useState("");
  const [subscribedEmail, setSubscribedEmail] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Subscription Successful!",
      description: "Thank you for subscribing to our newsletter.",
    });

    setEmail("");
    setSubscribedEmail(true);
  };

  const featuredProducts = products.filter(product => product.featured).slice(0, 4);
  const displayCategories = categories.filter(
    category => products.some(product => product.category === category.slug)
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <>
      <section className="relative min-h-[90vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/lovable-uploads/testt.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="sticky top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 z-20">
          <RotatingImage />
        </div>

        <div className="container relative z-20 mx-auto px-4 md:px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
          </motion.div>
        </div>
      </section>

      <BrandFeatures isMobile={isMobile} />

      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading categories...</div>}>
        <CategorySection filteredCategories={displayCategories} />
      </Suspense>

      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading products...</div>}>
        <div className="relative py-16">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute -top-[10%] -left-[5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute -bottom-[10%] -right-[5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-3xl"></div>
          </div>

          <FeaturedProducts featuredProducts={featuredProducts} formatPrice={formatPrice} isMobile={isMobile} />
        </div>
      </Suspense>

      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
        <WhyChooseUs />
      </Suspense>

      {!isMobile && (
        <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading testimonials...</div>}>
          <TestimonialSection 
            testimonials={[
              {
                id: 1,
                text: "The quality of these clothes exceeded my expectations. I've been shopping here for months and have never been disappointed.",
                author: "Jamie Smith",
                location: "New York",
                verified: true
              },
              {
                id: 2,
                text: "Fast shipping and the t-shirt fits perfectly. Will definitely be ordering more items soon!",
                author: "Alex Johnson",
                location: "Los Angeles",
                verified: true
              },
              {
                id: 3,
                text: "Love the designs! These are now my go-to pieces for both casual and semi-formal events.",
                author: "Taylor Wilson",
                location: "Chicago",
                verified: false
              }
            ]} 
            isMobile={isMobile} 
          />
        </Suspense>
      )}

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />

        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            variants={fadeIn}
            className="max-w-xl mx-auto text-center space-y-8"
          >
            <h2 className="text-4xl font-bold tracking-tight">
              Join Our Community
            </h2>
            <p className="text-lg text-muted-foreground">
              Get early access to new releases, exclusive discounts, and style inspiration.
            </p>
            {!subscribedEmail ? (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-full h-12 border-primary/20 focus:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="rounded-full h-12 px-8 hover:scale-105 transition-transform">
                  Subscribe
                </Button>
              </form>
            ) : (
              <p className="text-primary font-medium text-lg py-3">Thank you for subscribing!</p>
            )}
          </motion.div>
        </div>
      </motion.section>

      {showConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t p-4 z-50 shadow-lg">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p>
                This website uses cookies to enhance your browsing experience. 
                By continuing to use this site, you consent to our use of cookies.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={declineCookies} className="hover:bg-primary/10">
                Decline
              </Button>
              <Button onClick={acceptCookies} className="hover:scale-105 transition-transform">
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
