import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast.js";
import { useAuth } from "@/context/AuthContext.jsx";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        await register({
          email: formData.email,
          username: formData.email.split('@')[0],
          password: formData.password,
          full_name: formData.name,
        });
        toast({ title: "Account created!", description: "Welcome to AJALI!" });
      } else {
        await login(formData.email, formData.password);
        toast({ title: "Welcome back!", description: "Login successful" });
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-emergency shadow-emergency mb-8">
            <AlertTriangle className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold text-secondary-foreground mb-4">
            Ajali<span className="text-primary">!</span>
          </h1>
          <p className="text-xl text-secondary-foreground/80 max-w-md">
            Join our community of citizens making a difference. Report emergencies, save lives.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="lg:hidden flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-emergency shadow-emergency">
                  <AlertTriangle className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="font-display text-2xl">
                {mode === "signin" ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription>
                {mode === "signin"
                  ? "Sign in to your account to continue"
                  : "Get started with your free account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {mode === "signup" && (
                    <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-emergency shadow-emergency"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Please wait..."
                    : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                {mode === "signin" ? (
                  <p className="text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => setMode("signup")}
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => setMode("signin")}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;