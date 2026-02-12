import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";

interface Question {
  question: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  { question: "Ideal weekend?", options: ["Adventure 🏔️", "Netflix & Chill 🍿", "Party 🎉", "Reading 📚"] },
  { question: "Love language?", options: ["Words ✍️", "Touch 🤗", "Gifts 🎁", "Quality Time ⏰"] },
  { question: "Perfect dinner?", options: ["Fancy Restaurant 🍷", "Home Cooked 🍳", "Street Food 🌮", "Picnic 🧺"] },
  { question: "Morning routine?", options: ["Early Bird 🌅", "Night Owl 🦉", "Depends 🤷", "No Routine 😴"] },
  { question: "Music taste?", options: ["Pop 🎵", "Rock 🎸", "R&B/Soul 🎤", "Everything 🎶"] },
  { question: "Pet preference?", options: ["Dogs 🐕", "Cats 🐈", "Both 🐾", "No Pets 🚫"] },
  { question: "Vacation style?", options: ["Beach 🏖️", "Mountains ⛰️", "City 🏙️", "Countryside 🌾"] },
  { question: "Communication style?", options: ["Texting 📱", "Calls 📞", "In Person 👥", "Memes 😂"] },
];

interface Props {
  onBack: () => void;
}

const CompatibilityGame = ({ onBack }: Props) => {
  const [phase, setPhase] = useState<"p1" | "p2" | "result">("p1");
  const [step, setStep] = useState(0);
  const [p1Answers, setP1Answers] = useState<number[]>([]);
  const [p2Answers, setP2Answers] = useState<number[]>([]);

  const currentAnswers = phase === "p1" ? p1Answers : p2Answers;
  const setCurrentAnswers = phase === "p1" ? setP1Answers : setP2Answers;

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...currentAnswers, optionIndex];
    setCurrentAnswers(newAnswers);

    if (step + 1 >= QUESTIONS.length) {
      if (phase === "p1") {
        setPhase("p2");
        setStep(0);
      } else {
        setP2Answers(newAnswers);
        setPhase("result");
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const getScore = () => {
    let matches = 0;
    for (let i = 0; i < QUESTIONS.length; i++) {
      if (p1Answers[i] === p2Answers[i]) matches++;
    }
    return Math.round((matches / QUESTIONS.length) * 100);
  };

  const getVerdict = (score: number) => {
    if (score >= 80) return { emoji: "💕", title: "Perfect Match!", desc: "You two are incredibly compatible!", color: "text-primary" };
    if (score >= 60) return { emoji: "🌹", title: "Great Chemistry!", desc: "You have a strong connection!", color: "text-love-rose" };
    if (score >= 40) return { emoji: "✨", title: "Interesting Mix!", desc: "Opposites attract, right?", color: "text-love-gold" };
    return { emoji: "🌈", title: "Unique Match!", desc: "Different vibes, but that's exciting!", color: "text-love-purple" };
  };

  const restart = () => {
    setPhase("p1");
    setStep(0);
    setP1Answers([]);
    setP2Answers([]);
  };

  if (phase === "result") {
    const score = getScore();
    const verdict = getVerdict(score);
    return (
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center mt-6 space-y-4">
          <span className="text-7xl block">{verdict.emoji}</span>
          <h2 className="text-3xl font-display font-bold text-gradient-love">{verdict.title}</h2>
          <p className="text-muted-foreground">{verdict.desc}</p>

          <motion.div
            className="relative w-40 h-40 mx-auto"
            initial={{ rotate: -90 }}
            animate={{ rotate: -90 }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${score * 2.51} ${251 - score * 2.51}`}
                initial={{ strokeDasharray: "0 251" }}
                animate={{ strokeDasharray: `${score * 2.51} ${251 - score * 2.51}` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-3xl font-bold text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {score}%
              </motion.span>
            </div>
          </motion.div>

          <div className="space-y-2 text-left max-w-sm mx-auto mt-4">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>{p1Answers[i] === p2Answers[i] ? "💕" : "💔"}</span>
                <span className="text-muted-foreground">{q.question}</span>
              </div>
            ))}
          </div>

          <Button onClick={restart} className="gradient-love text-primary-foreground shadow-love mt-4">
            <Sparkles className="h-4 w-4 mr-1" /> Play Again
          </Button>
        </motion.div>
      </div>
    );
  }

  const question = QUESTIONS[step];

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="text-center">
        <span className="text-4xl">💞</span>
        <h1 className="text-2xl font-display font-bold text-gradient-love">Compatibility</h1>
        <div className="mt-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            phase === "p1" ? "gradient-love text-primary-foreground" : "bg-love-purple text-primary-foreground"
          }`}>
            {phase === "p1" ? "💕 Player 1" : "💜 Player 2"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Q {step + 1}/{QUESTIONS.length}</p>
        <div className="h-2 rounded-full bg-muted overflow-hidden mt-2">
          <motion.div className="h-full gradient-love rounded-full" animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${phase}-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="glass border-0 shadow-love mt-4">
            <CardContent className="pt-6 pb-6">
              <p className="text-lg font-display font-bold text-center text-foreground mb-6">{question.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(i)}
                    className="p-4 rounded-xl border-2 border-border hover:border-primary/40 bg-background/50 transition-all text-center"
                  >
                    <span className="font-medium text-foreground text-sm">{opt}</span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {phase === "p1" && step === 0 && (
        <p className="text-xs text-center text-muted-foreground">
          Pass the phone to Player 2 after you finish! 📱
        </p>
      )}
    </div>
  );
};

export default CompatibilityGame;
