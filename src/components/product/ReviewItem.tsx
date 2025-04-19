
import React from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewItemProps {
  review: {
    id: string;
    author: string;
    date: string;
    rating: number;
    content: string;
    helpful: number;
  };
  isHelpfulMarked: boolean;
  onMarkHelpful: (reviewId: string) => void;
}

export default function ReviewItem({ review, isHelpfulMarked, onMarkHelpful }: ReviewItemProps) {
  return (
    <div className="border-b pb-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium">{review.author}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(review.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </div>
        </div>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm mb-3">{review.content}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onMarkHelpful(review.id)}
        disabled={isHelpfulMarked}
        className="h-8 text-xs"
      >
        <ThumbsUp className="h-3 w-3 mr-1" />
        {isHelpfulMarked ? 'Marked as helpful' : 'Helpful'} ({review.helpful})
      </Button>
    </div>
  );
}
