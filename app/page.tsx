"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import firebaseApp from "../lib/firebase";
import { Header } from "@/components/dashboard/Header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { OrderManagement } from "@/components/dashboard/OrderManagement";
import { MenuManagement } from "@/components/dashboard/MenuManagement";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner, LoadingGrid } from "@/components/ui/LoadingSpinner";
import { categoryService, menuItemService } from "@/lib/services/firestore";
import type { Category, MenuItem } from "@/lib/schemas/firestore";

// import { subscribeUser, unsubscribeUser, sendNotification } from "./actions";
// import Link from "next/link";
// import { ThemeToggle } from "@/components/theme-toggle"

// Categories management with Firestore
function useCategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories from Firestore
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const addCategory = async (
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const categoryId = await categoryService.createCategory(categoryData);
      // Reload categories to get the updated list
      const updatedCategories = await categoryService.getCategories();
      setCategories(updatedCategories);
      return categoryId;
    } catch (err) {
      console.error("Error adding category:", err);
      throw new Error("Failed to add category");
    }
  };

  const removeCategory = async (categoryId: string) => {
    try {
      await categoryService.deleteCategory(categoryId);
      // Reload categories to get the updated list
      const updatedCategories = await categoryService.getCategories();
      setCategories(updatedCategories);
    } catch (err) {
      console.error("Error removing category:", err);
      throw new Error("Failed to remove category");
    }
  };

  const updateCategory = async (
    categoryId: string,
    updates: Partial<Category>
  ) => {
    try {
      await categoryService.updateCategory(categoryId, updates);
      // Reload categories to get the updated list
      const updatedCategories = await categoryService.getCategories();
      setCategories(updatedCategories);
    } catch (err) {
      console.error("Error updating category:", err);
      throw new Error("Failed to update category");
    }
  };

  return {
    categories,
    isLoading,
    error,
    addCategory,
    removeCategory,
    updateCategory,
  };
}

// Custom hook for menu item management with Firestore
function useMenuItemManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load menu items from Firestore
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true);
        const menuItemsData = await menuItemService.getMenuItems();
        setMenuItems(menuItemsData);
        setError(null);
      } catch (err) {
        console.error("Error loading menu items:", err);
        setError("Failed to load menu items");
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  const addMenuItem = async (
    menuItemData: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const itemId = await menuItemService.createMenuItem(menuItemData);
      // Reload menu items to get the updated list
      const updatedMenuItems = await menuItemService.getMenuItems();
      setMenuItems(updatedMenuItems);
      return itemId;
    } catch (err) {
      console.error("Error adding menu item:", err);
      throw new Error("Failed to add menu item");
    }
  };

  const updateMenuItem = async (itemId: string, updates: Partial<MenuItem>) => {
    try {
      await menuItemService.updateMenuItem(itemId, updates);
      // Reload menu items to get the updated list
      const updatedMenuItems = await menuItemService.getMenuItems();
      setMenuItems(updatedMenuItems);
    } catch (err) {
      console.error("Error updating menu item:", err);
      throw new Error("Failed to update menu item");
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    try {
      await menuItemService.deleteMenuItem(itemId);
      // Reload menu items to get the updated list
      const updatedMenuItems = await menuItemService.getMenuItems();
      setMenuItems(updatedMenuItems);
    } catch (err) {
      console.error("Error deleting menu item:", err);
      throw new Error("Failed to delete menu item");
    }
  };

  return {
    menuItems,
    isLoading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };
}

export default function RestaurantDashboard() {
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    addCategory,
    removeCategory,
    updateCategory,
  } = useCategoriesManager();

  const {
    menuItems,
    isLoading: menuItemsLoading,
    error: menuItemsError,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = useMenuItemManager();

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

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  // Handle category operations
  const handleAddCategory = async (
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await addCategory(categoryData);
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    try {
      await removeCategory(categoryId);
    } catch (err) {
      console.error("Error removing category:", err);
    }
  };

  const handleUpdateCategory = async (
    categoryId: string,
    updates: Partial<Category>
  ) => {
    try {
      await updateCategory(categoryId, updates);
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  // Handle menu item operations
  const handleAddMenuItem = async (
    menuItemData: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await addMenuItem(menuItemData);
    } catch (err) {
      console.error("Error adding menu item:", err);
    }
  };

  const handleUpdateMenuItem = async (
    itemId: string,
    updates: Partial<MenuItem>
  ) => {
    try {
      await updateMenuItem(itemId, updates);
    } catch (err) {
      console.error("Error updating menu item:", err);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      await deleteMenuItem(itemId);
    } catch (err) {
      console.error("Error deleting menu item:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-8 md:mb-12 slide-in-up">
          <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-2xl p-6 md:p-8 border border-orange-200/50 card-hover">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
              Welcome back! 👋
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Here's what's happening with your restaurant today.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="fade-in">
          <StatsCards
            activeOrders={orders.length}
            todayRevenue={1247}
            deliveries={8}
            avgDeliveryTime={28}
          />
        </div>

        {/* Tabs for Orders and Menu */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden fade-in">
          <Tabs defaultValue="orders" className="w-full">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-white shadow-sm border border-gray-200">
                <TabsTrigger
                  value="orders"
                  className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  Order Management
                </TabsTrigger>
                <TabsTrigger
                  value="menu"
                  className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  Menu Management
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <OrderManagement
                orders={orders}
                updateOrderStatus={updateOrderStatus}
              />

              <MenuManagement
                menuItems={menuItems}
                categories={categories}
                onAddMenuItem={handleAddMenuItem}
                onUpdateMenuItem={handleUpdateMenuItem}
                onDeleteMenuItem={handleDeleteMenuItem}
                onAddCategory={handleAddCategory}
                onRemoveCategory={handleRemoveCategory}
                onUpdateCategory={handleUpdateCategory}
                isLoading={categoriesLoading || menuItemsLoading}
                error={categoriesError || menuItemsError}
              />
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
