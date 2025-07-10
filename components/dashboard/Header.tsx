import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChefHat,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 shadow-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      <div className="relative px-4 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-2">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                RestaurantPro
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              </h1>
              <p className="text-xs md:text-sm text-orange-100 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Delivery & Takeaway Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white font-medium px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              Dashboard
            </Link>
            <Link
              href="/orders"
              className="text-orange-100 hover:text-white font-medium transition-colors duration-200"
            >
              All Orders
            </Link>
            <Link
              href="/kitchen"
              className="text-orange-100 hover:text-white font-medium transition-colors duration-200"
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
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link href="/" className="w-full flex items-center gap-2">
                      <ChefHat className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/orders"
                      className="w-full flex items-center gap-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      All Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/kitchen"
                      className="w-full flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Kitchen View
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Only - Notifications and User */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="text-white text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
