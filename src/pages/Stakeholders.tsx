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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sprout, Search, Bell, User, LogOut, Menu, LayoutDashboard, 
  Route, Package, Users, Settings, MapPin, Mail, Phone,
  Tractor, Building2, Truck, Plus, Filter, MoreHorizontal
} from "lucide-react";

interface User {
  address: string;
  role: string;
  connectedAt: string;
}

interface Stakeholder {
  id: string;
  type: 'farmer' | 'retailer' | 'distributor';
  name: string;
  contactName: string;
  email: string;
  phone: string;
  metadata: {
    farmSize?: string;
    certification?: string;
    storeCount?: number;
    storeType?: string;
    coverageArea?: string;
    vehicles?: number;
  };
  status: 'active' | 'inactive' | 'pending';
  joinedDate: string;
}

const Stakeholders = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
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

    // Simulate loading stakeholder data
    setTimeout(() => {
      const mockStakeholders: Stakeholder[] = [
        // Farmers
        {
          id: "1",
          type: "farmer",
          name: "Peterson Organic Farm",
          contactName: "John Peterson",
          email: "john@petersonorganic.com",
          phone: "+1 (555) 123-4567",
          metadata: {
            farmSize: "150 acres",
            certification: "USDA Organic"
          },
          status: "active",
          joinedDate: "2024-01-15"
        },
        {
          id: "2",
          type: "farmer", 
          name: "Rodriguez Family Farms",
          contactName: "Maria Rodriguez",
          email: "maria@rodriguezfarms.com",
          phone: "+1 (555) 234-5678",
          metadata: {
            farmSize: "300 acres",
            certification: "Conventional"
          },
          status: "active",
          joinedDate: "2024-02-20"
        },
        {
          id: "3",
          type: "farmer",
          name: "Sunrise Sustainable Farm", 
          contactName: "David Chen",
          email: "david@sunrisesustainable.com",
          phone: "+1 (555) 345-6789",
          metadata: {
            farmSize: "85 acres",
            certification: "Hydroponic"
          },
          status: "active",
          joinedDate: "2024-03-10"
        },
        {
          id: "4",
          type: "farmer",
          name: "Green Valley Produce",
          contactName: "Sarah Williams", 
          email: "sarah@greenvalley.com",
          phone: "+1 (555) 456-7890",
          metadata: {
            farmSize: "220 acres",
            certification: "USDA Organic"
          },
          status: "pending",
          joinedDate: "2024-09-15"
        },
        // Retailers
        {
          id: "5",
          type: "retailer",
          name: "FreshMart Supermarkets",
          contactName: "Michael Thompson",
          email: "mike@freshmart.com", 
          phone: "+1 (555) 567-8901",
          metadata: {
            storeCount: 15,
            storeType: "Supermarket Chain"
          },
          status: "active",
          joinedDate: "2024-01-05"
        },
        {
          id: "6",
          type: "retailer",
          name: "Corner Market",
          contactName: "Emily Davis",
          email: "emily@cornermarket.com",
          phone: "+1 (555) 678-9012",
          metadata: {
            storeCount: 3,
            storeType: "Local Market"
          },
          status: "active",
          joinedDate: "2024-04-12"
        },
        {
          id: "7",
          type: "retailer",
          name: "Organic Plus",
          contactName: "Robert Johnson",
          email: "robert@organicplus.com",
          phone: "+1 (555) 789-0123",
          metadata: {
            storeCount: 7,
            storeType: "Specialty Store"
          },
          status: "active",
          joinedDate: "2024-06-18"
        },
        // Distributors
        {
          id: "8",
          type: "distributor",
          name: "CaliFresh Distribution",
          contactName: "Lisa Anderson",
          email: "lisa@califresh.com",
          phone: "+1 (555) 890-1234",
          metadata: {
            coverageArea: "Northern California",
            vehicles: 25
          },
          status: "active",
          joinedDate: "2024-01-20"
        },
        {
          id: "9",
          type: "distributor",
          name: "Pacific Logistics",
          contactName: "James Wilson",
          email: "james@pacificlogistics.com",
          phone: "+1 (555) 901-2345",
          metadata: {
            coverageArea: "Southern California", 
            vehicles: 40
          },
          status: "active",
          joinedDate: "2024-02-28"
        },
        {
          id: "10",
          type: "distributor",
          name: "Valley Transport",
          contactName: "Amanda Brown",
          email: "amanda@valleytransport.com",
          phone: "+1 (555) 012-3456",
          metadata: {
            coverageArea: "Central Valley",
            vehicles: 18
          },
          status: "inactive",
          joinedDate: "2024-05-15"
        }
      ];

      setStakeholders(mockStakeholders);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('agritrace-user');
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'pending': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'farmer': return Tractor;
      case 'retailer': return Building2;
      case 'distributor': return Truck;
      default: return User;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'farmer': return 'text-green-600 bg-green-50';
      case 'retailer': return 'text-blue-600 bg-blue-50'; 
      case 'distributor': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredStakeholders = stakeholders.filter(stakeholder => {
    const matchesSearch = 
      stakeholder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stakeholder.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stakeholder.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || stakeholder.type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getTabCounts = () => {
    return {
      all: stakeholders.length,
      farmer: stakeholders.filter(s => s.type === 'farmer').length,
      retailer: stakeholders.filter(s => s.type === 'retailer').length,
      distributor: stakeholders.filter(s => s.type === 'distributor').length,
    };
  };

  const tabCounts = getTabCounts();

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", onClick: () => navigate('/dashboard') },
    { icon: Route, label: "Traceability", onClick: () => navigate('/traceability') },
    { icon: Package, label: "Register Batch", onClick: () => navigate('/register') },
    { icon: Users, label: "Stakeholders", active: true },
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
                placeholder="Search stakeholders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input-modern"
              />
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                3
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
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Stakeholders</h1>
                  <p className="text-muted-foreground">Manage farmers, retailers, and distributors in your network</p>
                </div>
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stakeholder
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Filters */}
              <Card className="card-modern">
                <CardContent className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between">
                      <TabsList className="grid w-full max-w-md grid-cols-4">
                        <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
                        <TabsTrigger value="farmer">Farmers ({tabCounts.farmer})</TabsTrigger>
                        <TabsTrigger value="retailer">Retailers ({tabCounts.retailer})</TabsTrigger>
                        <TabsTrigger value="distributor">Distributors ({tabCounts.distributor})</TabsTrigger>
                      </TabsList>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        More Filters
                      </Button>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Stakeholder Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStakeholders.map((stakeholder) => {
                  const TypeIcon = getTypeIcon(stakeholder.type);
                  return (
                    <Card key={stakeholder.id} className="card-modern hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(stakeholder.type)}`}>
                              <TypeIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                              <CardDescription>{stakeholder.contactName}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(stakeholder.status)} text-white text-xs`}>
                              {stakeholder.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <Separator className="my-1" />
                                <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {stakeholder.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {stakeholder.phone}
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          {stakeholder.type === 'farmer' && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Farm Size:</span>
                                <span className="font-medium">{stakeholder.metadata.farmSize}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Certification:</span>
                                <Badge variant="outline" className="text-xs">
                                  {stakeholder.metadata.certification}
                                </Badge>
                              </div>
                            </>
                          )}
                          {stakeholder.type === 'retailer' && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Store Count:</span>
                                <span className="font-medium">{stakeholder.metadata.storeCount}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Type:</span>
                                <Badge variant="outline" className="text-xs">
                                  {stakeholder.metadata.storeType}
                                </Badge>
                              </div>
                            </>
                          )}
                          {stakeholder.type === 'distributor' && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Coverage:</span>
                                <span className="font-medium text-xs">{stakeholder.metadata.coverageArea}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Vehicles:</span>
                                <span className="font-medium">{stakeholder.metadata.vehicles}</span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(stakeholder.joinedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredStakeholders.length === 0 && (
                <Card className="card-modern">
                  <CardContent className="p-12 text-center">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No stakeholders found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? 'Try adjusting your search criteria' : 'Start by adding your first stakeholder'}
                    </p>
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stakeholder
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Stakeholders;