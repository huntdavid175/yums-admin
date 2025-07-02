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
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  ChefHat,
  Clock,
  DollarSign,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { subscribeUser, unsubscribeUser, sendNotification } from "./actions";

// PWA code
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  );
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
}

// Mock data updated for delivery/takeaway
const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    phone: "+1 (555) 123-4567",
    items: "2x Burger, 1x Fries",
    total: 24.99,
    status: "preparing",
    time: "10 min ago",
    orderType: "delivery",
    address: "123 Main St, Apt 4B, Downtown",
    estimatedDelivery: "25-35 min",
    notes: "Ring doorbell twice, no onions on burger",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    phone: "+1 (555) 987-6543",
    items: "1x Pizza, 2x Coke",
    total: 18.5,
    status: "ready",
    time: "5 min ago",
    orderType: "takeaway",
    address: "Pickup at store",
    estimatedDelivery: "Ready for pickup",
    notes: "Customer will arrive in 10 minutes",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    phone: "+1 (555) 456-7890",
    items: "3x Tacos, 1x Salad",
    total: 32.75,
    status: "delivered",
    time: "15 min ago",
    orderType: "delivery",
    address: "456 Oak Ave, House with blue door",
    estimatedDelivery: "Delivered",
    notes: "Extra lime, left at door",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    phone: "+1 (555) 321-0987",
    items: "1x Pasta, 1x Wine",
    total: 28.0,
    status: "new",
    time: "2 min ago",
    orderType: "delivery",
    address: "789 Pine St, Unit 12, Riverside Complex",
    estimatedDelivery: "30-40 min",
    notes: "Call when arriving, gate code: 1234",
  },
];

const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Main",
    price: 12.99,
    description: "Beef patty with lettuce, tomato, and cheese",
    available: true,
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Main",
    price: 14.99,
    description: "Fresh mozzarella, tomato sauce, and basil",
    available: true,
  },
  {
    id: 3,
    name: "Caesar Salad",
    category: "Appetizer",
    price: 8.99,
    description: "Romaine lettuce, croutons, parmesan, caesar dressing",
    available: true,
  },
  {
    id: 4,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 6.99,
    description: "Rich chocolate cake with vanilla ice cream",
    available: false,
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
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function RestaurantDashboard() {
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    available: true,
  });

  const handleAddItem = () => {
    // Handle adding new menu item
    console.log("Adding new item:", newItem);
    setNewItem({
      name: "",
      category: "",
      price: "",
      description: "",
      available: true,
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // Handle order status update
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <PushNotificationManager />
      <InstallPrompt /> */}
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
            <a href="/" className="text-orange-600 font-medium">
              Dashboard
            </a>
            <a
              href="/orders"
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              All Orders
            </a>
            <a
              href="/kitchen"
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              Kitchen View
            </a>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Active Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last hour</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                Today's Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">$1,247</div>
              <p className="text-xs text-muted-foreground">
                +15% from yesterday
              </p>
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
              <div className="text-xl md:text-2xl font-bold">8</div>
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
              <div className="text-xl md:text-2xl font-bold">28m</div>
              <p className="text-xs text-muted-foreground">-5m from average</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Orders and Menu */}
        <Tabs defaultValue="orders" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] md:max-w-[500px]">
            <TabsTrigger value="orders" className="text-sm">
              Order Management
            </TabsTrigger>
            <TabsTrigger value="menu" className="text-sm">
              Menu Management
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
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
                            <p className="text-sm text-gray-600">
                              {order.address}
                            </p>
                          </div>
                          <p className="text-xs text-orange-600 mt-1">
                            {order.estimatedDelivery}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 truncate">
                            {order.items}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-medium">${order.total}</span>
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
                        <TableHead>Time</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
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
                          <TableCell className="max-w-[200px] truncate">
                            {order.items}
                          </TableCell>
                          <TableCell>${order.total}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.time}</TableCell>
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

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl">
                      Menu Items
                    </CardTitle>
                    <CardDescription>
                      Manage your restaurant's menu items
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Menu Item</DialogTitle>
                        <DialogDescription>
                          Add a new item to your restaurant menu.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={newItem.name}
                            onChange={(e) =>
                              setNewItem({ ...newItem, name: e.target.value })
                            }
                            placeholder="Item name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newItem.category}
                            onValueChange={(value) =>
                              setNewItem({ ...newItem, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="appetizer">
                                Appetizer
                              </SelectItem>
                              <SelectItem value="main">Main Course</SelectItem>
                              <SelectItem value="dessert">Dessert</SelectItem>
                              <SelectItem value="beverage">Beverage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newItem.price}
                            onChange={(e) =>
                              setNewItem({ ...newItem, price: e.target.value })
                            }
                            placeholder="0.00"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newItem.description}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                description: e.target.value,
                              })
                            }
                            placeholder="Item description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={handleAddItem}
                          className="w-full md:w-auto"
                        >
                          Add Item
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold truncate">
                                {item.name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                            <Badge
                              variant={item.available ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {item.available ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          ${item.price}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
