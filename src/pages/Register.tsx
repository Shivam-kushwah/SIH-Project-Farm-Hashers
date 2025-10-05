import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useContract } from "@/ContractContext";
import { 
  Sprout, Search, Bell, User, LogOut, Menu, LayoutDashboard, 
  Route, Package, Users, Settings
} from "lucide-react";

interface User {
  address: string;
  role: string;
  connectedAt: string;
}

const Register = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('agritrace-user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('agritrace-user');
    navigate('/login');
  };

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", onClick: () => navigate('/dashboard') },
    { icon: Route, label: "Traceability", onClick: () => navigate('/traceability') },
    { icon: Package, label: "Register Batch", active: true },
    { icon: Users, label: "Stakeholders", onClick: () => navigate('/stakeholders') },
    { icon: Settings, label: "Settings", onClick: () => navigate('/settings') }
  ];

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
                        variant={item.active ? "secondary" : "ghost"}
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
                <p className="text-sm text-muted-foreground">Farm to Table</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="hidden sm:flex items-center max-w-md w-full mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search batches, farms..."
                className="pl-10 input-modern"
              />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                2
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user?.role.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">
                      {user?.address.slice(0, 6)}...{user?.address.slice(-4)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
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
        <aside className="hidden md:flex w-72 flex-col bg-sidebar border-r border-sidebar-border">
          <div className="p-6">
            <nav className="space-y-2">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={index}
                    variant={item.active ? "secondary" : "ghost"}
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
            <div className="flex items-center justify-center min-h-[600px]">
              <Card className="card-modern max-w-md w-full">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Package className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-4">Batch Registration</CardTitle>
                  <CardDescription className="text-base leading-relaxed mb-6">
                    Register new agricultural batches functionality will be implemented here. This feature will allow you to:
                  </CardDescription>
                  <div className="text-left space-y-2 mb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Register new produce batches</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Set quality standards and certifications</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Generate blockchain records</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Track from farm to consumer</span>
                    </div>
                  </div>
                  <Button className="btn-primary w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;