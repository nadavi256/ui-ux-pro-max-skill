import {
  Baby,
  Bike,
  BookOpen,
  CookingPot,
  Dumbbell,
  Flower2,
  Gamepad2,
  Hammer,
  Lamp,
  type LucideProps,
  Monitor,
  Music,
  Package,
  Shirt,
  Smartphone,
  Sofa,
} from "lucide-react";

const ICONS = {
  Sofa,
  Smartphone,
  Monitor,
  Shirt,
  Baby,
  Dumbbell,
  Bike,
  BookOpen,
  Gamepad2,
  CookingPot,
  Hammer,
  Lamp,
  Flower2,
  Music,
  Package,
};

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICONS[name as keyof typeof ICONS] ?? Package;
  return <Icon aria-hidden {...props} />;
}
