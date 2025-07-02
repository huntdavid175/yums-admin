"use client";

import { useState } from "react";
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
import Link from "next/link";

// Extended mock data for delivery/takeaway orders
const allOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    phone: "+1 (555) 123-4567",
    items: [
      { name: "Classic Burger", quantity: 2, price: 12.99 },
      { name: "French Fries", quantity: 1, price: 4.99 },
    ],
    total: 30.97,
    status: "preparing",
    time: "10 min ago",
    orderType: "delivery",
    address: "123 Main St, Apt 4B, Downtown",
    estimatedDelivery: "25-35 min",
    date: "2024-01-07",
    notes: "Ring doorbell twice, no onions on burger",
    deliveryFee: 3.99,
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    phone: "+1 (555) 987-6543",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 14.99 },
      { name: "Coca Cola", quantity: 2, price: 2.99 },
    ],
    total: 20.97,
    status: "ready",
    time: "5 min ago",
    orderType: "takeaway",
    address: "Pickup at store",
    estimatedDelivery: "Ready for pickup",
    date: "2024-01-07",
    notes: "Customer will arrive in 10 minutes",
    deliveryFee: 0,
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    phone: "+1 (555) 456-7890",
    items: [
      { name: "Fish Tacos", quantity: 3, price: 8.99 },
      { name: "Caesar Salad", quantity: 1, price: 8.99 },
    ],
    total: 35.96,
    status: "delivered",
    time: "15 min ago",
    orderType: "delivery",
    address: "456 Oak Ave, House with blue door",
    estimatedDelivery: "Delivered",
    date: "2024-01-07",
    notes: "Extra lime, left at door",
    deliveryFee: 3.99,
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    phone: "+1 (555) 321-0987",
    items: [
      { name: "Chicken Pasta", quantity: 1, price: 16.99 },
      { name: "House Wine", quantity: 1, price: 8.99 },
    ],
    total: 25.98,
    status: "new",
    time: "2 min ago",
    orderType: "delivery",
    address: "789 Pine St, Unit 12, Riverside Complex",
    estimatedDelivery: "30-40 min",
    date: "2024-01-07",
    notes: "Call when arriving, gate code: 1234",
    deliveryFee: 3.99,
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    phone: "+1 (555) 654-3210",
    items: [
      { name: "BBQ Ribs", quantity: 1, price: 22.99 },
      { name: "Coleslaw", quantity: 1, price: 3.99 },
    ],
    total: 26.98,
    status: "cancelled",
    time: "1 hour ago",
    orderType: "takeaway",
    address: "Pickup at store",
    estimatedDelivery: "Cancelled",
    date: "2024-01-07",
    notes: "Customer cancelled - refund processed",
    deliveryFee: 0,
  },
  {
    id: "ORD-006",
    customer: "Lisa Garcia",
    phone: "+1 (555) 789-0123",
    items: [
      { name: "Vegetarian Wrap", quantity: 2, price: 9.99 },
      { name: "Sweet Potato Fries", quantity: 1, price: 5.99 },
    ],
    total: 25.97,
    status: "completed",
    time: "2 hours ago",
    orderType: "delivery",
    address: "321 Elm St, Apartment 3B, Green building",
    estimatedDelivery: "Delivered",
    date: "2024-01-07",
    notes: "Leave at door, customer tipped via app",
    deliveryFee: 3.99,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
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

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

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
                    <a href="/" className="w-full">
                      Dashboard
                    </a>
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
              Orders ({filteredOrders.length})
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
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{order.id}</span>
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
                          <p className="font-medium">{order.customer}</p>
                          <a
                            href={`tel:${order.phone}`}
                            className="text-blue-600"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        </div>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                        <div className="flex items-start gap-1 mt-1">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-600">
                              {order.address}
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
                            .map((item) => `${item.quantity}x ${item.name}`)
                            .join(", ")}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-medium">
                            ${order.total.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {order.time}
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
                                      {selectedOrder.address}
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
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                updateOrderStatus(order.id, "preparing")
                              }
                            >
                              Mark as Preparing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateOrderStatus(order.id, "ready")
                              }
                            >
                              Mark as Ready
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateOrderStatus(order.id, "delivered")
                              }
                            >
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Cancel Order
                            </DropdownMenuItem>
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
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {order.customer}
                            <a
                              href={`tel:${order.phone}`}
                              className="text-blue-600"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.phone}
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
                              {order.address}
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
                            .map((item) => `${item.quantity}x ${item.name}`)
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
                      <TableCell>{order.time}</TableCell>
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
                                        {selectedOrder.address}
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
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  updateOrderStatus(order.id, "preparing")
                                }
                              >
                                Mark as Preparing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateOrderStatus(order.id, "ready")
                                }
                              >
                                Mark as Ready
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateOrderStatus(order.id, "delivered")
                                }
                              >
                                Mark as Delivered
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Cancel Order
                              </DropdownMenuItem>
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
    </div>
  );
}
