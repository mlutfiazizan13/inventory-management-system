import * as LucideIcons from 'lucide-react';

export function getIconByName(name?: string) {
  if (!name) return null;
  return LucideIcons[name as keyof typeof LucideIcons] || null;
}
