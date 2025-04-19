
import React from "react";
import { Star } from "lucide-react";

interface RatingDistributionProps {
  ratingCounts: Record<number, number>;
  totalReviews: number;
}

export default function RatingDistribution({ ratingCounts, totalReviews }: RatingDistributionProps) {
  const calculatePercentage = (count: number) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };
  
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((starRating) => (
        <div key={starRating} className="flex items-center">
          <div className="flex items-center w-14">
            <span className="text-sm">{starRating}</span>
            <Star className="h-4 w-4 ml-1 fill-current text-yellow-400" />
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5 mx-2">
            <div
              className="bg-yellow-400 h-2.5 rounded-full"
              style={{ width: `${calculatePercentage(ratingCounts[starRating])}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground w-14 text-right">
            {ratingCounts[starRating]} reviews
          </div>
        </div>
      ))}
    </div>
  );
}
