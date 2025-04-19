
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Check, Link as LinkIcon } from "lucide-react";

const CheckoutIntegration = () => {
  const { toast } = useToast();
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);
  const [paymentGatewayUrl, setPaymentGatewayUrl] = useState('https://rzp.io/rzp/I3iwiEk');
  const [isEditing, setIsEditing] = useState(false);
  
  const savePaymentGateway = () => {
    toast({
      title: "Payment Gateway Updated",
      description: "Your payment gateway settings have been saved",
    });
    setIsEditing(false);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentGatewayUrl);
    toast({
      title: "URL Copied",
      description: "Payment gateway URL copied to clipboard",
    });
  };
  
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <CreditCard className="h-5 w-5 mr-2 text-primary" />
          Payment Gateway Integration
        </CardTitle>
        <CardDescription>
          Configure your checkout payment gateway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="razorpay-toggle">Razorpay Integration</Label>
            <p className="text-sm text-muted-foreground">
              Enable Razorpay for processing payments
            </p>
          </div>
          <Switch 
            id="razorpay-toggle" 
            checked={razorpayEnabled} 
            onCheckedChange={setRazorpayEnabled}
          />
        </div>
        
        {razorpayEnabled && (
          <div className="space-y-4 pt-2 border-t">
            <div className="space-y-2">
              <Label>Payment Gateway URL</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input 
                    value={paymentGatewayUrl}
                    onChange={(e) => setPaymentGatewayUrl(e.target.value)}
                    placeholder="https://example.com/pay" 
                    disabled={!isEditing}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={copyToClipboard}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
                {isEditing ? (
                  <Button onClick={savePaymentGateway}>
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This URL will be used to redirect users during checkout
              </p>
            </div>
            
            <div className="p-4 bg-green-500/10 border border-green-200 dark:border-green-900 rounded-md">
              <h4 className="text-sm font-medium flex items-center text-green-700 dark:text-green-400">
                <Check className="h-4 w-4 mr-2" />
                Checkout Integration Active
              </h4>
              <p className="text-xs text-green-700/80 dark:text-green-400/80 mt-1">
                When customers click "Proceed to Checkout", they'll be redirected to the Razorpay payment gateway
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckoutIntegration;
