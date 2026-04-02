export type ThemeMode = "luxury"

export interface ThemeConfig {
  name: string
  description: string
  background: string
  foreground: string
  card: string
  cardForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  border: string
  shadow: string
  fontClass?: string
}

export const themes: Record<ThemeMode, ThemeConfig> = {
  luxury: {
    name: "Люкс",
    description: "Элегантность",
    background: "bg-slate-950",
    foreground: "text-slate-100",
    card: "bg-slate-900",
    cardForeground: "text-slate-100",
    muted: "bg-slate-800",
    mutedForeground: "text-slate-400",
    accent: "bg-gradient-to-r from-slate-300 via-white to-slate-300",
    accentForeground: "text-slate-950",
    border: "border-slate-500/30",
    shadow: "shadow-xl shadow-slate-500/10",
  },
}
