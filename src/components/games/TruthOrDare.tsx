import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shuffle, Flame, Heart } from "lucide-react";

const TRUTHS = [
  "What's the most romantic thing you've ever done?",
  "Have you ever had a crush on a friend's partner?",
  "What's your biggest relationship deal-breaker?",
  "What's the sweetest text you've ever received?",
  "Have you ever written a love letter?",
  "What's your love language?",
  "What's the most embarrassing date you've been on?",
  "Do you believe in love at first sight?",
  "What's the cheesiest pickup line that would work on you?",
  "What song reminds you of your first love?",
  "What's your guilty pleasure when it comes to romance?",
  "Have you ever stalked someone's social media?",
  "What's a trait you find unexpectedly attractive?",
  "What's the longest you've had a crush on someone?",
  "Would you rather be proposed to in public or private?",
];

const DARES = [
  "Send a heart emoji to the last person you texted 💕",
  "Write a 4-line love poem right now ✍️",
  "Do your best romantic movie impression 🎬",
  "Sing the chorus of your favorite love song 🎤",
  "Give a compliment to every player in the room 💖",
  "Dance like nobody's watching for 15 seconds 💃",
  "Make your cutest face and hold it for 10 seconds 🥺",
  "Tell a joke that would make your crush laugh 😂",
  "Share your best dating advice in 10 words or less 💡",
  "Do a dramatic reading of the last text you sent 📱",
  "Strike your best model pose for a photo 📸",
  "Say something sweet to an imaginary partner 🥰",
  "Draw a heart with your non-dominant hand ✏️",
  "Make up a creative couple name for two random objects 💑",
  "Do your best impression of someone falling in love 😍",
];

interface Props {
  onBack: () => void;
}

const TruthOrDare = ({ onBack }: Props) => {
  const [mode, setMode] = useState<"choose" | "truth" | "dare" | null>("choose");
  const [current, setCurrent] = useState("");
  const [spinning, setSpinning] = useState(false);

  const pick = (type: "truth" | "dare") => {
    setSpinning(true);
    setMode(type);
    const list = type === "truth" ? TRUTHS : DARES;
    setTimeout(() => {
      setCurrent(list[Math.floor(Math.random() * list.length)]);
      setSpinning(false);
    }, 800);
  };

  const next = () => {
    if (mode === "truth" || mode === "dare") {
      setSpinning(true);
      const list = mode === "truth" ? TRUTHS : DARES;
      setTimeout(() => {
        setCurrent(list[Math.floor(Math.random() * list.length)]);
        setSpinning(false);
      }, 500);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="text-center">
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-5xl">🎯</span>
        </motion.div>
        <h1 className="text-2xl font-display font-bold text-gradient-love mt-2">Truth or Dare</h1>
        <p className="text-sm text-muted-foreground">Safe & fun version 💕</p>
      </div>

      <AnimatePresence mode="wait">
        {mode === "choose" ? (
          <motion.div
            key="choose"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="grid grid-cols-2 gap-4 mt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                className="cursor-pointer border-2 border-primary/20 hover:border-primary/50 transition-all bg-primary/5"
                onClick={() => pick("truth")}
              >
                <CardContent className="pt-8 pb-8 text-center">
                  <Heart className="h-12 w-12 mx-auto text-primary mb-3" />
                  <h3 className="text-xl font-display font-bold text-foreground">Truth</h3>
                  <p className="text-xs text-muted-foreground mt-1">Spill your heart</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                className="cursor-pointer border-2 border-love-neon/20 hover:border-love-neon/50 transition-all bg-love-neon/5"
                onClick={() => pick("dare")}
              >
                <CardContent className="pt-8 pb-8 text-center">
                  <Flame className="h-12 w-12 mx-auto text-love-neon mb-3" />
                  <h3 className="text-xl font-display font-bold text-foreground">Dare</h3>
                  <p className="text-xs text-muted-foreground mt-1">Show your courage</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass border-0 shadow-love mt-6">
              <CardContent className="pt-8 pb-8 text-center min-h-[200px] flex flex-col items-center justify-center">
                {spinning ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}>
                    <Shuffle className="h-12 w-12 text-primary" />
                  </motion.div>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4">
                      {mode === "truth" ? "💕 Truth" : "🔥 Dare"}
                    </span>
                    <p className="text-lg font-display font-bold text-foreground leading-relaxed">{current}</p>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setMode("choose")}>
                Switch
              </Button>
              <Button className="flex-1 gradient-love text-primary-foreground" onClick={next}>
                <Shuffle className="h-4 w-4 mr-1" /> Next
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TruthOrDare;
