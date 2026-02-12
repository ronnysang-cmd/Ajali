import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-emergency">
              <AlertTriangle className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              Ajali<span className="text-primary">!</span>
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/auth" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ajali! All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}