import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  // writeBatch,
  // runTransaction,
  Timestamp,
} from "firebase/firestore";
import firebaseApp from "../firebase";
import {
  COLLECTIONS,
  // DEFAULTS,
  FirestoreValidator,
  FirestoreUtils,
  type Order,
  type MenuItem,
  type Category,
  // type User,
  // type Notification,
  type OrderStatus,
  type PaymentStatus,
} from "../schemas/firestore";

// Initialize Firestore
const db = getFirestore(firebaseApp);

// ============================================================================
// ORDER SERVICE
// ============================================================================

export class OrderService {
  private collection = collection(db, COLLECTIONS.ORDERS);

  // Create a new order
  async createOrder(
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      // Validate order data
      const validatedOrder = FirestoreValidator.validateOrder({
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Sanitize data for Firestore
      const sanitizedOrder =
        FirestoreUtils.sanitizeForFirestore(validatedOrder);

      // Add to Firestore
      const docRef = await addDoc(this.collection, {
        ...sanitizedOrder,
        createdAt: Timestamp.fromDate(sanitizedOrder.createdAt),
        updatedAt: Timestamp.fromDate(sanitizedOrder.updatedAt),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(this.collection, orderId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      const order = {
        id: docSnap.id,
        ...data,
        createdAt: FirestoreUtils.timestampToDate(data.createdAt),
        updatedAt: FirestoreUtils.timestampToDate(data.updatedAt),
        paidAt: data.paidAt
          ? FirestoreUtils.timestampToDate(data.paidAt)
          : undefined,
        cancelledAt: data.cancelledAt
          ? FirestoreUtils.timestampToDate(data.cancelledAt)
          : undefined,
        estimatedDeliveryTime: data.estimatedDeliveryTime
          ? FirestoreUtils.timestampToDate(data.estimatedDeliveryTime)
          : undefined,
        actualDeliveryTime: data.actualDeliveryTime
          ? FirestoreUtils.timestampToDate(data.actualDeliveryTime)
          : undefined,
      };

      return FirestoreValidator.validateOrder(order);
    } catch (error) {
      console.error("Error getting order:", error);
      throw new Error("Failed to get order");
    }
  }

  // Get all orders
  async getOrders(limitCount: number = 50): Promise<Order[]> {
    try {
      const q = query(
        this.collection,
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return FirestoreValidator.validateOrder({
          id: doc.id,
          ...data,
          createdAt: FirestoreUtils.timestampToDate(data.createdAt),
          updatedAt: FirestoreUtils.timestampToDate(data.updatedAt),
          paidAt: data.paidAt
            ? FirestoreUtils.timestampToDate(data.paidAt)
            : undefined,
          cancelledAt: data.cancelledAt
            ? FirestoreUtils.timestampToDate(data.cancelledAt)
            : undefined,
          estimatedDeliveryTime: data.estimatedDeliveryTime
            ? FirestoreUtils.timestampToDate(data.estimatedDeliveryTime)
            : undefined,
          actualDeliveryTime: data.actualDeliveryTime
            ? FirestoreUtils.timestampToDate(data.actualDeliveryTime)
            : undefined,
        });
      });
    } catch (error) {
      console.error("Error getting orders:", error);
      throw new Error("Failed to get orders");
    }
  }

  // Get orders by status
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      const q = query(
        this.collection,
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return FirestoreValidator.validateOrder({
          id: doc.id,
          ...data,
          createdAt: FirestoreUtils.timestampToDate(data.createdAt),
          updatedAt: FirestoreUtils.timestampToDate(data.updatedAt),
          paidAt: data.paidAt
            ? FirestoreUtils.timestampToDate(data.paidAt)
            : undefined,
          cancelledAt: data.cancelledAt
            ? FirestoreUtils.timestampToDate(data.cancelledAt)
            : undefined,
          estimatedDeliveryTime: data.estimatedDeliveryTime
            ? FirestoreUtils.timestampToDate(data.estimatedDeliveryTime)
            : undefined,
          actualDeliveryTime: data.actualDeliveryTime
            ? FirestoreUtils.timestampToDate(data.actualDeliveryTime)
            : undefined,
        });
      });
    } catch (error) {
      console.error("Error getting orders by status:", error);
      throw new Error("Failed to get orders by status");
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const docRef = doc(this.collection, orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.fromDate(new Date()),
        ...(status === "delivered" && {
          actualDeliveryTime: Timestamp.fromDate(new Date()),
        }),
        ...(status === "cancelled" && {
          cancelledAt: Timestamp.fromDate(new Date()),
        }),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw new Error("Failed to update order status");
    }
  }

  // Update payment status
  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus
  ): Promise<void> {
    try {
      const docRef = doc(this.collection, orderId);
      await updateDoc(docRef, {
        paymentStatus,
        updatedAt: Timestamp.fromDate(new Date()),
        ...(paymentStatus === "paid" && {
          paidAt: Timestamp.fromDate(new Date()),
        }),
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw new Error("Failed to update payment status");
    }
  }

  // Delete order
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const docRef = doc(this.collection, orderId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw new Error("Failed to delete order");
    }
  }

  // Real-time listener for orders
  subscribeToOrders(callback: (orders: Order[]) => void): () => void {
    const q = query(this.collection, orderBy("createdAt", "desc"));

    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return FirestoreValidator.validateOrder({
          id: doc.id,
          ...data,
          createdAt: FirestoreUtils.timestampToDate(data.createdAt),
          updatedAt: FirestoreUtils.timestampToDate(data.updatedAt),
          paidAt: data.paidAt
            ? FirestoreUtils.timestampToDate(data.paidAt)
            : undefined,
          cancelledAt: data.cancelledAt
            ? FirestoreUtils.timestampToDate(data.cancelledAt)
            : undefined,
          estimatedDeliveryTime: data.estimatedDeliveryTime
            ? FirestoreUtils.timestampToDate(data.estimatedDeliveryTime)
            : undefined,
          actualDeliveryTime: data.actualDeliveryTime
            ? FirestoreUtils.timestampToDate(data.actualDeliveryTime)
            : undefined,
        });
      });

      callback(orders);
    });
  }
}

// ============================================================================
// MENU ITEM SERVICE
// ============================================================================

export class MenuItemService {
  private collection = collection(db, COLLECTIONS.MENU_ITEMS);

  // Create a new menu item
  async createMenuItem(
    menuItemData: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const validatedMenuItem = FirestoreValidator.validateMenuItem({
        ...menuItemData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const sanitizedMenuItem =
        FirestoreUtils.sanitizeForFirestore(validatedMenuItem);

      const docRef = await addDoc(this.collection, {
        ...sanitizedMenuItem,
        createdAt: Timestamp.fromDate(sanitizedMenuItem.createdAt),
        updatedAt: Timestamp.fromDate(sanitizedMenuItem.updatedAt),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating menu item:", error);
      throw new Error("Failed to create menu item");
    }
  }

  // Get menu item by ID
  async getMenuItem(itemId: string): Promise<MenuItem | null> {
    try {
      const docRef = doc(this.collection, itemId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      const menuItem = {
        id: docSnap.id,
        ...data,
        createdAt: FirestoreUtils.timestampToDate(data.createdAt),
        updatedAt: FirestoreUtils.timestampToDate(data.updatedAt),
      };

      return FirestoreValidator.validateMenuItem(menuItem);
    } catch (error) {
      console.error("Error getting menu item:", error);
      throw new Error("Failed to get menu item");
    }
  }

  // Get all menu items
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const querySnapshot = await getDocs(this.collection);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return FirestoreValidator.validateMenuItem({
          id: doc.id,
          ...data,
          createdAt: FirestoreUtils.timestampToDate(data.createdAt),
          updatedAt: FirestoreUtils.timestampToDate(data.updatedAt),
        });
      });
    } catch (error) {
      console.error("Error getting menu items:", error);
      throw new Error("Failed to get menu items");
    }
  }

  // Update menu item
  async updateMenuItem(
    itemId: string,
    updates: Partial<MenuItem>
  ): Promise<void> {
    try {
      const validatedUpdates =
        FirestoreValidator.validateMenuItemPartial(updates);
      const sanitizedUpdates = FirestoreUtils.sanitizeForFirestore({
        ...validatedUpdates,
        updatedAt: new Date(),
      });

      const docRef = doc(this.collection, itemId);
      await updateDoc(docRef, {
        ...sanitizedUpdates,
        updatedAt: Timestamp.fromDate(sanitizedUpdates.updatedAt),
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw new Error("Failed to update menu item");
    }
  }

  // Delete menu item
  async deleteMenuItem(itemId: string): Promise<void> {
    try {
      const docRef = doc(this.collection, itemId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw new Error("Failed to delete menu item");
    }
  }

  // Get menu items by category
  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    try {
      const q = query(
        this.collection,
        where("category", "==", category),
        where("available", "==", true)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return FirestoreValidator.validateMenuItem({
          id: doc.id,
          ...data,
          createdAt: FirestoreUtils.timestampToDate(data.createdAt),
          updatedAt: FirestoreUtils.timestampToDate(data.updatedAt),
        });
      });
    } catch (error) {
      console.error("Error getting menu items by category:", error);
      throw new Error("Failed to get menu items by category");
    }
  }
}

// ============================================================================
// CATEGORY SERVICE
// ============================================================================

export class CategoryService {
  private collection = collection(db, COLLECTIONS.CATEGORIES);

  // Create a new category
  async createCategory(
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const validatedCategory = FirestoreValidator.validateCategory({
        ...categoryData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const sanitizedCategory =
        FirestoreUtils.sanitizeForFirestore(validatedCategory);

      const docRef = await addDoc(this.collection, {
        ...sanitizedCategory,
        createdAt: Timestamp.fromDate(sanitizedCategory.createdAt),
        updatedAt: Timestamp.fromDate(sanitizedCategory.updatedAt),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  }

  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const q = query(this.collection, orderBy("sortOrder", "asc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return FirestoreValidator.validateCategory({
          id: doc.id,
          ...data,
          createdAt: FirestoreUtils.timestampToDate(data.createdAt),
          updatedAt: FirestoreUtils.timestampToDate(data.updatedAt),
        });
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      throw new Error("Failed to get categories");
    }
  }

  // Update category
  async updateCategory(
    categoryId: string,
    updates: Partial<Category>
  ): Promise<void> {
    try {
      const validatedUpdates =
        FirestoreValidator.validateCategoryPartial(updates);
      const sanitizedUpdates = FirestoreUtils.sanitizeForFirestore({
        ...validatedUpdates,
        updatedAt: new Date(),
      });

      const docRef = doc(this.collection, categoryId);
      await updateDoc(docRef, {
        ...sanitizedUpdates,
        updatedAt: Timestamp.fromDate(sanitizedUpdates.updatedAt),
      });
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("Failed to update category");
    }
  }

  // Delete category
  async deleteCategory(categoryId: string): Promise<void> {
    try {
      const docRef = doc(this.collection, categoryId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  }
}

// ============================================================================
// EXPORT SERVICE INSTANCES
// ============================================================================

export const orderService = new OrderService();
export const menuItemService = new MenuItemService();
export const categoryService = new CategoryService();
