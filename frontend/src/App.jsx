import { Toaster } from "@/components/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Index from "./pages/Index.jsx";
import Auth from "./pages/Auth.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ReportIncident from "./pages/ReportIncident.jsx";
import IncidentDetail from "./pages/IncidentDetail.jsx";
import EditIncident from "./pages/EditIncident.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/auth" />;
};

const UserOnlyRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (isAdmin()) return <Navigate to="/dashboard" />;
  return children;
};

const DashboardRoute = () => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAdmin() ? <AdminDashboard /> : <UserDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRoute /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/report" element={<UserOnlyRoute><ReportIncident /></UserOnlyRoute>} />
            <Route path="/incident/:id" element={<IncidentDetail />} />
            <Route path="/incident/:id/edit" element={<ProtectedRoute><EditIncident /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;