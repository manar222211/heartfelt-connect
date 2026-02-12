import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Star, Trophy } from "lucide-react";

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  { q: "Which hormone is known as the 'love hormone'?", options: ["Dopamine", "Oxytocin", "Serotonin", "Cortisol"], correct: 1, explanation: "Oxytocin is released during hugging, cuddling, and bonding! 💕" },
  { q: "In which country is Valentine's Day NOT celebrated on Feb 14?", options: ["USA", "Brazil", "France", "UK"], correct: 1, explanation: "Brazil celebrates Dia dos Namorados on June 12! 🇧🇷" },
  { q: "What does a red rose symbolize?", options: ["Friendship", "True Love", "Apology", "Gratitude"], correct: 1, explanation: "Red roses are the universal symbol of true love! 🌹" },
  { q: "Which love language involves physical closeness?", options: ["Words of Affirmation", "Quality Time", "Physical Touch", "Acts of Service"], correct: 2, explanation: "Physical Touch is one of the 5 love languages by Gary Chapman! 🤗" },
  { q: "How long does it take to decide if you're attracted to someone?", options: ["5 minutes", "30 seconds", "90 seconds", "10 minutes"], correct: 2, explanation: "Studies show it takes just 90 seconds to decide attraction! ⚡" },
  { q: "Which animal mates for life?", options: ["Dogs", "Penguins", "Cats", "Rabbits"], correct: 1, explanation: "Penguins are known for their lifelong partnerships! 🐧" },
  { q: "What is 'butterflies in your stomach' caused by?", options: ["Hunger", "Adrenaline", "Happiness", "Cold"], correct: 1, explanation: "The adrenaline rush of love redirects blood from your stomach! 🦋" },
  { q: "In ancient Greece, what color was associated with love?", options: ["Red", "Pink", "Purple", "Gold"], correct: 0, explanation: "Red has been associated with love and passion since ancient times! ❤️" },
  { q: "What percentage of couples meet online now?", options: ["10%", "20%", "30%", "40%+"], correct: 3, explanation: "Over 40% of couples now meet through dating apps and websites! 📱" },
  { q: "Which planet is named after the goddess of love?", options: ["Mars", "Venus", "Jupiter", "Mercury"], correct: 1, explanation: "Venus is named after the Roman goddess of love and beauty! 💫" },
];

interface Props {
  onBack: () => void;
}

const LoveQuiz = ({ onBack }: Props) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[index];

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === question.correct) setScore((s) => s + 1);
    setShowResult(true);
  };

  const next = () => {
    if (index + 1 >= QUESTIONS.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setFinished(false);
  };

  const getGrade = () => {
    const pct = (score / QUESTIONS.length) * 100;
    if (pct >= 90) return { emoji: "👑", title: "Love Expert!", desc: "You know everything about love!" };
    if (pct >= 70) return { emoji: "💕", title: "Romantic Soul", desc: "You really know your love facts!" };
    if (pct >= 50) return { emoji: "😊", title: "Love Learner", desc: "Not bad! Keep learning about love!" };
    return { emoji: "🌱", title: "Love Newbie", desc: "Time to explore the world of love!" };
  };

  if (finished) {
    const grade = getGrade();
    return (
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center mt-8">
          <span className="text-7xl block mb-4">{grade.emoji}</span>
          <h2 className="text-3xl font-display font-bold text-gradient-love">{grade.title}</h2>
          <p className="text-muted-foreground mt-2">{grade.desc}</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Trophy className="h-6 w-6 text-love-gold" />
            <span className="text-2xl font-bold text-foreground">{score}/{QUESTIONS.length}</span>
          </div>
          <div className="flex gap-1 justify-center mt-3">
            {Array.from({ length: QUESTIONS.length }).map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < score ? "text-love-gold fill-love-gold" : "text-muted"}`} />
            ))}
          </div>
          <Button onClick={restart} className="mt-6 gradient-love text-primary-foreground shadow-love">
            Play Again 💕
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="text-center">
        <span className="text-4xl">💕</span>
        <h1 className="text-2xl font-display font-bold text-gradient-love">Love Quiz</h1>
        <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>Question {index + 1}/{QUESTIONS.length}</span>
          <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-primary" /> {score}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mt-3">
          <motion.div className="h-full gradient-love rounded-full" animate={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="glass border-0 shadow-love mt-4">
            <CardContent className="pt-6 pb-6">
              <p className="text-lg font-display font-bold text-foreground text-center mb-6">{question.q}</p>
              <div className="space-y-3">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={selected === null ? { scale: 1.02 } : {}}
                    whileTap={selected === null ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(i)}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                      selected === null
                        ? "border-border hover:border-primary/40 bg-background/50"
                        : i === question.correct
                        ? "border-green-500 bg-green-500/10"
                        : i === selected
                        ? "border-destructive bg-destructive/10"
                        : "border-border opacity-50"
                    }`}
                  >
                    <span className="font-medium text-foreground">{opt}</span>
                  </motion.button>
                ))}
              </div>

              {showResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 rounded-lg bg-primary/5 text-center">
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-center">
              <Button onClick={next} className="gradient-love text-primary-foreground shadow-love">
                {index + 1 >= QUESTIONS.length ? "See Results 🏆" : "Next Question →"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoveQuiz;
