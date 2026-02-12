import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header.jsx";
import { Footer } from "@/components/layout/Footer.jsx";
import { StatusBadge } from "@/components/ui/StatusBadge.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INCIDENT_TYPE_LABELS, STATUS_LABELS } from "@/types/incident.js";
import { ArrowLeft, MapPin, Clock, User, Edit, Trash2, Car, Flame, Heart, Shield, CloudRain, AlertCircle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useToast } from "@/hooks/use-toast.js";
import { reportService } from "@/services/api.js";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.jsx";

const typeIcons = {
  accident: <Car className="h-6 w-6" />,
  fire: <Flame className="h-6 w-6" />,
  medical: <Heart className="h-6 w-6" />,
  crime: <Shield className="h-6 w-6" />,
  natural_disaster: <CloudRain className="h-6 w-6" />,
  other: <AlertCircle className="h-6 w-6" />,
};

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        console.log('Fetching incident with ID:', id);
        const result = await reportService.getReport(id);
        console.log('API response:', result);
        if (result && result.report) {
          setIncident(result.report);
        }
      } catch (error) {
        console.error('Error fetching incident:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIncident();
    }
  }, [id, toast]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleDelete = () => {
    toast({
      title: "Incident deleted",
      description: "The incident report has been removed.",
    });
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header isAuthenticated onLogout={handleLogout} />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header isAuthenticated onLogout={handleLogout} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Incident Not Found
            </h1>
            <p className="text-muted-foreground mb-4">
              The incident you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isAuthenticated onLogout={handleLogout} />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {typeIcons[incident.incident_type] || typeIcons.other}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {INCIDENT_TYPE_LABELS[incident.incident_type] || incident.incident_type}
                </p>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {incident.title}
                </h1>
              </div>
            </div>
            <StatusBadge status={incident.status} className="text-sm px-4 py-1.5">
              {STATUS_LABELS[incident.status] || incident.status}
            </StatusBadge>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {incident.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-foreground font-medium">
                      {incident.address || incident.location?.address || "Address not provided"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {(incident.latitude || incident.location?.latitude)?.toFixed(6)}, {(incident.longitude || incident.location?.longitude)?.toFixed(6)}
                    </p>
                  </div>
                  <div className="aspect-video rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center">
                    {(incident.latitude || incident.location?.latitude) && (incident.longitude || incident.location?.longitude) ? (
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${(incident.longitude || incident.location?.longitude)-0.01},${(incident.latitude || incident.location?.latitude)-0.01},${(incident.longitude || incident.location?.longitude)+0.01},${(incident.latitude || incident.location?.latitude)+0.01}&layer=mapnik&marker=${(incident.latitude || incident.location?.latitude)},${(incident.longitude || incident.location?.longitude)}`}
                        className="rounded-xl"
                      ></iframe>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No location data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={`/incident/${incident.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Report
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Reported by</p>
                      <p className="font-medium text-foreground">{incident.user?.full_name || incident.user?.username || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium text-foreground">
                        {incident.created_at ? format(new Date(incident.created_at), "PPp") : 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {incident.created_at ? `(${formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })})` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium text-foreground">
                        {incident.updated_at ? format(new Date(incident.updated_at), "PPp") : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IncidentDetail;