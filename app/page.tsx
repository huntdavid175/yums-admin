"use client";

import { useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  ChefHat,
  Clock,
  DollarSign,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  MapPin,
  Phone,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import firebaseApp from "../lib/firebase";

// import { subscribeUser, unsubscribeUser, sendNotification } from "./actions";
import Link from "next/link";
// import { ThemeToggle } from "@/components/theme-toggle"

// Categories management
function useCategoriesManager() {
  const [categories, setCategories] = useState([
    "Appetizer",
    "Main Course",
    "Dessert",
    "Beverage",
    "Side Dish",
    "Salad",
    "Pizza",
    "Pasta",
  ]);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories((prev) => [...prev, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories((prev) => prev.filter((cat) => cat !== categoryToRemove));
  };

  return {
    categories,
    newCategory,
    setNewCategory,
    addCategory,
    removeCategory,
    setCategories,
  };
}

// Custom hook for menu item management
function useMenuItemManager() {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Classic Burger",
      category: "Main Course",
      price: 12.99,
      description: "Beef patty with lettuce, tomato, and cheese",
      comesWith: "French Fries, Pickle, Coleslaw",
      available: true,
      images: ["/placeholder.svg?height=200&width=300"],
      sizes: [
        { name: "Regular", price: 0 },
        { name: "Large", price: 2.99 },
        { name: "Extra Large", price: 4.99 },
      ],
      extras: [
        { name: "Extra Cheese", price: 1.5 },
        { name: "Bacon", price: 2.99 },
        { name: "Avocado", price: 2.5 },
        { name: "Extra Patty", price: 4.99 },
      ],
    },
    {
      id: 2,
      name: "Margherita Pizza",
      category: "Pizza",
      price: 14.99,
      description: "Fresh mozzarella, tomato sauce, and basil",
      comesWith: "Garlic Bread, Parmesan Cheese",
      available: true,
      images: ["/placeholder.svg?height=200&width=300"],
      sizes: [
        { name: 'Small (10")', price: 0 },
        { name: 'Medium (12")', price: 3.99 },
        { name: 'Large (14")', price: 6.99 },
        { name: 'Family (16")', price: 9.99 },
      ],
      extras: [
        { name: "Extra Cheese", price: 2.0 },
        { name: "Pepperoni", price: 2.5 },
        { name: "Mushrooms", price: 1.5 },
        { name: "Olives", price: 1.5 },
        { name: "Bell Peppers", price: 1.5 },
      ],
    },
  ]);

  const addMenuItem = (item: any) => {
    const newItem = {
      ...item,
      id: Math.max(...menuItems.map((i) => i.id), 0) + 1,
      price: Number.parseFloat(item.price) || 0,
      sizes: item.sizes.map((s: any) => ({
        ...s,
        price: Number.parseFloat(s.price) || 0,
      })),
      extras: item.extras.map((e: any) => ({
        ...e,
        price: Number.parseFloat(e.price) || 0,
      })),
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (id: number, updatedItem: any) => {
    const updated = {
      ...updatedItem,
      id,
      price: Number.parseFloat(updatedItem.price) || 0,
      sizes: updatedItem.sizes.map((s: any) => ({
        ...s,
        price: Number.parseFloat(s.price) || 0,
      })),
      extras: updatedItem.extras.map((e: any) => ({
        ...e,
        price: Number.parseFloat(e.price) || 0,
      })),
    };
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    setMenuItems,
  };
}

// Custom hook for the menu item form
function useMenuItemForm(initialItem = null) {
  const [formData, setFormData] = useState(
    initialItem || {
      name: "",
      category: "",
      price: "",
      description: "",
      comesWith: "",
      available: true,
      images: [""],
      sizes: [{ name: "", price: "" }],
      extras: [{ name: "", price: "" }],
    }
  );

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      comesWith: "",
      available: true,
      images: [""],
      sizes: [{ name: "", price: "" }],
      extras: [{ name: "", price: "" }],
    });
  };

  const loadItem = (item: any) => {
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      comesWith: item.comesWith,
      available: item.available,
      images: item.images.length > 0 ? item.images : [""],
      sizes:
        item.sizes.length > 0
          ? item.sizes.map((s: any) => ({
              name: s.name,
              price: s.price.toString(),
            }))
          : [{ name: "", price: "" }],
      extras:
        item.extras.length > 0
          ? item.extras.map((e: any) => ({
              name: e.name,
              price: e.price.toString(),
            }))
          : [{ name: "", price: "" }],
    });
  };

  // Dynamic array helpers
  const addSize = () =>
    setFormData((p) => ({
      ...p,
      sizes: [...p.sizes, { name: "", price: "" }],
    }));
  const removeSize = (i: number) =>
    setFormData((p) => ({ ...p, sizes: p.sizes.filter((_, k) => k !== i) }));
  const updateSize = (i: number, f: "name" | "price", v: string) =>
    setFormData((p) => ({
      ...p,
      sizes: p.sizes.map((s, k) => (k === i ? { ...s, [f]: v } : s)),
    }));

  const addExtra = () =>
    setFormData((p) => ({
      ...p,
      extras: [...p.extras, { name: "", price: "" }],
    }));
  const removeExtra = (i: number) =>
    setFormData((p) => ({ ...p, extras: p.extras.filter((_, k) => k !== i) }));
  const updateExtra = (i: number, f: "name" | "price", v: string) =>
    setFormData((p) => ({
      ...p,
      extras: p.extras.map((e, k) => (k === i ? { ...e, [f]: v } : e)),
    }));

  const addImage = () =>
    setFormData((p) => ({ ...p, images: [...p.images, ""] }));
  const removeImage = (i: number) =>
    setFormData((p) => ({ ...p, images: p.images.filter((_, k) => k !== i) }));
  const updateImage = (i: number, v: string) =>
    setFormData((p) => ({
      ...p,
      images: p.images.map((img, k) => (k === i ? v : img)),
    }));

  return {
    formData,
    setFormData,
    resetForm,
    loadItem,
    addSize,
    removeSize,
    updateSize,
    addExtra,
    removeExtra,
    updateExtra,
    addImage,
    removeImage,
    updateImage,
  };
}

export default function RestaurantDashboard() {
  const {
    categories,
    newCategory,
    setNewCategory,
    addCategory: originalAddCategory,
    removeCategory,
    setCategories,
  } = useCategoriesManager();
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    setMenuItems,
  } = useMenuItemManager();
  const {
    formData,
    setFormData,
    resetForm,
    loadItem,
    addSize,
    removeSize,
    updateSize,
    addExtra,
    removeExtra,
    updateExtra,
    addImage,
    removeImage,
    updateImage,
  } = useMenuItemForm();

  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Add these new state variables and functions
  const [editingCategory, setEditingCategory] = useState<{
    name: string;
    index: number;
  } | null>(null);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
    useState(false);

  // Category color generator
  const getCategoryColor = (category: string) => {
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
    const index = category
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Enhanced category management functions
  const handleEditCategory = (category: string, index: number) => {
    setEditingCategory({ name: category, index });
    setNewCategory(category);
    setIsEditCategoryDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (
      editingCategory &&
      newCategory.trim() &&
      newCategory.trim() !== editingCategory.name
    ) {
      const oldName = editingCategory.name;
      const newName = newCategory.trim();

      // Update category in the list
      setCategories((prev) =>
        prev.map((cat, i) => (i === editingCategory.index ? newName : cat))
      );

      // Update all menu items that use this category
      setMenuItems((prev) =>
        prev.map((item) =>
          item.category === oldName ? { ...item, category: newName } : item
        )
      );

      setNewCategory("");
      setEditingCategory(null);
      setIsEditCategoryDialogOpen(false);
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    const itemsInCategory = menuItems.filter(
      (item) => item.category === categoryToDelete
    );

    if (itemsInCategory.length > 0) {
      alert(
        `Cannot delete category "${categoryToDelete}" because it contains ${itemsInCategory.length} menu items. Please move or delete these items first.`
      );
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete the category "${categoryToDelete}"?`
      )
    ) {
      removeCategory(categoryToDelete);
    }
  };

  // Enhanced add category function
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories((prev) => [...prev, newCategory.trim()]);
      setNewCategory("");
    } else if (categories.includes(newCategory.trim())) {
      alert("This category already exists!");
    }
  };

  const handleAddItem = () => {
    addMenuItem(formData);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    loadItem(item);
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      updateMenuItem(editingItem.id, formData);
      resetForm();
      setEditingItem(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteItem = (id: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteMenuItem(id);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const db = getFirestore(firebaseApp);
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // const orders = [
  //   {
  //     id: "ORD-001",
  //     customer: "John Doe",
  //     phone: "+1 (555) 123-4567",
  //     items: "2x Burger, 1x Fries",
  //     total: 24.99,
  //     status: "preparing",
  //     time: "10 min ago",
  //     orderType: "delivery",
  //     address: "123 Main St, Apt 4B, Downtown",
  //     estimatedDelivery: "25-35 min",
  //     notes: "Ring doorbell twice, no onions on burger",
  //   },
  //   {
  //     id: "ORD-002",
  //     customer: "Jane Smith",
  //     phone: "+1 (555) 987-6543",
  //     items: "1x Pizza, 2x Coke",
  //     total: 18.5,
  //     status: "ready",
  //     time: "5 min ago",
  //     orderType: "takeaway",
  //     address: "Pickup at store",
  //     estimatedDelivery: "Ready for pickup",
  //     notes: "Customer will arrive in 10 minutes",
  //   },
  // ];

  // Menu Item Form Component
  const MenuItemForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-6 py-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg border-b pb-2">
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Classic Burger"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <div className="flex gap-2">
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setIsCategoryDialogOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Base Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Detailed description of the item"
            rows={3}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="comesWith">Comes With</Label>
          <Textarea
            id="comesWith"
            value={formData.comesWith}
            onChange={(e) =>
              setFormData({ ...formData, comesWith: e.target.value })
            }
            placeholder="e.g., French Fries, Pickle, Coleslaw"
            rows={2}
          />
          <p className="text-sm text-gray-500">
            List items that are included with this dish
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg border-b pb-2 flex-1">Images</h4>
          <Button type="button" variant="outline" size="sm" onClick={addImage}>
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </Button>
        </div>
        <div className="space-y-3">
          {formData.images.map((image, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="Image URL or upload path"
                className="flex-1"
              />
              {formData.images.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg border-b pb-2 flex-1">
            Size Options
          </h4>
          <Button type="button" variant="outline" size="sm" onClick={addSize}>
            <Plus className="h-4 w-4 mr-1" />
            Add Size
          </Button>
        </div>
        <div className="space-y-3">
          {formData.sizes.map((size, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={size.name}
                onChange={(e) => updateSize(index, "name", e.target.value)}
                placeholder="Size name (e.g., Small, Large)"
                className="flex-1"
              />
              <Input
                type="number"
                step="0.01"
                value={size.price}
                onChange={(e) => updateSize(index, "price", e.target.value)}
                placeholder="Additional price"
                className="w-32"
              />
              {formData.sizes.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeSize(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          First size is typically the base size (additional price = 0)
        </p>
      </div>

      {/* Extras */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg border-b pb-2 flex-1">
            Extra Options
          </h4>
          <Button type="button" variant="outline" size="sm" onClick={addExtra}>
            <Plus className="h-4 w-4 mr-1" />
            Add Extra
          </Button>
        </div>
        <div className="space-y-3">
          {formData.extras.map((extra, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={extra.name}
                onChange={(e) => updateExtra(index, "name", e.target.value)}
                placeholder="Extra name (e.g., Extra Cheese)"
                className="flex-1"
              />
              <Input
                type="number"
                step="0.01"
                value={extra.price}
                onChange={(e) => updateExtra(index, "price", e.target.value)}
                placeholder="Extra price"
                className="w-32"
              />
              {formData.extras.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeExtra(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg border-b pb-2">Availability</h4>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="available"
            checked={formData.available}
            onChange={(e) =>
              setFormData({ ...formData, available: e.target.checked })
            }
            className="rounded"
          />
          <Label htmlFor="available">Item is available for ordering</Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                RestaurantPro
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                Delivery & Takeaway Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-orange-600 font-medium">
              Dashboard
            </a>
            <a
              href="/orders"
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              All Orders
            </a>
            <a
              href="/kitchen"
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              Kitchen View
            </a>
          </nav>

          {/* Mobile & Desktop Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <a href="/" className="w-full">
                      Dashboard
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/orders" className="w-full">
                      All Orders
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/kitchen" className="w-full">
                      Kitchen View
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center justify-between">
                    <span>Theme</span>
                    {/* <ThemeToggle /> */}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Only - Notifications and User */}
            <div className="hidden md:flex items-center space-x-4">
              {/* <ThemeToggle /> */}
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Active Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last hour</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Today's Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">$1,247</div>
              <p className="text-xs text-muted-foreground">
                +15% from yesterday
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Deliveries
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">4 takeaway</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Avg. Delivery Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">28m</div>
              <p className="text-xs text-muted-foreground">-5m from average</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Orders and Menu */}
        <Tabs defaultValue="orders" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] md:max-w-[500px]">
            <TabsTrigger value="orders" className="text-sm">
              Order Management
            </TabsTrigger>
            <TabsTrigger value="menu" className="text-sm">
              Menu Management
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl">
                      Recent Orders
                    </CardTitle>
                    <CardDescription>
                      Manage delivery and takeaway orders
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders..."
                        className="pl-8 w-full md:w-[250px]"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mobile/Tablet Order Cards */}
                <div className="lg:hidden space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            ORD-{order.id.slice(2, 6)}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {order.orderType}
                            </Badge>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{order.customerName}</p>
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="text-blue-600"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          </div>
                          <p className="text-sm text-gray-500">
                            {order.customerPhone}
                          </p>
                          <div className="flex items-start gap-1 mt-1">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                              {order?.deliveryAddress?.street}
                            </p>
                          </div>
                          <p className="text-xs text-orange-600 mt-1">
                            {order.estimatedDelivery}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 truncate">
                            {order.items.map(
                              (item: any) => item.name + "x" + item.quantity
                            )}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-medium">
                              GH₵{order.total}
                            </span>
                            <span className="text-sm text-gray-500">
                              {/* {order.time} */}
                            </span>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="p-2 bg-yellow-50 rounded text-xs">
                            {/* <strong>Notes:</strong> {order.notes} */}
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-transparent"
                            >
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                updateOrderStatus(order.id, "preparing")
                              }
                            >
                              Mark as Preparing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateOrderStatus(order.id, "ready")
                              }
                            >
                              Mark as Ready
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateOrderStatus(order.id, "delivered")
                              }
                            >
                              Mark as Delivered
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            ORD-{order.id.slice(2, 6)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {order.customerName}
                                <a
                                  href={`tel:${order.customerPhone}`}
                                  className="text-blue-600"
                                >
                                  <Phone className="h-4 w-4" />
                                </a>
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customerPhone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {order.orderType}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="flex items-start gap-1">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm truncate">
                                  {order?.deliveryAddress?.street}
                                </div>
                                <div className="text-xs text-orange-600">
                                  {order.status === "pending" &&
                                  order.orderType === "pickup"
                                    ? "40 min "
                                    : "Ready"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {/* {order.items} */}
                            {order.items.map(
                              (item: any) => item.name + "x" + item.quantity
                            )}
                          </TableCell>
                          <TableCell>GH₵{order.total}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.time}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateOrderStatus(order.id, "preparing")
                                  }
                                >
                                  Mark as Preparing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateOrderStatus(order.id, "ready")
                                  }
                                >
                                  Mark as Ready
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateOrderStatus(order.id, "delivered")
                                  }
                                >
                                  Mark as Delivered
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-4 md:space-y-6">
            {/* Existing Menu Items Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl">
                      Menu Items
                    </CardTitle>
                    <CardDescription>
                      Manage your restaurant's menu items
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
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
                          Create a detailed menu item with all options and
                          pricing.
                        </DialogDescription>
                      </DialogHeader>
                      <MenuItemForm />
                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto bg-transparent"
                        >
                          Save as Draft
                        </Button>
                        <Button
                          onClick={handleAddItem}
                          className="w-full sm:w-auto"
                        >
                          Add Menu Item
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      {/* Image */}
                      {item.images && item.images[0] && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={item.images[0] || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="menu-item-name truncate">
                                {item.name}
                              </h3>
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
                              onClick={() => handleDeleteItem(item.id)}
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
                            <span className="text-gray-600">
                              {item.comesWith}
                            </span>
                          </div>
                        )}

                        {/* Size Options */}
                        {item.sizes && item.sizes.length > 1 && (
                          <div className="text-xs">
                            <span className="font-medium text-blue-700">
                              Sizes:
                            </span>{" "}
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
                          From ${item.price}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* NEW: Categories Management Section */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl">
                      Menu Categories
                    </CardTitle>
                    <CardDescription>
                      Organize your menu items by creating and managing
                      categories
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-2">
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter category name"
                        className="w-full md:w-[200px]"
                        onKeyPress={(e) => e.key === "Enter" && addCategory()}
                      />
                      <Button
                        onClick={addCategory}
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
                  {categories.map((category, index) => (
                    <Card
                      key={category}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">
                              {category}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {
                                menuItems.filter(
                                  (item) => item.category === category
                                ).length
                              }{" "}
                              items
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditCategory(category, index)
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteCategory(category)}
                                className="text-red-600"
                                disabled={menuItems.some(
                                  (item) => item.category === category
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
                                item.category === category && item.available
                            ).length
                          }{" "}
                          | Unavailable:{" "}
                          {
                            menuItems.filter(
                              (item) =>
                                item.category === category && !item.available
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
          </TabsContent>
        </Tabs>

        {/* Edit Menu Item Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>
                Update the menu item details.
              </DialogDescription>
            </DialogHeader>
            <MenuItemForm isEdit={true} />
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-transparent"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateItem} className="w-full sm:w-auto">
                Update Menu Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Category Management Dialog */}
        <Dialog
          open={isCategoryDialogOpen}
          onOpenChange={setIsCategoryDialogOpen}
        >
          <DialogContent className="w-[95vw] max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Categories</DialogTitle>
              <DialogDescription>
                Add or remove menu categories.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1"
                />
                <Button onClick={originalAddCategory}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span>{category}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCategory(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsCategoryDialogOpen(false)}>
                Done
              </Button>
            </DialogFooter>
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
                Update the category name. This will affect all menu items in
                this category.
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
              <Button
                onClick={handleUpdateCategory}
                className="w-full sm:w-auto"
              >
                Update Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
