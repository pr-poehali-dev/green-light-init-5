import { Sparkles, Zap, Shield, Star } from "lucide-react"
import type { ThemeMode } from "@/lib/themes"

export interface ThemeContent {
  badge: string
  title: string
  highlight: string
  subtitle: string
  cta: string
  features: { icon: typeof Sparkles; text: string }[]
}

export const themeContent: Record<ThemeMode, ThemeContent> = {
  "minimal-light": {
    badge: "Голосование открывается скоро",
    title: "Мисс Интернет",
    highlight: "Краснокаменск 2026",
    subtitle:
      "Подавай заявку и забери свою корону! Совсем скоро начнётся интернет-голосование за самых ярких участниц конкурса красоты и элегантности.",
    cta: "Уведомить меня о старте",
    features: [
      { icon: Sparkles, text: "Онлайн-голосование" },
      { icon: Star, text: "32 участницы" },
      { icon: Shield, text: "Честное голосование" },
    ],
  },
  dark: {
    badge: "Голосование скоро",
    title: "Мисс Интернет",
    highlight: "Краснокаменск 2026",
    subtitle: "Подавай заявку и забери свою корону! Совсем скоро начнётся интернет-голосование за самых ярких участниц конкурса красоты и элегантности.",
    cta: "Уведомить меня о старте",
    features: [
      { icon: Sparkles, text: "Онлайн-голосование" },
      { icon: Star, text: "32 участницы" },
      { icon: Shield, text: "Честное голосование" },
    ],
  },
  retro: {
    badge: "Конкурс красоты 2026",
    title: "Мисс Интернет",
    highlight: "Краснокаменск 2026",
    subtitle: "Подавай заявку и забери свою корону! Совсем скоро начнётся интернет-голосование за самых ярких участниц конкурса красоты и элегантности.",
    cta: "Уведомить меня о старте",
    features: [
      { icon: Sparkles, text: "Онлайн-голосование" },
      { icon: Star, text: "32 участницы" },
      { icon: Shield, text: "Честное голосование" },
    ],
  },
  neon: {
    badge: "[ ГОЛОСОВАНИЕ СКОРО ]",
    title: "МИСС ИНТЕРНЕТ",
    highlight: "КРАСНОКАМЕНСК 2026",
    subtitle: "ПОДАВАЙ ЗАЯВКУ И ЗАБЕРИ СВОЮ КОРОНУ! СОВСЕМ СКОРО НАЧНЁТСЯ ИНТЕРНЕТ-ГОЛОСОВАНИЕ.",
    cta: "УВЕДОМИТЬ О СТАРТЕ",
    features: [
      { icon: Sparkles, text: "ОНЛАЙН-ГОЛОСОВАНИЕ" },
      { icon: Star, text: "32 УЧАСТНИЦЫ" },
      { icon: Shield, text: "ЧЕСТНЫЙ ПОДСЧЁТ" },
    ],
  },
  monochrome: {
    badge: "Конкурс 2026",
    title: "Мисс Интернет",
    highlight: "Краснокаменск 2026",
    subtitle: "Подавай заявку и забери свою корону! Совсем скоро начнётся интернет-голосование за самых ярких участниц конкурса красоты и элегантности.",
    cta: "Уведомить меня о старте",
    features: [
      { icon: Sparkles, text: "Онлайн-голосование" },
      { icon: Star, text: "32 участницы" },
      { icon: Shield, text: "Честное голосование" },
    ],
  },
  glass: {
    badge: "Голосование открывается скоро",
    title: "Мисс Интернет",
    highlight: "Краснокаменск 2026",
    subtitle: "Подавай заявку и забери свою корону! Совсем скоро начнётся интернет-голосование за самых ярких участниц конкурса красоты и элегантности.",
    cta: "Уведомить меня о старте",
    features: [
      { icon: Sparkles, text: "Онлайн-голосование" },
      { icon: Star, text: "32 участницы" },
      { icon: Shield, text: "Честное голосование" },
    ],
  },
  terminal: {
    badge: "> конкурс: мисс_краснокаменск_2026",
    title: "$ vote.start",
    highlight: "--краснокаменск-2026",
    subtitle: "// подавай заявку и забери свою корону. интернет-голосование скоро...",
    cta: "$ subscribe --notify",
    features: [
      { icon: Sparkles, text: "--онлайн" },
      { icon: Star, text: "--32 участницы" },
      { icon: Shield, text: "--честно" },
    ],
  },
  luxury: {
    badge: "Конкурс красоты · 2026",
    title: "Мисс Интернет",
    highlight: "Краснокаменск 2026",
    subtitle:
      "Подавай заявку и забери свою корону! Совсем скоро начнётся интернет-голосование за самых ярких участниц конкурса красоты и элегантности.",
    cta: "Уведомить меня о старте",
    features: [
      { icon: Sparkles, text: "Онлайн-голосование" },
      { icon: Star, text: "32 участницы" },
      { icon: Shield, text: "Честное голосование" },
    ],
  },
}
