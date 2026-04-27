
import React, { useState } from 'react';
import { db } from '@/integrations/firebase/client';
import { collection, addDoc, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";

export default function FinalSeed() {
  const [status, setStatus] = useState<string>("Ready");
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSeed = async () => {
    setIsInitializing(true);
    setError(null);
    setStatus("🚀 Starting migration...");

    try {
      // 1. Products
      setStatus("📦 Seeding products...");
      const productsRef = collection(db, "products");
      const sampleProducts = [
        {
          name: "Signature Crew Neck",
          description: "Premium heavy-weight cotton t-shirt with our signature brewery logo. Features reinforced stitching and a modern athletic fit.",
          price: 129900,
          originalPrice: 159900,
          category: "t-shirts",
          images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
          rating: 4.8,
          reviewCount: 42,
          isNew: true,
          variants: [
            { id: "v1-m-blk", size: "M", color: "Black", stock: 25, price: 129900 },
            { id: "v1-l-blk", size: "L", color: "Black", stock: 15, price: 129900 }
          ],
          createdAt: serverTimestamp()
        },
        {
          name: "Artisan Brew Mug",
          description: "Hand-crafted ceramic mug with matte finish. Keeps your coffee hot.",
          price: 89900,
          category: "accessories",
          images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800"],
          variants: [
            { id: "mug-1", size: "Standard", color: "White", stock: 50, price: 89900 }
          ],
          createdAt: serverTimestamp()
        }
      ];

      for (const p of sampleProducts) {
        await addDoc(productsRef, p);
      }

      // 2. Sequences
      setStatus("🔢 Initializing sequences...");
      await setDoc(doc(db, "sequences", "order_sequence"), { value: 100 }, { merge: true });

      // 3. Coupons
      setStatus("🎟️ Creation coupons...");
      await addDoc(collection(db, "coupons"), {
        code: "BREW25",
        type: "percentage",
        value: 25,
        minPurchase: 100000,
        isActive: true,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usageCount: 0,
        createdAt: serverTimestamp()
      });

      setStatus("✅ SEEDED SUCCESSFULLY!");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setStatus("❌ FAILED");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="text-primary h-6 w-6" />
            Final Project Seeder
          </CardTitle>
          <p className="text-muted-foreground text-sm uppercase tracking-widest mt-2">{status}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertTriangle className="text-destructive h-5 w-5 shrink-0" />
              <p className="text-destructive text-xs break-all">{error}</p>
            </div>
          )}

          <div className="bg-primary/5 p-6 rounded-xl text-center space-y-4">
            <p className="text-sm">Click the button below to force-seed your new project direct from your browser.</p>
            <Button 
              size="lg" 
              onClick={performSeed} 
              disabled={isInitializing}
              className="w-full"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding Mumbai Instance...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Seed Project (brewery-8j28a)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
