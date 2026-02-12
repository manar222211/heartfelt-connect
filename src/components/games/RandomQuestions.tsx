import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shuffle, Heart, MessageCircle, Flame, Sparkles } from "lucide-react";

const CATEGORIES = [
  { name: "Romantic", emoji: "💕", icon: Heart, color: "text-primary" },
  { name: "Fun", emoji: "😄", icon: MessageCircle, color: "text-love-gold" },
  { name: "Deep", emoji: "🌊", icon: Sparkles, color: "text-love-purple" },
  { name: "Spicy", emoji: "🔥", icon: Flame, color: "text-love-neon" },
];

const QUESTIONS: Record<string, string[]> = {
  Romantic: [
    "What's the most romantic gesture you can imagine?",
    "Do you believe in soulmates? Why or why not?",
    "What's your idea of a perfect first date?",
    "What love song describes your love life right now?",
    "What's the sweetest thing anyone has ever said to you?",
    "Where would you go on a dream honeymoon?",
    "What's your biggest green flag in a partner?",
    "How do you know when you're falling in love?",
    "Sunrise date or sunset date?",
    "What's the most romantic movie scene ever?",
  ],
  Fun: [
    "What's the weirdest food combo you secretly love?",
    "If your love life was a movie genre, what would it be?",
    "What's the most embarrassing thing in your search history?",
    "If you were a flavor of ice cream, which one?",
    "What's the funniest pickup line you've heard?",
    "Would you rather have a pet dragon or unicorn?",
    "What's your most used emoji?",
    "If you could have any superpower on a date, what?",
    "What's the silliest reason you've liked someone?",
    "What would your dating profile bio say in 5 words?",
  ],
  Deep: [
    "What's something you've never told anyone?",
    "What's your biggest fear about relationships?",
    "If you could relive one day, which would it be?",
    "What lesson did your hardest breakup teach you?",
    "What does 'home' feel like to you?",
    "What are you most grateful for right now?",
    "What's a belief you've changed your mind about?",
    "What would you want your legacy to be?",
    "What's the bravest thing you've ever done?",
    "What does unconditional love mean to you?",
  ],
  Spicy: [
    "What's your biggest turn-on personality-wise?",
    "Have you ever had a crush on a fictional character?",
    "What's the boldest move you've made on someone?",
    "What's your guilty pleasure TV show?",
    "Have you ever sent a risky text you regretted?",
    "What's the most spontaneous thing you'd do for love?",
    "Truth: have you ever dated two people at once?",
    "What's the most adventurous date you'd go on?",
    "What's your hottest take about modern dating?",
    "Would you make the first move or wait?",
  ],
};

interface Props {
  onBack: () => void;
}

const RandomQuestions = ({ onBack }: Props) => {
  const [category, setCategory] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const pickRandom = (cat?: string) => {
    const c = cat || category;
    if (!c) return;
    setAnimating(true);
    setTimeout(() => {
      const qs = QUESTIONS[c];
      setQuestion(qs[Math.floor(Math.random() * qs.length)]);
      setAnimating(false);
    }, 500);
  };

  const selectCategory = (name: string) => {
    setCategory(name);
    pickRandom(name);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <Button variant="ghost" size="sm" onClick={category ? () => { setCategory(null); setQuestion(null); } : onBack}>
        <ArrowLeft className="h-4 w-4 mr-1" /> {category ? "Categories" : "Back"}
      </Button>

      <div className="text-center">
        <span className="text-4xl">❓</span>
        <h1 className="text-2xl font-display font-bold text-gradient-love">Random Questions</h1>
        <p className="text-sm text-muted-foreground">Fun conversation starters!</p>
      </div>

      {!category ? (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card
                className="cursor-pointer border-2 border-border hover:border-primary/40 transition-all"
                onClick={() => selectCategory(cat.name)}
              >
                <CardContent className="pt-6 pb-6 text-center">
                  <span className="text-4xl block mb-2">{cat.emoji}</span>
                  <h3 className="font-display font-bold text-foreground">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{QUESTIONS[cat.name].length} questions</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={question} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <Card className="glass border-0 shadow-love mt-4">
              <CardContent className="pt-8 pb-8 text-center min-h-[180px] flex flex-col items-center justify-center">
                {animating ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}>
                    <Shuffle className="h-10 w-10 text-primary" />
                  </motion.div>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
                      {CATEGORIES.find((c) => c.name === category)?.emoji} {category}
                    </span>
                    <p className="text-lg font-display font-bold text-foreground leading-relaxed">{question}</p>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="mt-4 flex justify-center">
              <Button onClick={() => pickRandom()} className="gradient-love text-primary-foreground shadow-love">
                <Shuffle className="h-4 w-4 mr-1" /> Next Question
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default RandomQuestions;
