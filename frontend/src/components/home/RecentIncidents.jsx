import { IncidentCard } from "@/components/incidents/IncidentCard.jsx";
import { mockIncidents } from "@/data/mockIncidents.js";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function RecentIncidents() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Recent Incidents
            </h2>
            <p className="text-muted-foreground">
              Stay informed about emergencies in your area
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mockIncidents.slice(0, 4).map((incident, index) => (
            <div
              key={incident.id}
              className="animate-slide-in-bottom"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <IncidentCard incident={incident} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}