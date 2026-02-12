import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, Shield, Clock, MapPin } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground/90 text-sm font-medium mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Emergency Response Platform
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-6 animate-slide-in-bottom">
            Report Emergencies.{" "}
            <span className="text-gradient-emergency">Save Lives.</span>
          </h1>

          <p className="text-lg md:text-xl text-secondary-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-in-bottom" style={{ animationDelay: "0.1s" }}>
            Ajali! empowers citizens to report accidents and emergencies instantly, 
            connecting you directly with authorities and alerting the community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-in-bottom" style={{ animationDelay: "0.2s" }}>
            <Button
              size="lg"
              className="w-full sm:w-auto gradient-emergency shadow-emergency text-lg px-8 py-6 font-semibold group"
              asChild
            >
              <Link to="/auth?mode=signup">
                Report an Emergency
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-6 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
              asChild
            >
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 animate-slide-in-bottom" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2 text-secondary-foreground/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Real-time Alerts</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-foreground/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <MapPin className="h-4 w-4 text-success" />
              </div>
              <span className="text-sm font-medium">GPS Location</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-foreground/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info/20">
                <Shield className="h-4 w-4 text-info" />
              </div>
              <span className="text-sm font-medium">Authority Integration</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}