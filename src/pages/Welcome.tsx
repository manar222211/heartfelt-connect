import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingHearts from "@/components/FloatingHearts";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6">
      <FloatingHearts />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center max-w-md"
      >
        {/* Logo */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <div className="relative">
            <Heart className="h-20 w-20 text-primary fill-primary drop-shadow-lg" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-love-gold" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl font-display font-bold text-gradient-love mb-3"
        >
          LoveVerse
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg text-muted-foreground mb-2"
        >
          Where hearts connect ✨
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-sm text-muted-foreground mb-10 max-w-xs"
        >
          Find love, make friends, play games, and share confessions — all anonymously or openly. Your universe of connection awaits.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          <Button
            onClick={() => navigate("/auth?mode=register")}
            className="w-full gradient-love text-primary-foreground shadow-love hover:opacity-90 transition-opacity h-12 text-base"
          >
            Get Started <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button
            onClick={() => navigate("/auth?mode=login")}
            variant="outline"
            className="w-full h-12 text-base"
          >
            I already have an account
          </Button>
        </motion.div>

        {/* Features preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 flex gap-6 text-muted-foreground text-xs"
        >
          {[
            { emoji: "💬", label: "Chat" },
            { emoji: "💕", label: "Date" },
            { emoji: "🎮", label: "Games" },
            { emoji: "🤫", label: "Confess" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{f.emoji}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
