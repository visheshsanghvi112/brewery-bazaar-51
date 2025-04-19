
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    // Simulate review submission
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      // Reset form
      setReview("");
      setRating(0);
      
      // Notify parent component
      onReviewSubmitted();
    }, 1000);
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
