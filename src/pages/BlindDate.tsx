import { motion } from "framer-motion";
import { Heart, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BlindDate = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className="h-20 w-20 mx-auto text-love-neon" />
        </motion.div>
        <h1 className="text-3xl font-display font-bold text-gradient-love">Blind Date</h1>
        <p className="text-muted-foreground">Find your anonymous match based on personality & interests</p>

        <Card className="glass shadow-love border-0">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-love-gold" />
              <span>AI-powered matching</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-primary" />
              <span>Anonymous until both consent to reveal</span>
            </div>
            <Button className="w-full gradient-love text-primary-foreground shadow-love text-lg py-6" disabled>
              <Flame className="h-5 w-5 mr-2" /> Find a Match — Coming Soon
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BlindDate;
