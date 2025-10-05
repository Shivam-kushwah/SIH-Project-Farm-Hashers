import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Search, QrCode, MapPin, Calendar, User, CheckCircle, Truck, Store } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface TraceabilityStep {
  stage: string;
  actor: string;
  location: string;
  timestamp: string;
  verified: boolean;
}

const mockProduct = {
  id: 'AGT-001',
  name: 'Organic Basmati Rice',
  type: 'Rice',
  origin: 'Darjeeling, West Bengal',
  farmer: 'Ravi Kumar',
  harvestDate: '2024-10-15',
  certifications: ['Organic', 'Fair Trade'],
  traceability: [
    {
      stage: 'Farm',
      actor: 'Ravi Kumar',
      location: 'Darjeeling, West Bengal',
      timestamp: '2024-10-15 08:00 AM',
      verified: true
    },
    {
      stage: 'Quality Check',
      actor: 'AgriQuality Inspector',
      location: 'Siliguri Processing Center',
      timestamp: '2024-10-16 02:00 PM',
      verified: true
    },
    {
      stage: 'Distribution',
      actor: 'FastTrack Logistics',
      location: 'Delhi Warehouse',
      timestamp: '2024-10-18 10:00 AM',
      verified: true
    },
    {
      stage: 'Retail',
      actor: 'Fresh Market Store',
      location: 'Connaught Place, Delhi',
      timestamp: '2024-10-20 09:00 AM',
      verified: true
    }
  ]
};

const ConsumerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProduct, setShowProduct] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowProduct(true);
    }
  };

  return (
    <DashboardLayout title="Consumer Dashboard">
      <div className="space-y-6">
        {/* Search Section */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Track Product Origin
            </CardTitle>
            <CardDescription>Enter batch code or scan QR code to verify product authenticity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter batch code (e.g., AGT-001)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} className="btn-primary">
                  Search
                </Button>
              </div>
              <div className="flex items-center">
                <Separator className="flex-1" />
                <span className="px-3 text-sm text-muted-foreground">or</span>
                <Separator className="flex-1" />
              </div>
              <Button variant="outline" className="w-full">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Product Information */}
        {showProduct && (
          <>
            <Card className="card-modern">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{mockProduct.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{mockProduct.type}</Badge>
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {mockProduct.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Origin</p>
                        <p className="font-medium">{mockProduct.origin}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Farmer</p>
                        <p className="font-medium">{mockProduct.farmer}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Harvest Date</p>
                        <p className="font-medium">{new Date(mockProduct.harvestDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Certifications</p>
                        <div className="flex gap-2 mt-1">
                          {mockProduct.certifications.map((cert, idx) => (
                            <Badge key={idx} className="bg-green-500 text-white">{cert}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traceability Timeline */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Supply Chain Journey</CardTitle>
                <CardDescription>Complete traceability from farm to retail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[17px] top-8 bottom-8 w-0.5 bg-primary/20" />
                  
                  <div className="space-y-6">
                    {mockProduct.traceability.map((step, idx) => {
                      const icons = {
                        'Farm': User,
                        'Quality Check': CheckCircle,
                        'Distribution': Truck,
                        'Retail': Store
                      };
                      const Icon = icons[step.stage as keyof typeof icons] || CheckCircle;
                      
                      return (
                        <div key={idx} className="relative flex gap-4">
                          {/* Icon */}
                          <div className="relative z-10 flex-shrink-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-primary">
                            <Icon className="h-4 w-4 text-primary-foreground" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 pb-6">
                            <div className="bg-muted/50 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-lg">{step.stage}</h4>
                                  <p className="text-sm text-muted-foreground">{step.actor}</p>
                                </div>
                                {step.verified && (
                                  <Badge className="bg-green-500 text-white">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <Separator className="my-2" />
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">{step.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">{step.timestamp}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Score */}
            <Card className="card-modern bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Authenticity Score</p>
                    <p className="text-4xl font-bold text-primary">100%</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      All supply chain steps verified
                    </p>
                  </div>
                  <div className="h-24 w-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!showProduct && (
          <Card className="card-modern">
            <CardContent className="p-12 text-center">
              <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Product Searched</h3>
              <p className="text-muted-foreground">
                Enter a batch code or scan a QR code to view product traceability information
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConsumerDashboard;