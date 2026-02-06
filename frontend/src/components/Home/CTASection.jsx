import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-16 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-emergency shadow-emergency animate-pulse-emergency">
                <AlertTriangle className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-secondary-foreground/80 max-w-xl mx-auto mb-8">
              Join thousands of citizens helping to keep their communities safe. 
              Your report could save a life.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto gradient-emergency shadow-emergency text-lg px-8 py-6 font-semibold group"
                asChild
              >
                <Link to="/auth?mode=signup">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}