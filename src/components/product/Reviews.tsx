
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"; 
import ReviewForm from "./ReviewForm";
import RatingSummary from "./RatingSummary";
import ReviewsList from "./ReviewsList";

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
  // Mock reviews data - in a real app, this would be fetched from an API
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      author: "Raj Patel",
      date: "2023-05-15",
      rating: 5,
      content: "This is exactly what I was looking for! The fit is perfect and the material is super comfortable. Wore it all day without any issues. Would definitely recommend!",
      helpful: 12,
    },
    {
      id: "2",
      author: "Priya Sharma",
      date: "2023-04-28",
      rating: 4,
      content: "Great t-shirt overall. The design is awesome and exactly as pictured. Took one star off because it runs slightly small - I'd recommend sizing up.",
      helpful: 8,
    },
    {
      id: "3",
      author: "Aditya Mehta",
      date: "2023-04-10",
      rating: 5,
      content: "Absolutely love this tee! The fabric is so soft and breathable, perfect for Mumbai weather. The color is exactly as shown online. Fast shipping too!",
      helpful: 5,
    },
  ]);
  
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [helpfulMarked, setHelpfulMarked] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("reviews");
  const [canReview, setCanReview] = useState(false);
  const { toast } = useToast();
  
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setCanReview(false);
        return;
      }
      
      try {
        // Check if user has ordered this product and the order is delivered
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id, 
            status,
            order_items!inner(product_id)
          `)
          .eq('user_id', session.user.id)
          .eq('order_items.product_id', productId)
          .eq('status', 'Delivered');
          
        if (error) {
          console.error('Error checking purchase status:', error);
          return;
        }
        
        // If we have a result, the user has purchased this product and it's delivered
        setCanReview(data && data.length > 0);
        
        if (data && data.length > 0) {
          console.log('User has purchased this product with a completed order');
        }
      } catch (error) {
        console.error('Error checking purchase status:', error);
      }
    };
    
    checkPurchaseStatus();
  }, [productId]);
  
  const handleNewReview = () => {
    // In a real app, we would refresh the reviews from the server
    console.log("New review submitted");
    setActiveTab("reviews");
    
    toast({
      title: "Review Submitted",
      description: "Thank you for sharing your feedback!",
    });
  };
  
  const markHelpful = (reviewId: string) => {
    if (helpfulMarked[reviewId]) return;
    
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review
    ));
    
    setHelpfulMarked({
      ...helpfulMarked,
      [reviewId]: true,
    });
  };
  
  // Calculate rating distribution
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingCounts[review.rating as keyof typeof ratingCounts]++;
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
          {canReview && (
            <TabsTrigger value="write-review">Write a Review</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="reviews">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Rating Summary */}
            <RatingSummary 
              rating={rating}
              reviewCount={reviews.length}
              ratingCounts={ratingCounts}
              canReview={canReview}
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
                canReview={canReview}
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
