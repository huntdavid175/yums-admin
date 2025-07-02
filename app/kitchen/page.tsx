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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Kitchen-focused order data with delivery details
const kitchenOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    phone: "+1 (555) 123-4567",
    items: [
      { name: "Classic Burger", quantity: 2, cookTime: 8, status: "cooking" },
      { name: "French Fries", quantity: 1, cookTime: 4, status: "ready" },
    ],
    status: "preparing",
    orderTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    estimatedTime: 5,
    priority: "normal",
    notes: "Ring doorbell twice, no onions on burger",
    orderType: "delivery",
    address: "123 Main St, Apt 4B, Downtown",
    estimatedDelivery: "25-35 min",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    phone: "+1 (555) 987-6543",
    items: [
      { name: "Margherita Pizza", quantity: 1, cookTime: 12, status: "ready" },
      { name: "Garlic Bread", quantity: 1, cookTime: 5, status: "ready" },
    ],
    status: "ready",
    orderTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    estimatedTime: 0,
    priority: "high",
    notes: "Customer will arrive in 10 minutes",
    orderType: "takeaway",
    address: "Pickup at store",
    estimatedDelivery: "Ready for pickup",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    phone: "+1 (555) 321-0987",
    items: [
      { name: "Chicken Pasta", quantity: 1, cookTime: 15, status: "pending" },
      { name: "Caesar Salad", quantity: 1, cookTime: 3, status: "ready" },
    ],
    status: "new",
    orderTime: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    estimatedTime: 15,
    priority: "normal",
    notes: "Call when arriving, gate code: 1234",
    orderType: "delivery",
    address: "789 Pine St, Unit 12, Riverside Complex",
    estimatedDelivery: "30-40 min",
  },
  {
    id: "ORD-007",
    customer: "Mike Johnson",
    phone: "+1 (555) 456-7890",
    items: [
      { name: "Fish & Chips", quantity: 2, cookTime: 10, status: "cooking" },
      { name: "Mushy Peas", quantity: 2, cookTime: 3, status: "ready" },
    ],
    status: "preparing",
    orderTime: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    estimatedTime: 7,
    priority: "high",
    notes: "Extra tartar sauce, leave at door",
    orderType: "delivery",
    address: "456 Oak Ave, House with blue door",
    estimatedDelivery: "20-30 min",
  },
];

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "new":
//       return "bg-blue-100 text-blue-800 border-blue-200";
//     case "preparing":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     case "ready":
//       return "bg-green-100 text-green-800 border-green-200";
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-200";
//   }
// };

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

export default function KitchenView() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatElapsedTime = (orderTime: Date) => {
    const elapsed = Math.floor(
      (currentTime.getTime() - orderTime.getTime()) / 1000 / 60
    );
    return `${elapsed}m`;
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const activeOrders = kitchenOrders.filter(
    (order) => order.status !== "completed"
  );
  const newOrders = activeOrders.filter((order) => order.status === "new");
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
                    <a href="/orders" className="w-full">
                      All Orders
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/kitchen" className="w-full">
                      Kitchen View
                    </a>
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
          {/* New Orders */}
          <div>
            <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
              New Orders ({newOrders.length})
            </h2>
            <div className="space-y-3 md:space-y-4">
              {newOrders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base md:text-lg">
                        {order.id}
                      </CardTitle>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <Badge
                          className={`${getPriorityColor(
                            order.priority
                          )} text-xs`}
                        >
                          {order.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {order.orderType}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-xs md:text-sm">
                      {formatElapsedTime(order.orderTime)} ago • Est.{" "}
                      {order.estimatedTime}m
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Customer & Delivery Info */}
                    <div className="mb-3 p-2 bg-blue-50 rounded text-xs md:text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <strong>{order.customer}</strong>
                          <a
                            href={`tel:${order.phone}`}
                            className="text-blue-600"
                          >
                            <Phone className="h-3 w-3" />
                          </a>
                        </div>
                        <span className="text-xs text-gray-600">
                          {order.phone}
                        </span>
                      </div>
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700">{order.address}</p>
                          <p className="text-orange-600 font-medium">
                            {order.estimatedDelivery}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            {getItemStatusIcon(item.status)}
                            <span className="font-medium text-sm">
                              {item.quantity}x {item.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.cookTime}m
                          </span>
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
                      onClick={() => updateOrderStatus(order.id, "preparing")}
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
                <Card key={order.id} className="border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base md:text-lg">
                        {order.id}
                      </CardTitle>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <Badge
                          className={`${getPriorityColor(
                            order.priority
                          )} text-xs`}
                        >
                          {order.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {order.orderType}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-xs md:text-sm">
                      {formatElapsedTime(order.orderTime)} ago • Est.{" "}
                      {order.estimatedTime}m left
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Customer & Delivery Info */}
                    <div className="mb-3 p-2 bg-yellow-50 rounded text-xs md:text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <strong>{order.customer}</strong>
                          <a
                            href={`tel:${order.phone}`}
                            className="text-blue-600"
                          >
                            <Phone className="h-3 w-3" />
                          </a>
                        </div>
                        <span className="text-xs text-gray-600">
                          {order.phone}
                        </span>
                      </div>
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700">{order.address}</p>
                          <p className="text-orange-600 font-medium">
                            {order.estimatedDelivery}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            {getItemStatusIcon(item.status)}
                            <span className="font-medium text-sm">
                              {item.quantity}x {item.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.cookTime}m
                          </span>
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
                      onClick={() => updateOrderStatus(order.id, "ready")}
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
                <Card key={order.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base md:text-lg">
                        {order.id}
                      </CardTitle>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <Badge
                          className={`${getPriorityColor(
                            order.priority
                          )} text-xs`}
                        >
                          {order.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {order.orderType}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-xs md:text-sm">
                      Ready for {formatElapsedTime(order.orderTime)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Customer & Delivery Info */}
                    <div className="mb-3 p-2 bg-green-50 rounded text-xs md:text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <strong>{order.customer}</strong>
                          <a
                            href={`tel:${order.phone}`}
                            className="text-blue-600"
                          >
                            <Phone className="h-3 w-3" />
                          </a>
                        </div>
                        <span className="text-xs text-gray-600">
                          {order.phone}
                        </span>
                      </div>
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700">{order.address}</p>
                          <p className="text-green-600 font-medium">
                            {order.estimatedDelivery}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-green-50 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            {getItemStatusIcon(item.status)}
                            <span className="font-medium text-sm">
                              {item.quantity}x {item.name}
                            </span>
                          </div>
                          <CheckCircle className="h-4 w-4 text-green-600" />
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
                      onClick={() => updateOrderStatus(order.id, "delivered")}
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
        </div>
        <style jsx>{`
          @media (min-width: 768px) and (max-width: 1023px) {
            .kitchen-board > div:nth-child(3) {
              grid-column: 1 / -1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
