import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header.jsx";
import { Footer } from "@/components/layout/Footer.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INCIDENT_TYPE_LABELS } from "@/types/incident.js";
import { MapPin, Upload, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast.js";
import { reportService } from "@/services/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

const EditIncident = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    incident_type: "",
    latitude: "",
    longitude: "",
    address: "",
  });

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const result = await reportService.getReport(id);
        if (result && result.report) {
          const incident = result.report;
          setFormData({
            title: incident.title || "",
            description: incident.description || "",
            incident_type: incident.incident_type || "",
            latitude: incident.latitude?.toString() || "",
            longitude: incident.longitude?.toString() || "",
            address: incident.address || "",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIncident();
    }
  }, [id, toast, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        });
        setIsLocating(false);
        toast({
          title: "Location captured",
          description: "Your current location has been added to the report",
        });
      },
      (error) => {
        setIsLocating(false);
        toast({
          title: "Error",
          description: "Unable to retrieve your location. Please enter manually.",
          variant: "destructive",
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await reportService.updateReport(id, {
        title: formData.title,
        description: formData.description,
        incident_type: formData.incident_type,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        address: formData.address || null,
      });

      toast({
        title: "Incident updated!",
        description: "Your report has been updated successfully.",
      });

      navigate(`/incident/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isAuthenticated onLogout={handleLogout} />
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate(`/incident/${id}`)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Incident
            </Button>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Edit Incident Report
            </h1>
            <p className="text-muted-foreground mt-1">
              Update the details of your incident report
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>
                Modify the information below to update your report.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Incident Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the incident"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    minLength={5}
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Incident Type *</Label>
                  <Select
                    value={formData.incident_type}
                    onValueChange={(v) => setFormData({ ...formData, incident_type: v })}
                    required
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(INCIDENT_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about what happened"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    minLength={20}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Location *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={isLocating}
                    >
                      {isLocating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4 mr-2" />
                      )}
                      Use Current Location
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="lat">Latitude</Label>
                      <Input
                        id="lat"
                        placeholder="-1.2921"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng">Longitude</Label>
                      <Input
                        id="lng"
                        placeholder="36.8219"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="aspect-video rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center">
                    {formData.latitude && formData.longitude ? (
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(formData.longitude)-0.01},${parseFloat(formData.latitude)-0.01},${parseFloat(formData.longitude)+0.01},${parseFloat(formData.latitude)+0.01}&layer=mapnik&marker=${formData.latitude},${formData.longitude}`}
                        className="rounded-xl"
                      ></iframe>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Map preview will appear here</p>
                        <p className="text-xs">(Enter coordinates to see location)</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address / Landmark (Optional)</Label>
                    <Input
                      id="address"
                      placeholder="e.g., Near Kenyatta International Convention Centre"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/incident/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gradient-emergency shadow-emergency"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Update Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditIncident;