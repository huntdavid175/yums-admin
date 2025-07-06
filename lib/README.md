# Firestore Schema System

This directory contains a comprehensive schema system for Firebase Firestore that provides type safety, validation, and utilities for your restaurant management application.

## 📁 File Structure

```
lib/
├── schemas/
│   └── firestore.ts          # Main schema definitions and validation
├── services/
│   └── firestore.ts          # Type-safe Firestore service classes
├── examples/
│   └── schema-usage.ts       # Usage examples and patterns
└── README.md                 # This documentation
```

## 🎯 Features

### ✅ **Type Safety**

- Full TypeScript support with Zod schemas
- Compile-time type checking
- IntelliSense and autocomplete

### ✅ **Runtime Validation**

- Zod-based schema validation
- Detailed error messages
- Data sanitization

### ✅ **Firestore Integration**

- Type-safe CRUD operations
- Real-time listeners
- Batch operations support

### ✅ **Utility Functions**

- Order number generation
- Total calculations
- Email/phone validation
- Data sanitization

## 🚀 Quick Start

### 1. Import Schemas and Services

```typescript
import {
  orderService,
  menuItemService,
  categoryService,
} from "@/lib/services/firestore";
import {
  FirestoreValidator,
  FirestoreUtils,
  DEFAULTS,
} from "@/lib/schemas/firestore";
```

### 2. Create a New Order

```typescript
const orderData = {
  orderNumber: FirestoreUtils.generateOrderNumber(),
  customer: {
    name: "John Doe",
    phone: "+1234567890",
    email: "john@example.com",
  },
  items: [
    {
      id: "item-1",
      name: "Classic Burger",
      price: 12.99,
      quantity: 2,
      size: "Large",
      extras: ["Extra Cheese"],
    },
  ],
  orderType: "delivery" as const,
  status: DEFAULTS.ORDER_STATUS,
  paymentStatus: DEFAULTS.PAYMENT_STATUS,
  deliveryAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  },
};

// Validate and create
const orderId = await orderService.createOrder(orderData);
```

### 3. Update Order Status

```typescript
await orderService.updateOrderStatus(orderId, "preparing");
```

### 4. Real-time Order Listening

```typescript
const unsubscribe = orderService.subscribeToOrders((orders) => {
  console.log("Orders updated:", orders.length);
});

// Cleanup when done
unsubscribe();
```

## 📋 Schema Definitions

### Order Schema

```typescript
interface Order {
  id?: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  orderType: "delivery" | "pickup";
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryAddress?: DeliveryAddress;
  notes?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  cancelledReason?: string;
}
```

### Menu Item Schema

```typescript
interface MenuItem {
  id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  comesWith?: string;
  available: boolean;
  images: string[];
  sizes: SizeOption[];
  extras: ExtraOption[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Schema

```typescript
interface Category {
  id?: string;
  name: string;
  description?: string;
  color?: string;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Validation

### Manual Validation

```typescript
import { FirestoreValidator, OrderSchema } from "@/lib/schemas/firestore";

// Validate complete data
const order = FirestoreValidator.validateOrder(orderData);

// Validate partial updates
const updates = FirestoreValidator.validateOrderPartial(updateData);

// Validate with error handling
const result = FirestoreValidator.validateWithError(
  OrderSchema,
  data,
  "Creating order"
);

if (!result.success) {
  console.error("Validation failed:", result.error);
}
```

### Automatic Validation

The service classes automatically validate data:

```typescript
// This will throw an error if data is invalid
await orderService.createOrder(orderData);
```

## 🛠️ Utility Functions

### Order Utilities

```typescript
// Generate unique order number
const orderNumber = FirestoreUtils.generateOrderNumber();

// Calculate order totals
const totals = FirestoreUtils.calculateOrderTotals(items, deliveryFee);

// Validate email
const isValidEmail = FirestoreUtils.isValidEmail("john@example.com");

// Validate phone
const isValidPhone = FirestoreUtils.isValidPhone("+1234567890");
```

### Data Sanitization

```typescript
// Remove undefined values for Firestore
const sanitized = FirestoreUtils.sanitizeForFirestore(data);

// Convert timestamps
const date = FirestoreUtils.timestampToDate(firestoreTimestamp);
const timestamp = FirestoreUtils.dateToTimestamp(new Date());
```

## 📊 Service Classes

### OrderService

```typescript
// CRUD operations
await orderService.createOrder(orderData);
const order = await orderService.getOrder(orderId);
await orderService.updateOrderStatus(orderId, "preparing");
await orderService.deleteOrder(orderId);

// Queries
const orders = await orderService.getOrders(50);
const pendingOrders = await orderService.getOrdersByStatus("pending");

// Real-time
const unsubscribe = orderService.subscribeToOrders(callback);
```

### MenuItemService

```typescript
// CRUD operations
await menuItemService.createMenuItem(itemData);
const item = await menuItemService.getMenuItem(itemId);
await menuItemService.updateMenuItem(itemId, updates);
await menuItemService.deleteMenuItem(itemId);

// Queries
const items = await menuItemService.getMenuItems();
const pizzaItems = await menuItemService.getMenuItemsByCategory("Pizza");
```

### CategoryService

```typescript
// CRUD operations
await categoryService.createCategory(categoryData);
const categories = await categoryService.getCategories();
await categoryService.updateCategory(categoryId, updates);
await categoryService.deleteCategory(categoryId);
```

## 🎨 Default Values

```typescript
import { DEFAULTS } from "@/lib/schemas/firestore";

DEFAULTS.ORDER_STATUS; // "pending"
DEFAULTS.PAYMENT_STATUS; // "pending"
DEFAULTS.ORDER_TYPE; // "delivery"
DEFAULTS.USER_ROLE; // "staff"
DEFAULTS.TAX_RATE; // 0.08
DEFAULTS.DELIVERY_FEE; // 2.99
```

## 🔍 Collection Names

```typescript
import { COLLECTIONS } from "@/lib/schemas/firestore";

COLLECTIONS.ORDERS; // "orders"
COLLECTIONS.MENU_ITEMS; // "menuItems"
COLLECTIONS.CATEGORIES; // "categories"
COLLECTIONS.USERS; // "users"
COLLECTIONS.NOTIFICATIONS; // "notifications"
COLLECTIONS.SETTINGS; // "settings"
```

## 🚨 Error Handling

### Validation Errors

```typescript
try {
  const order = await orderService.createOrder(invalidData);
} catch (error) {
  if (error.message.includes("validation")) {
    console.error("Data validation failed:", error.message);
  }
}
```

### Firestore Errors

```typescript
try {
  const order = await orderService.getOrder("non-existent-id");
} catch (error) {
  console.error("Firestore error:", error.message);
}
```

## 📝 Best Practices

### 1. Always Validate Data

```typescript
// ✅ Good
const validatedData = FirestoreValidator.validateOrder(orderData);
await orderService.createOrder(validatedData);

// ❌ Bad
await orderService.createOrder(unvalidatedData);
```

### 2. Use Type-Safe Enums

```typescript
// ✅ Good
const status: OrderStatus = "preparing";

// ❌ Bad
const status = "preparing"; // No type safety
```

### 3. Handle Real-time Listeners

```typescript
// ✅ Good
const unsubscribe = orderService.subscribeToOrders(callback);
// Clean up when component unmounts
return () => unsubscribe();

// ❌ Bad
orderService.subscribeToOrders(callback); // Memory leak
```

### 4. Use Batch Operations for Multiple Updates

```typescript
// ✅ Good
const batch = writeBatch(db);
batch.update(doc1, updates1);
batch.update(doc2, updates2);
await batch.commit();

// ❌ Bad
await updateDoc(doc1, updates1);
await updateDoc(doc2, updates2); // Separate operations
```

## 🔄 Migration Guide

### From Plain Objects

```typescript
// Old way
const order = {
  customerName: "John",
  items: [...],
  total: 25.99,
};

// New way
const order: Order = {
  customer: {
    name: "John",
    phone: "+1234567890",
  },
  items: [...],
  total: 25.99,
  // ... other required fields
};
```

### From Manual Validation

```typescript
// Old way
if (!order.customerName) {
  throw new Error("Customer name required");
}

// New way
const validatedOrder = FirestoreValidator.validateOrder(order);
```

## 🧪 Testing

### Unit Tests

```typescript
import { FirestoreValidator, OrderSchema } from "@/lib/schemas/firestore";

describe("Order Validation", () => {
  it("should validate valid order", () => {
    const validOrder = {
      /* valid order data */
    };
    const result = FirestoreValidator.validateWithError(
      OrderSchema,
      validOrder
    );
    expect(result.success).toBe(true);
  });

  it("should reject invalid order", () => {
    const invalidOrder = {
      /* invalid order data */
    };
    const result = FirestoreValidator.validateWithError(
      OrderSchema,
      invalidOrder
    );
    expect(result.success).toBe(false);
  });
});
```

### Integration Tests

```typescript
import { orderService } from "@/lib/services/firestore";

describe("OrderService", () => {
  it("should create and retrieve order", async () => {
    const orderId = await orderService.createOrder(validOrderData);
    const order = await orderService.getOrder(orderId);
    expect(order).toBeDefined();
    expect(order?.id).toBe(orderId);
  });
});
```

## 📚 Additional Resources

- [Zod Documentation](https://zod.dev/)
- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

When adding new schemas or services:

1. Define the Zod schema in `schemas/firestore.ts`
2. Add validation methods to `FirestoreValidator`
3. Create service class in `services/firestore.ts`
4. Add examples in `examples/schema-usage.ts`
5. Update this README

## 📄 License

This schema system is part of the restaurant management application and follows the same license terms.
