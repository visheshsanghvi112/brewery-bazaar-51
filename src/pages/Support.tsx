
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Package, 
  ArrowRight, 
  Search, 
  HelpCircle, 
  Clock, 
  ArrowLeft, 
  Truck 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Support = () => {
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeTab, setActiveTab] = useState("faqs");

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid tracking number",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would connect to a shipping API
    toast({
      title: "Order Found",
      description: `Tracking information for order #${trackingNumber} is being fetched.`,
    });
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-background to-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            >
              How Can We Help You?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Get answers to all your questions about orders, shipping, returns, and more.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
      </section>

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="max-w-5xl mx-auto"
        >
          <TabsList className="w-full mb-8 bg-background/50 backdrop-blur-sm overflow-x-auto flex whitespace-nowrap md:justify-center p-1 border">
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipping Info
            </TabsTrigger>
            <TabsTrigger value="returns" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Returns & Exchanges
            </TabsTrigger>
            <TabsTrigger value="size-guide" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Size Guide
            </TabsTrigger>
            <TabsTrigger value="track-order" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Track Order
            </TabsTrigger>
          </TabsList>

          {/* FAQs Content */}
          <TabsContent value="faqs">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to our most commonly asked questions.</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerAnimation}
                  initial="hidden"
                  animate="visible"
                  className="mt-4"
                >
                  <Accordion type="single" collapsible className="w-full">
                    <motion.div variants={itemAnimation}>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How long will my order take to arrive?</AccordionTrigger>
                        <AccordionContent>
                          <p>Orders typically take 3-5 business days to arrive within India. International shipping may take 7-14 business days depending on the destination country. You can check the status of your order in your account or use our order tracking feature.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                    
                    <motion.div variants={itemAnimation}>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>What is your return policy?</AccordionTrigger>
                        <AccordionContent>
                          <p>We accept returns within 30 days of delivery for unworn items in original packaging. Initiating a return is easy - just login to your account, find your order, and select "Return Items". For more details, please see our Returns & Exchanges section.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                    
                    <motion.div variants={itemAnimation}>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>How do I find my size?</AccordionTrigger>
                        <AccordionContent>
                          <p>You can refer to our detailed size guide to find your perfect fit. Each product page also includes specific sizing information. If you're between sizes, we generally recommend sizing up for a more comfortable fit.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                    
                    <motion.div variants={itemAnimation}>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
                        <AccordionContent>
                          <p>Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see shipping costs during checkout before completing your purchase.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                    
                    <motion.div variants={itemAnimation}>
                      <AccordionItem value="item-5">
                        <AccordionTrigger>How do I care for my Brewery clothing?</AccordionTrigger>
                        <AccordionContent>
                          <p>For most items, we recommend machine washing in cold water and air drying to maintain the quality and longevity of your garments. Specific care instructions are included on the tag of each item and on product pages.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                    
                    <motion.div variants={itemAnimation}>
                      <AccordionItem value="item-6">
                        <AccordionTrigger>Are your products sustainable?</AccordionTrigger>
                        <AccordionContent>
                          <p>Sustainability is a priority for us. We use eco-friendly materials where possible and are continuously working to improve our manufacturing processes. Our packaging is made from recycled materials and is recyclable.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                    
                    <motion.div variants={itemAnimation}>
                      <AccordionItem value="item-7">
                        <AccordionTrigger>Can I modify or cancel my order?</AccordionTrigger>
                        <AccordionContent>
                          <p>Orders can be modified or canceled within 1 hour of placing them. For assistance, please contact our customer service team as soon as possible. Once an order has been processed for shipping, it cannot be modified or canceled.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  </Accordion>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Info Content */}
          <TabsContent value="shipping">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Shipping Information</CardTitle>
                <CardDescription>Learn about our shipping policies and delivery times.</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerAnimation}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">Delivery Times</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border bg-card/80">
                        <h4 className="font-medium mb-2">Domestic (India)</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Standard Shipping</span>
                            <span className="text-muted-foreground">3-5 business days</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Express Shipping</span>
                            <span className="text-muted-foreground">1-2 business days</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Same Day Delivery</span>
                            <span className="text-muted-foreground">Available in select cities</span>
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 rounded-lg border bg-card/80">
                        <h4 className="font-medium mb-2">International</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Standard Shipping</span>
                            <span className="text-muted-foreground">7-14 business days</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Express Shipping</span>
                            <span className="text-muted-foreground">3-5 business days</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">Shipping Costs</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50 text-left">
                            <th className="p-3 border">Order Value</th>
                            <th className="p-3 border">Standard Shipping</th>
                            <th className="p-3 border">Express Shipping</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-3 border">Under ₹500</td>
                            <td className="p-3 border">₹99</td>
                            <td className="p-3 border">₹199</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">₹500 - ₹999</td>
                            <td className="p-3 border">₹49</td>
                            <td className="p-3 border">₹149</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">₹1000 and above</td>
                            <td className="p-3 border">FREE</td>
                            <td className="p-3 border">₹99</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      International shipping rates vary by destination and will be calculated at checkout.
                    </p>
                  </motion.div>

                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">Shipping Policies</h3>
                    <div className="space-y-4 text-sm">
                      <div className="p-4 rounded-lg border bg-card/80">
                        <h4 className="font-medium mb-2">Order Processing</h4>
                        <p>Orders are processed within 24 hours of being placed (excluding weekends and holidays).</p>
                      </div>
                      <div className="p-4 rounded-lg border bg-card/80">
                        <h4 className="font-medium mb-2">Tracking Your Order</h4>
                        <p>You will receive a tracking number via email once your order ships. You can also track your order in your account or using our Track Order tool.</p>
                      </div>
                      <div className="p-4 rounded-lg border bg-card/80">
                        <h4 className="font-medium mb-2">International Customs and Duties</h4>
                        <p>International customers may be subject to import duties and taxes, which are the responsibility of the recipient. These charges are not included in the order total.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Returns & Exchanges Content */}
          <TabsContent value="returns">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Returns & Exchanges</CardTitle>
                <CardDescription>Our policies to ensure your satisfaction with every purchase.</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerAnimation}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">Return Policy</h3>
                    <div className="p-4 rounded-lg border bg-card/80 space-y-4">
                      <p>We want you to be completely satisfied with your purchase. If you're not, we offer a hassle-free return policy:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Items can be returned within 30 days of delivery</li>
                        <li>Products must be unworn, unwashed, and in original packaging</li>
                        <li>Tags must still be attached</li>
                        <li>Sale items are final sale and cannot be returned (exchanges may be possible)</li>
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">Exchange Process</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg border bg-card/80 text-center flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <span className="font-semibold">1</span>
                          </div>
                          <h4 className="font-medium mb-2">Initiate Exchange</h4>
                          <p className="text-sm text-muted-foreground">Log into your account and select "Exchange Items" from your order history.</p>
                        </div>
                        <div className="p-4 rounded-lg border bg-card/80 text-center flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <span className="font-semibold">2</span>
                          </div>
                          <h4 className="font-medium mb-2">Return Original Item</h4>
                          <p className="text-sm text-muted-foreground">Use our prepaid shipping label to return your original purchase.</p>
                        </div>
                        <div className="p-4 rounded-lg border bg-card/80 text-center flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <span className="font-semibold">3</span>
                          </div>
                          <h4 className="font-medium mb-2">Receive New Item</h4>
                          <p className="text-sm text-muted-foreground">We'll send your new item as soon as we receive the original.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">Refund Process</h3>
                    <div className="p-4 rounded-lg border bg-card/80 space-y-4">
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Refunds are processed within 5-7 business days after we receive your return</li>
                        <li>The refund will be issued to the original payment method</li>
                        <li>Shipping costs are non-refundable unless the return is due to our error</li>
                        <li>For items purchased using COD, refunds will be processed through bank transfer</li>
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Us</h3>
                    <div className="p-4 rounded-lg border bg-card/80">
                      <p>If you have any questions about returns or exchanges, please contact our customer service team:</p>
                      <p className="mt-2">
                        <a href="mailto:returns@brewery.com" className="text-primary hover:underline">
                          returns@brewery.com
                        </a> or call <a href="tel:+919876543210" className="text-primary hover:underline">+91 98765 43210</a>
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Size Guide Content */}
          <TabsContent value="size-guide">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Size Guide</CardTitle>
                <CardDescription>Find your perfect fit with our comprehensive size charts.</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerAnimation}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">How to Measure</h3>
                    <div className="p-4 rounded-lg border bg-card/80 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Chest / Bust</h4>
                          <p className="text-sm text-muted-foreground">Measure around the fullest part of your chest, keeping the tape measure horizontal.</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Waist</h4>
                          <p className="text-sm text-muted-foreground">Measure around your natural waistline, keeping the tape measure horizontal.</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Hips</h4>
                          <p className="text-sm text-muted-foreground">Measure around the fullest part of your hips, keeping the tape measure horizontal.</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Inseam</h4>
                          <p className="text-sm text-muted-foreground">Measure from the crotch to the bottom of the ankle along the inside of the leg.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">T-Shirts and Tops (in cm)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50 text-left">
                            <th className="p-3 border">Size</th>
                            <th className="p-3 border">Chest</th>
                            <th className="p-3 border">Length</th>
                            <th className="p-3 border">Sleeve</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-3 border">XS</td>
                            <td className="p-3 border">86-91</td>
                            <td className="p-3 border">66</td>
                            <td className="p-3 border">20</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">S</td>
                            <td className="p-3 border">91-96</td>
                            <td className="p-3 border">68</td>
                            <td className="p-3 border">21</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">M</td>
                            <td className="p-3 border">96-101</td>
                            <td className="p-3 border">70</td>
                            <td className="p-3 border">22</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">L</td>
                            <td className="p-3 border">101-106</td>
                            <td className="p-3 border">72</td>
                            <td className="p-3 border">23</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">XL</td>
                            <td className="p-3 border">106-111</td>
                            <td className="p-3 border">74</td>
                            <td className="p-3 border">24</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">XXL</td>
                            <td className="p-3 border">111-116</td>
                            <td className="p-3 border">76</td>
                            <td className="p-3 border">25</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">Bottoms (in cm)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50 text-left">
                            <th className="p-3 border">Size</th>
                            <th className="p-3 border">Waist</th>
                            <th className="p-3 border">Hips</th>
                            <th className="p-3 border">Inseam</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-3 border">XS</td>
                            <td className="p-3 border">68-73</td>
                            <td className="p-3 border">88-93</td>
                            <td className="p-3 border">76</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">S</td>
                            <td className="p-3 border">73-78</td>
                            <td className="p-3 border">93-98</td>
                            <td className="p-3 border">78</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">M</td>
                            <td className="p-3 border">78-83</td>
                            <td className="p-3 border">98-103</td>
                            <td className="p-3 border">80</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">L</td>
                            <td className="p-3 border">83-88</td>
                            <td className="p-3 border">103-108</td>
                            <td className="p-3 border">82</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">XL</td>
                            <td className="p-3 border">88-93</td>
                            <td className="p-3 border">108-113</td>
                            <td className="p-3 border">84</td>
                          </tr>
                          <tr>
                            <td className="p-3 border">XXL</td>
                            <td className="p-3 border">93-98</td>
                            <td className="p-3 border">113-118</td>
                            <td className="p-3 border">86</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">Size Tips</h3>
                    <div className="p-4 rounded-lg border bg-card/80 space-y-4">
                      <ul className="list-disc pl-5 space-y-2">
                        <li>If you're between sizes, we recommend sizing up for a more comfortable fit.</li>
                        <li>Our garments may shrink slightly after washing, so please consider this when selecting your size.</li>
                        <li>Different styles may fit differently, so please refer to the specific size information on each product page.</li>
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Track Order Content */}
          <TabsContent value="track-order">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Track Your Order</CardTitle>
                <CardDescription>Enter your order number to track your shipment.</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={containerAnimation}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  <motion.div variants={itemAnimation} className="max-w-md mx-auto p-6 border rounded-lg bg-card/80">
                    <form onSubmit={handleTrackOrder} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="tracking-number" className="text-sm font-medium">
                          Order/Tracking Number
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="tracking-number"
                            placeholder="e.g., ORD1234567890"
                            className="pl-10"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 transition-colors"
                      >
                        Track Order
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                    
                    <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                      <p>
                        Don't have your order number? Please check your order confirmation email or contact our customer service team.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnimation} className="space-y-4">
                    <h3 className="text-lg font-semibold">Tracking FAQs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border bg-card/80">
                        <h4 className="font-medium mb-2">When will I receive tracking information?</h4>
                        <p className="text-sm text-muted-foreground">You will receive tracking information via email once your order has been shipped, typically within 24-48 hours after placing your order.</p>
                      </div>
                      <div className="p-4 rounded-lg border bg-card/80">
                        <h4 className="font-medium mb-2">My tracking doesn't show any updates</h4>
                        <p className="text-sm text-muted-foreground">It may take 24-48 hours after shipping for tracking information to become active. If you continue to see no updates after this time, please contact us.</p>
                      </div>
                      <div className="p-4 rounded-lg border bg-card/80">
                        <h4 className="font-medium mb-2">I didn't receive a tracking number</h4>
                        <p className="text-sm text-muted-foreground">Please check your spam or junk folder. If you still can't find it, you can view your tracking information in your account or contact our support team.</p>
                      </div>
                      <div className="p-4 rounded-lg border bg-card/80">
                        <h4 className="font-medium mb-2">My package shows delivered but I don't have it</h4>
                        <p className="text-sm text-muted-foreground">Please check with neighbors and around your delivery location. If you still can't locate it, contact our support team within 48 hours.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Support;
