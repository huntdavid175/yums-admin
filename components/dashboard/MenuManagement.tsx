import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Plus, Settings, Trash2 } from "lucide-react";
import { MenuItemForm } from "./MenuItemForm";
import type { MenuItem, Category } from "@/lib/schemas/firestore";
import { toast } from "react-hot-toast";

interface MenuManagementProps {
  menuItems: MenuItem[];
  categories: Category[];
  onAddMenuItem: (
    item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onUpdateMenuItem: (
    itemId: string,
    updates: Partial<MenuItem>
  ) => Promise<void>;
  onDeleteMenuItem: (itemId: string) => Promise<void>;
  onAddCategory: (
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onRemoveCategory: (categoryId: string) => Promise<void>;
  onUpdateCategory: (
    categoryId: string,
    updates: Partial<Category>
  ) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function MenuManagement({
  menuItems,
  categories,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onAddCategory,
  onRemoveCategory,
  onUpdateCategory,
  isLoading = false,
  error = null,
}: MenuManagementProps) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
    useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Category color generator
  const getCategoryColor = (category: Category) => {
    if (category.color) return category.color;

    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
    ];
    const index = category.name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Enhanced category management functions
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
    setIsEditCategoryDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (
      editingCategory &&
      newCategory.trim() &&
      newCategory.trim() !== editingCategory.name
    ) {
      try {
        await onUpdateCategory(editingCategory.id!, {
          name: newCategory.trim(),
        });
        setNewCategory("");
        setEditingCategory(null);
        setIsEditCategoryDialogOpen(false);
      } catch (err) {
        console.error("Error updating category:", err);
      }
    }
  };

  const handleDeleteCategory = async (categoryToDelete: Category) => {
    const itemsInCategory = menuItems.filter(
      (item) => item.category === categoryToDelete.name
    );

    if (itemsInCategory.length > 0) {
      alert(
        `Cannot delete category "${categoryToDelete.name}" because it contains ${itemsInCategory.length} menu items. Please move or delete these items first.`
      );
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete the category "${categoryToDelete.name}"?`
      )
    ) {
      try {
        await onRemoveCategory(categoryToDelete.id!);
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  };

  const handleAddItem = async (formData: any) => {
    try {
      await onAddMenuItem(formData);
      setIsAddDialogOpen(false);
      toast.success("Menu item added successfully!");
    } catch (err) {
      console.error("Error adding menu item:", err);
      toast.error("Failed to add menu item.");
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = async (formData: any) => {
    if (editingItem) {
      try {
        await onUpdateMenuItem(editingItem.id!, formData);
        setEditingItem(null);
        setIsEditDialogOpen(false);
        toast.success("Menu item updated successfully!");
      } catch (err) {
        console.error("Error updating menu item:", err);
        toast.error("Failed to update menu item.");
      }
    }
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        await onDeleteMenuItem(item.id!);
        toast.success("Menu item deleted successfully!");
      } catch (err) {
        console.error("Error deleting menu item:", err);
        toast.error("Failed to delete menu item.");
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await onAddCategory({
          name: newCategory.trim(),
          description: "",
          color: "#FF6B6B",
          sortOrder: categories.length,
          active: true,
        });
        setNewCategory("");
      } catch (err) {
        console.error("Error adding category:", err);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <TabsContent value="menu" className="space-y-4 md:space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading menu data...</p>
        </div>
      </TabsContent>
    );
  }

  // Error state
  if (error) {
    return (
      <TabsContent value="menu" className="space-y-4 md:space-y-6">
        <div className="text-center py-8">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="menu" className="space-y-4 md:space-y-6">
      {/* Existing Menu Items Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">Menu Items</CardTitle>
              <CardDescription>
                Manage your restaurant's menu items
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>
                    Create a detailed menu item with all options and pricing.
                  </DialogDescription>
                </DialogHeader>
                <MenuItemForm
                  categories={categories.map((cat) => cat.name)}
                  onSubmit={handleAddItem}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {/* Image */}
                {item.image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="menu-item-name truncate">{item.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <Badge
                        variant={item.available ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>

                  {/* Comes With */}
                  {item.comesWith && (
                    <div className="text-xs">
                      <span className="font-medium text-green-700">
                        Includes:
                      </span>{" "}
                      <span className="text-gray-600">{item.comesWith}</span>
                    </div>
                  )}

                  {/* Size Options */}
                  {item.sizes && item.sizes.length > 1 && (
                    <div className="text-xs">
                      <span className="font-medium text-blue-700">Sizes:</span>{" "}
                      <span className="text-gray-600">
                        {item.sizes
                          .map(
                            (size) =>
                              `${size.name}${
                                size.price > 0 ? ` (+$${size.price})` : ""
                              }`
                          )
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Extras Preview */}
                  {item.extras && item.extras.length > 0 && (
                    <div className="text-xs">
                      <span className="font-medium text-purple-700">
                        Extras available:
                      </span>{" "}
                      <span className="text-gray-600">
                        {item.extras
                          .slice(0, 3)
                          .map((extra) => extra.name)
                          .join(", ")}
                        {item.extras.length > 3 &&
                          ` +${item.extras.length - 3} more`}
                      </span>
                    </div>
                  )}

                  <p className="price-text text-green-600">
                    From GH₵{item.price}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories Management Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">
                Menu Categories
              </CardTitle>
              <CardDescription>
                Organize your menu items by creating and managing categories
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full md:w-[200px]"
                  onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                />
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Categories Grid */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {
                          menuItems.filter(
                            (item) => item.category === category.name
                          ).length
                        }{" "}
                        items
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCategory(category)}
                          className="text-red-600"
                          disabled={menuItems.some(
                            (item) => item.category === category.name
                          )}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Category Color Indicator */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border-2"
                      style={{
                        backgroundColor: getCategoryColor(category),
                      }}
                    />
                    <span className="text-xs text-gray-500">
                      {getCategoryColor(category)}
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="text-xs text-gray-500">
                    Available:{" "}
                    {
                      menuItems.filter(
                        (item) =>
                          item.category === category.name && item.available
                      ).length
                    }{" "}
                    | Unavailable:{" "}
                    {
                      menuItems.filter(
                        (item) =>
                          item.category === category.name && !item.available
                      ).length
                    }
                  </div>
                </div>
              </Card>
            ))}

            {/* Empty State */}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No categories yet</p>
                <p className="text-sm">
                  Create your first category to organize your menu items
                </p>
              </div>
            )}
          </div>

          {/* Category Statistics */}
          {categories.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Category Overview</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {categories.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-green-600">
                    {menuItems.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Available Items</p>
                  <p className="text-2xl font-bold text-green-600">
                    {menuItems.filter((item) => item.available).length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Unavailable Items</p>
                  <p className="text-2xl font-bold text-red-600">
                    {menuItems.filter((item) => !item.available).length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>Update the menu item details.</DialogDescription>
          </DialogHeader>
          <MenuItemForm
            categories={categories.map((cat) => cat.name)}
            initialItem={editingItem}
            onSubmit={handleUpdateItem}
            onCancel={() => setIsEditDialogOpen(false)}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={isEditCategoryDialogOpen}
        onOpenChange={setIsEditCategoryDialogOpen}
      >
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name. This will affect all menu items in this
              category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="editCategoryName">Category Name</Label>
              <Input
                id="editCategoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            {editingCategory && (
              <div className="p-3 bg-blue-50 rounded text-sm">
                <p>
                  <strong>Current name:</strong> {editingCategory.name}
                </p>
                <p>
                  <strong>Items in category:</strong>{" "}
                  {
                    menuItems.filter(
                      (item) => item.category === editingCategory.name
                    ).length
                  }
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              onClick={() => {
                setIsEditCategoryDialogOpen(false);
                setEditingCategory(null);
                setNewCategory("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory} className="w-full sm:w-auto">
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
