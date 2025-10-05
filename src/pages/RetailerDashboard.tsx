import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Store, Plus, Edit2, Trash2, Package, ShoppingCart, TrendingUp, DollarSign, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface RetailerProfile {
  name: string;
  storeName: string;
  storeLocation: string;
  contactNumber: string;
  gstNumber: string;
}

interface InventoryItem {
  id: string;
  productName: string;
  productType: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  receivedDate: string;
  expiryDate: string;
  soldQuantity: number;
}

const RetailerDashboard = () => {
  const [profile, setProfile] = useState<RetailerProfile>({
    name: '',
    storeName: '',
    storeLocation: '',
    contactNumber: '',
    gstNumber: ''
  });
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    productName: '',
    productType: '',
    quantity: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    supplier: '',
    expiryDate: '',
    soldQuantity: 0
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('retailer-profile');
    const savedInventory = localStorage.getItem('retailer-inventory');
    
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
  }, []);

  const saveProfile = () => {
    localStorage.setItem('retailer-profile', JSON.stringify(profile));
    setIsEditingProfile(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const addItem = () => {
    const item: InventoryItem = {
      id: Date.now().toString(),
      productName: newItem.productName || '',
      productType: newItem.productType || '',
      quantity: newItem.quantity || 0,
      purchasePrice: newItem.purchasePrice || 0,
      sellingPrice: newItem.sellingPrice || 0,
      supplier: newItem.supplier || '',
      receivedDate: new Date().toLocaleDateString(),
      expiryDate: newItem.expiryDate || '',
      soldQuantity: newItem.soldQuantity || 0
    };

    const updatedInventory = [...inventory, item];
    setInventory(updatedInventory);
    localStorage.setItem('retailer-inventory', JSON.stringify(updatedInventory));
    
    setIsAddingItem(false);
    setNewItem({
      productName: '',
      productType: '',
      quantity: 0,
      purchasePrice: 0,
      sellingPrice: 0,
      supplier: '',
      expiryDate: '',
      soldQuantity: 0
    });
    
    toast({
      title: "Item Added",
      description: `${item.productName} has been added to inventory.`,
    });
  };

  const updateItem = () => {
    if (!editingItem) return;
    
    const updatedInventory = inventory.map(i => i.id === editingItem.id ? editingItem : i);
    setInventory(updatedInventory);
    localStorage.setItem('retailer-inventory', JSON.stringify(updatedInventory));
    
    setEditingItem(null);
    toast({
      title: "Item Updated",
      description: "Inventory item has been updated.",
    });
  };

  const deleteItem = (id: string) => {
    const updatedInventory = inventory.filter(i => i.id !== id);
    setInventory(updatedInventory);
    localStorage.setItem('retailer-inventory', JSON.stringify(updatedInventory));
    
    toast({
      title: "Item Deleted",
      description: "Item has been removed from inventory.",
    });
  };

  const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.quantity * i.purchasePrice), 0);
  const totalSales = inventory.reduce((sum, i) => sum + (i.soldQuantity * i.sellingPrice), 0);
  const totalProfit = inventory.reduce((sum, i) => sum + ((i.sellingPrice - i.purchasePrice) * i.soldQuantity), 0);
  const totalItems = inventory.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <DashboardLayout title="Retailer Dashboard">
      <div className="space-y-6">
        {/* Profile Section */}
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                Store Profile
              </CardTitle>
              <CardDescription>Your store information</CardDescription>
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
                  <Label htmlFor="name">Owner Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={profile.storeName}
                    onChange={(e) => setProfile({...profile, storeName: e.target.value})}
                    placeholder="Enter store name"
                  />
                </div>
                <div>
                  <Label htmlFor="storeLocation">Store Location</Label>
                  <Input
                    id="storeLocation"
                    value={profile.storeLocation}
                    onChange={(e) => setProfile({...profile, storeLocation: e.target.value})}
                    placeholder="Enter store location"
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
                  <Label htmlFor="gst">GST Number</Label>
                  <Input
                    id="gst"
                    value={profile.gstNumber}
                    onChange={(e) => setProfile({...profile, gstNumber: e.target.value})}
                    placeholder="Enter GST number"
                  />
                </div>
                <Button onClick={saveProfile} className="btn-primary">Save Profile</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Owner Name</p>
                  <p className="font-medium">{profile.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Store Name</p>
                  <p className="font-medium">{profile.storeName || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{profile.storeLocation || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{profile.contactNumber || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GST Number</p>
                  <p className="font-medium">{profile.gstNumber || 'Not set'}</p>
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
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inventory Value</p>
                  <p className="text-2xl font-bold">₹{totalInventoryValue.toFixed(0)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">₹{totalSales.toFixed(0)}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Profit</p>
                  <p className="text-2xl font-bold">₹{totalProfit.toFixed(0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management */}
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </div>
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                  <DialogDescription>Add a new product to your inventory</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Product Name</Label>
                      <Input
                        value={newItem.productName}
                        onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
                        placeholder="e.g., Organic Rice"
                      />
                    </div>
                    <div>
                      <Label>Product Type</Label>
                      <Input
                        value={newItem.productType}
                        onChange={(e) => setNewItem({...newItem, productType: e.target.value})}
                        placeholder="e.g., Grains"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Quantity (kg)</Label>
                      <Input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Sold Quantity (kg)</Label>
                      <Input
                        type="number"
                        value={newItem.soldQuantity}
                        onChange={(e) => setNewItem({...newItem, soldQuantity: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Purchase Price (₹/kg)</Label>
                      <Input
                        type="number"
                        value={newItem.purchasePrice}
                        onChange={(e) => setNewItem({...newItem, purchasePrice: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Selling Price (₹/kg)</Label>
                      <Input
                        type="number"
                        value={newItem.sellingPrice}
                        onChange={(e) => setNewItem({...newItem, sellingPrice: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Supplier</Label>
                    <Input
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                      placeholder="Supplier name"
                    />
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={newItem.expiryDate}
                      onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                    />
                  </div>
                  <Button onClick={addItem} className="w-full btn-primary">Add Item</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No inventory items yet. Click "Add Item" to get started.</p>
                </div>
              ) : (
                inventory.map((item) => (
                  <Card key={item.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{item.productName}</h4>
                            <Badge variant="secondary">{item.productType}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">In Stock</p>
                              <p className="font-medium">{item.quantity} kg</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Sold</p>
                              <p className="font-medium">{item.soldQuantity} kg</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Supplier</p>
                              <p className="font-medium">{item.supplier}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Purchase Price</p>
                              <p className="text-green-600 font-medium">₹{item.purchasePrice}/kg</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Selling Price</p>
                              <p className="text-blue-600 font-medium">₹{item.sellingPrice}/kg</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Profit/kg</p>
                              <p className="text-primary font-medium">₹{(item.sellingPrice - item.purchasePrice).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Received</p>
                              <p className="text-xs">{item.receivedDate}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Expiry</p>
                              <p className="text-xs">{new Date(item.expiryDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Revenue</p>
                              <p className="font-medium">₹{(item.soldQuantity * item.sellingPrice).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteItem(item.id)}
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

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>Update inventory item</DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Product Name</Label>
                    <Input
                      value={editingItem.productName}
                      onChange={(e) => setEditingItem({...editingItem, productName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Product Type</Label>
                    <Input
                      value={editingItem.productType}
                      onChange={(e) => setEditingItem({...editingItem, productType: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity (kg)</Label>
                    <Input
                      type="number"
                      value={editingItem.quantity}
                      onChange={(e) => setEditingItem({...editingItem, quantity: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Sold Quantity (kg)</Label>
                    <Input
                      type="number"
                      value={editingItem.soldQuantity}
                      onChange={(e) => setEditingItem({...editingItem, soldQuantity: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Purchase Price (₹/kg)</Label>
                    <Input
                      type="number"
                      value={editingItem.purchasePrice}
                      onChange={(e) => setEditingItem({...editingItem, purchasePrice: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Selling Price (₹/kg)</Label>
                    <Input
                      type="number"
                      value={editingItem.sellingPrice}
                      onChange={(e) => setEditingItem({...editingItem, sellingPrice: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <Button onClick={updateItem} className="w-full btn-primary">Update Item</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default RetailerDashboard;