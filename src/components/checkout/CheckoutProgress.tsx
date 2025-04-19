
import React from "react";
import { CheckCircle, Circle, ShoppingCart, MapPin, CreditCard, Package } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: 'cart' | 'address' | 'payment' | 'confirmation';
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmation', icon: Package },
  ];

  // Find the index of the current step
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="mb-8 pt-4">
      {/* Desktop view - full progress bar */}
      <div className="hidden md:block">
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            
            return (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Circle with icon */}
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : isCompleted 
                        ? "bg-primary/80 text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                  } transition-colors duration-300`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <StepIcon className="h-6 w-6" />
                  )}
                </div>
                
                {/* Label */}
                <span className={`mt-2 text-sm font-medium ${
                  isActive 
                    ? "text-primary"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
                
                {/* Connecting line - except for last item */}
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-full w-[calc(100%-3rem)] h-0.5 -ml-6">
                    <div className={`h-full ${isCompleted || (isActive && index > 0) ? "bg-primary/80" : "bg-muted"}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Mobile view - simplified progress indicator */}
      <div className="md:hidden flex items-center justify-center mb-6">
        <div className="flex space-x-3">
          {steps.map((step, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            
            return (
              <React.Fragment key={step.id}>
                <div 
                  className={`w-3 h-3 rounded-full ${
                    isActive 
                      ? "bg-primary" 
                      : isCompleted 
                        ? "bg-primary/80" 
                        : "bg-muted"
                  }`}
                />
                {index < steps.length - 1 && (
                  <div className="w-4 h-px mt-1.5 bg-muted" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      {/* Current step label for mobile */}
      <div className="md:hidden text-center mb-4">
        <span className="text-sm font-medium">
          Step {currentIndex + 1}: {steps[currentIndex].label}
        </span>
      </div>
    </div>
  );
}
