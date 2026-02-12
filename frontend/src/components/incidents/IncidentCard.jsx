import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge.jsx";
import { INCIDENT_TYPE_LABELS } from "@/types/incident.js";
import { MapPin, Clock, Car, Flame, Heart, Shield, CloudRain, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeIcons = {
  accident: <Car className="h-5 w-5" />,
  fire: <Flame className="h-5 w-5" />,
  medical: <Heart className="h-5 w-5" />,
  crime: <Shield className="h-5 w-5" />,
  natural_disaster: <CloudRain className="h-5 w-5" />,
  other: <AlertCircle className="h-5 w-5" />,
};

export function IncidentCard({ incident }) {
  const type = incident.type || incident.incident_type;
  const status = incident.status;
  const location = incident.location || {};
  const createdAt = incident.createdAt || incident.created_at;
  
  return (
    <Link to={`/incident/${incident.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 gradient-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {typeIcons[type]}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {INCIDENT_TYPE_LABELS[type]}
                </p>
                <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {incident.title}
                </h3>
              </div>
            </div>
            <StatusBadge status={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </StatusBadge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {incident.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{location.address || "Location pending"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}