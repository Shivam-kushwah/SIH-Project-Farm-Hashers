import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import DistributorDashboard from "./pages/DistributorDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import Traceability from "./pages/Traceability";
import Register from "./pages/Register";
import Stakeholders from "./pages/Stakeholders";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// ⬇️ import your ContractProvider
import { ContractProvider } from "./ContractContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* wrap all routes with ContractProvider */}
      <ContractProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/farmer" element={<FarmerDashboard />} />
            <Route path="/dashboard/distributor" element={<DistributorDashboard />} />
            <Route path="/dashboard/retailer" element={<RetailerDashboard />} />
            <Route path="/dashboard/consumer" element={<ConsumerDashboard />} />
            <Route path="/traceability" element={<Traceability />} />
            <Route path="/register" element={<Register />} />
            <Route path="/stakeholders" element={<Stakeholders />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ContractProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
