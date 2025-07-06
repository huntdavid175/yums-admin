import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Utensils, CheckCircle } from "lucide-react";
import React from "react";
import { useNow } from "@/components/ui/useNow";

interface KitchenCardProps {
  order: any;
  statusColor: string;
  borderColor: string;
  onClick?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  getPriorityColor: (priority: string) => string;
  capitalizeStatus: (status: string) => string;
  getItemStatusIcon: (status: string) => React.ReactNode;
  formatRelativeTime: (createdAt: any, now?: Date) => string;
  disabled?: boolean;
}

export function KitchenCard({
  order,
  statusColor,
  borderColor,
  onClick,
  onAction,
  actionLabel,
  actionIcon,
  getPriorityColor,
  capitalizeStatus,
  getItemStatusIcon,
  formatRelativeTime,
  disabled = false,
}: KitchenCardProps) {
  const now = useNow(60000);
  return (
    <Card
      className={`border-l-4 ${borderColor} cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base md:text-lg">
            ORD-#{order.orderNumber || order.id}
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
          {formatRelativeTime(order.createdAt, now)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Customer & Delivery Info */}
        <div className={`mb-3 p-2 ${statusColor} rounded text-xs md:text-sm`}>
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
            <span className="text-xs text-gray-600">{order.customerPhone}</span>
          </div>
          <div className="flex items-start gap-1">
            <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700">
                {order?.deliveryAddress?.street || "Pickup"}
              </p>
              <p className="text-orange-600 font-medium">
                {order.orderType === "delivery"
                  ? order.estimatedDelivery || "25-40 min"
                  : "Ready for pickup"}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {order.items?.map((item: any, index: number) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  {getItemStatusIcon(item.status || order.status || "pending")}
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
                  {item.extras.length > 2 && ` +${item.extras.length - 2} more`}
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
        {onAction && (
          <Button
            className="w-full text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            disabled={disabled}
          >
            {actionIcon}
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
