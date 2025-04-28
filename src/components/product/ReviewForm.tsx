
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth } from "@/integrations/firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { toast } = useToast();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "You must give the product a star rating",
        variant: "destructive",
      });
      return;
    }
    
    if (review.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write a more detailed review",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Add review to Firebase
      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        author: user.displayName || user.email?.split('@')[0] || "Anonymous",
        productId,
        rating,
        content: review,
        createdAt: Timestamp.now(),
        helpful: 0
      });
      
      // Reset form
      setReview("");
      setRating(0);
      
      // Notify parent component
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center mb-2">
          <label htmlFor="rating" className="text-sm font-medium mr-4">Your Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setTempRating(star)}
                onMouseLeave={() => setTempRating(0)}
                className="p-1 hover:scale-110 transition-transform"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`h-6 w-6 ${
                    (tempRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <Textarea
          id="review"
          placeholder="Share your experience with this product..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="min-h-[100px]"
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
