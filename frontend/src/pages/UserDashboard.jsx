import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header.jsx";
import { Footer } from "@/components/layout/Footer.jsx";
import { IncidentCard } from "@/components/incidents/IncidentCard.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { INCIDENT_TYPE_LABELS, STATUS_LABELS } from "@/types/incident.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { reportService } from "@/services/api.js";
import { useToast } from "@/hooks/use-toast.js";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports();
      setReports(data.reports || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Filter to show only user's own reports
  const userIncidents = reports.filter(report => {
    const reportUserId = report.user_id || report.user?.id;
    return reportUserId === user?.id;
  });

  const filteredIncidents = userIncidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    const matchesType = typeFilter === "all" || incident.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isAuthenticated onLogout={handleLogout} />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                My Reports
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage your incident reports
              </p>
            </div>
            <Button className="gradient-emergency shadow-emergency" asChild>
              <Link to="/report">
                <Plus className="h-4 w-4 mr-2" />
                Report New Incident
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your reports..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(INCIDENT_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading reports...</p>
            </div>
          ) : filteredIncidents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredIncidents.map((incident, index) => (
                <div
                  key={incident.id}
                  className="animate-slide-in-bottom"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <IncidentCard incident={incident} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No reports found
              </h3>
              <p className="text-muted-foreground mb-4">
                {userIncidents.length === 0 
                  ? "You haven't created any reports yet"
                  : "Try adjusting your search or filter criteria"}
              </p>
              {userIncidents.length === 0 && (
                <Button className="gradient-emergency shadow-emergency" asChild>
                  <Link to="/report">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Report
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
