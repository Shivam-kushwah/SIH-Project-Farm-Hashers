import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, Plus, Edit2, Trash2, Package, Warehouse, TrendingUp, AlertTriangle, Star, DollarSign, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface DistributorProfile {
  name: string;
  companyName: string;
  contactNumber: string;
  licenseNumber: string;
}

interface StockItem {
  id: string;
  cropName: string;
  cropType: string;
  quantityInHand: number;
  quantityDispatched: number;
  buyingPrice: number;
  sellingPrice: number;
  warehouseLocation: string;
  warehouseCapacity: string;
  wastedQuantity: number;
  packagingType: string;
  farmerName: string;
  farmerRating: number;
  purchaseDate: string;
  qualityGrade: 'A' | 'B' | 'C';
  transportationCost: number;
  dispatchInfo: string;
  timestamps: {
    received: string;
    inspected: string;
    stored: string;
    dispatched?: string;
  };
}

const DistributorDashboard = () => {
  const [profile, setProfile] = useState<DistributorProfile>({
    name: '',
    companyName: '',
    contactNumber: '',
    licenseNumber: ''
  });
  const [stock, setStock] = useState<StockItem[]>([]);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [editingStock, setEditingStock] = useState<StockItem | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [newStock, setNewStock] = useState<Partial<StockItem>>({
    cropName: '',
    cropType: '',
    quantityInHand: 0,
    quantityDispatched: 0,
    buyingPrice: 0,
    sellingPrice: 0,
    warehouseLocation: '',
    warehouseCapacity: '',
    wastedQuantity: 0,
    packagingType: '',
    farmerName: '',
    farmerRating: 5,
    qualityGrade: 'A',
    transportationCost: 0,
    dispatchInfo: ''
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('distributor-profile');
    const savedStock = localStorage.getItem('distributor-stock');
    
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedStock) setStock(JSON.parse(savedStock));
  }, []);

  const saveProfile = () => {
    localStorage.setItem('distributor-profile', JSON.stringify(profile));
    setIsEditingProfile(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const addStock = () => {
    const now = new Date().toISOString();
    const item: StockItem = {
      id: Date.now().toString(),
      cropName: newStock.cropName || '',
      cropType: newStock.cropType || '',
      quantityInHand: newStock.quantityInHand || 0,
      quantityDispatched: newStock.quantityDispatched || 0,
      buyingPrice: newStock.buyingPrice || 0,
      sellingPrice: newStock.sellingPrice || 0,
      warehouseLocation: newStock.warehouseLocation || '',
      warehouseCapacity: newStock.warehouseCapacity || '',
      wastedQuantity: newStock.wastedQuantity || 0,
      packagingType: newStock.packagingType || '',
      farmerName: newStock.farmerName || '',
      farmerRating: newStock.farmerRating || 5,
      purchaseDate: new Date().toLocaleDateString(),
      qualityGrade: newStock.qualityGrade || 'A',
      transportationCost: newStock.transportationCost || 0,
      dispatchInfo: newStock.dispatchInfo || '',
      timestamps: {
        received: now,
        inspected: now,
        stored: now
      }
    };

    const updatedStock = [...stock, item];
    setStock(updatedStock);
    localStorage.setItem('distributor-stock', JSON.stringify(updatedStock));
    
    setIsAddingStock(false);
    setNewStock({
      cropName: '',
      cropType: '',
      quantityInHand: 0,
      quantityDispatched: 0,
      buyingPrice: 0,
      sellingPrice: 0,
      warehouseLocation: '',
      warehouseCapacity: '',
      wastedQuantity: 0,
      packagingType: '',
      farmerName: '',
      farmerRating: 5,
      qualityGrade: 'A',
      transportationCost: 0,
      dispatchInfo: ''
    });
    
    toast({
      title: "Stock Added",
      description: `${item.cropName} has been added to inventory.`,
    });
  };

  const updateStock = () => {
    if (!editingStock) return;
    
    const updatedStock = stock.map(s => s.id === editingStock.id ? editingStock : s);
    setStock(updatedStock);
    localStorage.setItem('distributor-stock', JSON.stringify(updatedStock));
    
    setEditingStock(null);
    toast({
      title: "Stock Updated",
      description: "Stock information has been updated.",
    });
  };

  const deleteStock = (id: string) => {
    const updatedStock = stock.filter(s => s.id !== id);
    setStock(updatedStock);
    localStorage.setItem('distributor-stock', JSON.stringify(updatedStock));
    
    toast({
      title: "Stock Deleted",
      description: "Stock item has been removed.",
    });
  };

  const totalStock = stock.reduce((sum, s) => sum + s.quantityInHand, 0);
  const totalDispatched = stock.reduce((sum, s) => sum + s.quantityDispatched, 0);
  const totalWasted = stock.reduce((sum, s) => sum + s.wastedQuantity, 0);
  const profitMargin = stock.reduce((sum, s) => {
    const profit = (s.sellingPrice - s.buyingPrice - s.transportationCost) * s.quantityDispatched;
    return sum + profit;
  }, 0);

  const getQualityColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-yellow-500';
      case 'C': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout title="Distributor Dashboard">
      <div className="space-y-6">
        {/* Profile Section */}
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Distributor Profile
              </CardTitle>
              <CardDescription>Your distribution business information</CardDescription>
            </div>
            <Button onClick={() => setIsEditingProfile(!isEditingProfile)} variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditingProfile ? 'Cancel' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent>
            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Contact Person Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={profile.companyName}
                    onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={profile.contactNumber}
                    onChange={(e) => setProfile({...profile, contactNumber: e.target.value})}
                    placeholder="Enter contact number"
                  />
                </div>
                <div>
                  <Label htmlFor="license">License Number</Label>
                  <Input
                    id="license"
                    value={profile.licenseNumber}
                    onChange={(e) => setProfile({...profile, licenseNumber: e.target.value})}
                    placeholder="Enter license number"
                  />
                </div>
                <Button onClick={saveProfile} className="btn-primary">Save Profile</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{profile.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{profile.companyName || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{profile.contactNumber || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">License</p>
                  <p className="font-medium">{profile.licenseNumber || 'Not set'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stock in Hand</p>
                  <p className="text-2xl font-bold">{totalStock} kg</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dispatched</p>
                  <p className="text-2xl font-bold">{totalDispatched} kg</p>
                </div>
                <Truck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wasted</p>
                  <p className="text-2xl font-bold">{totalWasted} kg</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-2xl font-bold">₹{profitMargin.toFixed(0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Management */}
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track your stock and dispatches</CardDescription>
            </div>
            <Dialog open={isAddingStock} onOpenChange={setIsAddingStock}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Stock</DialogTitle>
                  <DialogDescription>Register new inventory item</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Crop Name</Label>
                      <Input
                        value={newStock.cropName}
                        onChange={(e) => setNewStock({...newStock, cropName: e.target.value})}
                        placeholder="e.g., Basmati Rice"
                      />
                    </div>
                    <div>
                      <Label>Crop Type</Label>
                      <Input
                        value={newStock.cropType}
                        onChange={(e) => setNewStock({...newStock, cropType: e.target.value})}
                        placeholder="e.g., Rice"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Quantity in Hand (kg)</Label>
                      <Input
                        type="number"
                        value={newStock.quantityInHand}
                        onChange={(e) => setNewStock({...newStock, quantityInHand: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Dispatched (kg)</Label>
                      <Input
                        type="number"
                        value={newStock.quantityDispatched}
                        onChange={(e) => setNewStock({...newStock, quantityDispatched: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Wasted (kg)</Label>
                      <Input
                        type="number"
                        value={newStock.wastedQuantity}
                        onChange={(e) => setNewStock({...newStock, wastedQuantity: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Buying Price (₹/kg)</Label>
                      <Input
                        type="number"
                        value={newStock.buyingPrice}
                        onChange={(e) => setNewStock({...newStock, buyingPrice: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Selling Price (₹/kg)</Label>
                      <Input
                        type="number"
                        value={newStock.sellingPrice}
                        onChange={(e) => setNewStock({...newStock, sellingPrice: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Transport Cost (₹)</Label>
                      <Input
                        type="number"
                        value={newStock.transportationCost}
                        onChange={(e) => setNewStock({...newStock, transportationCost: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Warehouse Location</Label>
                      <Input
                        value={newStock.warehouseLocation}
                        onChange={(e) => setNewStock({...newStock, warehouseLocation: e.target.value})}
                        placeholder="e.g., Warehouse A, Delhi"
                      />
                    </div>
                    <div>
                      <Label>Warehouse Capacity</Label>
                      <Input
                        value={newStock.warehouseCapacity}
                        onChange={(e) => setNewStock({...newStock, warehouseCapacity: e.target.value})}
                        placeholder="e.g., 5000 kg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Packaging Type</Label>
                      <Input
                        value={newStock.packagingType}
                        onChange={(e) => setNewStock({...newStock, packagingType: e.target.value})}
                        placeholder="e.g., Jute bags, 50kg each"
                      />
                    </div>
                    <div>
                      <Label>Quality Grade</Label>
                      <Select value={newStock.qualityGrade} onValueChange={(v: 'A' | 'B' | 'C') => setNewStock({...newStock, qualityGrade: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Grade A (Premium)</SelectItem>
                          <SelectItem value="B">Grade B (Standard)</SelectItem>
                          <SelectItem value="C">Grade C (Basic)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Farmer Name</Label>
                      <Input
                        value={newStock.farmerName}
                        onChange={(e) => setNewStock({...newStock, farmerName: e.target.value})}
                        placeholder="Source farmer"
                      />
                    </div>
                    <div>
                      <Label>Farmer Rating</Label>
                      <Select value={newStock.farmerRating?.toString()} onValueChange={(v) => setNewStock({...newStock, farmerRating: parseInt(v)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map(rating => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {'⭐'.repeat(rating)} ({rating}/5)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Dispatch Information</Label>
                    <Textarea
                      value={newStock.dispatchInfo}
                      onChange={(e) => setNewStock({...newStock, dispatchInfo: e.target.value})}
                      placeholder="Delivery details, route, etc."
                      rows={3}
                    />
                  </div>

                  <Button onClick={addStock} className="w-full btn-primary">Add Stock</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stock.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Warehouse className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No stock items yet. Click "Add Stock" to get started.</p>
                </div>
              ) : (
                stock.map((item) => (
                  <Card key={item.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{item.cropName}</h4>
                            <Badge className={`${getQualityColor(item.qualityGrade)} text-white`}>
                              Grade {item.qualityGrade}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground">In Hand</p>
                              <p className="font-medium">{item.quantityInHand} kg</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Dispatched</p>
                              <p className="font-medium">{item.quantityDispatched} kg</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Wasted</p>
                              <p className="font-medium text-orange-600">{item.wastedQuantity} kg</p>
                            </div>
                          </div>

                          <Separator className="my-2" />

                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Buying Price</p>
                              <p className="text-green-600 font-medium">₹{item.buyingPrice}/kg</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Selling Price</p>
                              <p className="text-blue-600 font-medium">₹{item.sellingPrice}/kg</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Transport Cost</p>
                              <p className="font-medium">₹{item.transportationCost}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Net Profit/kg</p>
                              <p className="font-medium text-primary">
                                ₹{(item.sellingPrice - item.buyingPrice - (item.transportationCost / item.quantityInHand || 0)).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="p-3 bg-muted/50 rounded-lg mb-3">
                            <p className="text-sm font-medium flex items-center gap-1 mb-2">
                              <Warehouse className="h-4 w-4" />
                              Warehouse Info
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <p><span className="text-muted-foreground">Location:</span> {item.warehouseLocation}</p>
                              <p><span className="text-muted-foreground">Capacity:</span> {item.warehouseCapacity}</p>
                              <p><span className="text-muted-foreground">Packaging:</span> {item.packagingType}</p>
                            </div>
                          </div>

                          <div className="p-3 bg-muted/50 rounded-lg mb-3">
                            <p className="text-sm font-medium flex items-center gap-1 mb-2">
                              <Star className="h-4 w-4" />
                              Farmer Quality Rating
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <p>{item.farmerName}</p>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < item.farmerRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium flex items-center gap-1 mb-2">
                              <Clock className="h-4 w-4" />
                              Timestamps
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <p><span className="text-muted-foreground">Received:</span> {new Date(item.timestamps.received).toLocaleString()}</p>
                              <p><span className="text-muted-foreground">Inspected:</span> {new Date(item.timestamps.inspected).toLocaleString()}</p>
                              <p><span className="text-muted-foreground">Stored:</span> {new Date(item.timestamps.stored).toLocaleString()}</p>
                              {item.timestamps.dispatched && (
                                <p><span className="text-muted-foreground">Dispatched:</span> {new Date(item.timestamps.dispatched).toLocaleString()}</p>
                              )}
                            </div>
                          </div>

                          {item.dispatchInfo && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Dispatch: {item.dispatchInfo}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingStock(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteStock(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog - Similar structure to Add Dialog */}
        <Dialog open={!!editingStock} onOpenChange={(open) => !open && setEditingStock(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Stock</DialogTitle>
              <DialogDescription>Update stock information</DialogDescription>
            </DialogHeader>
            {editingStock && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Crop Name</Label>
                    <Input
                      value={editingStock.cropName}
                      onChange={(e) => setEditingStock({...editingStock, cropName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Crop Type</Label>
                    <Input
                      value={editingStock.cropType}
                      onChange={(e) => setEditingStock({...editingStock, cropType: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Quantity in Hand (kg)</Label>
                    <Input
                      type="number"
                      value={editingStock.quantityInHand}
                      onChange={(e) => setEditingStock({...editingStock, quantityInHand: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Dispatched (kg)</Label>
                    <Input
                      type="number"
                      value={editingStock.quantityDispatched}
                      onChange={(e) => setEditingStock({...editingStock, quantityDispatched: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Wasted (kg)</Label>
                    <Input
                      type="number"
                      value={editingStock.wastedQuantity}
                      onChange={(e) => setEditingStock({...editingStock, wastedQuantity: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Buying Price (₹/kg)</Label>
                    <Input
                      type="number"
                      value={editingStock.buyingPrice}
                      onChange={(e) => setEditingStock({...editingStock, buyingPrice: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Selling Price (₹/kg)</Label>
                    <Input
                      type="number"
                      value={editingStock.sellingPrice}
                      onChange={(e) => setEditingStock({...editingStock, sellingPrice: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Transport Cost (₹)</Label>
                    <Input
                      type="number"
                      value={editingStock.transportationCost}
                      onChange={(e) => setEditingStock({...editingStock, transportationCost: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Quality Grade</Label>
                  <Select value={editingStock.qualityGrade} onValueChange={(v: 'A' | 'B' | 'C') => setEditingStock({...editingStock, qualityGrade: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Grade A (Premium)</SelectItem>
                      <SelectItem value="B">Grade B (Standard)</SelectItem>
                      <SelectItem value="C">Grade C (Basic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={updateStock} className="w-full btn-primary">Update Stock</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default DistributorDashboard;