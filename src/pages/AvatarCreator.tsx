import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Shuffle, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FloatingHearts from "@/components/FloatingHearts";
import { AvatarDisplay, AvatarConfig, DEFAULT_AVATAR } from "@/components/AvatarDisplay";

const SKIN_TONES = ["🟡", "🟠", "🟤", "⚪", "🔵"];
const HAIR_STYLES = [
  { value: "straight", label: "Straight", emoji: "💇" },
  { value: "curly", label: "Curly", emoji: "🦱" },
  { value: "wavy", label: "Wavy", emoji: "💆" },
  { value: "short", label: "Short", emoji: "✂️" },
  { value: "bald", label: "Bald", emoji: "🧑‍🦲" },
];
const HAIR_COLORS = [
  { value: "brown", label: "Brown", color: "bg-amber-800" },
  { value: "black", label: "Black", color: "bg-gray-900" },
  { value: "blonde", label: "Blonde", color: "bg-yellow-400" },
  { value: "red", label: "Red", color: "bg-red-600" },
  { value: "pink", label: "Pink", color: "bg-pink-400" },
  { value: "blue", label: "Blue", color: "bg-blue-500" },
];
const EYE_STYLES = [
  { value: "normal", emoji: "👀" },
  { value: "wink", emoji: "😉" },
  { value: "stars", emoji: "🤩" },
  { value: "hearts", emoji: "😍" },
];
const OUTFITS = [
  { value: "casual", label: "Casual", emoji: "👕" },
  { value: "formal", label: "Formal", emoji: "👔" },
  { value: "sporty", label: "Sporty", emoji: "🏃" },
  { value: "creative", label: "Creative", emoji: "🎨" },
  { value: "cozy", label: "Cozy", emoji: "🧥" },
];
const ACCESSORIES = [
  { value: "none", label: "None", emoji: "❌" },
  { value: "glasses", label: "Glasses", emoji: "👓" },
  { value: "sunglasses", label: "Shades", emoji: "🕶️" },
  { value: "hat", label: "Hat", emoji: "🎩" },
  { value: "crown", label: "Crown", emoji: "👑" },
  { value: "headphones", label: "Headphones", emoji: "🎧" },
];
const MOODS = ["😊", "😎", "🥰", "😜", "🤗", "😇", "🥺", "✨", "💖", "🌟"];

const STEPS = ["skin", "hair", "eyes", "outfit", "accessory", "mood"] as const;
type Step = typeof STEPS[number];

const AvatarCreator = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("skin");
  const [saving, setSaving] = useState(false);

  const [avatar, setAvatar] = useState<AvatarConfig>({ ...DEFAULT_AVATAR });

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

  const update = (key: keyof AvatarConfig, value: string) => {
    setAvatar((prev) => ({ ...prev, [key]: value }));
  };

  const randomize = () => {
    setAvatar({
      skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
      hairStyle: HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].value,
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].value,
      eyeStyle: EYE_STYLES[Math.floor(Math.random() * EYE_STYLES.length)].value,
      outfit: OUTFITS[Math.floor(Math.random() * OUTFITS.length)].value,
      accessory: ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].value,
      mood: MOODS[Math.floor(Math.random() * MOODS.length)],
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_config: avatar as any })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error saving avatar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Avatar saved! 🎉" });
      navigate("/feed");
    }
    setSaving(false);
  };

  const Chip = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-3 rounded-xl border-2 transition-all text-center ${
        selected ? "border-primary bg-primary/10 shadow-love" : "border-border hover:border-primary/40"
      }`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <FloatingHearts />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg z-10">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avatar Step {stepIndex + 1}/{STEPS.length}</span>
            <Button variant="ghost" size="sm" onClick={randomize}>
              <Shuffle className="h-4 w-4 mr-1" /> Random
            </Button>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full gradient-love rounded-full" animate={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <AvatarDisplay config={avatar} size="xl" />
        </div>

        <Card className="glass shadow-love border-0">
          <CardContent className="pt-6 pb-6">
            {step === "skin" && (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-bold text-foreground">Skin Tone 🎨</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {SKIN_TONES.map((s) => (
                    <Chip key={s} selected={avatar.skinTone === s} onClick={() => update("skinTone", s)}>
                      <span className="text-3xl">{s}</span>
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {step === "hair" && (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-bold text-foreground">Hair Style ✂️</h2>
                <div className="flex flex-wrap gap-2">
                  {HAIR_STYLES.map((h) => (
                    <Chip key={h.value} selected={avatar.hairStyle === h.value} onClick={() => update("hairStyle", h.value)}>
                      <span className="text-xl">{h.emoji}</span>
                      <p className="text-xs text-muted-foreground">{h.label}</p>
                    </Chip>
                  ))}
                </div>
                <Label className="mt-4">Hair Color</Label>
                <div className="flex flex-wrap gap-2">
                  {HAIR_COLORS.map((c) => (
                    <motion.button
                      key={c.value}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => update("hairColor", c.value)}
                      className={`h-8 w-8 rounded-full ${c.color} border-2 ${
                        avatar.hairColor === c.value ? "border-primary ring-2 ring-primary/30" : "border-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === "eyes" && (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-bold text-foreground">Eye Style 👀</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {EYE_STYLES.map((e) => (
                    <Chip key={e.value} selected={avatar.eyeStyle === e.value} onClick={() => update("eyeStyle", e.value)}>
                      <span className="text-3xl">{e.emoji}</span>
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {step === "outfit" && (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-bold text-foreground">Outfit 👗</h2>
                <div className="flex flex-wrap gap-2">
                  {OUTFITS.map((o) => (
                    <Chip key={o.value} selected={avatar.outfit === o.value} onClick={() => update("outfit", o.value)}>
                      <span className="text-xl">{o.emoji}</span>
                      <p className="text-xs text-muted-foreground">{o.label}</p>
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {step === "accessory" && (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-bold text-foreground">Accessory ✨</h2>
                <div className="flex flex-wrap gap-2">
                  {ACCESSORIES.map((a) => (
                    <Chip key={a.value} selected={avatar.accessory === a.value} onClick={() => update("accessory", a.value)}>
                      <span className="text-xl">{a.emoji}</span>
                      <p className="text-xs text-muted-foreground">{a.label}</p>
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {step === "mood" && (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-bold text-foreground">Mood Sticker 💫</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {MOODS.map((m) => (
                    <Chip key={m} selected={avatar.mood === m} onClick={() => update("mood", m)}>
                      <span className="text-3xl">{m}</span>
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={() => setStep(STEPS[stepIndex - 1])} disabled={stepIndex === 0}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              {step === "mood" ? (
                <Button onClick={handleSave} disabled={saving} className="gradient-love text-primary-foreground shadow-love">
                  {saving ? <Heart className="h-4 w-4 animate-heart-beat" /> : <>Save Avatar <Sparkles className="h-4 w-4 ml-1" /></>}
                </Button>
              ) : (
                <Button onClick={() => setStep(STEPS[stepIndex + 1])} className="gradient-love text-primary-foreground shadow-love">
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <button onClick={() => navigate("/feed")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Skip for now →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AvatarCreator;
