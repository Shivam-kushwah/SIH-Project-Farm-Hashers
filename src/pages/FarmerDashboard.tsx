import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sprout, Plus, Edit2, Trash2, DollarSign, MapPin, Calendar, Package, TrendingUp, Truck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useContract } from "@/ContractContext";
import DashboardLayout from "@/components/DashboardLayout";

interface FarmerProfile {
  name: string;
  farmLocation: string;
  contactNumber: string;
  farmSize: string;
}

interface Crop {
  id: string;
  name: string;
  type: string; // dal, vegetable, rice, etc
  harvestDate: string;
  quantity: string;
  expectedPricePerUnit: number;
  soldPricePerUnit: number | null;
  growLocation: string;
  locationMultiplier: number; // premium locations get higher multiplier
  bidAmount: number | null;
  status: 'available' | 'bid_placed' | 'sold';
  distributorName?: string;
  distributorAccount?: string;
  soldDate?: string;
  improvementNotes: string;
}

const locationMultipliers: Record<string, number> = {
  'Darjeeling': 1.5,
  'Kashmir': 1.4,
  'Assam': 1.3,
  'Punjab': 1.2,
  'Kerala': 1.3,
  'Maharashtra': 1.1,
  'Other': 1.0
};

const cropTypes = ['Vegetable', 'Dal', 'Rice', 'Wheat', 'Tea', 'Coffee', 'Spices', 'Fruits', 'Other'];

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FarmerProfile>({
    name: '',
    farmLocation: '',
    contactNumber: '',
    farmSize: ''
  });
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [newCrop, setNewCrop] = useState<Partial<Crop>>({
    name: '',
    type: '',
    harvestDate: '',
    quantity: '',
    expectedPricePerUnit: 0,
    growLocation: 'Other',
    improvementNotes: '',
    status: 'available'
  });

  useEffect(() => {
    // Load profile and crops from localStorage
    const savedProfile = localStorage.getItem('farmer-profile');
    const savedCrops = localStorage.getItem('farmer-crops');
    
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedCrops) setCrops(JSON.parse(savedCrops));
  }, []);
  const contract = useContract();

 

  const saveProfile = () => {
    localStorage.setItem('farmer-profile', JSON.stringify(profile));
    setIsEditingProfile(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const addCrop = () => {
    const locationMultiplier = locationMultipliers[newCrop.growLocation || 'Other'] || 1.0;
    const crop: Crop = {
      id: Date.now().toString(),
      name: newCrop.name || '',
      type: newCrop.type || '',
      harvestDate: newCrop.harvestDate || '',
      quantity: newCrop.quantity || '',
      expectedPricePerUnit: newCrop.expectedPricePerUnit || 0,
      soldPricePerUnit: null,
      growLocation: newCrop.growLocation || 'Other',
      locationMultiplier,
      bidAmount: null,
      status: 'available',
      improvementNotes: newCrop.improvementNotes || ''
    }
    
    if (!contract) {
      toast({ 
        title: "Contract Not Loaded",
        description: "Unable to interact with the blockchain contract.",
        variant: "destructive"
      });
      return
    }
    // Here you can add code to interact with the smart contract if needed
    // e.g., await contract.registerCrop(crop.id, crop.name, ...);
    // For now, we just save it locally
    console.log(contract.target)
   contract.create_batch(1,"wheat",1000,200,"agra");
   console.log(contract.get_all_batches());
    
    ;


    const updatedCrops = [...crops, crop];
    setCrops(updatedCrops);
    localStorage.setItem('farmer-crops', JSON.stringify(updatedCrops));
    
    setIsAddingCrop(false);
    setNewCrop({
      name: '',
      type: '',
      harvestDate: '',
      quantity: '',
      expectedPricePerUnit: 0,
      growLocation: 'Other',
      improvementNotes: '',
      status: 'available'
    });
    
    toast({
      title: "Crop Registered",
      description: `${crop.name} has been added successfully.`,
    });
  };

  const updateCrop = () => {
    if (!editingCrop) return;
    
    const locationMultiplier = locationMultipliers[editingCrop.growLocation] || 1.0;
    const updatedCrop = { ...editingCrop, locationMultiplier };
    
    const updatedCrops = crops.map(c => c.id === updatedCrop.id ? updatedCrop : c);
    setCrops(updatedCrops);
    localStorage.setItem('farmer-crops', JSON.stringify(updatedCrops));
    
    setEditingCrop(null);
    toast({
      title: "Crop Updated",
      description: "Crop information has been updated.",
    });
  };

  const deleteCrop = (id: string) => {
    const updatedCrops = crops.filter(c => c.id !== id);
    setCrops(updatedCrops);
    localStorage.setItem('farmer-crops', JSON.stringify(updatedCrops));
    
    toast({
      title: "Crop Deleted",
      description: "Crop has been removed from your list.",
    });
  };

  const markAsSold = (crop: Crop, distributorName: string, distributorAccount: string, soldPrice: number) => {
    const updatedCrop = {
      ...crop,
      status: 'sold' as const,
      soldPricePerUnit: soldPrice,
      distributorName,
      distributorAccount,
      soldDate: new Date().toLocaleDateString()
    };
    
    const updatedCrops = crops.map(c => c.id === crop.id ? updatedCrop : c);
    setCrops(updatedCrops);
    localStorage.setItem('farmer-crops', JSON.stringify(updatedCrops));
    
    toast({
      title: "Crop Sold",
      description: `Successfully sold to ${distributorName}`,
    });
  };

  const getAdjustedPrice = (basePrice: number, multiplier: number) => {
    return (basePrice * multiplier).toFixed(2);
  };

  const totalRevenue = crops
    .filter(c => c.status === 'sold' && c.soldPricePerUnit)
    .reduce((sum, c) => sum + (c.soldPricePerUnit! * parseFloat(c.quantity)), 0);

  const availableCrops = crops.filter(c => c.status === 'available').length;
  const soldCrops = crops.filter(c => c.status === 'sold').length;

  return (
    <DashboardLayout title="Farmer Dashboard">
      <div className="space-y-6">
        {/* Profile Section */}
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                Farmer Profile
              </CardTitle>
              <CardDescription>Your farming information</CardDescription>
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
                  <Label htmlFor="name">Farmer Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Farm Location</Label>
                  <Input
                    id="location"
                    value={profile.farmLocation}
                    onChange={(e) => setProfile({...profile, farmLocation: e.target.value})}
                    placeholder="Enter farm location"
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
                  <Label htmlFor="farmSize">Farm Size (acres)</Label>
                  <Input
                    id="farmSize"
                    value={profile.farmSize}
                    onChange={(e) => setProfile({...profile, farmSize: e.target.value})}
                    placeholder="Enter farm size"
                  />
                </div>
                <Button onClick={saveProfile} className="btn-primary">Save Profile</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{profile.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{profile.farmLocation || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{profile.contactNumber || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Farm Size</p>
                  <p className="font-medium">{profile.farmSize ? `${profile.farmSize} acres` : 'Not set'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Crops</p>
                  <p className="text-2xl font-bold">{availableCrops}</p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sold Crops</p>
                  <p className="text-2xl font-bold">{soldCrops}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crops Management */}
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Registered Crops</CardTitle>
              <CardDescription>Manage your crop inventory</CardDescription>
            </div>
            <Dialog open={isAddingCrop} onOpenChange={setIsAddingCrop}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Register Crop
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Register New Crop</DialogTitle>
                  <DialogDescription>Add a new crop to your inventory</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cropName">Crop Name</Label>
                    <Input
                      id="cropName"
                      value={newCrop.name}
                      onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                      placeholder="e.g., Basmati Rice"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select value={newCrop.type} onValueChange={(v) => setNewCrop({...newCrop, type: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="harvestDate">Harvest Date</Label>
                    <Input
                      id="harvestDate"
                      type="date"
                      value={newCrop.harvestDate}
                      onChange={(e) => setNewCrop({...newCrop, harvestDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity (kg)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newCrop.quantity}
                      onChange={(e) => setNewCrop({...newCrop, quantity: e.target.value})}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Expected Price Per Unit (₹/kg)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newCrop.expectedPricePerUnit}
                      onChange={(e) => setNewCrop({...newCrop, expectedPricePerUnit: parseFloat(e.target.value)})}
                      placeholder="Enter expected price"
                    />
                  </div>
                  <div>
                    <Label htmlFor="growLocation">Growing Location</Label>
                    <Select value={newCrop.growLocation} onValueChange={(v) => setNewCrop({...newCrop, growLocation: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(locationMultipliers).map(loc => (
                          <SelectItem key={loc} value={loc}>
                            {loc} (×{locationMultipliers[loc]})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Premium locations fetch higher prices
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="improvements">Improvement Notes</Label>
                    <Textarea
                      id="improvements"
                      value={newCrop.improvementNotes}
                      onChange={(e) => setNewCrop({...newCrop, improvementNotes: e.target.value})}
                      placeholder="Notes for future improvements..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={addCrop} className="w-full btn-primary">Register Crop</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crops.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No crops registered yet. Click "Register Crop" to get started.</p>
                </div>
              ) : (
                crops.map((crop) => (
                  <Card key={crop.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{crop.name}</h4>
                            <Badge variant={crop.status === 'sold' ? 'default' : 'secondary'}>
                              {crop.status === 'sold' ? 'Sold' : 'Available'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-muted-foreground">
                              <span className="font-medium">Type:</span> {crop.type}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium">Quantity:</span> {crop.quantity} kg
                            </p>
                            <p className="text-muted-foreground">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              Harvest: {new Date(crop.harvestDate).toLocaleDateString()}
                            </p>
                            <p className="text-muted-foreground">
                              <MapPin className="inline h-3 w-3 mr-1" />
                              {crop.growLocation}
                            </p>
                            <p className="text-green-600 font-medium">
                              Expected: ₹{getAdjustedPrice(crop.expectedPricePerUnit, crop.locationMultiplier)}/kg
                            </p>
                            {crop.soldPricePerUnit && (
                              <p className="text-blue-600 font-medium">
                                Sold: ₹{crop.soldPricePerUnit}/kg
                              </p>
                            )}
                          </div>
                          
                          {crop.status === 'sold' && crop.distributorName && (
                            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm font-medium flex items-center gap-1">
                                <Truck className="h-4 w-4" />
                                Transaction Details
                              </p>
                              <Separator className="my-2" />
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <p><span className="text-muted-foreground">Distributor:</span> {crop.distributorName}</p>
                                <p><span className="text-muted-foreground">Date:</span> {crop.soldDate}</p>
                                <p className="col-span-2 text-xs text-muted-foreground break-all">
                                  Account: {crop.distributorAccount}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {crop.improvementNotes && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Notes: {crop.improvementNotes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingCrop(crop)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteCrop(crop.id)}
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

        {/* Edit Crop Dialog */}
        <Dialog open={!!editingCrop} onOpenChange={(open) => !open && setEditingCrop(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Crop</DialogTitle>
              <DialogDescription>Update crop information</DialogDescription>
            </DialogHeader>
            {editingCrop && (
              <div className="space-y-4">
                <div>
                  <Label>Crop Name</Label>
                  <Input
                    value={editingCrop.name}
                    onChange={(e) => setEditingCrop({...editingCrop, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Crop Type</Label>
                  <Select value={editingCrop.type} onValueChange={(v) => setEditingCrop({...editingCrop, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Quantity (kg)</Label>
                  <Input
                    type="number"
                    value={editingCrop.quantity}
                    onChange={(e) => setEditingCrop({...editingCrop, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Expected Price (₹/kg)</Label>
                  <Input
                    type="number"
                    value={editingCrop.expectedPricePerUnit}
                    onChange={(e) => setEditingCrop({...editingCrop, expectedPricePerUnit: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Growing Location</Label>
                  <Select value={editingCrop.growLocation} onValueChange={(v) => setEditingCrop({...editingCrop, growLocation: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(locationMultipliers).map(loc => (
                        <SelectItem key={loc} value={loc}>
                          {loc} (×{locationMultipliers[loc]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Improvement Notes</Label>
                  <Textarea
                    value={editingCrop.improvementNotes}
                    onChange={(e) => setEditingCrop({...editingCrop, improvementNotes: e.target.value})}
                    rows={3}
                  />
                </div>
                <Separator />
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={editingCrop.status} 
                    onValueChange={(v: 'available' | 'sold') => setEditingCrop({...editingCrop, status: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingCrop.status === 'sold' && (
                  <>
                    <div>
                      <Label>Sold Price (₹/kg)</Label>
                      <Input
                        type="number"
                        value={editingCrop.soldPricePerUnit || ''}
                        onChange={(e) => setEditingCrop({...editingCrop, soldPricePerUnit: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Distributor Name</Label>
                      <Input
                        value={editingCrop.distributorName || ''}
                        onChange={(e) => setEditingCrop({...editingCrop, distributorName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Distributor Account</Label>
                      <Input
                        value={editingCrop.distributorAccount || ''}
                        onChange={(e) => setEditingCrop({...editingCrop, distributorAccount: e.target.value})}
                      />
                    </div>
                  </>
                )}
                <Button onClick={updateCrop} className="w-full btn-primary">Update Crop</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;
