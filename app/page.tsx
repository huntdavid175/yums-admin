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
import { categoryService, menuItemService } from "@/lib/services/firestore";
import type { Category, MenuItem } from "@/lib/schemas/firestore";

// import { subscribeUser, unsubscribeUser, sendNotification } from "./actions";
import Link from "next/link";
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <StatsCards
          activeOrders={orders.length}
          todayRevenue={1247}
          deliveries={8}
          avgDeliveryTime={28}
        />

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
        </Tabs>
      </main>
    </div>
  );
}
