
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileChange: (file: File | null) => void;
  preview?: string;
  className?: string;
  label?: string;
  buttonText?: string;
  accept?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onFileChange, preview, label, buttonText = "Select file", accept = "image/*", ...props }, ref) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      
      if (file) {
        onFileChange(file);
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleClear = () => {
      setPreviewUrl(null);
      onFileChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className={cn("space-y-2", className)}>
        {label && <Label>{label}</Label>}
        <div 
          className={cn(
            "border-2 border-dashed rounded-md p-4 transition-colors",
            "hover:border-primary/50 focus-within:border-primary/50",
            "bg-background/50"
          )}
        >
          <Input
            type="file"
            ref={ref || fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={accept}
            {...props}
          />
          
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="File preview" 
                className="mx-auto max-h-52 rounded-md object-contain"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-black/40 hover:bg-black/60 text-white rounded-full"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div 
              onClick={handleButtonClick}
              className="flex flex-col items-center justify-center py-6 cursor-pointer text-center"
            >
              <div className="mb-3 rounded-full bg-primary/10 p-3">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {buttonText}
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag & drop or click to upload
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };
