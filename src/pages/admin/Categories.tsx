
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Save } from "lucide-react";
import { Category } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  getCategoriesFromFirestore,
  updateCategoryInFirestore,
  deleteCategoryFromFirestore,
  seedDefaultCategories,
} from "@/lib/firebase/categoryOperations";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formCategory, setFormCategory] = useState<Partial<Category>>({
    name: "",
    slug: "",
    description: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await getCategoriesFromFirestore();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setFormCategory({
      name: "",
      slug: "",
      description: "",
      image: "",
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setFormCategory({ ...category });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from name if editing the name field
    if (name === "name" && (!formCategory.slug || !isEditing)) {
      setFormCategory({
        ...formCategory,
        [name]: value,
        slug: value.toLowerCase().replace(/\s+/g, "-"),
      });
    } else {
      setFormCategory({
        ...formCategory,
        [name]: value,
      });
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (!formCategory.name) {
        toast({
          title: "Missing information",
          description: "Category name is required",
          variant: "destructive",
        });
        return;
      }

      setSaving(true);

      // Create slug from name if not provided
      if (!formCategory.slug) {
        formCategory.slug = formCategory.name.toLowerCase().replace(/\s+/g, "-");
      }

      await updateCategoryInFirestore(formCategory);
      
      toast({
        title: "Success",
        description: `Category ${isEditing ? "updated" : "added"} successfully`,
      });
      
      // Reload categories and close form
      await loadCategories();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} category`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setLoading(true);
        await deleteCategoryFromFirestore(categoryId);
        
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        
        // Reload categories
        await loadCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSeedDefaultCategories = async () => {
    try {
      setLoading(true);
      await seedDefaultCategories();
      toast({
        title: "Success",
        description: "Default categories added successfully",
      });
      await loadCategories();
    } catch (error) {
      console.error("Error seeding default categories:", error);
      toast({
        title: "Error",
        description: "Failed to add default categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Categories</h2>
        <div className="flex gap-2">
          <Button onClick={handleAddCategory} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          {categories.length === 0 && !loading && (
            <Button variant="outline" onClick={handleSeedDefaultCategories}>
              <Save className="mr-2 h-4 w-4" />
              Add Default Categories
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div
                className="h-40 bg-cover bg-center"
                style={{
                  backgroundImage: category.image
                    ? `url(${category.image})`
                    : "url(https://via.placeholder.com/400x200?text=No+Image)",
                }}
              ></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{category.name}</CardTitle>
                  <Badge variant="secondary">{category.slug}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description || "No description"}
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No categories found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first category or add default categories to get started.
          </p>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formCategory.name}
                onChange={handleInputChange}
                placeholder="Category name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formCategory.slug}
                onChange={handleInputChange}
                placeholder="category-slug"
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly version of the name. Auto-generated if left blank.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formCategory.description}
                onChange={handleInputChange}
                placeholder="Category description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formCategory.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
