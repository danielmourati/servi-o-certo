import {
  Hammer, Zap, Wrench, Layers, Paintbrush, Key, Compass, Truck, FileCheck, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Hammer, Zap, Wrench, Layers, Paintbrush, Key, Compass, Truck, FileCheck,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Wrench;
  return <Icon className={className} />;
}

export const categoryIconNames = Object.keys(map);
