import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Dice1, Brain, Sparkles, Zap, MessageSquare, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TruthOrDare from "@/components/games/TruthOrDare";
import LoveQuiz from "@/components/games/LoveQuiz";
import EmojiMemory from "@/components/games/EmojiMemory";
import SpeedChat from "@/components/games/SpeedChat";
import RandomQuestions from "@/components/games/RandomQuestions";
import CompatibilityGame from "@/components/games/CompatibilityGame";

type GameId = "truth-or-dare" | "love-quiz" | "emoji-memory" | "speed-chat" | "random-questions" | "compatibility";

const GAMES: { id: GameId; name: string; emoji: string; icon: any; desc: string }[] = [
  { id: "truth-or-dare", name: "Truth or Dare", emoji: "🎯", icon: Dice1, desc: "Safe & fun version" },
  { id: "love-quiz", name: "Love Quiz", emoji: "💕", icon: Brain, desc: "Test your love IQ" },
  { id: "emoji-memory", name: "Emoji Memory", emoji: "🧠", icon: Sparkles, desc: "Match emoji pairs" },
  { id: "speed-chat", name: "Speed Chat", emoji: "⚡", icon: Zap, desc: "Timed chat rounds" },
  { id: "random-questions", name: "Random Questions", emoji: "❓", icon: HelpCircle, desc: "Conversation starters" },
  { id: "compatibility", name: "Compatibility", emoji: "💞", icon: MessageSquare, desc: "How well do you match?" },
];

const Games = () => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const onBack = () => setActiveGame(null);

  if (activeGame === "truth-or-dare") return <TruthOrDare onBack={onBack} />;
  if (activeGame === "love-quiz") return <LoveQuiz onBack={onBack} />;
  if (activeGame === "emoji-memory") return <EmojiMemory onBack={onBack} />;
  if (activeGame === "speed-chat") return <SpeedChat onBack={onBack} />;
  if (activeGame === "random-questions") return <RandomQuestions onBack={onBack} />;
  if (activeGame === "compatibility") return <CompatibilityGame onBack={onBack} />;

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
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className="glass border-0 hover:shadow-love transition-shadow cursor-pointer group"
              onClick={() => setActiveGame(game.id)}
            >
              <CardContent className="pt-5 pb-4 text-center">
                <motion.span
                  className="text-3xl block mb-2"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {game.emoji}
                </motion.span>
                <h3 className="font-display font-bold text-sm text-foreground">{game.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{game.desc}</p>
                <p className="text-[10px] text-primary mt-2 font-medium group-hover:text-love-neon transition-colors">
                  Play Now 🎮
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Games;
