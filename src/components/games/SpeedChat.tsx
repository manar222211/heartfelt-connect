import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Send, RotateCcw } from "lucide-react";

const PROMPTS = [
  "Describe your perfect date in one sentence ❤️",
  "What's the most spontaneous thing you've done? ⚡",
  "Your favorite way to spend a rainy day? 🌧️",
  "What makes you laugh the hardest? 😂",
  "Your dream travel destination? ✈️",
  "Describe yourself in 3 emojis 🎭",
  "What's your hidden talent? 🌟",
  "Morning person or night owl? 🌅🦉",
  "Favorite comfort food? 🍕",
  "What's your love language? 💕",
  "Best movie to watch on a date? 🎬",
  "What song is stuck in your head? 🎵",
  "Your most controversial food opinion? 🍔",
  "If you could have dinner with anyone? 🍽️",
  "What's your go-to karaoke song? 🎤",
];

const ROUND_TIME = 30;
const TOTAL_ROUNDS = 5;

interface Props {
  onBack: () => void;
}

const SpeedChat = ({ onBack }: Props) => {
  const [phase, setPhase] = useState<"start" | "playing" | "done">("start");
  const [round, setRound] = useState(0);
  const [time, setTime] = useState(ROUND_TIME);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [prompts, setPrompts] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = () => {
    const shuffled = [...PROMPTS].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS);
    setPrompts(shuffled);
    setRound(0);
    setAnswers([]);
    setInput("");
    setTime(ROUND_TIME);
    setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing") return;
    if (time <= 0) {
      submitAnswer();
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, phase]);

  useEffect(() => {
    if (phase === "playing") inputRef.current?.focus();
  }, [round, phase]);

  const submitAnswer = () => {
    const newAnswers = [...answers, input || "(skipped)"];
    setAnswers(newAnswers);
    setInput("");
    if (round + 1 >= TOTAL_ROUNDS) {
      setPhase("done");
    } else {
      setRound((r) => r + 1);
      setTime(ROUND_TIME);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) submitAnswer();
  };

  if (phase === "start") {
    return (
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="text-center mt-8 space-y-4">
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-6xl block">⚡</motion.span>
          <h1 className="text-3xl font-display font-bold text-gradient-love">Speed Chat</h1>
          <p className="text-muted-foreground">Answer {TOTAL_ROUNDS} prompts in {ROUND_TIME}s each!</p>
          <p className="text-sm text-muted-foreground">Think fast, be creative, have fun! 💕</p>
          <Button onClick={startGame} className="gradient-love text-primary-foreground shadow-love mt-4" size="lg">
            Start Game ⚡
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="text-center mt-4">
          <span className="text-5xl block mb-2">🏆</span>
          <h2 className="text-2xl font-display font-bold text-gradient-love">Speed Chat Complete!</h2>
          <p className="text-sm text-muted-foreground mt-1">Here's what you said:</p>
        </div>
        <div className="space-y-3">
          {prompts.map((p, i) => (
            <Card key={i} className="glass border-0">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground mb-1">{p}</p>
                <p className="font-medium text-foreground">{answers[i]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onBack}>Done</Button>
          <Button className="flex-1 gradient-love text-primary-foreground" onClick={startGame}>
            <RotateCcw className="h-4 w-4 mr-1" /> Again
          </Button>
        </div>
      </div>
    );
  }

  const progress = (time / ROUND_TIME) * 100;
  const urgent = time <= 10;

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-sm text-muted-foreground">Round {round + 1}/{TOTAL_ROUNDS}</span>
        </div>
        <motion.div
          className={`text-4xl font-bold font-display ${urgent ? "text-destructive" : "text-foreground"}`}
          animate={urgent ? { scale: [1, 1.1, 1] } : {}}
          transition={urgent ? { duration: 0.5, repeat: Infinity } : {}}
        >
          <Clock className="h-5 w-5 inline mr-1" />
          {time}s
        </motion.div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mt-2">
          <motion.div
            className={`h-full rounded-full ${urgent ? "bg-destructive" : "gradient-love"}`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={round} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <Card className="glass border-0 shadow-love">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-lg font-display font-bold text-foreground">{prompts[round]}</p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" size="icon" className="gradient-love text-primary-foreground h-12 w-12 rounded-xl">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default SpeedChat;
