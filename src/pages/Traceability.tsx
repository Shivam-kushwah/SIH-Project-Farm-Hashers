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
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sprout, Search, Bell, User, LogOut, Menu, LayoutDashboard, 
  Route, Package, Users, Settings, Activity, ChevronRight,
  MapPin, Calendar, CheckCircle, Clock, Truck, ArrowRight, Filter
} from "lucide-react";

interface User {
  address: string;
  role: string;
  connectedAt: string;
}

interface Batch {
  id: string;
  code: string;
  product: string;
  quantity: string;
  status: 'Created' | 'In Transit' | 'Verified' | 'Delivered';
  originFarm: string;
  currentLocation: string;
  createdAt: string;
  updatedAt: string;
}

interface ActivityTimeline {
  id: string;
  type: 'batch_created' | 'verification_complete' | 'location_update' | 'status_change';
  title: string;
  description: string;
  timestamp: string;
  location?: string;
}

const Traceability = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [timeline, setTimeline] = useState<ActivityTimeline[]>([]);
  const [loading, setLoading] = useState(true);
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

    // Simulate loading data
    setTimeout(() => {
      const mockBatches: Batch[] = [
        {
          id: "1",
          code: "AGT-003",
          product: "Organic Carrots",
          quantity: "300 kg",
          status: "Created",
          originFarm: "Green Valley Produce",
          currentLocation: "Green Valley Produce",
          createdAt: "2025-09-16T10:00:00Z",
          updatedAt: "2025-09-16T10:00:00Z"
        },
        {
          id: "2",
          code: "AGT-005", 
          product: "Organic Spinach",
          quantity: "100 kg",
          status: "In Transit",
          originFarm: "Peterson Organic Farm",
          currentLocation: "Distribution Center A",
          createdAt: "2025-09-15T08:30:00Z",
          updatedAt: "2025-09-16T09:15:00Z"
        },
        {
          id: "3",
          code: "AGT-002",
          product: "Hydroponic Lettuce",
          quantity: "150 kg", 
          status: "Delivered",
          originFarm: "Sunrise Sustainable Farm",
          currentLocation: "FreshMart Store #12",
          createdAt: "2025-09-14T07:00:00Z",
          updatedAt: "2025-09-16T14:30:00Z"
        },
        {
          id: "4",
          code: "AGT-001",
          product: "Organic Tomatoes",
          quantity: "200 kg",
          status: "Verified",
          originFarm: "Rodriguez Family Farms",
          currentLocation: "Quality Control Center",
          createdAt: "2025-09-13T09:00:00Z",
          updatedAt: "2025-09-15T16:20:00Z"
        }
      ];

      setBatches(mockBatches);
      setSelectedBatch(mockBatches[0]);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  useEffect(() => {
    if (selectedBatch) {
      // Generate timeline for selected batch
      const mockTimeline: ActivityTimeline[] = [
        {
          id: "1",
          type: "batch_created",
          title: "Batch Created",
          description: `${selectedBatch.product} batch registered at ${selectedBatch.originFarm}`,
          timestamp: selectedBatch.createdAt,
          location: selectedBatch.originFarm
        },
        {
          id: "2", 
          type: "verification_complete",
          title: "Quality Verification",
          description: "Organic certification and quality standards verified",
          timestamp: "2025-09-16T11:30:00Z",
          location: selectedBatch.originFarm
        }
      ];

      if (selectedBatch.status !== 'Created') {
        mockTimeline.push({
          id: "3",
          type: "location_update",
          title: "In Transit",
          description: "Batch picked up and en route to distribution center",
          timestamp: "2025-09-16T13:00:00Z",
          location: "Distribution Center A"
        });
      }

      if (selectedBatch.status === 'Delivered') {
        mockTimeline.push({
          id: "4", 
          type: "status_change",
          title: "Delivered",
          description: "Batch successfully delivered to retail location",
          timestamp: selectedBatch.updatedAt,
          location: selectedBatch.currentLocation
        });
      }

      setTimeline(mockTimeline);
    }
  }, [selectedBatch]);

  const logout = () => {
    localStorage.removeItem('agritrace-user');
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Created': return 'bg-blue-500';
      case 'In Transit': return 'bg-orange-500';
      case 'Verified': return 'bg-green-500';
      case 'Delivered': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'batch_created': return Package;
      case 'verification_complete': return CheckCircle;
      case 'location_update': return Truck;
      case 'status_change': return MapPin;
      default: return Clock;
    }
  };

  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'batch_created': return 'text-blue-500 bg-blue-50';
      case 'verification_complete': return 'text-green-500 bg-green-50';
      case 'location_update': return 'text-orange-500 bg-orange-50';
      case 'status_change': return 'text-purple-500 bg-purple-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const filteredBatches = batches.filter(batch =>
    batch.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.originFarm.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", onClick: () => navigate('/dashboard') },
    { icon: Route, label: "Traceability", active: true },
    { icon: Package, label: "Register Batch", onClick: () => navigate('/register') },
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
                4
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
              <h1 className="text-3xl font-bold mb-2">Traceability Console</h1>
              <p className="text-muted-foreground">Track and trace agricultural batches through the supply chain</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Batch List */}
              <div className="lg:col-span-1">
                <Card className="card-modern">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Batches
                      </CardTitle>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                    <CardDescription>Select a batch to view detailed traceability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-3">
                        {filteredBatches.map((batch) => (
                          <div
                            key={batch.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedBatch?.id === batch.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setSelectedBatch(batch)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{batch.code}</span>
                              <Badge className={`${getStatusColor(batch.status)} text-white text-xs`}>
                                {batch.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{batch.product}</p>
                            <p className="text-sm text-muted-foreground">{batch.quantity}</p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {batch.currentLocation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Batch Details & Timeline */}
              <div className="lg:col-span-2">
                {selectedBatch ? (
                  <div className="space-y-6">
                    {/* Batch Overview */}
                    <Card className="card-modern">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Route className="h-5 w-5" />
                            {selectedBatch.code}
                          </CardTitle>
                          <Badge className={`${getStatusColor(selectedBatch.status)} text-white`}>
                            {selectedBatch.status}
                          </Badge>
                        </div>
                        <CardDescription>{selectedBatch.product}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Origin Farm</h4>
                            <p className="text-muted-foreground">{selectedBatch.originFarm}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Current Location</h4>
                            <p className="text-muted-foreground">{selectedBatch.currentLocation}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Quantity</h4>
                            <p className="text-muted-foreground">{selectedBatch.quantity}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Supply Chain Timeline */}
                    <Card className="card-modern">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Supply Chain Timeline
                        </CardTitle>
                        <CardDescription>Complete custody chain and verification history</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {timeline.map((event, index) => {
                            const IconComponent = getTimelineIcon(event.type);
                            const isLast = index === timeline.length - 1;
                            
                            return (
                              <div key={event.id} className="relative">
                                {!isLast && (
                                  <div className="absolute left-6 top-12 w-0.5 h-6 bg-border"></div>
                                )}
                                <div className="flex gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTimelineColor(event.type)}`}>
                                    <IconComponent className="h-5 w-5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-medium">{event.title}</h4>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(event.timestamp).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                                    {event.location && (
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {event.location}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Blockchain Verification */}
                    <Card className="card-modern">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          Blockchain Verification
                        </CardTitle>
                        <CardDescription>Immutable record of batch authenticity</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-green-800">Verified on Blockchain</span>
                            </div>
                            <p className="text-sm text-green-700">
                              Transaction Hash: 0x1234...abcd
                            </p>
                            <p className="text-sm text-green-700">
                              Network: Ethereum Mainnet
                            </p>
                          </div>
                          <Button variant="outline" className="w-full">
                            View Full Blockchain Record
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="card-modern h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <Route className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Select a Batch</h3>
                      <p className="text-muted-foreground">Choose a batch from the list to view its complete traceability information</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Traceability;