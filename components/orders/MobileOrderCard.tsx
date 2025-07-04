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
import { OrderDialog } from "@/components/orders/OrderDialog";

import React from "react";

const MobileOrderCard = ({
  orders,
  updateOrderStatus,
  getStatusColor,
  setSelectedOrder,
  setCancelOrder,
  setCancelDialogOpen,
  statusOrder,
}: {
  orders: any;
  updateOrderStatus: any;
  getStatusColor: any;
  setSelectedOrder: any;
  setCancelOrder: any;
  setCancelDialogOpen: any;
  statusOrder: any;
}) => {
  return (
    <>
      {" "}
      {/* Mobile/Tablet Order Cards */}
      <div className="lg:hidden">
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order: any) => (
            <Card key={order.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* <span className="font-medium">{order.id}</span> */}
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
                    <p className="font-medium">{order.customer}</p>
                    <a href={`tel:${order.phone}`} className="text-blue-600">
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                  <div className="flex items-start gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{order.address}</p>
                      <p className="text-xs text-orange-600">
                        {order.estimatedDelivery}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {order.items
                      .map((item: any) => `${item.quantity}x ${item.name}`)
                      .join(", ")}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-medium">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">{order.time}</span>
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
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        disabled={order.status === "delivered"}
                      >
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {(() => {
                        const currentIndex = statusOrder.indexOf(order.status);
                        return statusOrder
                          .slice(currentIndex + 1)
                          .map((nextStatus: any) => (
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
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileOrderCard;
