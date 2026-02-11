import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Settings, LogOut, Edit, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AvatarDisplay, AvatarConfig } from "@/components/AvatarDisplay";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const VIBE_LABELS: Record<string, string> = {
  romantic: "🌹 Romantic",
  funny: "😂 Funny",
  chill: "😎 Chill",
  adventurous: "🏔️ Adventurous",
  shy: "🙈 Shy",
};

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data);
        setDisplayName(data?.display_name || "");
        setBio(data?.bio || "");
        setLoading(false);
      });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio })
      .eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProfile((p: any) => ({ ...p, display_name: displayName, bio }));
      setEditing(false);
      toast({ title: "Profile updated! ✨" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Heart className="h-8 w-8 animate-heart-beat text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      {/* Avatar & Name */}
      <Card className="glass border-0 shadow-love">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate("/avatar")} className="cursor-pointer">
              <AvatarDisplay config={profile?.avatar_config as AvatarConfig} size="xl" />
            </motion.div>
            {editing ? (
              <div className="w-full space-y-3">
                <Input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                <Textarea placeholder="Bio..." value={bio} onChange={(e) => setBio(e.target.value)} />
                <div className="flex gap-2 justify-center">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button size="sm" className="gradient-love text-primary-foreground" onClick={saveProfile}>Save</Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-display font-bold text-foreground">
                  {profile?.display_name || "LoveVerse User"}
                </h2>
                {profile?.bio && <p className="text-sm text-muted-foreground">{profile.bio}</p>}
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit Profile
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vibes & Interests */}
      {profile && (
        <Card className="glass border-0">
          <CardContent className="pt-4 pb-4 space-y-3">
            <h3 className="font-display font-bold text-sm text-foreground">Personality Vibes</h3>
            <div className="flex flex-wrap gap-2">
              {(profile.personality_vibes || []).map((v: string) => (
                <span key={v} className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {VIBE_LABELS[v] || v}
                </span>
              ))}
            </div>

            <h3 className="font-display font-bold text-sm text-foreground pt-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {(profile.interests || []).map((i: string) => (
                <span key={i} className="px-3 py-1 rounded-full bg-accent text-xs font-medium text-accent-foreground">
                  {i}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card className="glass border-0">
        <CardContent className="pt-4 pb-4 space-y-2">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground flex items-center gap-2">
              <Settings className="h-4 w-4" /> Theme
            </span>
            <ThemeSwitcher />
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm text-foreground"
            onClick={() => navigate("/avatar")}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Avatar
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
