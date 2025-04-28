
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, AlertTriangle, CheckCircle2 } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Contact() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setFormSuccess(false);
    
    try {
      // Validate all fields
      if (!name.trim()) {
        throw new Error("Please enter your name");
      }
      if (!email.trim()) {
        throw new Error("Please enter your email");
      }
      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address");
      }
      if (!subject.trim()) {
        throw new Error("Please enter a subject");
      }
      if (!message.trim() || message.length < 10) {
        throw new Error("Please enter a message (minimum 10 characters)");
      }
      
      // Create the data object
      const contactData = {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
      };
      
      // Submit to Firestore
      const docRef = await addDoc(collection(db, "contact_submissions"), contactData);
      
      console.log("Document written with ID:", docRef.id);
      
      // Show success message
      setFormSuccess(true);
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setFormSuccess(false);
      
      // Handle validation errors
      if ((error as Error).message) {
        setFormError((error as Error).message);
        toast({
          title: "Validation Error",
          description: (error as Error).message,
          variant: "destructive",
        });
      } else {
        setFormError("There was an error sending your message. Please try again.");
        toast({
          title: "Error",
          description: "There was an error sending your message. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-0">
              We're here to help with any questions about our products
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-secondary p-8 rounded-lg text-center">
              <Mail className="mx-auto h-8 w-8 mb-4" />
              <h3 className="text-lg font-medium mb-2">Email</h3>
              <a href="mailto:breweryfit@gmail.com" className="text-primary hover:underline">
                breweryfit@gmail.com
              </a>
            </div>
            <div className="bg-secondary p-8 rounded-lg text-center">
              <Phone className="mx-auto h-8 w-8 mb-4" />
              <h3 className="text-lg font-medium mb-2">Phone</h3>
              <a href="tel:+919876543210" className="text-primary hover:underline">
                +91 98765 43210
              </a>
            </div>
            <div className="bg-secondary p-8 rounded-lg text-center">
              <MapPin className="mx-auto h-8 w-8 mb-4" />
              <h3 className="text-lg font-medium mb-2">Address</h3>
              <p className="text-muted-foreground">
                42 Fashion Street, Mumbai, India - 400001
              </p>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.7329677001985!2d72.82755641475394!3d18.93004638717723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1e8f2abfb77%3A0x3f019cb35b4021cb!2sFashion%20Street%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1624956452347!5m2!1sen!2sin!4v1624956452347!5m2!1sen!2sin" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                className="rounded-lg"
                title="Google Maps - Fashion Street"
              ></iframe>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              {/* Success Message */}
              {formSuccess && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-600">
                    Your message has been sent successfully! We'll get back to you soon.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Error Message */}
              {formError && (
                <Alert className="mb-6 bg-destructive/15 border-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <AlertDescription className="text-destructive">
                    {formError}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    className={formError && !name.trim() ? "border-destructive" : ""}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com" 
                    className={formError && (!email.trim() || !validateEmail(email)) ? "border-destructive" : ""}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input 
                    id="subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Product inquiry" 
                    className={formError && !subject.trim() ? "border-destructive" : ""}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you? (minimum 10 characters)" 
                    rows={5} 
                    className={formError && (!message.trim() || message.length < 10) ? "border-destructive" : ""}
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading} 
                  className="w-full"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-background p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">What is your return policy?</h3>
              <p className="text-muted-foreground">
                We offer a 30-day return policy for all unworn items in original packaging.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">How long does shipping take?</h3>
              <p className="text-muted-foreground">
                Domestic orders typically arrive within 3-5 business days. International shipping can take 7-14 days.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Do you offer size exchanges?</h3>
              <p className="text-muted-foreground">
                Yes, we offer free size exchanges within 14 days of receiving your order.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">How can I track my order?</h3>
              <p className="text-muted-foreground">
                Once your order ships, you'll receive a tracking number via email that you can use to track your package.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
