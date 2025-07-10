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
import { Header } from "@/components/dashboard/Header";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import firebaseApp from "@/lib/firebase";
import Link from "next/link";
import {
  MobileOrderSkeletonGrid,
  DesktopTableSkeleton,
} from "@/components/orders/OrderSkeletons";
import { formatRelativeTime, capitalizeStatus } from "@/helpers/helpers";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-blue-100 text-blue-800 shadow-blue-200";
    case "preparing":
      return "bg-yellow-100 text-yellow-800 shadow-yellow-200";
    case "ready":
      return "bg-green-100 text-green-800 shadow-green-200";
    case "delivered":
    case "completed":
      return "bg-gray-100 text-gray-800 shadow-gray-200";
    case "cancelled":
      return "bg-red-100 text-red-800 shadow-red-200";
    default:
      return "bg-gray-100 text-gray-800 shadow-gray-200";
  }
};

const statusOrder = ["pending", "preparing", "ready", "delivered"];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelOrder, setCancelOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    setIsLoading(true);
    let q;
    if (statusFilter === "all") {
      q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
    } else {
      q = query(
        collection(db, "orders"),
        where("status", "==", statusFilter),
        orderBy("createdAt", "desc"),
        limit(10)
      );
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [statusFilter]);

  useEffect(() => {
    if (selectedOrder) {
      const updatedOrder = orders.find(
        (order) => order.id === selectedOrder.id
      );
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  }, [orders, selectedOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-8 md:mb-12 slide-in-up">
          <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-2xl p-6 md:p-8 border border-orange-200/50 card-hover">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
              All Orders
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Manage delivery and takeaway orders
            </p>
          </div>
        </div>
        {/* Filters and Search */}
        <Card className="mb-8 glass border-0 shadow-lg fade-in">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
                  <Input
                    placeholder="Search orders, customer, phone..."
                    className="pl-10 input-modern glass"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] input-modern glass">
                    <Filter className="h-4 w-4 mr-2 text-orange-400" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white/70 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg border border-orange-200 btn-modern"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white/70 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg border border-orange-200 btn-modern"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Orders Table */}
        <Card className="glass border-0 shadow-xl fade-in">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold gradient-text mb-1">
              Orders ({orders.length})
            </CardTitle>
            <CardDescription className="text-gray-600">
              {statusFilter === "all"
                ? "All orders"
                : `Orders with status: ${statusFilter}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile/Tablet Order Cards */}
            <div className="lg:hidden">
              {isLoading ? (
                <MobileOrderSkeletonGrid />
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {statusFilter === "all"
                      ? "No orders found"
                      : `No orders with status \"${statusFilter}\" found`}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {orders.map((order, idx) => (
                    <Card
                      key={order.id}
                      className="p-4 bg-gradient-to-br from-orange-50 to-purple-50 rounded-2xl shadow-lg card-hover fade-in"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-orange-700">
                            ORD-#{order.orderNumber}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs capitalize px-2 py-1 rounded-full border-orange-200 bg-orange-100 text-orange-700 font-semibold shadow-sm"
                            >
                              {order.orderType}
                            </Badge>
                            <Badge
                              className={`px-3 py-1 rounded-full font-semibold shadow ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {capitalizeStatus(order.status)}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900">
                              {order.customerName}
                            </p>
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
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
                              <p className="text-xs text-orange-600 font-semibold">
                                {order.estimatedDelivery}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {order.items
                              .map(
                                (item: any) => `${item.quantity}x ${item.name}`
                              )
                              .join(", ")}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-lg text-orange-700">
                              GH₵{order.total.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatRelativeTime(order.paidAt, currentTime)}
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
                                className="flex-1 bg-white/70 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg border border-orange-200 transition-all"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl">
                              <DialogHeader className="pb-6">
                                <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
                                  <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                                  Order Details - ORD-#
                                  {selectedOrder?.orderNumber}
                                </DialogTitle>
                                <DialogDescription className="text-gray-600 mt-2">
                                  Complete order information and delivery
                                  details
                                </DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  {/* Status Overview Card */}
                                  <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl p-4 border border-orange-200/50">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                          Order Status
                                        </h3>
                                        <Badge
                                          className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getStatusColor(
                                            selectedOrder.status
                                          )}`}
                                        >
                                          {capitalizeStatus(
                                            selectedOrder.status
                                          )}
                                        </Badge>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                          Order Time
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                          {formatRelativeTime(
                                            selectedOrder.paidAt,
                                            currentTime
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Customer & Order Info Cards */}
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <Card className="border border-gray-200 shadow-sm">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Phone className="h-3 w-3 text-blue-600" />
                                          </div>
                                          Customer Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">
                                            Name
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                              {selectedOrder.customerName}
                                            </span>
                                            <Link
                                              href={`tel:${selectedOrder.customerPhone}`}
                                              className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
                                              title="Call customer"
                                            >
                                              <Phone className="h-4 w-4" />
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">
                                            Phone
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {selectedOrder.customerPhone}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">
                                            Order Type
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="px-2 py-1 rounded-full border-orange-200 bg-orange-100 text-orange-700 font-semibold text-xs"
                                          >
                                            {selectedOrder.orderType}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card className="border border-gray-200 shadow-sm">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                            <ChefHat className="h-3 w-3 text-green-600" />
                                          </div>
                                          Order Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">
                                            Order ID
                                          </span>
                                          <span className="font-mono text-sm font-medium text-gray-900">
                                            {selectedOrder.id}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">
                                            Total Amount
                                          </span>
                                          <span className="font-bold text-lg text-orange-700">
                                            GH₵{selectedOrder.total.toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">
                                            Items Count
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            {selectedOrder.items.length} items
                                          </span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Delivery Information Card */}
                                  <Card className="border border-gray-200 shadow-sm">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                          <MapPin className="h-3 w-3 text-purple-600" />
                                        </div>
                                        Delivery Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                      <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                          <p className="text-sm text-gray-600 mb-1">
                                            Delivery Address
                                          </p>
                                          <p className="font-medium text-gray-900">
                                            {
                                              selectedOrder?.deliveryAddress
                                                ?.street
                                            }
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                          Estimated Time
                                        </span>
                                        <span className="font-medium text-orange-700">
                                          {selectedOrder.estimatedDelivery}
                                        </span>
                                      </div>
                                      {selectedOrder.deliveryFee > 0 && (
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">
                                            Delivery Fee
                                          </span>
                                          <span className="font-medium text-gray-900">
                                            GH₵
                                            {selectedOrder.deliveryFee.toFixed(
                                              2
                                            )}
                                          </span>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>

                                  {/* Order Items Card */}
                                  <Card className="border border-gray-200 shadow-sm">
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                          <ChefHat className="h-3 w-3 text-yellow-600" />
                                        </div>
                                        Order Items
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        {selectedOrder.items.map(
                                          (item: any, index: number) => (
                                            <div
                                              key={index}
                                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                                  <span className="text-xs font-bold text-orange-700">
                                                    {item.quantity}
                                                  </span>
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                  {item.name}
                                                </span>
                                              </div>
                                              <span className="font-bold text-orange-700">
                                                GH₵
                                                {(
                                                  item.quantity * item.price
                                                ).toFixed(2)}
                                              </span>
                                            </div>
                                          )
                                        )}
                                        {selectedOrder.deliveryFee > 0 && (
                                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <span className="font-medium text-gray-900">
                                              Delivery Fee
                                            </span>
                                            <span className="font-bold text-blue-700">
                                              GH₵
                                              {selectedOrder.deliveryFee.toFixed(
                                                2
                                              )}
                                            </span>
                                          </div>
                                        )}
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                          <span className="font-bold text-gray-900">
                                            Total
                                          </span>
                                          <span className="font-bold text-xl text-green-700">
                                            GH₵{selectedOrder.total.toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  {/* Special Notes Card */}
                                  {selectedOrder.notes && (
                                    <Card className="border border-yellow-200 shadow-sm bg-yellow-50/30">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-yellow-700">
                                              !
                                            </span>
                                          </div>
                                          Special Notes
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-gray-700 bg-yellow-100 p-3 rounded-lg border border-yellow-200">
                                          {selectedOrder.notes}
                                        </p>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                      Order Actions
                                    </h4>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                      {(() => {
                                        const currentIndex =
                                          statusOrder.indexOf(
                                            selectedOrder.status
                                          );
                                        return statusOrder
                                          .slice(currentIndex + 1)
                                          .map((nextStatus) => (
                                            <Button
                                              key={nextStatus}
                                              onClick={() =>
                                                updateOrderStatus(
                                                  selectedOrder.id,
                                                  nextStatus
                                                )
                                              }
                                              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                            >
                                              {`Mark as ${capitalizeStatus(
                                                nextStatus
                                              )}`}
                                            </Button>
                                          ));
                                      })()}
                                    </div>
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
                                className="bg-white/70 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg border border-orange-200 transition-all"
                                disabled={
                                  order.status === "delivered" ||
                                  order.status === "cancelled"
                                }
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl shadow-lg border border-orange-100"
                            >
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
                                      className="hover:bg-orange-100 hover:text-orange-900 transition-colors"
                                    >
                                      {`Mark as ${capitalizeStatus(
                                        nextStatus
                                      )}`}
                                    </DropdownMenuItem>
                                  ));
                              })()}
                              {order.status !== "delivered" &&
                                order.status !== "cancelled" && (
                                  <DropdownMenuItem
                                    className="text-red-600 hover:bg-red-100 hover:text-red-900 transition-colors"
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
              )}
            </div>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              {isLoading ? (
                <DesktopTableSkeleton />
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {statusFilter === "all"
                      ? "No orders found"
                      : `No orders with status \"${statusFilter}\" found`}
                  </p>
                </div>
              ) : (
                <Table className="rounded-2xl overflow-hidden">
                  <TableHeader className="bg-gradient-to-r from-orange-50 to-purple-50">
                    <TableRow>
                      <TableHead className="font-bold text-gray-700">
                        Order ID
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">
                        Customer
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">
                        Type
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">
                        Destination
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">
                        Items
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">
                        Total
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">
                        Status
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">
                        Time
                      </TableHead>
                      <TableHead className="font-bold text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, idx) => (
                      <TableRow
                        key={order.id}
                        className={`transition-all duration-200 hover:bg-orange-50/60 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } fade-in`}
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        <TableCell className="font-semibold text-orange-700">
                          ORD-#{order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center gap-2 text-gray-900">
                              {order.customerName}
                              <a
                                href={`tel:${order.customerPhone}`}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
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
                          <Badge
                            variant="outline"
                            className="capitalize px-2 py-1 rounded-full border-orange-200 bg-orange-100 text-orange-700 font-semibold shadow-sm"
                          >
                            {order.orderType}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="flex items-start gap-1">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm truncate text-gray-700">
                                {order?.deliveryAddress?.street}
                              </div>
                              <div className="text-xs text-orange-600 font-semibold">
                                {order.estimatedDelivery}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate text-gray-700">
                            {order.items
                              .map(
                                (item: any) => `${item.quantity}x ${item.name}`
                              )
                              .join(", ")}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-lg text-orange-700">
                          GH₵{order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`px-3 py-1 rounded-full font-semibold shadow ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {capitalizeStatus(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatRelativeTime(order.paidAt, currentTime)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="bg-white/70 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg border border-orange-200 transition-all"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl rounded-2xl">
                                <DialogHeader className="pb-6">
                                  <DialogTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
                                    <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                                    Order Details - ORD-#
                                    {selectedOrder?.orderNumber}
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-600 mt-2">
                                    Complete order information and delivery
                                    details
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedOrder && (
                                  <div className="space-y-6">
                                    {/* Status Overview Card */}
                                    <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl p-4 border border-orange-200/50">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h3 className="font-semibold text-gray-900 mb-1">
                                            Order Status
                                          </h3>
                                          <Badge
                                            className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getStatusColor(
                                              selectedOrder.status
                                            )}`}
                                          >
                                            {capitalizeStatus(
                                              selectedOrder.status
                                            )}
                                          </Badge>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-sm text-gray-600">
                                            Order Time
                                          </p>
                                          <p className="font-semibold text-gray-900">
                                            {formatRelativeTime(
                                              selectedOrder.paidAt,
                                              currentTime
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Customer & Order Info Cards */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                      <Card className="border border-gray-200 shadow-sm">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                              <Phone className="h-3 w-3 text-blue-600" />
                                            </div>
                                            Customer Information
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                              Name
                                            </span>
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium text-gray-900">
                                                {selectedOrder.customerName}
                                              </span>
                                              <Link
                                                href={`tel:${selectedOrder.customerPhone}`}
                                                className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
                                                title="Call customer"
                                              >
                                                <Phone className="h-4 w-4" />
                                              </Link>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                              Phone
                                            </span>
                                            <span className="font-medium text-gray-900">
                                              {selectedOrder.customerPhone}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                              Order Type
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className="px-2 py-1 rounded-full border-orange-200 bg-orange-100 text-orange-700 font-semibold text-xs"
                                            >
                                              {selectedOrder.orderType}
                                            </Badge>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card className="border border-gray-200 shadow-sm">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                              <ChefHat className="h-3 w-3 text-green-600" />
                                            </div>
                                            Order Information
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                              Order ID
                                            </span>
                                            <span className="font-mono text-sm font-medium text-gray-900">
                                              {selectedOrder.id}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                              Total Amount
                                            </span>
                                            <span className="font-bold text-lg text-orange-700">
                                              GH₵
                                              {selectedOrder.total.toFixed(2)}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                              Items Count
                                            </span>
                                            <span className="font-medium text-gray-900">
                                              {selectedOrder.items.length} items
                                            </span>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {/* Delivery Information Card */}
                                    <Card className="border border-gray-200 shadow-sm">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                            <MapPin className="h-3 w-3 text-purple-600" />
                                          </div>
                                          Delivery Information
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-start gap-3">
                                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                          <div className="flex-1">
                                            <p className="text-sm text-gray-600 mb-1">
                                              Delivery Address
                                            </p>
                                            <p className="font-medium text-gray-900">
                                              {
                                                selectedOrder?.deliveryAddress
                                                  ?.street
                                              }
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-gray-600">
                                            Estimated Time
                                          </span>
                                          <span className="font-medium text-orange-700">
                                            {selectedOrder.estimatedDelivery}
                                          </span>
                                        </div>
                                        {selectedOrder.deliveryFee > 0 && (
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                              Delivery Fee
                                            </span>
                                            <span className="font-medium text-gray-900">
                                              GH₵
                                              {selectedOrder.deliveryFee.toFixed(
                                                2
                                              )}
                                            </span>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>

                                    {/* Order Items Card */}
                                    <Card className="border border-gray-200 shadow-sm">
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <ChefHat className="h-3 w-3 text-yellow-600" />
                                          </div>
                                          Order Items
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-3">
                                          {selectedOrder.items.map(
                                            (item: any, index: number) => (
                                              <div
                                                key={index}
                                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                                              >
                                                <div className="flex items-center gap-3">
                                                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold text-orange-700">
                                                      {item.quantity}
                                                    </span>
                                                  </div>
                                                  <span className="font-medium text-gray-900">
                                                    {item.name}
                                                  </span>
                                                </div>
                                                <span className="font-bold text-orange-700">
                                                  GH₵
                                                  {(
                                                    item.quantity * item.price
                                                  ).toFixed(2)}
                                                </span>
                                              </div>
                                            )
                                          )}
                                          {selectedOrder.deliveryFee > 0 && (
                                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                              <span className="font-medium text-gray-900">
                                                Delivery Fee
                                              </span>
                                              <span className="font-bold text-blue-700">
                                                GH₵
                                                {selectedOrder.deliveryFee.toFixed(
                                                  2
                                                )}
                                              </span>
                                            </div>
                                          )}
                                          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                            <span className="font-bold text-gray-900">
                                              Total
                                            </span>
                                            <span className="font-bold text-xl text-green-700">
                                              GH₵
                                              {selectedOrder.total.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    {/* Special Notes Card */}
                                    {selectedOrder.notes && (
                                      <Card className="border border-yellow-200 shadow-sm bg-yellow-50/30">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                              <span className="text-xs font-bold text-yellow-700">
                                                !
                                              </span>
                                            </div>
                                            Special Notes
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-gray-700 bg-yellow-100 p-3 rounded-lg border border-yellow-200">
                                            {selectedOrder.notes}
                                          </p>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                      <h4 className="font-semibold text-gray-900 mb-3">
                                        Order Actions
                                      </h4>
                                      <div className="flex flex-col sm:flex-row gap-3">
                                        {(() => {
                                          const currentIndex =
                                            statusOrder.indexOf(
                                              selectedOrder.status
                                            );
                                          return statusOrder
                                            .slice(currentIndex + 1)
                                            .map((nextStatus) => (
                                              <Button
                                                key={nextStatus}
                                                onClick={() =>
                                                  updateOrderStatus(
                                                    selectedOrder.id,
                                                    nextStatus
                                                  )
                                                }
                                                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                              >
                                                {`Mark as ${capitalizeStatus(
                                                  nextStatus
                                                )}`}
                                              </Button>
                                            ));
                                        })()}
                                      </div>
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
                                  className="bg-white/70 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg border border-orange-200 transition-all"
                                  disabled={
                                    order.status === "delivered" ||
                                    order.status === "cancelled"
                                  }
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="rounded-xl shadow-lg border border-orange-100"
                              >
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
                                          updateOrderStatus(
                                            order.id,
                                            nextStatus
                                          )
                                        }
                                        className="hover:bg-orange-100 hover:text-orange-900 transition-colors"
                                      >
                                        {`Mark as ${capitalizeStatus(
                                          nextStatus
                                        )}`}
                                      </DropdownMenuItem>
                                    ));
                                })()}
                                {order.status !== "delivered" &&
                                  order.status !== "cancelled" && (
                                    <DropdownMenuItem
                                      className="text-red-600 hover:bg-red-100 hover:text-red-900 transition-colors"
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
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="bg-white border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="btn-modern"
              onClick={() => setCancelDialogOpen(false)}
            >
              No, keep order
            </Button>
            <Button
              variant="destructive"
              className="btn-modern"
              onClick={handleCancelOrder}
            >
              Yes, cancel order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
