import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QrCode, Wallet, Sprout, User, Truck, Store, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

type UserRole = 'farmer' | 'distributor' | 'retailer' | 'consumer';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'farmer',
    title: 'Farmer Login',
    description: 'Manage crops, register batches, and track harvest',
    icon: User,
    color: 'bg-green-500'
  },
  {
    id: 'distributor', 
    title: 'Distributor Login',
    description: 'Manage logistics, track shipments, and coordinate delivery',
    icon: Truck,
    color: 'bg-blue-500'
  },
  {
    id: 'retailer',
    title: 'Retailer Login', 
    description: 'Receive products, manage inventory, and serve customers',
    icon: Store,
    color: 'bg-purple-500'
  },
  {
    id: 'consumer',
    title: 'Consumer Access',
    description: 'Track product origin, verify authenticity, and view history',
    icon: ShoppingCart,
    color: 'bg-orange-500'
  }
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showQRLogin, setShowQRLogin] = useState(false);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (!selectedRole) return;
    
    setIsConnecting(true);
    
    try {
      // In a real app, this would connect to MetaMask
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          // Store user session
          localStorage.setItem('agritrace-user', JSON.stringify({
            address: accounts[0],
            role: selectedRole,
            connectedAt: new Date().toISOString()
          }));
          
          // Navigate to dashboard
          navigate('/dashboard');
        }
      } else {
        // Demo mode - simulate wallet connection
        setTimeout(() => {
          localStorage.setItem('agritrace-user', JSON.stringify({
            address: '0x742d35Cc6634C0532925a3b8D404d00Ca11da58F',
            role: selectedRole,
            connectedAt: new Date().toISOString()
          }));
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const directMetaMaskLogin = async () => {
    setIsConnecting(true);
    
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          // For existing users, we'll use a default role or fetch from backend
          localStorage.setItem('agritrace-user', JSON.stringify({
            address: accounts[0],
            role: 'farmer', // Default role for existing users
            connectedAt: new Date().toISOString()
          }));
          
          navigate('/dashboard');
        }
      } else {
        // Demo mode
        setTimeout(() => {
          localStorage.setItem('agritrace-user', JSON.stringify({
            address: '0x742d35Cc6634C0532925a3b8D404d00Ca11da58F',
            role: 'farmer',
            connectedAt: new Date().toISOString()
          }));
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const generateQRCode = () => {
    setShowQRLogin(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-primary">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome to AgriTrace</h1>
          <p className="text-xl text-muted-foreground">Blockchain-backed agricultural produce traceability</p>
        </div>

        {isNewUser === null ? (
          /* Initial Choice Screen */
          <div className="max-w-md mx-auto">
            <Card className="card-modern">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-primary">
                  <Sprout className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Welcome to AgriTrace</CardTitle>
                <CardDescription>
                  Choose your login method to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full btn-primary text-lg py-6"
                  onClick={directMetaMaskLogin}
                  disabled={isConnecting}
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  {isConnecting ? 'Connecting...' : 'Direct Login with MetaMask'}
                </Button>
                
                <div className="flex items-center">
                  <Separator className="flex-1" />
                  <span className="px-3 text-sm text-muted-foreground">or</span>
                  <Separator className="flex-1" />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full py-6"
                  onClick={() => setIsNewUser(true)}
                >
                  <User className="mr-2 h-5 w-5" />
                  Create New Account
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full py-6"
                  onClick={generateQRCode}
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  Login with QR Code
                </Button>

                {showQRLogin && (
                  <div className="text-center p-6 border rounded-lg bg-muted/20">
                    <div className="w-32 h-32 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code with your mobile wallet to connect
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : !selectedRole ? (
          /* Role Selection for New Users */
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Select Your Role</h2>
              <p className="text-muted-foreground">Choose the role that best describes you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roleOptions.map((role) => {
                const IconComponent = role.icon;
                return (
                  <Card 
                    key={role.id}
                    className="card-modern cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/30"
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full btn-primary" variant="outline">
                        Select Role
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="text-center mt-8">
              <Button 
                variant="ghost" 
                onClick={() => setIsNewUser(null)}
              >
                Back to Login Options
              </Button>
            </div>
          </div>
        ) : (
          /* Wallet Connection for New Users */
          <div className="max-w-md mx-auto">
            <Card className="card-modern">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-primary">
                  <Sprout className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
                <CardDescription>
                  Selected role: 
                  <Badge variant="secondary" className="ml-2">
                    {roleOptions.find(r => r.id === selectedRole)?.title}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full btn-primary text-lg py-6"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  {isConnecting ? 'Connecting...' : 'Connect with MetaMask'}
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setSelectedRole(null)}
                >
                  Back to Role Selection
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;