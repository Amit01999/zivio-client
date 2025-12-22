import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { Layout } from "@/components/Layout";

import Home from "@/pages/Home";
import Search from "@/pages/Search";
import PropertyDetail from "@/pages/PropertyDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import DashboardRouter from "@/pages/DashboardRouter";
import BuyerDashboard from "@/pages/BuyerDashboard";
import SellerDashboard from "@/pages/SellerDashboard";
import BrokerDashboard from "@/pages/BrokerDashboard";
import ComparisonPage from "@/pages/ComparisonPage";
import CreateListing from "@/pages/CreateListing";
import Agents from "@/pages/Agents";
import Messages from "@/pages/Messages";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/property/:slug" component={PropertyDetail} />
      <Route path="/properties/:slug" component={PropertyDetail} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={DashboardRouter} />
      <Route path="/dashboard/buyer" component={BuyerDashboard} />
      <Route path="/dashboard/seller" component={SellerDashboard} />
      <Route path="/dashboard/broker" component={BrokerDashboard} />
      <Route path="/comparison" component={ComparisonPage} />
      <Route path="/listings/new" component={CreateListing} />
      <Route path="/agents" component={Agents} />
      <Route path="/messages" component={Messages} />
      <Route path="/admin" component={Admin} />
      <Route path="/favorites" component={BuyerDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Layout>
              <Router />
            </Layout>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;