import {
  orderService,
  menuItemService,
  categoryService,
} from "../services/firestore";
import {
  FirestoreUtils,
  FirestoreValidator,
  DEFAULTS,
  OrderSchema,
  MenuItemSchema,
  CategorySchema,
} from "../schemas/firestore";
import type {
  Order,
  //   MenuItem,
  //   Category,
  OrderStatus,
} from "../schemas/firestore";

// ============================================================================
// EXAMPLE: CREATING A NEW ORDER
// ============================================================================

export async function createNewOrderExample() {
  try {
    // Create order data with proper validation
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
          extras: ["Extra Cheese", "Bacon"],
          notes: "Well done please",
        },
        {
          id: "item-2",
          name: "French Fries",
          price: 4.99,
          quantity: 1,
          size: "Regular",
          extras: [],
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
        apartment: "Apt 4B",
        instructions: "Ring doorbell twice",
      },
      notes: "Please deliver to back entrance",
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    };

    // Calculate totals
    const totals = FirestoreUtils.calculateOrderTotals(
      orderData.items,
      DEFAULTS.DELIVERY_FEE
    );

    const completeOrderData = {
      ...orderData,
      ...totals,
      deliveryFee: DEFAULTS.DELIVERY_FEE,
    };

    // Validate the order data
    const validationResult = FirestoreValidator.validateWithError(
      OrderSchema,
      completeOrderData,
      "Creating new order"
    );

    if (!validationResult.success) {
      console.error("Order validation failed:", validationResult.error);
      return;
    }

    // Create the order in Firestore
    const orderId = await orderService.createOrder(completeOrderData);
    console.log("Order created successfully with ID:", orderId);

    return orderId;
  } catch (error) {
    console.error("Error creating order:", error);
  }
}

// ============================================================================
// EXAMPLE: CREATING A NEW MENU ITEM
// ============================================================================

export async function createNewMenuItemExample() {
  try {
    const menuItemData = {
      name: "Margherita Pizza",
      category: "Pizza",
      price: 14.99,
      description:
        "Fresh mozzarella, tomato sauce, and basil on our signature crust",
      comesWith: "Garlic bread, Parmesan cheese",
      available: true,
      image: "https://example.com/pizza-margherita.jpg",
      sizes: [
        { id: "small-10", name: 'Small (10")', price: 0 },
        { id: "medium-12", name: 'Medium (12")', price: 3.99 },
        { id: "large-14", name: 'Large (14")', price: 6.99 },
        { id: "family-16", name: 'Family (16")', price: 9.99 },
      ],
      extras: [
        { id: "extra-cheese", name: "Extra Cheese", price: 2.0 },
        { id: "pepperoni", name: "Pepperoni", price: 2.5 },
        { id: "mushrooms", name: "Mushrooms", price: 1.5 },
        { id: "olives", name: "Olives", price: 1.5 },
        { id: "bell-peppers", name: "Bell Peppers", price: 1.5 },
      ],
    };

    // Validate the menu item data
    const validationResult = FirestoreValidator.validateWithError(
      MenuItemSchema,
      menuItemData,
      "Creating new menu item"
    );

    if (!validationResult.success) {
      console.error("Menu item validation failed:", validationResult.error);
      return;
    }

    // Create the menu item in Firestore
    const itemId = await menuItemService.createMenuItem(menuItemData);
    console.log("Menu item created successfully with ID:", itemId);

    return itemId;
  } catch (error) {
    console.error("Error creating menu item:", error);
  }
}

// ============================================================================
// EXAMPLE: CREATING A NEW CATEGORY
// ============================================================================

export async function createNewCategoryExample() {
  try {
    const categoryData = {
      name: "Desserts",
      description: "Sweet treats and desserts",
      color: "#FF6B6B",
      sortOrder: 5,
      active: true,
    };

    // Validate the category data
    const validationResult = FirestoreValidator.validateWithError(
      CategorySchema,
      categoryData,
      "Creating new category"
    );

    if (!validationResult.success) {
      console.error("Category validation failed:", validationResult.error);
      return;
    }

    // Create the category in Firestore
    const categoryId = await categoryService.createCategory(categoryData);
    console.log("Category created successfully with ID:", categoryId);

    return categoryId;
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

// ============================================================================
// EXAMPLE: UPDATING ORDER STATUS
// ============================================================================

export async function updateOrderStatusExample(orderId: string) {
  try {
    // Update order status with proper validation
    const newStatus: OrderStatus = "preparing";

    await orderService.updateOrderStatus(orderId, newStatus);
    console.log(`Order ${orderId} status updated to: ${newStatus}`);

    // Get the updated order to verify
    const updatedOrder = await orderService.getOrder(orderId);
    if (updatedOrder) {
      console.log("Updated order:", {
        id: updatedOrder.id,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
}

// ============================================================================
// EXAMPLE: REAL-TIME ORDER LISTENING
// ============================================================================

export function subscribeToOrdersExample() {
  // Subscribe to real-time order updates
  const unsubscribe = orderService.subscribeToOrders((orders) => {
    console.log("Real-time orders update:", orders.length, "orders");

    // Group orders by status
    const ordersByStatus = orders.reduce((acc, order) => {
      const status = order.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(order);
      return acc;
    }, {} as Record<OrderStatus, Order[]>);

    console.log("Orders by status:", ordersByStatus);
  });

  // Return unsubscribe function for cleanup
  return unsubscribe;
}

// ============================================================================
// EXAMPLE: BATCH OPERATIONS
// ============================================================================

export async function batchOperationsExample() {
  try {
    // Create multiple menu items in a batch
    const menuItems = [
      {
        name: "Caesar Salad",
        category: "Salad",
        price: 8.99,
        description: "Fresh romaine lettuce with Caesar dressing",
        comesWith: "Croutons, parmesan cheese",
        available: true,
        image: "https://example.com/caesar-salad.jpg",
        sizes: [{ id: "regular", name: "Regular", price: 0 }],
        extras: [
          { id: "grilled-chicken", name: "Grilled Chicken", price: 3.99 },
          { id: "shrimp", name: "Shrimp", price: 4.99 },
        ],
      },
      {
        name: "Chicken Wings",
        category: "Appetizer",
        price: 11.99,
        description: "Crispy wings with your choice of sauce",
        comesWith: "Celery sticks, ranch dressing",
        available: true,
        image: "https://example.com/chicken-wings.jpg",
        sizes: [
          { id: "6-wings", name: "6 Wings", price: 0 },
          { id: "12-wings", name: "12 Wings", price: 5.99 },
          { id: "24-wings", name: "24 Wings", price: 10.99 },
        ],
        extras: [
          { id: "extra-sauce", name: "Extra Sauce", price: 0.99 },
          { id: "blue-cheese", name: "Blue Cheese", price: 1.49 },
        ],
      },
    ];

    // Validate all menu items
    for (const item of menuItems) {
      const validationResult = FirestoreValidator.validateWithError(
        MenuItemSchema,
        item,
        `Validating menu item: ${item.name}`
      );

      if (!validationResult.success) {
        console.error("Menu item validation failed:", validationResult.error);
        return;
      }
    }

    // Create all items
    const createdIds = [];
    for (const item of menuItems) {
      const itemId = await menuItemService.createMenuItem(item);
      createdIds.push(itemId);
      console.log(`Created menu item: ${item.name} with ID: ${itemId}`);
    }

    console.log("All menu items created successfully:", createdIds);
    return createdIds;
  } catch (error) {
    console.error("Error in batch operations:", error);
  }
}

// ============================================================================
// EXAMPLE: DATA VALIDATION UTILITIES
// ============================================================================

export function validationUtilitiesExample() {
  // Email validation
  const emails = ["john@example.com", "invalid-email", "test@test.co.uk"];

  emails.forEach((email) => {
    const isValid = FirestoreUtils.isValidEmail(email);
    console.log(`Email "${email}" is ${isValid ? "valid" : "invalid"}`);
  });

  // Phone validation
  const phones = [
    "+1234567890",
    "123-456-7890",
    "invalid-phone",
    "+44 20 7946 0958",
  ];

  phones.forEach((phone) => {
    const isValid = FirestoreUtils.isValidPhone(phone);
    console.log(`Phone "${phone}" is ${isValid ? "valid" : "invalid"}`);
  });

  // Data sanitization
  const dataWithUndefined = {
    name: "Test Item",
    price: 10.99,
    description: "Test description",
    category: undefined,
    images: undefined,
  };

  const sanitizedData = FirestoreUtils.sanitizeForFirestore(dataWithUndefined);
  console.log("Sanitized data:", sanitizedData);
}

// ============================================================================
// EXAMPLE: ERROR HANDLING
// ============================================================================

export async function errorHandlingExample() {
  try {
    // Try to create an invalid order
    const invalidOrderData = {
      orderNumber: "",
      customer: {
        name: "", // Invalid: empty name
        phone: "123", // Invalid: too short
        email: "invalid-email", // Invalid: not an email
      },
      items: [], // Invalid: no items
      orderType: "invalid-type" as any, // Invalid: not a valid order type
      status: "invalid-status" as any, // Invalid: not a valid status
      paymentStatus: "invalid-payment" as any, // Invalid: not a valid payment status
      subtotal: -10, // Invalid: negative amount
      tax: -1, // Invalid: negative amount
      deliveryFee: -5, // Invalid: negative amount
      total: -16, // Invalid: negative amount
    };

    const validationResult = FirestoreValidator.validateWithError(
      OrderSchema,
      invalidOrderData,
      "Creating invalid order"
    );

    if (!validationResult.success) {
      console.log(
        "Validation correctly caught errors:",
        validationResult.error
      );
    } else {
      console.log("Unexpected: validation passed for invalid data");
    }
  } catch (error) {
    console.error("Error in error handling example:", error);
  }
}
