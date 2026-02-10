import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const hearts = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 4,
  size: 12 + Math.random() * 16,
  opacity: 0.08 + Math.random() * 0.12,
}));

const FloatingHearts = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {hearts.map((h) => (
      <motion.div
        key={h.id}
        className="absolute text-love-neon"
        style={{ left: `${h.x}%`, bottom: "-20px", opacity: h.opacity }}
        animate={{ y: [0, -window.innerHeight - 50], rotate: [0, 360] }}
        transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "linear" }}
      >
        <Heart size={h.size} fill="currentColor" />
      </motion.div>
    ))}
  </div>
);

export default FloatingHearts;
