import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChefHat, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
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
          <Link href="/" className="text-orange-600 font-medium">
            Dashboard
          </Link>
          <Link
            href="/orders"
            className="text-gray-700 hover:text-orange-600 font-medium"
          >
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
                  <Link href="/orders" className="w-full">
                    All Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/kitchen" className="w-full">
                    Kitchen View
                  </Link>
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
  );
}
