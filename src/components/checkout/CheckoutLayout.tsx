
import React, { ReactNode } from "react";
import CheckoutProgress from "./CheckoutProgress";
import { Card } from "@/components/ui/card";

interface CheckoutLayoutProps {
  children: ReactNode;
  currentStep: 'cart' | 'address' | 'payment' | 'confirmation';
  title: string;
  description?: string;
}

export default function CheckoutLayout({ 
  children, 
  currentStep, 
  title, 
  description 
}: CheckoutLayoutProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Checkout
      </h1>
      
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      
      <CheckoutProgress currentStep={currentStep} />
      
      <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border border-border/50">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          {children}
        </div>
      </Card>
    </div>
  );
}
