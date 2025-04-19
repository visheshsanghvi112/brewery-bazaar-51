
import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Terms = () => {
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
              Terms & Conditions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Please read these terms carefully before using our services.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
      </section>

      {/* Terms & Conditions Content */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="visible"
            className="prose prose-sm max-w-none dark:prose-invert"
          >
            <motion.div variants={itemAnimation}>
              <div className="mb-12">
                <p className="text-muted-foreground mb-6">
                  Last updated: April 5, 2025
                </p>
                
                <p className="mb-6">
                  Welcome to Brewery. These Terms and Conditions ("Terms") govern your use of the Brewery website, mobile applications, and services (collectively, the "Services"), so please read them carefully.
                </p>
                
                <p className="mb-6">
                  By accessing or using our Services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use our Services.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">1. Acceptance of Terms</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      By accessing and using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you are using the Services on behalf of an organization, you are agreeing to these Terms for that organization and promising that you have the authority to bind that organization to these Terms.
                    </p>
                    <p>
                      We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page. You are advised to review these Terms periodically for any changes.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">2. Account Registration</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      To access certain features of our Services, you may need to create an account. When you create an account, you must provide accurate and complete information. You are solely responsible for the activity that occurs on your account, and you must keep your account password secure.
                    </p>
                    <p className="mb-4">
                      You must notify us immediately of any breach of security or unauthorized use of your account. We will not be liable for any losses caused by any unauthorized use of your account.
                    </p>
                    <p>
                      We reserve the right to suspend or terminate your account at any time and for any reason, without notice.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">3. Purchase and Payment</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      All purchases made through our Services are subject to these Terms and our order acceptance policies.
                    </p>
                    <p className="mb-4">
                      Prices for our products are subject to change without notice. We reserve the right to modify or discontinue any product without notice at any time.
                    </p>
                    <p className="mb-4">
                      Payment for all orders must be made at the time of purchase. We accept various payment methods as indicated on our website.
                    </p>
                    <p>
                      All prices listed on our website are in Indian Rupees (INR) unless otherwise specified. Prices are inclusive of GST but exclusive of shipping charges, which will be calculated and displayed during checkout.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">4. Shipping and Delivery</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      We will make every effort to deliver your order within the estimated delivery time indicated at checkout. However, delivery times are not guaranteed and may vary due to factors beyond our control.
                    </p>
                    <p className="mb-4">
                      We ship to addresses within India and to select international destinations. Additional shipping charges and customs duties may apply for international shipments.
                    </p>
                    <p>
                      Risk of loss and title for all products purchased from our website pass to you upon delivery of the product to the carrier.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">5. Returns and Refunds</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      Products may be returned within 7 days of delivery. To be eligible for a return, the item must be unused, unworn, unwashed, and in the original packaging with all tags attached.
                    </p>
                    <p className="mb-4">
                      Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed and credited to your original method of payment within 5-7 business days.
                    </p>
                    <p>
                      Sale items and items marked as "Final Sale" are not eligible for return or refund.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-medium">6. Intellectual Property</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      All content on our Services, including text, graphics, logos, images, and software, is the property of Brewery or its content suppliers and is protected by intellectual property laws.
                    </p>
                    <p className="mb-4">
                      You may not use, reproduce, distribute, modify, or create derivative works from any content on our Services without our express written permission.
                    </p>
                    <p>
                      The Brewery name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Brewery or its affiliates. You may not use such marks without our prior written permission.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-lg font-medium">7. User Content</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      Our Services may allow you to post, submit, or transmit content, such as reviews, comments, or photos ("User Content").
                    </p>
                    <p className="mb-4">
                      By posting User Content on or through our Services, you grant us a non-exclusive, royalty-free, worldwide, transferable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such User Content in any media.
                    </p>
                    <p>
                      You represent and warrant that you own or control all rights in and to the User Content you post and that such User Content does not violate these Terms or any applicable law.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-lg font-medium">8. Limitation of Liability</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      In no event shall Brewery, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any:
                    </p>
                    <ul className="list-disc pl-5 mb-4">
                      <li>Errors, mistakes, or inaccuracies of content</li>
                      <li>Personal injury or property damage of any nature whatsoever</li>
                      <li>Unauthorized access to or use of our servers and/or any personal information stored therein</li>
                      <li>Interruption or cessation of transmission to or from our Services</li>
                      <li>Bugs, viruses, trojan horses, or the like which may be transmitted to or through our Services</li>
                    </ul>
                    <p>
                      The limitation of liability shall apply to the fullest extent permitted by law in the applicable jurisdiction.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger className="text-lg font-medium">9. Governing Law</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
                    </p>
                    <p>
                      Any dispute arising under or relating to these Terms shall be resolved exclusively in the courts located in Mumbai, India.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger className="text-lg font-medium">10. Contact Information</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      If you have any questions or concerns about these Terms, please contact us at:
                    </p>
                    <address className="mt-2">
                      <p>Brewery Lifestyle Pvt. Ltd.</p>
                      <p>42 Fashion Street, Mumbai - 400001</p>
                      <p>Email: legal@brewery.com</p>
                      <p>Phone: +91 98765 43210</p>
                    </address>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
