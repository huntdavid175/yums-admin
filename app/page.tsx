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

  const updateCategory = (oldName: string, newName: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat === oldName ? newName : cat))
    );
  };

  return {
    categories,
    newCategory,
    setNewCategory,
    addCategory,
    removeCategory,
    updateCategory,
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

export default function RestaurantDashboard() {
  const {
    categories,
    newCategory,
    setNewCategory,
    addCategory,
    removeCategory,
    updateCategory,
  } = useCategoriesManager();
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } =
    useMenuItemManager();

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
            onAddMenuItem={addMenuItem}
            onUpdateMenuItem={updateMenuItem}
            onDeleteMenuItem={deleteMenuItem}
            onAddCategory={addCategory}
            onRemoveCategory={removeCategory}
            onUpdateCategory={updateCategory}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
          />
        </Tabs>
      </main>
    </div>
  );
}
