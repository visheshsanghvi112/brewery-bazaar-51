
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/integrations/firebase/client";
import { getUserReviews, updateReview, deleteReview, UserReview } from "@/lib/firebase/userOperations";
import { StarRating } from "./StarRating";
import { CalendarDays, Edit, Trash2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserReviewsSection() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<UserReview | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        if (auth.currentUser) {
          const userReviews = await getUserReviews(auth.currentUser.uid);
          setReviews(userReviews);
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
        toast({
          title: "Error",
          description: "Failed to load your reviews",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [toast]);

  const handleOpenEditDialog = (review: UserReview) => {
    setCurrentReview(review);
    setEditContent(review.content);
    setEditRating(review.rating);
    setEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (review: UserReview) => {
    setCurrentReview(review);
    setDeleteDialogOpen(true);
  };

  const handleEditReview = async () => {
    if (!currentReview) return;

    setIsSubmitting(true);

    try {
      await updateReview(currentReview.id, editRating, editContent);
      
      // Update the reviews list
      setReviews(reviews.map(review => 
        review.id === currentReview.id 
          ? { ...review, rating: editRating, content: editContent, updatedAt: new Date().toISOString() }
          : review
      ));
      
      setEditDialogOpen(false);
      toast({
        title: "Review updated",
        description: "Your review has been successfully updated",
      });
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Update failed",
        description: "Failed to update your review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!currentReview) return;

    setIsSubmitting(true);

    try {
      await deleteReview(currentReview.id);
      
      // Remove the review from the list
      setReviews(reviews.filter(review => review.id !== currentReview.id));
      
      setDeleteDialogOpen(false);
      toast({
        title: "Review deleted",
        description: "Your review has been deleted",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete your review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Reviews</CardTitle>
        <CardDescription>Manage the product reviews you've submitted</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {review.rating}/5
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {formatDate(review.updatedAt)}
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{review.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => navigateToProduct(review.productId)}
                    >
                      View Product
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenEditDialog(review)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleOpenDeleteDialog(review)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <h3 className="font-medium text-lg mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't submitted any product reviews yet
            </p>
            <Button onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </div>
        )}
      </CardContent>

      {/* Edit Review Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update your rating and review
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl ${
                      star <= editRating ? "text-amber-400" : "text-gray-300"
                    }`}
                    onClick={() => setEditRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="review-content">Your Review</Label>
              <Textarea
                id="review-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleEditReview} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Review Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
