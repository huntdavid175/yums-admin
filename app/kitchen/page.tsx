"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  ChefHat,
  Clock,
  Timer,
  CheckCircle,
  AlertCircle,
  Utensils,
  MoreHorizontal,
  MapPin,
  Phone,
  X,
  DollarSign,
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import firebaseApp from "@/lib/firebase";
import { formatRelativeTime, capitalizeStatus } from "@/helpers/helpers";
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "preparing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ready":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "normal":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getItemStatusIcon = (status: string) => {
  switch (status) {
    case "ready":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "cooking":
      return <Timer className="h-4 w-4 text-yellow-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-gray-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function KitchenView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch orders from Firestore
  useEffect(() => {
    const db = getFirestore(firebaseApp);
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatElapsedTime = (orderTime: any) => {
    if (!orderTime) return "0m";

    // Handle Firestore timestamp
    const time = orderTime.toDate ? orderTime.toDate() : new Date(orderTime);
    const elapsed = Math.floor(
      (currentTime.getTime() - time.getTime()) / 1000 / 60
    );
    return `${elapsed}m`;
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const db = getFirestore(firebaseApp);
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      console.log(`Order ${orderId} updated to ${newStatus}`);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleCardClick = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const activeOrders = orders.filter(
    (order) => order.status !== "completed" && order.status !== "delivered"
  );
  const newOrders = activeOrders.filter((order) => order.status === "pending");
  const preparingOrders = activeOrders.filter(
    (order) => order.status === "preparing"
  );
  const readyOrders = activeOrders.filter((order) => order.status === "ready");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Kitchen View
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                Real-time order management for kitchen staff
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/orders"
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              All Orders
            </Link>
            <Link href="/kitchen" className="text-orange-600 font-medium">
              Kitchen View
            </Link>
          </nav>

          {/* Mobile & Desktop Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Time Display */}
            <div className="text-right">
              <div className="text-xs md:text-sm font-medium">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-xs text-gray-500 hidden md:block">
                {currentTime.toLocaleDateString()}
              </div>
            </div>

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
                    <Link href="/" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders" className="w-full">
                      All Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/kitchen" className="w-full">
                      Kitchen View
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Only - Notifications */}
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex bg-transparent"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Kitchen Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    New Orders
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-blue-600">
                    {newOrders.length}
                  </p>
                </div>
                <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Preparing
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-yellow-600">
                    {preparingOrders.length}
                  </p>
                </div>
                <Timer className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Ready
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    {readyOrders.length}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600">
                    Avg. Time
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    28m
                  </p>
                </div>
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kitchen Board */}
        <div className="kitchen-board grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : (
            <>
              {/* New Orders */}
              <div>
                <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                  New Orders ({newOrders.length})
                </h2>
                <div className="space-y-3 md:space-y-4">
                  {newOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="border-l-4 border-l-blue-500 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                      onClick={() => handleCardClick(order)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base md:text-lg">
                            {order.orderNumber || order.id}
                          </CardTitle>
                          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <Badge
                              className={`${getPriorityColor(
                                order.priority || "normal"
                              )} text-xs`}
                            >
                              {order.priority || "normal"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {capitalizeStatus(order.orderType) || "delivery"}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-xs md:text-sm">
                          {formatRelativeTime(order.createdAt, currentTime)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Customer & Delivery Info */}
                        <div className="mb-3 p-2 bg-blue-50 rounded text-xs md:text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <strong>{order.customerName}</strong>
                              <a
                                href={`tel:${order.customerPhone}`}
                                className="text-blue-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Phone className="h-3 w-3" />
                              </a>
                            </div>
                            <span className="text-xs text-gray-600">
                              {order.customerPhone}
                            </span>
                          </div>
                          <div className="flex items-start gap-1">
                            <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-700">
                                {order?.deliveryAddress?.street || "Pickup"}
                              </p>
                              <p className="text-orange-600 font-medium">
                                {order.orderType === "delivery"
                                  ? "25-40 min"
                                  : order.estimatedDelivery ||
                                    "Ready for pickup"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items?.map((item: any, index: number) => (
                            <div key={index} className="p-2 bg-gray-50 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  {getItemStatusIcon(item.status || "pending")}
                                  <span className="font-medium text-sm">
                                    {item.quantity}x {item.name}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {item.cookTime || 5}m
                                </span>
                              </div>
                              {item.size && (
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                                      {item.size}
                                    </span>
                                    {item.extras && item.extras.length > 0 && (
                                      <span className="text-gray-600">
                                        +{item.extras.length} extra
                                        {item.extras.length > 1 ? "s" : ""}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {item.extras && item.extras.length > 0 && (
                                <div className="mt-1 text-xs text-gray-600">
                                  <span className="font-medium">Extras:</span>{" "}
                                  {item.extras.slice(0, 2).join(", ")}
                                  {item.extras.length > 2 &&
                                    ` +${item.extras.length - 2} more`}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {order.notes && (
                          <div className="mb-4 p-2 bg-yellow-50 rounded text-xs md:text-sm">
                            <strong>Note:</strong> {order.notes}
                          </div>
                        )}
                        <Button
                          className="w-full text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, "preparing");
                          }}
                        >
                          <Utensils className="h-4 w-4 mr-2" />
                          Start Cooking
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Preparing Orders */}
              <div>
                <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center">
                  <Timer className="h-4 w-4 md:h-5 md:w-5 mr-2 text-yellow-600" />
                  Preparing ({preparingOrders.length})
                </h2>
                <div className="space-y-3 md:space-y-4">
                  {preparingOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="border-l-4 border-l-yellow-500 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                      onClick={() => handleCardClick(order)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base md:text-lg">
                            {order.orderNumber || order.id}
                          </CardTitle>
                          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <Badge
                              className={`${getPriorityColor(
                                order.priority || "normal"
                              )} text-xs`}
                            >
                              {order.priority || "normal"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {capitalizeStatus(order.orderType) || "delivery"}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-xs md:text-sm">
                          {formatRelativeTime(order.createdAt, currentTime)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Customer & Delivery Info */}
                        <div className="mb-3 p-2 bg-yellow-50 rounded text-xs md:text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <strong>{order.customerName}</strong>
                              <a
                                href={`tel:${order.customerPhone}`}
                                className="text-blue-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Phone className="h-3 w-3" />
                              </a>
                            </div>
                            <span className="text-xs text-gray-600">
                              {order.customerPhone}
                            </span>
                          </div>
                          <div className="flex items-start gap-1">
                            <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-700">
                                {order?.deliveryAddress?.street || "Pickup"}
                              </p>
                              <p className="text-orange-600 font-medium">
                                {order.orderType === "delivery"
                                  ? "25-40 min"
                                  : order.estimatedDelivery ||
                                    "Ready for pickup"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items?.map((item: any, index: number) => (
                            <div key={index} className="p-2 bg-gray-50 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  {getItemStatusIcon(item.status || "cooking")}
                                  <span className="font-medium text-sm">
                                    {item.quantity}x {item.name}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {item.cookTime || 5}m
                                </span>
                              </div>
                              {item.size && (
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                                      {item.size}
                                    </span>
                                    {item.extras && item.extras.length > 0 && (
                                      <span className="text-gray-600">
                                        +{item.extras.length} extra
                                        {item.extras.length > 1 ? "s" : ""}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {item.extras && item.extras.length > 0 && (
                                <div className="mt-1 text-xs text-gray-600">
                                  <span className="font-medium">Extras:</span>{" "}
                                  {item.extras.slice(0, 2).join(", ")}
                                  {item.extras.length > 2 &&
                                    ` +${item.extras.length - 2} more`}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {order.notes && (
                          <div className="mb-4 p-2 bg-yellow-50 rounded text-xs md:text-sm">
                            <strong>Note:</strong> {order.notes}
                          </div>
                        )}
                        <Button
                          className="w-full text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, "ready");
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Ready
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Ready Orders */}
              <div>
                <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-600" />
                  Ready for{" "}
                  {readyOrders.some((o) => o.orderType === "delivery")
                    ? "Delivery"
                    : "Pickup"}{" "}
                  ({readyOrders.length})
                </h2>
                <div className="space-y-3 md:space-y-4">
                  {readyOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="border-l-4 border-l-green-500 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                      onClick={() => handleCardClick(order)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base md:text-lg">
                            {order.orderNumber || order.id}
                          </CardTitle>
                          <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <Badge
                              className={`${getPriorityColor(
                                order.priority || "normal"
                              )} text-xs`}
                            >
                              {order.priority || "normal"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {capitalizeStatus(order.orderType) || "delivery"}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-xs md:text-sm">
                          Ready for {formatElapsedTime(order.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Customer & Delivery Info */}
                        <div className="mb-3 p-2 bg-green-50 rounded text-xs md:text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <strong>{order.customerName}</strong>
                              <a
                                href={`tel:${order.customerPhone}`}
                                className="text-blue-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Phone className="h-3 w-3" />
                              </a>
                            </div>
                            <span className="text-xs text-gray-600">
                              {order.customerPhone}
                            </span>
                          </div>
                          <div className="flex items-start gap-1">
                            <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-700">
                                {order?.deliveryAddress?.street || "Pickup"}
                              </p>
                              <p className="text-green-600 font-medium">
                                {order.orderType === "delivery"
                                  ? "Ready for Delivery"
                                  : "Ready for Pickup"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items?.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="p-2 bg-green-50 rounded"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  {getItemStatusIcon("ready")}
                                  <span className="font-medium text-sm">
                                    {item.quantity}x {item.name}
                                  </span>
                                </div>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                              {item.size && (
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                                      {item.size}
                                    </span>
                                    {item.extras && item.extras.length > 0 && (
                                      <span className="text-gray-600">
                                        +{item.extras.length} extra
                                        {item.extras.length > 1 ? "s" : ""}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {item.extras && item.extras.length > 0 && (
                                <div className="mt-1 text-xs text-gray-600">
                                  <span className="font-medium">Extras:</span>{" "}
                                  {item.extras.slice(0, 2).join(", ")}
                                  {item.extras.length > 2 &&
                                    ` +${item.extras.length - 2} more`}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {order.notes && (
                          <div className="mb-4 p-2 bg-yellow-50 rounded text-xs md:text-sm">
                            <strong>Note:</strong> {order.notes}
                          </div>
                        )}
                        <Button
                          variant="outline"
                          className="w-full bg-transparent text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, "delivered");
                          }}
                        >
                          Mark as{" "}
                          {order.orderType === "delivery"
                            ? "Delivered"
                            : "Picked Up"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Order Details Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  Order Details -{" "}
                  {selectedOrder?.orderNumber || selectedOrder?.id}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDialogOpen(false)}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
                <DialogDescription>
                  Complete order information and kitchen management
                </DialogDescription>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Customer Information
                      </h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong>Name:</strong> {selectedOrder.customerName}
                          <a
                            href={`tel:${selectedOrder.customerPhone}`}
                            className="text-blue-600"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        </div>
                        <p>
                          <strong>Phone:</strong> {selectedOrder.customerPhone}
                        </p>
                        <p>
                          <strong>Type:</strong>{" "}
                          {capitalizeStatus(selectedOrder.orderType) ||
                            "delivery"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Order Information</h4>
                      <div className="space-y-1">
                        <p>
                          <strong>Order ID:</strong>{" "}
                          {selectedOrder.orderNumber || selectedOrder.id}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <Badge
                            className={getStatusColor(selectedOrder.status)}
                          >
                            {capitalizeStatus(selectedOrder.status)}
                          </Badge>
                        </p>
                        <p>
                          <strong>Priority:</strong>{" "}
                          <Badge
                            className={getPriorityColor(
                              selectedOrder.priority || "normal"
                            )}
                          >
                            {selectedOrder.priority || "normal"}
                          </Badge>
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {formatRelativeTime(
                            selectedOrder.createdAt,
                            currentTime
                          )}{" "}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Information
                    </h4>
                    <div className="p-3 bg-gray-50 rounded space-y-2">
                      <p>
                        <strong>Address:</strong>{" "}
                        {selectedOrder?.deliveryAddress?.street || "Pickup"}
                      </p>
                      <p>
                        <strong>Estimated Delivery:</strong>{" "}
                        {selectedOrder.estimatedDelivery || "Ready for pickup"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Payment Information
                    </h4>
                    <div className="p-3 bg-gray-50 rounded space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm">
                            <strong>Payment Method:</strong>{" "}
                            {selectedOrder.paymentMethod === "mobile_money"
                              ? "Momo"
                              : "Card"}
                          </p>
                          {selectedOrder.cardLast4 && (
                            <p className="text-sm">
                              <strong>Card:</strong> ••••{" "}
                              {selectedOrder.cardLast4}
                            </p>
                          )}
                          <p className="text-sm">
                            <strong>Status:</strong>{" "}
                            <Badge
                              className={getPaymentStatusColor(
                                selectedOrder.paymentStatus
                              )}
                            >
                              {capitalizeStatus(selectedOrder.paymentStatus)}
                            </Badge>
                          </p>
                        </div>
                        <div>
                          {selectedOrder.transactionId && (
                            <p className="text-sm">
                              <strong>Transaction ID:</strong>{" "}
                              {selectedOrder.transactionId}
                            </p>
                          )}
                          {selectedOrder.paidAt && (
                            <p className="text-sm">
                              <strong>Payment Time:</strong>{" "}
                              {selectedOrder.paidAt.toLocaleString()}
                            </p>
                          )}
                          {selectedOrder.tip > 0 && (
                            <p className="text-sm">
                              <strong>Tip:</strong> $
                              {selectedOrder.tip.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">
                      Order Items & Details
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              {getItemStatusIcon(item.status || "pending")}
                              <div>
                                <span className="font-medium text-lg">
                                  {item.quantity}x {item.name}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  {item.size && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                      {item.size}
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-500">
                                    Cook time: {item.cookTime || 5}m • Status:{" "}
                                    {item.status || "pending"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="font-bold text-lg">
                              GH₵
                              {(
                                (item.quantity || 1) * (item.price || 0)
                              ).toFixed(2)}
                            </span>
                          </div>

                          {item.extras && item.extras.length > 0 && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                              <div className="font-medium text-sm text-yellow-800 mb-1">
                                Extras & Modifications:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {item.extras.map(
                                  (extra: string, extraIndex: number) => (
                                    <span
                                      key={extraIndex}
                                      className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium"
                                    >
                                      {extra}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Price Breakdown */}
                      {selectedOrder.total && (
                        <div className="border-t pt-3 space-y-2">
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span>Subtotal</span>
                            <span className="font-medium">
                              GH₵{selectedOrder.subtotal?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          {selectedOrder.deliveryFee &&
                            selectedOrder.deliveryFee > 0 && (
                              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                <span>Delivery Fee</span>
                                <span className="font-medium">
                                  GH₵{selectedOrder.deliveryFee.toFixed(2)}
                                </span>
                              </div>
                            )}
                          {/* {selectedOrder.tax && (
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>Tax</span>
                              <span className="font-medium">
                                ${selectedOrder.tax.toFixed(2)}
                              </span>
                            </div>
                          )} */}
                          <div className="flex justify-between items-center p-3 bg-green-100 rounded font-bold text-lg border-2 border-green-200">
                            <span>Total Paid</span>
                            <span>GH₵{selectedOrder.total.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Special Notes</h4>
                      <p className="text-sm bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    {selectedOrder.status === "pending" && (
                      <Button
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "preparing")
                        }
                        className="w-full sm:w-auto"
                      >
                        <Utensils className="h-4 w-4 mr-2" />
                        Start Cooking
                      </Button>
                    )}
                    {selectedOrder.status === "preparing" && (
                      <Button
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "ready")
                        }
                        className="w-full sm:w-auto"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Ready
                      </Button>
                    )}
                    {selectedOrder.status === "ready" && (
                      <Button
                        onClick={() =>
                          updateOrderStatus(selectedOrder.id, "delivered")
                        }
                        className="w-full sm:w-auto"
                      >
                        Mark as{" "}
                        {selectedOrder.orderType === "delivery"
                          ? "Delivered"
                          : "Picked Up"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <style jsx>{`
            @media (min-width: 768px) and (max-width: 1023px) {
              .kitchen-board > div:nth-child(3) {
                grid-column: 1 / -1;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
