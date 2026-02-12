import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";

const EMOJI_PAIRS = ["💕", "🌹", "💖", "😍", "🦋", "✨", "💘", "🥰"];

interface CardItem {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  onBack: () => void;
}

const EmojiMemory = ({ onBack }: Props) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);

  const initGame = () => {
    const pairs = shuffle([...EMOJI_PAIRS, ...EMOJI_PAIRS]);
    setCards(pairs.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })));
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setWon(false);
    setTimer(0);
    setStarted(false);
  };

  useEffect(() => { initGame(); }, []);

  useEffect(() => {
    if (!started || won) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [started, won]);

  const handleFlip = (id: number) => {
    if (flippedIds.length === 2) return;
    const card = cards[id];
    if (card.flipped || card.matched) return;

    if (!started) setStarted(true);

    const newCards = [...cards];
    newCards[id] = { ...card, flipped: true };
    setCards(newCards);

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;
      if (newCards[a].emoji === newCards[b].emoji) {
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
          const newMatches = matches + 1;
          setMatches(newMatches);
          if (newMatches === EMOJI_PAIRS.length) setWon(true);
          setFlippedIds([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  const getStars = () => {
    if (moves <= 10) return 3;
    if (moves <= 16) return 2;
    return 1;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="text-center">
        <span className="text-4xl">🧠</span>
        <h1 className="text-2xl font-display font-bold text-gradient-love">Emoji Memory</h1>
        <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>Moves: {moves}</span>
          <span>⏱ {timer}s</span>
          <span>Matched: {matches}/{EMOJI_PAIRS.length}</span>
        </div>
      </div>

      {won ? (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center mt-8 space-y-4">
          <Trophy className="h-16 w-16 mx-auto text-love-gold" />
          <h2 className="text-2xl font-display font-bold text-gradient-love">You Won! 🎉</h2>
          <p className="text-muted-foreground">{moves} moves in {timer}s</p>
          <div className="flex justify-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`text-2xl ${i < getStars() ? "" : "opacity-30"}`}>⭐</span>
            ))}
          </div>
          <Button onClick={initGame} className="gradient-love text-primary-foreground shadow-love">
            <RotateCcw className="h-4 w-4 mr-1" /> Play Again
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all border-2 ${
                card.matched
                  ? "bg-primary/10 border-primary/30"
                  : card.flipped
                  ? "bg-card border-primary/50 shadow-love"
                  : "bg-muted border-border hover:border-primary/30 cursor-pointer"
              }`}
            >
              <motion.span
                initial={false}
                animate={{ rotateY: card.flipped || card.matched ? 0 : 180, opacity: card.flipped || card.matched ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {card.flipped || card.matched ? card.emoji : ""}
              </motion.span>
              {!card.flipped && !card.matched && (
                <span className="text-xl opacity-30">💜</span>
              )}
            </motion.button>
          ))}
        </div>
      )}

      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={initGame}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reset
        </Button>
      </div>
    </div>
  );
};

export default EmojiMemory;
