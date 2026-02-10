import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FloatingHearts from "@/components/FloatingHearts";

const EDUCATION_LEVELS = [
  { value: "high_school", label: "High School", emoji: "🎒" },
  { value: "university", label: "University Student", emoji: "🎓" },
  { value: "working", label: "Working Professional", emoji: "💼" },
  { value: "other", label: "Other", emoji: "✨" },
];

const RELATIONSHIP_GOALS = [
  { value: "chat", label: "Chat", emoji: "💬" },
  { value: "dating", label: "Dating", emoji: "💕" },
  { value: "friendship", label: "Friendship", emoji: "🤝" },
  { value: "games", label: "Games", emoji: "🎮" },
  { value: "not_sure", label: "Not Sure", emoji: "🤷" },
];

const GENDERS = [
  { value: "male", label: "Male", emoji: "👨" },
  { value: "female", label: "Female", emoji: "👩" },
  { value: "non_binary", label: "Non-Binary", emoji: "🌈" },
  { value: "prefer_not_to_say", label: "Prefer not to say", emoji: "🤫" },
];

const VIBES = [
  { value: "romantic", label: "Romantic", emoji: "🌹" },
  { value: "funny", label: "Funny", emoji: "😂" },
  { value: "chill", label: "Chill", emoji: "😎" },
  { value: "adventurous", label: "Adventurous", emoji: "🏔️" },
  { value: "shy", label: "Shy", emoji: "🙈" },
];

const INTERESTS = [
  { value: "music", label: "Music", emoji: "🎵" },
  { value: "movies", label: "Movies", emoji: "🎬" },
  { value: "gaming", label: "Gaming", emoji: "🎮" },
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "cooking", label: "Cooking", emoji: "🍳" },
  { value: "sports", label: "Sports", emoji: "⚽" },
  { value: "art", label: "Art", emoji: "🎨" },
  { value: "reading", label: "Reading", emoji: "📚" },
  { value: "photography", label: "Photography", emoji: "📸" },
  { value: "fitness", label: "Fitness", emoji: "💪" },
  { value: "nature", label: "Nature", emoji: "🌿" },
  { value: "tech", label: "Tech", emoji: "💻" },
];

const STEPS = ["age", "education", "goal", "gender", "vibes", "interests"] as const;
type Step = typeof STEPS[number];

const Onboarding = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("age");
  const [saving, setSaving] = useState(false);

  const [dob, setDob] = useState("");
  const [education, setEducation] = useState("");
  const [goal, setGoal] = useState("");
  const [gender, setGender] = useState("");
  const [interestedIn, setInterestedIn] = useState<string[]>([]);
  const [vibes, setVibes] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Heart className="h-8 w-8 animate-heart-beat text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const getAge = () => {
    if (!dob) return 0;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const canNext = () => {
    switch (step) {
      case "age": return dob && getAge() >= 13;
      case "education": return !!education;
      case "goal": return !!goal;
      case "gender": return !!gender;
      case "vibes": return vibes.length > 0;
      case "interests": return interests.length >= 2;
    }
  };

  const nextStep = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const prevStep = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const toggleArray = (arr: string[], val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const handleFinish = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        date_of_birth: dob,
        education_level: education,
        relationship_goal: goal,
        gender,
        interested_in: interestedIn,
        personality_vibes: vibes,
        interests,
        onboarding_completed: true,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
    setSaving(false);
  };

  const OptionCard = ({ selected, onClick, emoji, label }: { selected: boolean; onClick: () => void; emoji: string; label: string }) => (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all w-full text-left ${
        selected ? "border-primary bg-primary/10 shadow-love" : "border-border hover:border-primary/40"
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="font-medium text-foreground">{label}</span>
    </motion.button>
  );

  const ChipCard = ({ selected, onClick, emoji, label }: { selected: boolean; onClick: () => void; emoji: string; label: string }) => (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all ${
        selected ? "border-primary bg-primary/10 shadow-love" : "border-border hover:border-primary/40"
      }`}
    >
      <span className="text-lg">{emoji}</span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </motion.button>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <FloatingHearts />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {stepIndex + 1} of {STEPS.length}</span>
            <Sparkles className="h-4 w-4 text-love-gold" />
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full gradient-love rounded-full" animate={{ width: `${progress}%` }} />
          </div>
        </div>

        <Card className="glass shadow-love border-0">
          <CardContent className="pt-6 pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                {step === "age" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold text-foreground">When's your birthday? 🎂</h2>
                    <p className="text-muted-foreground text-sm">You must be at least 13 to use LoveVerse</p>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                    </div>
                    {dob && getAge() < 13 && (
                      <p className="text-destructive text-sm">You must be at least 13 years old</p>
                    )}
                    {dob && getAge() >= 13 && (
                      <p className="text-muted-foreground text-sm">You're {getAge()} years old ✨</p>
                    )}
                  </div>
                )}

                {step === "education" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold text-foreground">Education level 📚</h2>
                    <div className="space-y-2">
                      {EDUCATION_LEVELS.map((e) => (
                        <OptionCard key={e.value} selected={education === e.value} onClick={() => setEducation(e.value)} emoji={e.emoji} label={e.label} />
                      ))}
                    </div>
                  </div>
                )}

                {step === "goal" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold text-foreground">What are you looking for? 💫</h2>
                    <div className="space-y-2">
                      {RELATIONSHIP_GOALS.map((g) => (
                        <OptionCard key={g.value} selected={goal === g.value} onClick={() => setGoal(g.value)} emoji={g.emoji} label={g.label} />
                      ))}
                    </div>
                  </div>
                )}

                {step === "gender" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold text-foreground">About you 🌟</h2>
                    <div className="space-y-2">
                      <Label>Your gender</Label>
                      {GENDERS.map((g) => (
                        <OptionCard key={g.value} selected={gender === g.value} onClick={() => setGender(g.value)} emoji={g.emoji} label={g.label} />
                      ))}
                    </div>
                    <div className="space-y-2 pt-4">
                      <Label>Interested in (select all)</Label>
                      <div className="flex flex-wrap gap-2">
                        {GENDERS.filter((g) => g.value !== "prefer_not_to_say").map((g) => (
                          <ChipCard key={g.value} selected={interestedIn.includes(g.value)} onClick={() => toggleArray(interestedIn, g.value, setInterestedIn)} emoji={g.emoji} label={g.label} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === "vibes" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold text-foreground">Your vibe ✨</h2>
                    <p className="text-muted-foreground text-sm">Pick one or more personality vibes</p>
                    <div className="flex flex-wrap gap-2">
                      {VIBES.map((v) => (
                        <ChipCard key={v.value} selected={vibes.includes(v.value)} onClick={() => toggleArray(vibes, v.value, setVibes)} emoji={v.emoji} label={v.label} />
                      ))}
                    </div>
                  </div>
                )}

                {step === "interests" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-display font-bold text-foreground">What do you love? 💖</h2>
                    <p className="text-muted-foreground text-sm">Pick at least 2 interests</p>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((i) => (
                        <ChipCard key={i.value} selected={interests.includes(i.value)} onClick={() => toggleArray(interests, i.value, setInterests)} emoji={i.emoji} label={i.label} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={prevStep} disabled={stepIndex === 0}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              {step === "interests" ? (
                <Button onClick={handleFinish} disabled={!canNext() || saving} className="gradient-love text-primary-foreground shadow-love">
                  {saving ? <Heart className="h-4 w-4 animate-heart-beat" /> : <>Finish <Sparkles className="h-4 w-4 ml-1" /></>}
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={!canNext()} className="gradient-love text-primary-foreground shadow-love">
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Onboarding;
