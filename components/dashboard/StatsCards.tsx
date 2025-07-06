import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, DollarSign, MapPin, Clock } from "lucide-react";

interface StatsCardsProps {
  activeOrders: number;
  todayRevenue: number;
  deliveries: number;
  avgDeliveryTime: number;
}

export function StatsCards({
  activeOrders,
  todayRevenue,
  deliveries,
  avgDeliveryTime,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Active Orders
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{activeOrders}</div>
          <p className="text-xs text-muted-foreground">+2 from last hour</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Today&apos;s Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">GH₵{todayRevenue}</div>
          <p className="text-xs text-muted-foreground">+15% from yesterday</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Deliveries
          </CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{deliveries}</div>
          <p className="text-xs text-muted-foreground">4 takeaway</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            Avg. Delivery Time
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {avgDeliveryTime}m
          </div>
          <p className="text-xs text-muted-foreground">-5m from average</p>
        </CardContent>
      </Card>
    </div>
  );
}
