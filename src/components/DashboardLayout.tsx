import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Sprout, Bell, User, LogOut, Menu, LayoutDashboard, Route, Package, Users, Settings } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

interface UserData {
  address: string;
  role: string;
  connectedAt: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('agritrace-user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('agritrace-user');
    navigate('/login');
  };

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", onClick: () => navigate('/dashboard') },
    { icon: Route, label: "Traceability", onClick: () => navigate('/traceability') },
    { icon: Package, label: "Register Batch", onClick: () => navigate('/register') },
    { icon: Users, label: "Stakeholders", onClick: () => navigate('/stakeholders') },
    { icon: Settings, label: "Settings", onClick: () => navigate('/settings') }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Sprout className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold">AgriTrace</h2>
                    <p className="text-sm text-muted-foreground">Farm to Table</p>
                  </div>
                </div>
                <nav className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={item.onClick}
                      >
                        <IconComponent className="mr-3 h-4 w-4" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-primary">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-lg">AgriTrace</h1>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.role.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <Separator className="my-1" />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-72 flex-col bg-sidebar border-r border-sidebar-border min-h-[calc(100vh-65px)]">
          <div className="p-6">
            <nav className="space-y-2">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={item.onClick}
                  >
                    <IconComponent className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;