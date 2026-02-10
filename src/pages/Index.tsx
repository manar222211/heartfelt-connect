import { Navigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Heart className="h-8 w-8 animate-heart-beat text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // TODO: Check onboarding_completed and redirect accordingly
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Heart className="h-16 w-16 mx-auto text-primary fill-primary animate-pulse-love mb-4" />
        <h1 className="text-4xl font-display font-bold text-gradient-love mb-2">Welcome to LoveVerse</h1>
        <p className="text-muted-foreground">Feed coming soon 💕</p>
      </div>
    </div>
  );
};

export default Index;
