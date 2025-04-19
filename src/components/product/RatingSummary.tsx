
import React from "react";
import { Star } from "lucide-react";
import RatingDistribution from "./RatingDistribution";

interface RatingSummaryProps {
  rating: number;
  reviewCount: number;
  ratingCounts: Record<number, number>;
  canReview: boolean;
  onWriteReviewClick: () => void;
}

export default function RatingSummary({ 
  rating, 
  reviewCount, 
  ratingCounts, 
  canReview, 
  onWriteReviewClick 
}: RatingSummaryProps) {
  return (
    <div className="md:col-span-1 space-y-6">
      <div className="text-center md:text-left">
        <div className="text-5xl font-bold mb-2">{rating.toFixed(1)}</div>
        <div className="flex justify-center md:justify-start items-center mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Based on {reviewCount} reviews
        </div>
      </div>
      
      <RatingDistribution 
        ratingCounts={ratingCounts} 
        totalReviews={reviewCount} 
      />
      
      {!canReview && (
        <div className="bg-muted/30 p-4 rounded-md border border-border/50">
          <p className="text-sm text-muted-foreground">
            Only verified customers who have purchased and received this product can leave a review.
          </p>
        </div>
      )}
    </div>
  );
}
