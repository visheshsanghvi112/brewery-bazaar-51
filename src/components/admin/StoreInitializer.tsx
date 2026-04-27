
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDocs, deleteDoc } from "firebase/firestore";
import { Database, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { seedProductsToFirestore } from "@/lib/firebase/products";

export default function StoreInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();

  const seedStore = async (force: boolean = false) => {
    if (force && !confirm("DANGER: This will wipe and re-seed EVERYTHING! Proceed?")) return;
    
    setIsInitializing(true);
    try {
      if (force) {
        console.log("Wiping products before full re-seed...");
        const querySnapshot = await getDocs(collection(db, "products"));
        for (const productDoc of querySnapshot.docs) {
          await deleteDoc(doc(db, "products", productDoc.id));
        }
      }

      console.log("Calling master seedProductsToFirestore from the data catalog...");
      await seedProductsToFirestore();
      
      // 2. Initialize Sequences
      console.log("Initializing order sequences to 100 on Mumbai instance...");
      await setDoc(doc(db, "sequences", "order_sequence"), { value: 100 }, { merge: true });
      
      // 3. Create a Robust Sample Coupon set
      const coupons = [
        {
          code: "BREW25",
          type: "percentage",
          value: 25,
          minPurchase: 100000, // INR 1000.00
          isActive: true,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          usageLimit: 100,
          usageCount: 0,
          createdAt: serverTimestamp()
        },
        {
          code: "WELCOME500",
          type: "fixed",
          value: 50000, // INR 500.00
          minPurchase: 200000, // INR 2000.00
          isActive: true,
          validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          usageLimit: 50,
          usageCount: 0,
          createdAt: serverTimestamp()
        }
      ];

      for (const coupon of coupons) {
        // Use setDoc with the code as ID to prevent duplicates if force=false
        await setDoc(doc(db, "coupons", coupon.code.toLowerCase()), coupon, { merge: true });
      }

      toast({
        title: force ? "Full Re-Seed Complete" : "Store Initialized",
        description: force 
          ? "Mumbai instance wiped and re-populated with master catalog." 
          : "Successfully added missing products, categories, and sequences to Mumbai project!",
      });
    } catch (error: any) {
      console.error("Seeder failure:", error);
      toast({
        title: "Initialization Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const clearProducts = async () => {
    if (!confirm("Are you sure? This will delete ALL products from Firestore!")) return;
    setIsInitializing(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      console.log(`Deleting ${querySnapshot.size} products...`);
      for (const productDoc of querySnapshot.docs) {
        await deleteDoc(doc(db, "products", productDoc.id));
      }
      toast({ title: "Database Wiped", description: "All products have been removed from Mumbai instance." });
    } catch (error: any) {
      toast({ title: "Wipe Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-primary/5 shadow-inner">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Database className="h-5 w-5" />
          Mumbai Instance Initializer
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Connected Snapshot: <code className="bg-primary/10 px-1 rounded">{import.meta.env.VITE_FIREBASE_PROJECT_ID}</code>. 
          Use these one-click tools to sync the master product list and operational sequences.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button 
          onClick={() => seedStore(false)} 
          disabled={isInitializing}
          className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
        >
          {isInitializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Sync Master Catalog
            </>
          )}
        </Button>

        <Button 
          variant="outline"
          onClick={() => seedStore(true)} 
          disabled={isInitializing}
          className="flex-1 sm:flex-none border-primary/30 text-primary hover:bg-primary/5"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Force Full Re-Seed
        </Button>

        <Button 
          variant="ghost"
          onClick={clearProducts} 
          disabled={isInitializing}
          className="flex-1 sm:flex-none text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          Wipe Data
        </Button>
      </CardContent>
    </Card>
  );
}
