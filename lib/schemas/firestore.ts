import { z } from "zod";

// ============================================================================
// BASE SCHEMAS
// ============================================================================

// Order Status Enum
export const OrderStatusSchema = z.enum([
  "pending",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

// Order Type Enum
export const OrderTypeSchema = z.enum(["delivery", "pickup"]);
export type OrderType = z.infer<typeof OrderTypeSchema>;

// Payment Status Enum
export const PaymentStatusSchema = z.enum(["pending", "paid", "failed"]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

// ============================================================================
// MENU ITEM SCHEMAS
// ============================================================================

// Size Option Schema
export const SizeOptionSchema = z.object({
  id: z.string().min(1, "Size id is required"),
  name: z.string().min(1, "Size name is required"),
  price: z.number(), // Allow negative values for size pricing adjustments
});

export type SizeOption = z.infer<typeof SizeOptionSchema>;

// Extra Option Schema
export const ExtraOptionSchema = z.object({
  id: z.string().min(1, "Extra id is required"),
  name: z.string().min(1, "Extra name is required"),
  price: z.number().min(0, "Price must be non-negative"),
});

export type ExtraOption = z.infer<typeof ExtraOptionSchema>;

// Menu Item Schema
export const MenuItemSchema = z.object({
  id: z.string().optional(), // Firestore document ID
  name: z.string().min(1, "Item name is required").max(100, "Name too long"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be non-negative"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long"),
  comesWith: z.string().optional(),
  available: z.boolean().default(true),
  image: z.string().url("Invalid image URL"),
  sizes: z.array(SizeOptionSchema).min(1, "At least one size is required"),
  extras: z.array(ExtraOptionSchema).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

// ============================================================================
// ORDER SCHEMAS
// ============================================================================

// Order Item Schema
export const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required"),
  price: z.number().min(0, "Price must be non-negative"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  size: z.string().optional(),
  extras: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

// Delivery Address Schema
export const DeliveryAddressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  apartment: z.string().optional(),
  instructions: z.string().optional(),
});

export type DeliveryAddress = z.infer<typeof DeliveryAddressSchema>;

// Customer Schema
export const CustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required").optional(),
});

export type Customer = z.infer<typeof CustomerSchema>;

// Order Schema
export const OrderSchema = z.object({
  id: z.string().optional(), // Firestore document ID
  orderNumber: z.string().min(1, "Order number is required"),
  customer: CustomerSchema,
  items: z.array(OrderItemSchema).min(1, "At least one item required"),
  orderType: OrderTypeSchema,
  status: OrderStatusSchema.default("pending"),
  paymentStatus: PaymentStatusSchema.default("pending"),
  subtotal: z.number().min(0, "Subtotal must be non-negative"),
  tax: z.number().min(0, "Tax must be non-negative"),
  deliveryFee: z.number().min(0, "Delivery fee must be non-negative"),
  total: z.number().min(0, "Total must be non-negative"),
  deliveryAddress: DeliveryAddressSchema.optional(),
  notes: z.string().optional(),
  estimatedDeliveryTime: z.date().optional(),
  actualDeliveryTime: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  paidAt: z.date().optional(),
  cancelledAt: z.date().optional(),
  cancelledBy: z.string().optional(),
  cancelledReason: z.string().optional(),
});

export type Order = z.infer<typeof OrderSchema>;

// ============================================================================
// CATEGORY SCHEMAS
// ============================================================================

export const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Category name is required").max(50, "Name too long"),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .optional(),
  sortOrder: z.number().default(0),
  active: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Category = z.infer<typeof CategorySchema>;

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const UserRoleSchema = z.enum(["admin", "manager", "staff"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Valid email required"),
  name: z.string().min(1, "Name is required"),
  role: UserRoleSchema.default("staff"),
  active: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  lastLoginAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================================================
// NOTIFICATION SCHEMAS
// ============================================================================

export const NotificationTypeSchema = z.enum([
  "new_order",
  "order_status_change",
  "payment_received",
  "delivery_update",
  "system_alert",
]);

export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NotificationSchema = z.object({
  id: z.string().optional(),
  type: NotificationTypeSchema,
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  userId: z.string().optional(),
  orderId: z.string().optional(),
  read: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

export type Notification = z.infer<typeof NotificationSchema>;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export class FirestoreValidator {
  // Menu Item Validation
  static validateMenuItem(data: unknown): MenuItem {
    return MenuItemSchema.parse(data);
  }

  static validateMenuItemPartial(data: unknown): Partial<MenuItem> {
    return MenuItemSchema.partial().parse(data);
  }

  // Order Validation
  static validateOrder(data: unknown): Order {
    return OrderSchema.parse(data);
  }

  static validateOrderPartial(data: unknown): Partial<Order> {
    return OrderSchema.partial().parse(data);
  }

  // Category Validation
  static validateCategory(data: unknown): Category {
    return CategorySchema.parse(data);
  }

  static validateCategoryPartial(data: unknown): Partial<Category> {
    return CategorySchema.partial().parse(data);
  }

  // User Validation
  static validateUser(data: unknown): User {
    return UserSchema.parse(data);
  }

  static validateUserPartial(data: unknown): Partial<User> {
    return UserSchema.partial().parse(data);
  }

  // Notification Validation
  static validateNotification(data: unknown): Notification {
    return NotificationSchema.parse(data);
  }

  static validateNotificationPartial(data: unknown): Partial<Notification> {
    return NotificationSchema.partial().parse(data);
  }

  // Generic validation with error handling
  static validateWithError<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context?: string
  ): { success: true; data: T } | { success: false; error: string } {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map((err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return {
          success: false,
          error: context ? `${context}: ${errorMessage}` : errorMessage,
        };
      }
      return {
        success: false,
        error: context
          ? `${context}: Unknown validation error`
          : "Unknown validation error",
      };
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const FirestoreUtils = {
  // Generate order number
  generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp.slice(-6)}-${random}`;
  },

  // Calculate order totals
  calculateOrderTotals(
    items: OrderItem[],
    deliveryFee: number = 0
  ): {
    subtotal: number;
    tax: number;
    total: number;
  } {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax + deliveryFee;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  },

  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number format
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  // Sanitize data for Firestore
  sanitizeForFirestore<T extends Record<string, any>>(data: T): T {
    const sanitized = { ...data };

    // Remove undefined values
    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });

    return sanitized;
  },

  // Convert Firestore timestamp to Date
  timestampToDate(timestamp: any): Date {
    if (timestamp?.toDate) {
      return timestamp.toDate();
    }
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return new Date(timestamp);
  },

  // Convert Date to Firestore timestamp
  dateToTimestamp(date: Date) {
    return {
      seconds: Math.floor(date.getTime() / 1000),
      nanoseconds: (date.getTime() % 1000) * 1000000,
    };
  },
};

// ============================================================================
// COLLECTION NAMES
// ============================================================================

export const COLLECTIONS = {
  ORDERS: "orders",
  MENU_ITEMS: "menuItems",
  CATEGORIES: "categories",
  USERS: "users",
  NOTIFICATIONS: "notifications",
  SETTINGS: "settings",
} as const;

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULTS = {
  ORDER_STATUS: "pending" as OrderStatus,
  PAYMENT_STATUS: "pending" as PaymentStatus,
  ORDER_TYPE: "delivery" as OrderType,
  USER_ROLE: "staff" as UserRole,
  TAX_RATE: 0.08,
  DELIVERY_FEE: 2.99,
} as const;
