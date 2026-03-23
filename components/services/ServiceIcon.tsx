import { 
  Wrench, 
  Scissors, 
  Car, 
  Sparkles, 
  SprayCan, 
  Palette,
  CircleDashed // Fallback (domyślna ikona)
} from "lucide-react";

// Słownik dostępnych ikon (tylko te zostaną dodane do paczki produkcyjnej!)
export const iconMap: Record<string, React.ElementType> = {
  Wrench: Wrench,
  Scissors: Scissors,
  Car: Car,
  Sparkles: Sparkles,
  SprayCan: SprayCan,
  Palette: Palette,
};

export function ServiceIcon({ name, className }: { name?: string | null, className?: string }) {
  // Jeśli usługa ma zapisaną nazwę i istnieje ona w naszym słowniku, używamy jej. 
  // W przeciwnym razie pokazujemy domyślną ikonę (CircleDashed).
  const IconComponent = (name && iconMap[name]) ? iconMap[name] : CircleDashed;

  return <IconComponent className={className} />;
}