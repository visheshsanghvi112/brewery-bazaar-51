
import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Privacy = () => {
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
              Privacy Policy
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Alert className="mb-8 bg-secondary/50">
            <Info className="h-5 w-5" />
            <AlertTitle>Last updated: April 5, 2025</AlertTitle>
            <AlertDescription>
              This Privacy Policy describes how Brewery collects and processes your personal information.
            </AlertDescription>
          </Alert>

          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="visible"
            className="prose prose-sm max-w-none"
          >
            <motion.div variants={itemAnimation}>
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="mb-6">
                Brewery ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or make purchases from us (collectively, the "Services").
              </p>
              <p className="mb-6">
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access or use our Services.
              </p>
            </motion.div>

            <Separator className="my-8" />

            <motion.div variants={itemAnimation}>
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">Personal Information</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      We may collect personal information that you voluntarily provide when you:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                      <li>Create an account</li>
                      <li>Place an order</li>
                      <li>Subscribe to our newsletter</li>
                      <li>Contact customer service</li>
                      <li>Participate in surveys or promotions</li>
                    </ul>
                    <p className="mb-4">
                      This personal information may include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Postal address</li>
                      <li>Payment information</li>
                      <li>Date of birth</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">Automatically Collected Information</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      When you access our Services, we may automatically collect certain information, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Device information (such as your device type, operating system, and browser type)</li>
                      <li>IP address</li>
                      <li>Browsing actions and patterns</li>
                      <li>Referring website</li>
                      <li>Time spent on pages</li>
                      <li>Clickstream data</li>
                      <li>Location data (if enabled)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">Cookies and Similar Technologies</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4">
                      We use cookies and similar tracking technologies to collect and use information about you. Cookies are small data files that are placed on your device when you visit a website, which enables us to: remember your preferences, understand how you use our Services, and personalize your experience.
                    </p>
                    <p>
                      You can set your browser to refuse all or some browser cookies or to alert you when websites set or access cookies. However, if you disable or refuse cookies, some parts of our Services may become inaccessible or not function properly.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            <Separator className="my-8" />

            <motion.div variants={itemAnimation}>
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">Provide and Manage Services</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Process and fulfill your orders</li>
                      <li>Create and manage your account</li>
                      <li>Provide customer support</li>
                      <li>Facilitate returns and exchanges</li>
                      <li>Send transactional emails and order updates</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">Marketing and Communications</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Send promotional emails about new products, sales, and offers</li>
                      <li>Deliver content and product information relevant to your interests</li>
                      <li>Administer contests, promotions, and surveys</li>
                      <li>Communicate about account or service-related matters</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-medium">Improve Our Services</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Analyze usage patterns and preferences</li>
                      <li>Develop new products and services</li>
                      <li>Enhance website functionality and user experience</li>
                      <li>Diagnose technical problems</li>
                      <li>Maintain security and prevent fraud</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-lg font-medium">Legal Compliance</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Comply with legal obligations</li>
                      <li>Enforce our terms and conditions</li>
                      <li>Protect our rights, privacy, safety, or property</li>
                      <li>Respond to legal requests and prevent harm</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>

            <Separator className="my-8" />

            <motion.div variants={itemAnimation}>
              <h2 className="text-2xl font-bold mb-4">Sharing Your Information</h2>
              
              <p className="mb-6">
                We may share your personal information with the following categories of recipients:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Service Providers</h3>
                  <p className="text-sm">
                    Third parties that perform services on our behalf, such as payment processing, shipping, customer service, and marketing assistance.
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Business Partners</h3>
                  <p className="text-sm">
                    Companies with whom we partner to offer products, services, or promotions to our customers.
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Legal Requirements</h3>
                  <p className="text-sm">
                    When we believe disclosure is necessary to comply with a legal obligation, protect our rights, prevent fraud, or ensure safety.
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Business Transfers</h3>
                  <p className="text-sm">
                    In connection with a corporate transaction, such as a sale, merger, or acquisition.
                  </p>
                </div>
              </div>
            </motion.div>

            <Separator className="my-8" />

            <motion.div variants={itemAnimation}>
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              
              <p className="mb-6">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, theft, and loss. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>
            </motion.div>

            <Separator className="my-8" />

            <motion.div variants={itemAnimation}>
              <h2 className="text-2xl font-bold mb-4">Your Privacy Rights</h2>
              
              <p className="mb-6">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Access</h3>
                  <p className="text-sm">
                    Request access to the personal information we hold about you.
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Correction</h3>
                  <p className="text-sm">
                    Request correction of inaccurate or incomplete information.
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Deletion</h3>
                  <p className="text-sm">
                    Request deletion of your personal information in certain circumstances.
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Restriction</h3>
                  <p className="text-sm">
                    Request restriction of processing of your personal information.
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Data Portability</h3>
                  <p className="text-sm">
                    Request transfer of your personal information to another organization.
                  </p>
                </div>
                
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Opt-Out</h3>
                  <p className="text-sm">
                    Opt-out of certain processing activities, such as marketing.
                  </p>
                </div>
              </div>
              
              <p className="mt-6">
                To exercise any of these rights, please contact us at privacy@brewery.com.
              </p>
            </motion.div>

            <Separator className="my-8" />

            <motion.div variants={itemAnimation}>
              <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
              
              <p className="mb-6">
                Your personal information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws than your country.
              </p>
              
              <p>
                When we transfer your personal information to other countries, we will ensure that appropriate safeguards are in place to protect your information and comply with our legal obligations.
              </p>
            </motion.div>

            <Separator className="my-8" />

            <motion.div variants={itemAnimation}>
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              
              <p>
                Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </motion.div>

            <Separator className="my-8" />

            <motion.div variants={itemAnimation}>
              <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
              
              <p>
                We may update our Privacy Policy from time to time. The updated version will be effective as of the date stated at the top of the policy. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
              </p>
            </motion.div>

            <Separator className="my-8" />

            <motion.div variants={itemAnimation}>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              
              <p className="mb-4">
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              
              <address>
                <p>Brewery Lifestyle Pvt. Ltd.</p>
                <p>42 Fashion Street, Mumbai - 400001</p>
                <p>Email: privacy@brewery.com</p>
                <p>Phone: +91 98765 43210</p>
              </address>
              
              <div className="mt-6">
                <p>
                  If you have unresolved concerns, you may have the right to complain to your local data protection authority.
                </p>
              </div>
            </motion.div>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                By using our Services, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              <Link to="/terms" className="text-sm text-primary hover:underline mt-2 block">
                View our Terms & Conditions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
