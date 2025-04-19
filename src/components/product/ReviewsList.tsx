
import React from "react";
import { Button } from "@/components/ui/button";
import ReviewItem from "./ReviewItem";

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  content: string;
  helpful: number;
}

interface ReviewsListProps {
  reviews: Review[];
  helpfulMarked: Record<string, boolean>;
  onMarkHelpful: (reviewId: string) => void;
  canReview: boolean;
  onWriteReviewClick: () => void;
}

export default function ReviewsList({ 
  reviews, 
  helpfulMarked, 
  onMarkHelpful, 
  canReview, 
  onWriteReviewClick 
}: ReviewsListProps) {
  return (
    <div className="md:col-span-2 space-y-6">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewItem 
            key={review.id} 
            review={review} 
            isHelpfulMarked={helpfulMarked[review.id]} 
            onMarkHelpful={onMarkHelpful} 
          />
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            This product doesn't have any reviews yet.
          </p>
          {canReview ? (
            <Button onClick={onWriteReviewClick}>
              Be the first to review
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Purchase this product to share your experience.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
