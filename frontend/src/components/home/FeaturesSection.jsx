import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Camera, Bell, Users, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "GPS Location Tracking",
    description: "Automatically capture and share precise incident locations for faster emergency response.",
  },
  {
    icon: Camera,
    title: "Media Evidence",
    description: "Attach photos and videos to your reports, providing crucial evidence for investigations.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Authorities receive real-time alerts, ensuring the fastest possible response times.",
  },
  {
    icon: Users,
    title: "Community Alerts",
    description: "Keep the public informed about nearby emergencies and hazardous situations.",
  },
  {
    icon: Shield,
    title: "Status Tracking",
    description: "Monitor your reports from submission through investigation to resolution.",
  },
  {
    icon: Zap,
    title: "Quick Reporting",
    description: "Simple, intuitive interface designed for urgent situations when every second counts.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need for{" "}
            <span className="text-gradient-emergency">Emergency Reporting</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ajali! provides all the tools citizens need to report incidents quickly and 
            effectively, bridging the gap between you and emergency services.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg gradient-card animate-slide-in-bottom"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}