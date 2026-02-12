import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header.jsx";
import { Footer } from "@/components/layout/Footer.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INCIDENT_TYPE_LABELS } from "@/types/incident.js";
import { MapPin, Upload, Image, Video, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast.js";
import { reportService } from "@/services/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { uploadToCloudinary } from "@/services/cloudinary.js";

const ReportIncident = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    lat: "",
    lng: "",
    address: "",
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
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

  const handleFileUpload = async (files, type) => {
    setIsUploading(true);
    try {
      const uploadedFiles = [];
      
      for (const file of files) {
        // Store file temporarily in state
        const fileUrl = URL.createObjectURL(file);
        uploadedFiles.push({
          url: fileUrl,
          type,
          name: file.name,
          file: file // Store actual file for later upload
        });
      }
      
      setMediaFiles(prev => [...prev, ...uploadedFiles]);
      
      toast({
        title: "Files selected",
        description: `${uploadedFiles.length} file(s) ready to upload with report`,
      });
    } catch (error) {
      toast({
        title: "Selection failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate before sending
      if (formData.title.length < 5) {
        toast({
          title: "Validation Error",
          description: "Title must be at least 5 characters long",
          variant: "destructive",
        });
        return;
      }
      
      if (formData.description.length < 20) {
        toast({
          title: "Validation Error",
          description: "Description must be at least 20 characters long",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.type) {
        toast({
          title: "Validation Error",
          description: "Please select an incident type",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.lat || !formData.lng) {
        toast({
          title: "Validation Error",
          description: "Please provide location coordinates",
          variant: "destructive",
        });
        return;
      }

      await reportService.createReport({
        title: formData.title,
        description: formData.description,
        incident_type: formData.type,
        latitude: parseFloat(formData.lat),
        longitude: parseFloat(formData.lng),
        address: formData.address || null,
        media: mediaFiles.map(f => ({ name: f.name, type: f.type })) // Include media info
      });

      toast({
        title: "Incident reported!",
        description: "Your report has been submitted successfully. Authorities have been notified.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isAuthenticated onLogout={handleLogout} />
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Report an Incident
            </h1>
            <p className="text-muted-foreground mt-1">
              Provide details about the emergency to help authorities respond quickly
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>
                Fill in the information below. The more details you provide, the faster
                emergency services can respond.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Incident Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the incident (min 5 characters)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    minLength={5}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">{formData.title.length}/200 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Incident Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
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
                    placeholder="Provide detailed information about what happened, number of people involved, immediate dangers, etc. (min 20 characters)"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    minLength={20}
                  />
                  <p className="text-xs text-muted-foreground">{formData.description.length} characters (minimum 20)</p>
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
                        value={formData.lat}
                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng">Longitude</Label>
                      <Input
                        id="lng"
                        placeholder="36.8219"
                        value={formData.lng}
                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                        required
                      />
                    </div>
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

                  <div className="aspect-video rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center">
                    {formData.lat && formData.lng ? (
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(formData.lng)-0.01},${parseFloat(formData.lat)-0.01},${parseFloat(formData.lng)+0.01},${parseFloat(formData.lat)+0.01}&layer=mapnik&marker=${formData.lat},${formData.lng}`}
                        className="rounded-xl"
                      ></iframe>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Map preview will appear here</p>
                        <p className="text-xs">(OpenStreetMap integration)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/dashboard")}
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
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Report
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

export default ReportIncident;