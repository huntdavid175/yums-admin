// import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { MoreHorizontal, Phone, MapPin, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: any[];
  total: number;
  status: string;
  orderType: string;
  deliveryAddress?: {
    street: string;
  };
  notes?: string;
}

interface OrderManagementProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-yellow-100 text-yellow-800";
    case "ready":
      return "bg-green-100 text-green-800";
    case "delivered":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function OrderManagement({
  orders,
  updateOrderStatus,
}: OrderManagementProps) {
  return (
    <TabsContent value="orders" className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">
                Recent Orders
              </CardTitle>
              <CardDescription>
                Manage delivery and takeaway orders
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8 w-full md:w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile/Tablet Order Cards */}
          <div className="lg:hidden space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      ORD-{order.id.slice(2, 6)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
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
                      <p className="text-sm text-gray-600">
                        {order?.deliveryAddress?.street}
                      </p>
                    </div>
                    <p className="text-xs text-orange-600 mt-1">
                      {order.status === "pending" &&
                      order.orderType === "pickup"
                        ? "40 min"
                        : "Ready"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 truncate">
                      {order.items.map(
                        (item: any) => item.name + "x" + item.quantity
                      )}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-medium">GH₵{order.total}</span>
                    </div>
                  </div>
                  {order.notes && (
                    <div className="p-2 bg-yellow-50 rounded text-xs">
                      <strong>Notes:</strong> {order.notes}
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                      >
                        Mark as Preparing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "ready")}
                      >
                        Mark as Ready
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                      >
                        Mark as Delivered
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      ORD-{order.id.slice(2, 6)}
                    </TableCell>
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
                            {order.status === "pending" &&
                            order.orderType === "pickup"
                              ? "40 min"
                              : "Ready"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {order.items.map(
                        (item: any) => item.name + "x" + item.quantity
                      )}
                    </TableCell>
                    <TableCell>GH₵{order.total}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
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
                            onClick={() => updateOrderStatus(order.id, "ready")}
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
