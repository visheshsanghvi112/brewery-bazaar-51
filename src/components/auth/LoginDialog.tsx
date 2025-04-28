
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, ShoppingBag } from "lucide-react";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleRegister = () => {
    onClose();
    navigate("/register");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Login Required
          </DialogTitle>
          <DialogDescription>
            Please login to your account to proceed with checkout. All your cart items will be saved.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 mt-4">
          <p className="text-sm text-muted-foreground">
            You need to be logged in to place an order and track your purchases. Creating an account takes just a moment.
          </p>
          
          <div className="flex justify-end space-x-3 mt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleRegister}>
              Register
            </Button>
            <Button onClick={handleLogin} className="gap-1">
              <LogIn className="h-4 w-4 mr-1" />
              Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
