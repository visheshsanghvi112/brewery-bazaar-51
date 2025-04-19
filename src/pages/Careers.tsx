
import React from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, Clock, Briefcase } from "lucide-react";

const Careers = () => {
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

  // Career positions
  const positions = [
    {
      id: 1,
      title: "Senior Fashion Designer",
      department: "Design",
      type: "Full-time",
      location: "Mumbai",
      description: "We're looking for an experienced fashion designer to join our creative team and help develop new seasonal collections.",
      requirements: [
        "5+ years experience in fashion design",
        "Strong portfolio demonstrating expertise in streetwear",
        "Proficiency in Adobe Creative Suite",
        "Bachelor's degree in Fashion Design or related field"
      ]
    },
    {
      id: 2,
      title: "E-commerce Manager",
      department: "Digital",
      type: "Full-time",
      location: "Remote",
      description: "Manage our online store operations, optimize customer experience, and drive digital sales growth.",
      requirements: [
        "3+ years experience in e-commerce management",
        "Strong understanding of digital marketing",
        "Experience with Shopify or similar platforms",
        "Excellent analytical skills"
      ]
    },
    {
      id: 3,
      title: "Retail Store Associate",
      department: "Retail",
      type: "Part-time",
      location: "Mumbai",
      description: "Join our flagship store team to provide exceptional customer service and drive in-store sales.",
      requirements: [
        "1+ years retail experience",
        "Passion for fashion and customer service",
        "Flexible availability including weekends",
        "Strong communication skills"
      ]
    },
    {
      id: 4,
      title: "Social Media Coordinator",
      department: "Marketing",
      type: "Full-time",
      location: "Mumbai",
      description: "Create engaging content for our social media channels and help grow our online community.",
      requirements: [
        "2+ years experience in social media management",
        "Portfolio of successful social campaigns",
        "Knowledge of fashion trends and aesthetics",
        "Experience with content planning tools"
      ]
    }
  ];

  // Company values and benefits
  const values = [
    {
      title: "Innovation",
      description: "We challenge convention and embrace new ideas."
    },
    {
      title: "Quality",
      description: "We're committed to excellence in everything we create."
    },
    {
      title: "Sustainability",
      description: "We're working to reduce our environmental impact."
    },
    {
      title: "Community",
      description: "We foster an inclusive workplace where everyone belongs."
    }
  ];

  const benefits = [
    "Competitive salary and bonuses",
    "Flexible working hours",
    "Employee discount on all products",
    "Health insurance and wellness program",
    "Professional development opportunities",
    "Team retreats and events"
  ];

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
              Join Our Team
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Be part of a creative collective shaping the future of fashion in India.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
      </section>

      {/* Careers Content */}
      <section className="py-16 container mx-auto px-4">
        {/* Company Culture */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Life at Brewery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <p className="text-lg">
                At Brewery, we're more than just a clothing brand – we're a community of passionate creatives dedicated to redefining streetwear culture in India.
              </p>
              <p>
                Our team is diverse, dynamic, and driven by a shared commitment to quality, creativity, and sustainability. We work in a collaborative environment where every voice is heard and every idea is valued.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {values.map((value, index) => (
                  <div key={index} className="p-4 bg-card/50 rounded-lg border border-border/50">
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/fa6791b1-8add-4bf8-aae4-54011cc38849.png" 
                alt="Brewery Team Culture" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start p-4 bg-card/30 border border-border/50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Open Positions */}
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {positions.map((position) => (
              <motion.div key={position.id} variants={itemAnimation}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{position.title}</CardTitle>
                        <CardDescription>{position.department}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="font-normal">
                          {position.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-4 gap-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {position.location}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {position.department}
                      </div>
                    </div>
                    
                    <p className="mb-4">{position.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {position.requirements.map((req, index) => (
                          <li key={index} className="text-sm">{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full sm:w-auto">Apply Now</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Application Process */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Our Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-card/30 border border-border/50 rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-2">Application</h3>
              <p className="text-sm text-muted-foreground">Submit your application and portfolio</p>
            </div>
            <div className="p-4 bg-card/30 border border-border/50 rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="font-semibold">2</span>
              </div>
              <h3 className="font-medium mb-2">Interview</h3>
              <p className="text-sm text-muted-foreground">Initial interview with our hiring team</p>
            </div>
            <div className="p-4 bg-card/30 border border-border/50 rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-2">Assessment</h3>
              <p className="text-sm text-muted-foreground">Skills assessment or task relevant to the role</p>
            </div>
            <div className="p-4 bg-card/30 border border-border/50 rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="font-semibold">4</span>
              </div>
              <h3 className="font-medium mb-2">Offer</h3>
              <p className="text-sm text-muted-foreground">Final interview and potential job offer</p>
            </div>
          </div>
        </div>
        
        {/* Contact CTA */}
        <div className="mt-16 p-8 border border-border rounded-xl bg-card/30 text-center">
          <h2 className="text-2xl font-bold mb-3">Don't see a position for you?</h2>
          <p className="mb-6 max-w-lg mx-auto">
            We're always looking for talented people to join our team. Send us your resume and we'll keep it on file for future opportunities.
          </p>
          <Button>Contact Us</Button>
        </div>
      </section>
    </div>
  );
};

export default Careers;
