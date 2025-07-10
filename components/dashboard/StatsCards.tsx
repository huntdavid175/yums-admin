import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  DollarSign,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

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
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
      {/* Active Orders Card */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
          <CardTitle className="text-sm font-semibold text-blue-700">
            Active Orders
          </CardTitle>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <ShoppingCart className="h-5 w-5 text-blue-600 relative z-10" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl md:text-3xl font-bold text-blue-800 mb-1">
            {activeOrders}
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <TrendingUp className="h-3 w-3" />
            <span>+2 from last hour</span>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Card */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
          <CardTitle className="text-sm font-semibold text-green-700">
            Today&apos;s Revenue
          </CardTitle>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <DollarSign className="h-5 w-5 text-green-600 relative z-10" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl md:text-3xl font-bold text-green-800 mb-1">
            GH₵{todayRevenue}
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>+15% from yesterday</span>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Card */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
          <CardTitle className="text-sm font-semibold text-orange-700">
            Deliveries
          </CardTitle>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <MapPin className="h-5 w-5 text-orange-600 relative z-10" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl md:text-3xl font-bold text-orange-800 mb-1">
            {deliveries}
          </div>
          <div className="flex items-center gap-1 text-xs text-orange-600">
            <span>4 takeaway</span>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Time Card */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
          <CardTitle className="text-sm font-semibold text-purple-700">
            Avg. Delivery Time
          </CardTitle>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <Clock className="h-5 w-5 text-purple-600 relative z-10" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl md:text-3xl font-bold text-purple-800 mb-1">
            {avgDeliveryTime}m
          </div>
          <div className="flex items-center gap-1 text-xs text-purple-600">
            <TrendingDown className="h-3 w-3" />
            <span>-5m from average</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
