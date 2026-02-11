import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Flag, Send, Ghost, Smile, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AvatarDisplay, AvatarConfig } from "@/components/AvatarDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Post {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  is_anonymous: boolean;
  media_url: string | null;
  created_at: string;
  profile?: { display_name: string | null; avatar_config: AvatarConfig | null };
  reactions_count: number;
  comments_count: number;
  user_reacted: boolean;
  user_saved: boolean;
}

const REACTIONS = ["❤️", "😂", "🔥", "😍", "👏", "😢"];

const Feed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [reportingPost, setReportingPost] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");

  const fetchPosts = async () => {
    const { data: postsData, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
      return;
    }

    // Fetch profiles for non-anonymous posts
    const userIds = [...new Set((postsData || []).filter((p) => !p.is_anonymous).map((p) => p.user_id))];
    let profilesMap: Record<string, any> = {};
    if (userIds.length > 0) {
      // We can only fetch our own profile due to RLS, so we'll handle display differently
      if (user) {
        const { data: myProfile } = await supabase.from("profiles").select("display_name, avatar_config").eq("user_id", user.id).maybeSingle();
        if (myProfile) profilesMap[user.id] = myProfile;
      }
    }

    // Fetch reactions counts
    const postIds = (postsData || []).map((p) => p.id);
    const { data: reactions } = await supabase.from("post_reactions").select("post_id, user_id").in("post_id", postIds.length > 0 ? postIds : ["none"]);
    const { data: commentsCounts } = await supabase.from("comments").select("post_id").in("post_id", postIds.length > 0 ? postIds : ["none"]);
    const { data: savedPosts } = user
      ? await supabase.from("saved_posts").select("post_id").eq("user_id", user.id).in("post_id", postIds.length > 0 ? postIds : ["none"])
      : { data: [] };

    const enriched: Post[] = (postsData || []).map((p) => ({
      ...p,
      profile: profilesMap[p.user_id] || null,
      reactions_count: (reactions || []).filter((r) => r.post_id === p.id).length,
      comments_count: (commentsCounts || []).filter((c) => c.post_id === p.id).length,
      user_reacted: (reactions || []).some((r) => r.post_id === p.id && r.user_id === user?.id),
      user_saved: (savedPosts || []).some((s) => s.post_id === p.id),
    }));

    setPosts(enriched);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!newPostContent.trim() || !user) return;
    setPosting(true);
    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      content: newPostContent.trim(),
      post_type: isAnonymous ? "anonymous" : "text",
      is_anonymous: isAnonymous,
    });
    if (error) {
      toast({ title: "Error creating post", description: error.message, variant: "destructive" });
    } else {
      setNewPostContent("");
      setIsAnonymous(false);
      fetchPosts();
    }
    setPosting(false);
  };

  const toggleReaction = async (postId: string, reacted: boolean) => {
    if (!user) return;
    if (reacted) {
      await supabase.from("post_reactions").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("post_reactions").insert({ post_id: postId, user_id: user.id, reaction: "like" });
    }
    fetchPosts();
  };

  const toggleSave = async (postId: string, saved: boolean) => {
    if (!user) return;
    if (saved) {
      await supabase.from("saved_posts").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("saved_posts").insert({ post_id: postId, user_id: user.id });
    }
    fetchPosts();
  };

  const loadComments = async (postId: string) => {
    setCommentingOn(postId);
    const { data } = await supabase.from("comments").select("*").eq("post_id", postId).order("created_at", { ascending: true });
    setComments(data || []);
  };

  const submitComment = async () => {
    if (!commentText.trim() || !commentingOn || !user) return;
    await supabase.from("comments").insert({ post_id: commentingOn, user_id: user.id, content: commentText.trim() });
    setCommentText("");
    loadComments(commentingOn);
    fetchPosts();
  };

  const submitReport = async () => {
    if (!reportReason.trim() || !reportingPost || !user) return;
    await supabase.from("reports").insert({ reporter_id: user.id, post_id: reportingPost, reason: reportReason.trim() });
    toast({ title: "Report submitted 🛡️", description: "We'll review this post." });
    setReportingPost(null);
    setReportReason("");
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      {/* Create Post */}
      <Card className="glass border-0 shadow-love">
        <CardContent className="pt-4 pb-4 space-y-3">
          <Textarea
            placeholder="What's on your mind? 💭"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-[80px] resize-none border-0 bg-transparent focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={isAnonymous ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={isAnonymous ? "gradient-love text-primary-foreground" : ""}
              >
                <Ghost className="h-4 w-4 mr-1" /> Anonymous
              </Button>
            </div>
            <Button
              onClick={createPost}
              disabled={!newPostContent.trim() || posting}
              size="sm"
              className="gradient-love text-primary-foreground shadow-love"
            >
              {posting ? <Heart className="h-4 w-4 animate-heart-beat" /> : <><Send className="h-4 w-4 mr-1" /> Post</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Heart className="h-8 w-8 animate-heart-beat text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-primary/30 mb-3" />
          <p className="text-muted-foreground">No posts yet. Be the first! 💖</p>
        </div>
      ) : (
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="glass border-0">
                <CardContent className="pt-4 pb-3">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <AvatarDisplay
                      config={post.is_anonymous ? null : post.profile?.avatar_config}
                      size="sm"
                      blurred={post.is_anonymous}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">
                        {post.is_anonymous ? "Anonymous 🤫" : post.profile?.display_name || "LoveVerse User"}
                      </p>
                      <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)} ago</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setReportingPost(post.id)}>
                      <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>

                  {/* Content */}
                  <p className="text-foreground text-sm whitespace-pre-wrap mb-3">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReaction(post.id, post.user_reacted)}
                      className={post.user_reacted ? "text-love-pink" : "text-muted-foreground"}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${post.user_reacted ? "fill-current" : ""}`} />
                      {post.reactions_count > 0 && post.reactions_count}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => loadComments(post.id)} className="text-muted-foreground">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments_count > 0 && post.comments_count}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSave(post.id, post.user_saved)}
                      className={post.user_saved ? "text-love-gold" : "text-muted-foreground"}
                    >
                      <Bookmark className={`h-4 w-4 ${post.user_saved ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Comments Dialog */}
      <Dialog open={!!commentingOn} onOpenChange={() => setCommentingOn(null)}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="font-display">Comments 💬</DialogTitle>
          </DialogHeader>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="p-2 rounded-lg bg-muted/50">
                  <p className="text-sm text-foreground">{c.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{timeAgo(c.created_at)} ago</p>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
            />
            <Button onClick={submitComment} size="icon" className="gradient-love text-primary-foreground">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={!!reportingPost} onOpenChange={() => setReportingPost(null)}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="font-display">Report Post 🛡️</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Why are you reporting this post?"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
          <Button onClick={submitReport} className="gradient-love text-primary-foreground">Submit Report</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feed;
