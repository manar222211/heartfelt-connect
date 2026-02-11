import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Chat = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <MessageCircle className="h-20 w-20 mx-auto text-primary" />
        </motion.div>
        <h1 className="text-3xl font-display font-bold text-gradient-love">Chat</h1>
        <p className="text-muted-foreground">Private & anonymous messaging with stickers, voice notes & more</p>
        <Card className="glass shadow-love border-0">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              <Sparkles className="h-4 w-4 text-love-gold" />
              <span>Real-time chat coming soon 💬</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Chat;
