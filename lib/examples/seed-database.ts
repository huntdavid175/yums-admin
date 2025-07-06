import { categoryService, menuItemService } from "../services/firestore";
import type { Category, MenuItem } from "../schemas/firestore";

function toId(str: string) {
  return str.trim().toLowerCase().replace(/\s+/g, "-");
}

// ============================================================================
// SEED CATEGORIES
// ============================================================================

const seedCategories: Omit<Category, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Appetizers",
    description: "Start your meal with our delicious appetizers",
    color: "#FF6B6B",
    sortOrder: 1,
    active: true,
  },
  {
    name: "Main Course",
    description: "Our signature main dishes",
    color: "#4ECDC4",
    sortOrder: 2,
    active: true,
  },
  {
    name: "Pizza",
    description: "Fresh-baked pizzas with premium toppings",
    color: "#45B7D1",
    sortOrder: 3,
    active: true,
  },
  {
    name: "Pasta",
    description: "Authentic Italian pasta dishes",
    color: "#96CEB4",
    sortOrder: 4,
    active: true,
  },
  {
    name: "Salads",
    description: "Fresh and healthy salad options",
    color: "#FFEAA7",
    sortOrder: 5,
    active: true,
  },
  {
    name: "Desserts",
    description: "Sweet treats to end your meal",
    color: "#DDA0DD",
    sortOrder: 6,
    active: true,
  },
  {
    name: "Beverages",
    description: "Refreshing drinks and beverages",
    color: "#98D8C8",
    sortOrder: 7,
    active: true,
  },
  {
    name: "Side Dishes",
    description: "Perfect accompaniments to your main dish",
    color: "#F7DC6F",
    sortOrder: 8,
    active: true,
  },
];

// ============================================================================
// SEED MENU ITEMS
// ============================================================================

const seedMenuItems: Omit<MenuItem, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Classic Burger",
    category: "Main Course",
    price: 12.99,
    description:
      "Juicy beef patty with lettuce, tomato, and cheese on a toasted bun",
    comesWith: "French Fries, Pickle, Coleslaw",
    available: true,
    image: "/placeholder.svg?height=200&width=300",
    sizes: [
      { name: "Regular", price: 0 },
      { name: "Large", price: 2.99 },
      { name: "Extra Large", price: 4.99 },
    ].map((s) => ({ ...s, id: toId(s.name) })),
    extras: [
      { name: "Extra Cheese", price: 1.5 },
      { name: "Bacon", price: 2.99 },
      { name: "Avocado", price: 2.5 },
      { name: "Extra Patty", price: 4.99 },
    ].map((e) => ({ ...e, id: toId(e.name) })),
  },
  {
    name: "Margherita Pizza",
    category: "Pizza",
    price: 14.99,
    description:
      "Fresh mozzarella, tomato sauce, and basil on our signature crust",
    comesWith: "Garlic Bread, Parmesan Cheese",
    available: true,
    image: "/placeholder.svg?height=200&width=300",
    sizes: [
      { name: 'Small (10")', price: 0 },
      { name: 'Medium (12")', price: 3.99 },
      { name: 'Large (14")', price: 6.99 },
      { name: 'Family (16")', price: 9.99 },
    ].map((s) => ({ ...s, id: toId(s.name) })),
    extras: [
      { name: "Extra Cheese", price: 2.0 },
      { name: "Pepperoni", price: 2.5 },
      { name: "Mushrooms", price: 1.5 },
      { name: "Olives", price: 1.5 },
      { name: "Bell Peppers", price: 1.5 },
    ].map((e) => ({ ...e, id: toId(e.name) })),
  },
  {
    name: "Caesar Salad",
    category: "Salads",
    price: 8.99,
    description:
      "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
    comesWith: "Croutons, Parmesan Cheese",
    available: true,
    image: "/placeholder.svg?height=200&width=300",
    sizes: [
      { name: "Regular", price: 0 },
      { name: "Large", price: 2.99 },
    ].map((s) => ({ ...s, id: toId(s.name) })),
    extras: [
      { name: "Grilled Chicken", price: 3.99 },
      { name: "Shrimp", price: 4.99 },
      { name: "Extra Dressing", price: 0.99 },
    ].map((e) => ({ ...e, id: toId(e.name) })),
  },
  {
    name: "Chicken Wings",
    category: "Appetizers",
    price: 11.99,
    description: "Crispy wings with your choice of sauce",
    comesWith: "Celery Sticks, Ranch Dressing",
    available: true,
    image: "/placeholder.svg?height=200&width=300",
    sizes: [
      { name: "6 Wings", price: 0 },
      { name: "12 Wings", price: 5.99 },
      { name: "24 Wings", price: 10.99 },
    ].map((s) => ({ ...s, id: toId(s.name) })),
    extras: [
      { name: "Extra Sauce", price: 0.99 },
      { name: "Blue Cheese", price: 1.49 },
      { name: "Hot Sauce", price: 0.5 },
    ].map((e) => ({ ...e, id: toId(e.name) })),
  },
  {
    name: "Spaghetti Carbonara",
    category: "Pasta",
    price: 13.99,
    description:
      "Classic Italian pasta with eggs, cheese, pancetta, and black pepper",
    comesWith: "Garlic Bread, Parmesan Cheese",
    available: true,
    image: "/placeholder.svg?height=200&width=300",
    sizes: [
      { name: "Regular", price: 0 },
      { name: "Large", price: 3.99 },
    ].map((s) => ({ ...s, id: toId(s.name) })),
    extras: [
      { name: "Extra Parmesan", price: 1.0 },
      { name: "Grilled Chicken", price: 3.99 },
      { name: "Shrimp", price: 4.99 },
    ].map((e) => ({ ...e, id: toId(e.name) })),
  },
  {
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 6.99,
    description:
      "Warm chocolate cake with molten center, served with vanilla ice cream",
    comesWith: "Vanilla Ice Cream, Fresh Berries",
    available: true,
    image: "/placeholder.svg?height=200&width=300",
    sizes: [
      { name: "Regular", price: 0 },
      { name: "Large", price: 2.99 },
    ].map((s) => ({ ...s, id: toId(s.name) })),
    extras: [
      { name: "Extra Ice Cream", price: 1.99 },
      { name: "Whipped Cream", price: 0.99 },
      { name: "Chocolate Sauce", price: 0.99 },
    ].map((e) => ({ ...e, id: toId(e.name) })),
  },
  {
    name: "Fresh Lemonade",
    category: "Beverages",
    price: 3.99,
    description: "Freshly squeezed lemonade with a hint of mint",
    comesWith: "Lemon Slice, Mint Sprig",
    available: true,
    image: "/placeholder.svg?height=200&width=300",
    sizes: [
      { name: "Regular", price: 0 },
      { name: "Large", price: 1.99 },
    ].map((s) => ({ ...s, id: toId(s.name) })),
    extras: [
      { name: "Extra Mint", price: 0.5 },
      { name: "Strawberry", price: 1.0 },
      { name: "Raspberry", price: 1.0 },
    ].map((e) => ({ ...e, id: toId(e.name) })),
  },
  {
    name: "Garlic Bread",
    category: "Side Dishes",
    price: 4.99,
    description: "Toasted bread with garlic butter and herbs",
    comesWith: "Marinara Sauce",
    available: true,
    image: "/placeholder.svg?height=200&width=300",
    sizes: [
      { name: "Regular", price: 0 },
      { name: "Large", price: 1.99 },
    ].map((s) => ({ ...s, id: toId(s.name) })),
    extras: [
      { name: "Extra Cheese", price: 1.0 },
      { name: "Extra Garlic", price: 0.5 },
      { name: "Parmesan", price: 1.0 },
    ].map((e) => ({ ...e, id: toId(e.name) })),
  },
];

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed categories
    console.log("📂 Creating categories...");
    const categoryIds: string[] = [];

    for (const category of seedCategories) {
      try {
        const categoryId = await categoryService.createCategory(category);
        categoryIds.push(categoryId);
        console.log(
          `✅ Created category: ${category.name} (ID: ${categoryId})`
        );
      } catch (error) {
        console.error(`❌ Failed to create category ${category.name}:`, error);
      }
    }

    // Seed menu items
    console.log("🍽️ Creating menu items...");

    for (const menuItem of seedMenuItems) {
      try {
        const itemId = await menuItemService.createMenuItem(menuItem);
        console.log(`✅ Created menu item: ${menuItem.name} (ID: ${itemId})`);
      } catch (error) {
        console.error(`❌ Failed to create menu item ${menuItem.name}:`, error);
      }
    }

    console.log("🎉 Database seeding completed!");
    console.log(
      `📊 Created ${categoryIds.length} categories and ${seedMenuItems.length} menu items`
    );

    return {
      categoriesCreated: categoryIds.length,
      menuItemsCreated: seedMenuItems.length,
    };
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
}

// ============================================================================
// CLEAR DATABASE (USE WITH CAUTION)
// ============================================================================

export async function clearDatabase() {
  console.log("🗑️ Clearing database...");

  try {
    // Get all categories and menu items
    const categories = await categoryService.getCategories();
    const menuItems = await menuItemService.getMenuItems();

    // Delete all menu items
    console.log(`🗑️ Deleting ${menuItems.length} menu items...`);
    for (const item of menuItems) {
      if (item.id) {
        await menuItemService.deleteMenuItem(item.id);
      }
    }

    // Delete all categories
    console.log(`🗑️ Deleting ${categories.length} categories...`);
    for (const category of categories) {
      if (category.id) {
        await categoryService.deleteCategory(category.id);
      }
    }

    console.log("✅ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Failed to clear database:", error);
    throw error;
  }
}

// ============================================================================
// VERIFY SEEDING
// ============================================================================

export async function verifySeeding() {
  console.log("🔍 Verifying database seeding...");

  try {
    const categories = await categoryService.getCategories();
    const menuItems = await menuItemService.getMenuItems();

    console.log(`📊 Database contains:`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${menuItems.length} menu items`);

    // Show categories
    console.log("\n📂 Categories:");
    categories.forEach((cat) => {
      const itemCount = menuItems.filter(
        (item) => item.category === cat.name
      ).length;
      console.log(`   - ${cat.name} (${itemCount} items)`);
    });

    // Show menu items by category
    console.log("\n🍽️ Menu Items by Category:");
    const itemsByCategory = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    Object.entries(itemsByCategory).forEach(([category, items]) => {
      console.log(`   ${category}:`);
      items.forEach((item) => {
        console.log(`     - ${item.name} ($${item.price})`);
      });
    });

    return {
      categories: categories.length,
      menuItems: menuItems.length,
    };
  } catch (error) {
    console.error("❌ Failed to verify seeding:", error);
    throw error;
  }
}

// ============================================================================
// RUN SEEDING (if this file is executed directly)
// ============================================================================

if (typeof window === "undefined") {
  // Only run in Node.js environment
  seedDatabase()
    .then(() => verifySeeding())
    .then(() => {
      console.log("✅ Seeding and verification completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}
