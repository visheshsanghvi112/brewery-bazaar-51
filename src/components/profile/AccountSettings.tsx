
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { changeUserPassword, deleteUserAccount, updateNotificationPreferences, getUserProfile, UserProfile } from "@/lib/firebase/userOperations";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield } from "lucide-react";
import { auth } from "@/integrations/firebase/client";

interface AccountSettingsProps {
  userProfile: UserProfile | null;
  onProfileUpdate: () => void;
}

export default function AccountSettings({ userProfile, onProfileUpdate }: AccountSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
  
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailMarketing: userProfile?.notificationPreferences?.emailMarketing || false,
    orderUpdates: userProfile?.notificationPreferences?.orderUpdates || true,
    priceAlerts: userProfile?.notificationPreferences?.priceAlerts || false,
  });
  
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleChangePassword = async () => {
    setPasswordError("");
    
    // Validation
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await changeUserPassword(currentPassword, newPassword);
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setPasswordDialogOpen(false);
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed",
      });
    } catch (error: any) {
      console.error("Password change error:", error);
      setPasswordError(
        error.code === "auth/wrong-password"
          ? "Current password is incorrect"
          : "Failed to change password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    
    if (!deleteConfirmPassword) {
      setDeleteError("Password is required to confirm account deletion");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await deleteUserAccount(deleteConfirmPassword);
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
      });
      
      // User will be automatically redirected by auth listener in Profile.tsx
    } catch (error: any) {
      console.error("Account deletion error:", error);
      setDeleteError(
        error.code === "auth/wrong-password"
          ? "Password is incorrect"
          : "Failed to delete account"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    const updatedPreferences = {
      ...notificationPreferences,
      [key]: value,
    };
    
    setNotificationPreferences(updatedPreferences);
    
    try {
      if (auth.currentUser) {
        await updateNotificationPreferences(auth.currentUser.uid, updatedPreferences);
        
        toast({
          title: "Preferences updated",
          description: "Your notification preferences have been saved",
        });
        
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Update failed",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences and security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Password & Security</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Update your password to keep your account secure
          </p>
          <Button onClick={() => setPasswordDialogOpen(true)}>
            Change Password
          </Button>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-emails" className="font-medium">
                  Marketing Emails
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new products and offers
                </p>
              </div>
              <Switch
                id="marketing-emails"
                checked={notificationPreferences.emailMarketing}
                onCheckedChange={(checked) =>
                  handleNotificationChange("emailMarketing", checked)
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="order-updates" className="font-medium">
                  Order Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notifications about your orders and shipping
                </p>
              </div>
              <Switch
                id="order-updates"
                checked={notificationPreferences.orderUpdates}
                onCheckedChange={(checked) =>
                  handleNotificationChange("orderUpdates", checked)
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="price-alerts" className="font-medium">
                  Price Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when items in your wishlist go on sale
                </p>
              </div>
              <Switch
                id="price-alerts"
                checked={notificationPreferences.priceAlerts}
                onCheckedChange={(checked) =>
                  handleNotificationChange("priceAlerts", checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-red-500 mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data
          </p>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Account
          </Button>
        </div>

        {/* Change Password Dialog */}
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and a new password
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {passwordError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setPasswordDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleChangePassword} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-500">Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. All your data will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <Alert variant="destructive" className="mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  For security, please enter your password to confirm account deletion
                </AlertDescription>
              </Alert>
              
              {deleteError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="delete-password">Password</Label>
                <Input
                  id="delete-password"
                  type="password"
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
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
                onClick={handleDeleteAccount}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
