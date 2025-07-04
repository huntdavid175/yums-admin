import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import React from "react";

const statusOrder = ["pending", "preparing", "ready", "delivered"];

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

export interface OrderDialogProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateOrderStatus: any;
}

export const OrderDialog: React.FC<OrderDialogProps> = ({
  order,
  open,
  onOpenChange,
  updateOrderStatus,
}) => {
  if (!order) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order?.id}</DialogTitle>
          <DialogDescription>
            Complete order information and delivery details
          </DialogDescription>
        </DialogHeader>
        {order && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong>Name:</strong> {order.customer}
                    <a href={`tel:${order.phone}`} className="text-blue-600">
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                  <p>
                    <strong>Phone:</strong> {order.phone}
                  </p>
                  <p>
                    <strong>Type:</strong> {order.orderType}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Information</h4>
                <div className="space-y-1">
                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </p>
                  <p>
                    <strong>Time:</strong> {order.time}
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.total.toFixed(2)}
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
                  <strong>Address:</strong> {order.address}
                </p>
                <p>
                  <strong>Estimated Time:</strong> {order.estimatedDelivery}
                </p>
                {order.deliveryFee > 0 && (
                  <p>
                    <strong>Delivery Fee:</strong> $
                    {order.deliveryFee.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Order Items</h4>
              <div className="space-y-2">
                {order.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>Delivery Fee</span>
                    <span className="font-medium">
                      ${order.deliveryFee.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center p-2 bg-green-50 rounded font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {order.notes && (
              <div>
                <h4 className="font-semibold mb-2">Special Notes</h4>
                <p className="text-sm bg-yellow-50 p-3 rounded">
                  {order.notes}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              {(() => {
                const currentIndex = statusOrder.indexOf(order.status);
                return statusOrder.slice(currentIndex + 1).map((nextStatus) => (
                  <Button
                    key={nextStatus}
                    onClick={() => updateOrderStatus(order.id, nextStatus)}
                    className="w-full sm:w-auto"
                  >
                    {`Mark as ${
                      nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)
                    }`}
                  </Button>
                ));
              })()}
              {order.status !== "delivered" && (
                <Button
                  variant="destructive"
                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                  className="w-full sm:w-auto"
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
