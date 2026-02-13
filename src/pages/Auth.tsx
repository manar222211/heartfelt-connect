import { useState, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import FloatingHearts from "@/components/FloatingHearts";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const Auth = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") setIsLogin(false);
    else if (mode === "login") setIsLogin(true);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Heart className="h-8 w-8 animate-heart-beat text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/onboarding" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (!isLogin) {
      if (!username.trim()) {
        toast({ title: "Username required", description: "Please enter a username", variant: "destructive" });
        return;
      }
      if (username.trim().length < 3) {
        toast({ title: "Username too short", description: "Username must be at least 3 characters", variant: "destructive" });
        return;
      }
      if (password.length < 6) {
        toast({ title: "Weak password", description: "Password must be at least 6 characters", variant: "destructive" });
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Passwords don't match", description: "Please make sure both passwords are the same", variant: "destructive" });
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Login failed", description: error.message, variant: "destructive" });
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast({ title: "Signup failed", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Check your email! 💌", description: "We sent you a verification link." });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <FloatingHearts />
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Heart className="h-14 w-14 text-primary fill-primary" />
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-gradient-love">LoveVerse</h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Welcome back! 💖" : "Create your account ✨"}
          </p>
        </div>

        <Card className="glass shadow-love border-0">
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Username (register only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="coolheart123"
                        className="pl-10"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                        maxLength={30}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (register only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-destructive">Passwords don't match</p>
                    )}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full gradient-love text-primary-foreground shadow-love hover:opacity-90 transition-opacity"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Heart className="h-4 w-4 animate-heart-beat" />
                  ) : isLogin ? (
                    "Sign In 💖"
                  ) : (
                    "Create Account 🌹"
                  )}
                </Button>
              </motion.form>
            </AnimatePresence>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
