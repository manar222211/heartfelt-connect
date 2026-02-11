import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Flame, MessageCircle, Gamepad2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const NAV_ITEMS = [
  { path: "/feed", label: "Feed", icon: Heart },
  { path: "/blind-date", label: "Blind Date", icon: Flame },
  { path: "/chat", label: "Chat", icon: MessageCircle },
  { path: "/games", label: "Games", icon: Gamepad2 },
  { path: "/profile", label: "Profile", icon: User },
];

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-gradient-love">LoveVerse</h1>
        <ThemeSwitcher />
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50">
        <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 relative z-10", active && "fill-primary/20")} />
                <span className="text-[10px] font-medium relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
