"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DatabaseUtils } from "@/lib/utils/database-utils";
import { categoryService, menuItemService } from "@/lib/services/firestore";
import type { Category, MenuItem } from "@/lib/schemas/firestore";

export default function TestSchemaPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, menuItemsData] = await Promise.all([
        categoryService.getCategories(),
        menuItemService.getMenuItems(),
      ]);
      setCategories(categoriesData);
      setMenuItems(menuItemsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      setIsLoading(true);
      await DatabaseUtils.seedDatabase();
      await loadData();
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDatabase = async () => {
    try {
      const result = await DatabaseUtils.verifyDatabase();
      setStats(result);
    } catch (error) {
      console.error("Error verifying database:", error);
    }
  };

  const handleClearDatabase = async () => {
    try {
      setIsLoading(true);
      await DatabaseUtils.clearDatabase();
      await loadData();
    } catch (error) {
      console.error("Error clearing database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    try {
      setIsLoading(true);
      await DatabaseUtils.resetDatabase();
      await loadData();
    } catch (error) {
      console.error("Error resetting database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Firestore Schema System Test
          </h1>
          <p className="text-gray-600">
            Test the categories and menu items schema implementation
          </p>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Database Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleSeedDatabase}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                🌱 Seed Database
              </Button>
              <Button
                onClick={handleVerifyDatabase}
                disabled={isLoading}
                variant="outline"
              >
                🔍 Verify Database
              </Button>
              <Button
                onClick={handleClearDatabase}
                disabled={isLoading}
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                🗑️ Clear Database
              </Button>
              <Button
                onClick={handleResetDatabase}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                🔄 Reset Database
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Database Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.categories}
                  </p>
                  <p className="text-sm text-gray-600">Categories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {stats.menuItems}
                  </p>
                  <p className="text-sm text-gray-600">Menu Items</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {menuItems.filter((item) => item.available).length}
                  </p>
                  <p className="text-sm text-gray-600">Available Items</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {categories.filter((cat) => cat.active).length}
                  </p>
                  <p className="text-sm text-gray-600">Active Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No categories found</p>
                <p className="text-sm text-gray-400">
                  Use &quot;Seed Database&quot; to add sample categories
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge
                        variant={category.active ? "default" : "secondary"}
                      >
                        {category.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: category.color || "#FF6B6B" }}
                      />
                      <span className="text-xs text-gray-500">
                        {
                          menuItems.filter(
                            (item) => item.category === category.name
                          ).length
                        }{" "}
                        items
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Items ({menuItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading menu items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No menu items found</p>
                <p className="text-sm text-gray-400">
                  Use &quot;Seed Database&quot; to add sample menu items
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-semibold">
                        ${item.price}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    {item.sizes.length > 1 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.sizes.length} size options
                      </p>
                    )}
                    {item.extras.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {item.extras.length} extras available
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Console Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Console Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm font-mono mb-2">
                You can also use these commands in the browser console:
              </p>
              <div className="space-y-1 text-sm font-mono">
                <p>
                  <span className="text-blue-600">seedDB()</span> - Seed
                  database with sample data
                </p>
                <p>
                  <span className="text-blue-600">verifyDB()</span> - Verify
                  current database state
                </p>
                <p>
                  <span className="text-blue-600">clearDB()</span> - Clear all
                  data (with confirmation)
                </p>
                <p>
                  <span className="text-blue-600">resetDB()</span> - Clear and
                  reseed database
                </p>
                <p>
                  <span className="text-blue-600">getDBStats()</span> - Get
                  database statistics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
