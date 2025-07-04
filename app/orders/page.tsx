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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bell,
  ChefHat,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Calendar,
  Download,
  MapPin,
  Phone,
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
  DialogTrigger,
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
import Link from "next/link";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-yellow-100 text-yellow-800";
    case "ready":
      return "bg-green-100 text-green-800";
    case "delivered":
    case "completed":
      return "bg-gray-100 text-gray-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function formatTime(isoString: string) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date
    .toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
}

const statusOrder = ["pending", "preparing", "ready", "delivered"];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  //   const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelOrder, setCancelOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const db = getFirestore(firebaseApp);
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      console.log(`Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrder) return;
    await updateOrderStatus(cancelOrder.id, "cancelled");
    setCancelDialogOpen(false);
    setCancelOrder(null);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                RestaurantPro
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                Delivery & Takeaway Management
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
            <Link href="/orders" className="text-orange-600 font-medium">
              All Orders
            </Link>
            <Link
              href="/kitchen"
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              Kitchen View
            </Link>
          </nav>

          {/* Mobile & Desktop Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
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

            {/* Desktop Only - Notifications and User */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            All Orders
          </h2>
          <p className="text-gray-600">Manage delivery and takeaway orders</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, customer, phone..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Orders ({orders.length})
            </CardTitle>
            <CardDescription>
              {statusFilter === "all"
                ? "All orders"
                : `Orders with status: ${statusFilter}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile/Tablet Order Cards */}
            <div className="lg:hidden">
              <div className="grid gap-4 md:grid-cols-2">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {/* <span className="font-medium">{order.id}</span> */}
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {order.orderType}
                          </Badge>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{order.customerName}</p>
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="text-blue-600"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        </div>
                        <p className="text-sm text-gray-500">
                          {order.customerPhone}
                        </p>
                        <div className="flex items-start gap-1 mt-1">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-600">
                              {order?.deliveryAddress?.street}
                            </p>
                            <p className="text-xs text-orange-600">
                              {order.estimatedDelivery}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {order.items
                            .map(
                              (item: any) => `${item.quantity}x ${item.name}`
                            )
                            .join(", ")}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-medium">
                            ${order.total.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatTime(order.paidAt)}
                          </span>
                        </div>
                      </div>
                      {order.notes && (
                        <div className="p-2 bg-yellow-50 rounded text-xs">
                          <strong>Notes:</strong> {order.notes}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Order Details - {selectedOrder?.id}
                              </DialogTitle>
                              <DialogDescription>
                                Complete order information and delivery details
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
                                        <strong>Name:</strong>{" "}
                                        {selectedOrder.customer}
                                        <a
                                          href={`tel:${selectedOrder.phone}`}
                                          className="text-blue-600"
                                        >
                                          <Phone className="h-4 w-4" />
                                        </a>
                                      </div>
                                      <p>
                                        <strong>Phone:</strong>{" "}
                                        {selectedOrder.phone}
                                      </p>
                                      <p>
                                        <strong>Type:</strong>{" "}
                                        {selectedOrder.orderType}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Order Information
                                    </h4>
                                    <div className="space-y-1">
                                      <p>
                                        <strong>Order ID:</strong>{" "}
                                        {selectedOrder.id}
                                      </p>
                                      <p>
                                        <strong>Status:</strong>{" "}
                                        <Badge
                                          className={getStatusColor(
                                            selectedOrder.status
                                          )}
                                        >
                                          {selectedOrder.status}
                                        </Badge>
                                      </p>
                                      <p>
                                        <strong>Time:</strong>{" "}
                                        {selectedOrder.time}
                                      </p>
                                      <p>
                                        <strong>Total:</strong> $
                                        {selectedOrder.total.toFixed(2)}
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
                                      {selectedOrder?.deliveryAddress?.street}
                                    </p>
                                    <p>
                                      <strong>Estimated Time:</strong>{" "}
                                      {selectedOrder.estimatedDelivery}
                                    </p>
                                    {selectedOrder.deliveryFee > 0 && (
                                      <p>
                                        <strong>Delivery Fee:</strong> $
                                        {selectedOrder.deliveryFee.toFixed(2)}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Order Items
                                  </h4>
                                  <div className="space-y-2">
                                    {selectedOrder.items.map(
                                      (item: any, index: number) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                        >
                                          <span>
                                            {item.quantity}x {item.name}
                                          </span>
                                          <span className="font-medium">
                                            $
                                            {(
                                              item.quantity * item.price
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                      )
                                    )}
                                    {selectedOrder.deliveryFee > 0 && (
                                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                        <span>Delivery Fee</span>
                                        <span className="font-medium">
                                          $
                                          {selectedOrder.deliveryFee.toFixed(2)}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-center p-2 bg-green-50 rounded font-bold">
                                      <span>Total</span>
                                      <span>
                                        ${selectedOrder.total.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {selectedOrder.notes && (
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Special Notes
                                    </h4>
                                    <p className="text-sm bg-yellow-50 p-3 rounded">
                                      {selectedOrder.notes}
                                    </p>
                                  </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                                  <Button
                                    onClick={() =>
                                      updateOrderStatus(
                                        selectedOrder.id,
                                        "preparing"
                                      )
                                    }
                                    className="w-full sm:w-auto"
                                  >
                                    Mark as Preparing
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      updateOrderStatus(
                                        selectedOrder.id,
                                        "ready"
                                      )
                                    }
                                    className="w-full sm:w-auto"
                                  >
                                    Mark as Ready
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      updateOrderStatus(
                                        selectedOrder.id,
                                        "delivered"
                                      )
                                    }
                                    className="w-full sm:w-auto"
                                  >
                                    Mark as Delivered
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={
                                order.status === "delivered" ||
                                order.status === "cancelled"
                              }
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(() => {
                              const currentIndex = statusOrder.indexOf(
                                order.status
                              );
                              return statusOrder
                                .slice(currentIndex + 1)
                                .map((nextStatus) => (
                                  <DropdownMenuItem
                                    key={nextStatus}
                                    onClick={() =>
                                      updateOrderStatus(order.id, nextStatus)
                                    }
                                  >
                                    {`Mark as ${
                                      nextStatus.charAt(0).toUpperCase() +
                                      nextStatus.slice(1)
                                    }`}
                                  </DropdownMenuItem>
                                ));
                            })()}
                            {order.status !== "delivered" &&
                              order.status !== "cancelled" && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setCancelOrder(order);
                                    setCancelDialogOpen(true);
                                  }}
                                >
                                  Cancel Order
                                </DropdownMenuItem>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {order.customerName}
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="text-blue-600"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {order.orderType}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex items-start gap-1">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm truncate">
                              {order?.deliveryAddress?.street}
                            </div>
                            <div className="text-xs text-orange-600">
                              {order.estimatedDelivery}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate">
                          {order.items
                            .map(
                              (item: any) => `${item.quantity}x ${item.name}`
                            )
                            .join(", ")}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatTime(order.paidAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Order Details - {selectedOrder?.id}
                                </DialogTitle>
                                <DialogDescription>
                                  Complete order information and delivery
                                  details
                                </DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        Customer Information
                                      </h4>
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <strong>Name:</strong>{" "}
                                          {selectedOrder.customer}
                                          <a
                                            href={`tel:${selectedOrder.phone}`}
                                            className="text-blue-600"
                                          >
                                            <Phone className="h-4 w-4" />
                                          </a>
                                        </div>
                                        <p>
                                          <strong>Phone:</strong>{" "}
                                          {selectedOrder.phone}
                                        </p>
                                        <p>
                                          <strong>Type:</strong>{" "}
                                          {selectedOrder.orderType}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        Order Information
                                      </h4>
                                      <div className="space-y-1">
                                        <p>
                                          <strong>Order ID:</strong>{" "}
                                          {selectedOrder.id}
                                        </p>
                                        <p>
                                          <strong>Status:</strong>{" "}
                                          <Badge
                                            className={getStatusColor(
                                              selectedOrder.status
                                            )}
                                          >
                                            {selectedOrder.status}
                                          </Badge>
                                        </p>
                                        <p>
                                          <strong>Time:</strong>{" "}
                                          {selectedOrder.time}
                                        </p>
                                        <p>
                                          <strong>Total:</strong> $
                                          {selectedOrder.total.toFixed(2)}
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
                                        {selectedOrder?.deliveryAddress?.street}
                                      </p>
                                      <p>
                                        <strong>Estimated Time:</strong>{" "}
                                        {selectedOrder.estimatedDelivery}
                                      </p>
                                      {selectedOrder.deliveryFee > 0 && (
                                        <p>
                                          <strong>Delivery Fee:</strong> $
                                          {selectedOrder.deliveryFee.toFixed(2)}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Order Items
                                    </h4>
                                    <div className="space-y-2">
                                      {selectedOrder.items.map(
                                        (item: any, index: number) => (
                                          <div
                                            key={index}
                                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                          >
                                            <span>
                                              {item.quantity}x {item.name}
                                            </span>
                                            <span className="font-medium">
                                              $
                                              {(
                                                item.quantity * item.price
                                              ).toFixed(2)}
                                            </span>
                                          </div>
                                        )
                                      )}
                                      {selectedOrder.deliveryFee > 0 && (
                                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                          <span>Delivery Fee</span>
                                          <span className="font-medium">
                                            $
                                            {selectedOrder.deliveryFee.toFixed(
                                              2
                                            )}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex justify-between items-center p-2 bg-green-50 rounded font-bold">
                                        <span>Total</span>
                                        <span>
                                          ${selectedOrder.total.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {selectedOrder.notes && (
                                    <div>
                                      <h4 className="font-semibold mb-2">
                                        Special Notes
                                      </h4>
                                      <p className="text-sm bg-yellow-50 p-3 rounded">
                                        {selectedOrder.notes}
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      onClick={() =>
                                        updateOrderStatus(
                                          selectedOrder.id,
                                          "preparing"
                                        )
                                      }
                                    >
                                      Mark as Preparing
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        updateOrderStatus(
                                          selectedOrder.id,
                                          "ready"
                                        )
                                      }
                                    >
                                      Mark as Ready
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        updateOrderStatus(
                                          selectedOrder.id,
                                          "delivered"
                                        )
                                      }
                                    >
                                      Mark as Delivered
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={
                                  order.status === "delivered" ||
                                  order.status === "cancelled"
                                }
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {(() => {
                                const currentIndex = statusOrder.indexOf(
                                  order.status
                                );
                                return statusOrder
                                  .slice(currentIndex + 1)
                                  .map((nextStatus) => (
                                    <DropdownMenuItem
                                      key={nextStatus}
                                      onClick={() =>
                                        updateOrderStatus(order.id, nextStatus)
                                      }
                                    >
                                      {`Mark as ${
                                        nextStatus.charAt(0).toUpperCase() +
                                        nextStatus.slice(1)
                                      }`}
                                    </DropdownMenuItem>
                                  ));
                              })()}
                              {order.status !== "delivered" && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setCancelOrder(order);
                                    setCancelDialogOpen(true);
                                  }}
                                >
                                  Cancel Order
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              No, keep order
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              Yes, cancel order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
