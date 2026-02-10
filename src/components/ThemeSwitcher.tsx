import { Sun, Moon, Heart } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "pink" as const, icon: Heart, label: "Pink" },
  ];

  return (
    <div className="flex gap-1 p-1 rounded-full bg-muted">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={theme === value ? "default" : "ghost"}
          size="icon"
          className={`h-8 w-8 rounded-full ${theme === value ? "shadow-love" : ""}`}
          onClick={() => setTheme(value)}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
