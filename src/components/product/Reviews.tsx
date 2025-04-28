
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/integrations/firebase/client";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"; 
import ReviewForm from "./ReviewForm";
import RatingSummary from "./RatingSummary";
import ReviewsList from "./ReviewsList";
import { auth } from "@/integrations/firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";

interface ReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  content: string;
  helpful: number;
}

export default function Reviews({ productId, rating, reviewCount }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [helpfulMarked, setHelpfulMarked] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("reviews");
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  
  // Fetch reviews from Firebase
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, "reviews");
        const q = query(reviewsRef, where("productId", "==", productId));
        const querySnapshot = await getDocs(q);
        
        const fetchedReviews: Review[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedReviews.push({
            id: doc.id,
            author: data.author || "Anonymous",
            date: data.createdAt ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString(),
            rating: data.rating || 0,
            content: data.content || "",
            helpful: data.helpful || 0,
          });
        });
        
        setReviews(fetchedReviews);
        console.log("Fetched reviews:", fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    
    fetchReviews();
  }, [productId]);
  
  // Update filtered reviews when reviews change or filter changes
  useEffect(() => {
    if (activeFilter === null) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(review => review.rating === activeFilter));
    }
  }, [reviews, activeFilter]);
  
  // Check if the user has purchased this product and if their order is delivered
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!user) {
        setCanReview(false);
        return;
      }
      
      try {
        // Check if user has ordered this product
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        let hasPurchased = false;
        
        if (!querySnapshot.empty) {
          for (const doc of querySnapshot.docs) {
            const orderData = doc.data();
            
            if (orderData.status === "Delivered") {
              // Check if this product is in the order items
              const orderItemsRef = collection(db, "order_items");
              const itemsQuery = query(orderItemsRef, 
                where("orderId", "==", doc.id),
                where("productId", "==", productId)
              );
              
              const itemsSnapshot = await getDocs(itemsQuery);
              
              if (!itemsSnapshot.empty) {
                hasPurchased = true;
                break;
              }
            }
          }
        }
        
        setCanReview(hasPurchased);
        
        // Check if user has already reviewed this product
        if (user) {
          const reviewsRef = collection(db, "reviews");
          const reviewQuery = query(
            reviewsRef,
            where("userId", "==", user.uid),
            where("productId", "==", productId)
          );
          
          const reviewSnapshot = await getDocs(reviewQuery);
          setHasReviewed(!reviewSnapshot.empty);
        }
        
      } catch (error) {
        console.error('Error checking purchase status:', error);
      }
    };
    
    checkPurchaseStatus();
  }, [productId, user]);
  
  const handleNewReview = () => {
    // Refresh the reviews list
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, "reviews");
        const q = query(reviewsRef, where("productId", "==", productId));
        const querySnapshot = await getDocs(q);
        
        const fetchedReviews: Review[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedReviews.push({
            id: doc.id,
            author: data.author || "Anonymous",
            date: data.createdAt ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString(),
            rating: data.rating || 0,
            content: data.content || "",
            helpful: data.helpful || 0,
          });
        });
        
        setReviews(fetchedReviews);
        setHasReviewed(true);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    
    fetchReviews();
    setActiveTab("reviews");
    
    toast({
      title: "Review Submitted",
      description: "Thank you for sharing your feedback!",
    });
  };
  
  const markHelpful = async (reviewId: string) => {
    if (helpfulMarked[reviewId]) return;
    
    try {
      // Update the review in Firebase
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("id", "==", reviewId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const reviewDoc = querySnapshot.docs[0];
        const reviewData = reviewDoc.data();
        
        // Update the review locally
        setReviews(reviews.map(review => 
          review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review
        ));
        
        setHelpfulMarked({
          ...helpfulMarked,
          [reviewId]: true,
        });
      }
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    }
  };
  
  // Calculate rating distribution
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating as keyof typeof ratingCounts]++;
    }
  });

  const handleFilterByRating = (rating: number | null) => {
    setActiveFilter(rating === activeFilter ? null : rating);
  };
  
  return (
    <div className="mt-16 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          {canReview && !hasReviewed && (
            <TabsTrigger value="write-review">Write a Review</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="reviews">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Rating Summary */}
            <RatingSummary 
              rating={reviews.length > 0 
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
                : rating}
              reviewCount={reviews.length}
              ratingCounts={ratingCounts}
              canReview={canReview && !hasReviewed}
              onWriteReviewClick={() => setActiveTab("write-review")}
            />
            
            {/* Review Filters */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant={activeFilter === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleFilterByRating(null)}
                >
                  All Reviews
                </Button>
                {[5, 4, 3, 2, 1].map((star) => (
                  <Button
                    key={star}
                    variant={activeFilter === star ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterByRating(star)}
                    className="flex items-center gap-1"
                  >
                    {star} Star{star !== 1 ? 's' : ''} ({ratingCounts[star as keyof typeof ratingCounts]})
                  </Button>
                ))}
              </div>
              
              {/* Review List */}
              <ReviewsList
                reviews={filteredReviews}
                helpfulMarked={helpfulMarked}
                onMarkHelpful={markHelpful}
                canReview={canReview && !hasReviewed}
                onWriteReviewClick={() => setActiveTab("write-review")}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="write-review">
          <div className="max-w-xl mx-auto">
            <h3 className="text-lg font-medium mb-4">Share Your Experience</h3>
            <ReviewForm productId={productId} onReviewSubmitted={handleNewReview} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
