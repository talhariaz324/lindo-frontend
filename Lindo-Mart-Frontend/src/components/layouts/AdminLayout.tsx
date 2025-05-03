import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Bell,
  Users,
  Settings,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function AdminLayout({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications, markAsRead, unreadCount } = useNotifications();

  // Close sidebar when route changes on mobile/tablet
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Add notification sound effect
  useEffect(() => {
    const audio = new Audio("/notification.mp3");
    const playNotificationSound = () => {
      audio
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    };

    if (unreadCount > 0) {
      playNotificationSound();
      toast.info(
        `You have ${unreadCount} new notification${unreadCount > 1 ? "s" : ""}`
      );
    }
  }, [unreadCount]);

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      color: "text-sky-500",
    },
    {
      label: "Received Forms",
      icon: FileText,
      href: "/admin/received-forms",
      color: "text-violet-500",
    },
    {
      label: "Moved Forms",
      icon: FileText,
      href: "/admin/moved-forms",
      color: "text-pink-700",
    },
    {
      label: "User Management",
      icon: Users,
      href: "/admin/users",
      color: "text-emerald-500",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      color: "text-gray-500",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const NotificationButton = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative w-9 h-9 rounded-full bg-white/90 p-0 hover:bg-white/50 transition-colors">
            <Bell className="h-[1.2rem] w-[1.2rem] text-slate-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[280px] sm:w-[350px] md:w-[380px]"
        >
          <DropdownMenuLabel className="font-semibold">
            Notifications
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[var(--notification-height)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification._id}
                    className="flex flex-col items-start p-3 cursor-pointer hover:bg-accent focus:bg-accent"
                  >
                    <div className="flex items-start justify-between w-full gap-2">
                      <span className="font-medium line-clamp-2">
                        {notification.message}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </ScrollArea>
          <style jsx global>{`
            :root {
              --notification-height: ${Math.min(
                notifications.length * 80,
                240
              )}px;
            }
          `}</style>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const UserNav = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative h-9 w-9 rounded-full p-0 hover:bg-white/50 transition-colors">
            <Avatar className="h-9 w-9 border-2 border-white/20 bg-white/90">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white">
                {user?.username?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/admin/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent hover:text-slate-900 lg:hidden absolute left-4 top-4 z-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[280px] sm:w-[350px] p-0 bg-gray-100"
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  Admin Panel
                </h2>
                <div className="flex items-center gap-2">
                  <NotificationButton />
                  <UserNav />
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 px-3">
              <SidebarContent routes={routes} pathname={location.pathname} />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:w-72 lg:flex-col border-r bg-gray-100/40",
          className
        )}
      >
        <div className="lg:fixed lg:inset-y-0 lg:z-50 lg:w-72">
          <div className="flex h-full flex-col">
            <div className="px-3 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  Admin Panel
                </h2>
                <div className="flex items-center gap-2">
                  <NotificationButton />
                  <UserNav />
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 px-3">
              <SidebarContent routes={routes} pathname={location.pathname} />
            </ScrollArea>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72">
        <div className="h-full py-6 px-4 lg:px-8">
          {location.pathname === "/admin/settings" && (
            <div className="mb-6">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md bg-gray-100/50 hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

interface SidebarContentProps {
  routes: {
    label: string;
    icon: any;
    href: string;
    color?: string;
  }[];
  pathname: string;
}

function SidebarContent({ routes, pathname }: SidebarContentProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/60"
              )}
            >
              <route.icon className={cn("mr-2 h-4 w-4", route.color)} />
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
