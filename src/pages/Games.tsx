import { motion } from "framer-motion";
import { Gamepad2, Sparkles, Dice1, Brain, Zap, MessageSquare, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const GAMES = [
  { name: "Truth or Dare", emoji: "🎯", icon: Dice1, desc: "Safe & fun version", color: "text-love-pink" },
  { name: "Love Quiz", emoji: "💕", icon: Brain, desc: "Test your compatibility", color: "text-love-rose" },
  { name: "Emoji Memory", emoji: "🧠", icon: Sparkles, desc: "Match emoji pairs", color: "text-love-gold" },
  { name: "Speed Chat", emoji: "⚡", icon: Zap, desc: "Timed chat rounds", color: "text-love-neon" },
  { name: "Random Questions", emoji: "❓", icon: HelpCircle, desc: "Fun conversation starters", color: "text-love-purple" },
  { name: "Compatibility", emoji: "💞", icon: MessageSquare, desc: "How well do you match?", color: "text-primary" },
];

const Games = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <div className="text-center mb-6">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Gamepad2 className="h-12 w-12 mx-auto text-primary mb-2" />
        </motion.div>
        <h1 className="text-2xl font-display font-bold text-gradient-love">Games Zone</h1>
        <p className="text-sm text-muted-foreground">Play with friends or matches</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((game, i) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass border-0 hover:shadow-love transition-shadow cursor-pointer group">
              <CardContent className="pt-5 pb-4 text-center">
                <span className="text-3xl block mb-2">{game.emoji}</span>
                <h3 className="font-display font-bold text-sm text-foreground">{game.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{game.desc}</p>
                <p className="text-[10px] text-love-gold mt-2">Coming Soon ✨</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Games;
