import { useTheme } from "./theme-context"
import { themes } from "@/lib/themes"
import { cn } from "@/lib/utils"
import Icon from "@/components/ui/icon"

const steps = [
  {
    icon: "UserPlus",
    title: "Приём заявок",
    desc: "Заполни анкету и загрузи 3 фотографии на официальном сайте конкурса.",
    date: "со 2 апреля по 20 апреля 2026",
  },
  {
    icon: "Vote",
    title: "I этап голосования",
    desc: "Открытое интернет-голосование за участниц конкурса.",
    date: "с 20 апреля по 20 мая",
  },
  {
    icon: "Trophy",
    title: "II этап голосования",
    desc: "Финальный этап, по итогам которого определятся 10 финалисток проекта.",
    date: "с 20 мая по 20 июня",
  },
  {
    icon: "Star",
    title: "Церемония награждения",
    desc: "Определится победительница проекта и обладательницы специальных номинаций.",
    date: "20 июня",
  },
]

export function InfoSection() {
  const { theme } = useTheme()
  const t = themes[theme]

  const accentText = cn(
    theme === "luxury" && "text-slate-300",
    theme === "neon" && "text-cyan-400",
    theme === "glass" && "text-indigo-500",
    theme === "retro" && "text-amber-700",
    theme === "terminal" && "text-green-400",
    (theme === "minimal-light" || theme === "dark" || theme === "monochrome") && t.cardForeground,
  )

  return (
    <section className={cn("w-full py-14 px-4 sm:px-6 border-t", t.border, t.fontClass)}>
      <div className="max-w-4xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="text-center flex flex-col gap-3">
          <p className={cn("text-xs uppercase tracking-widest", t.mutedForeground)}>О конкурсе</p>
          <h2 className={cn("text-2xl sm:text-3xl font-bold", t.cardForeground)}>
            Мисс Интернет <span className={accentText}>Краснокаменск 2026</span>
          </h2>
        </div>

        {/* Invitation block */}
        <div className={cn(
          "rounded-2xl border p-6 sm:p-8 flex flex-col gap-4",
          t.card, t.border, t.shadow,
          theme === "neon" && "shadow-[0_0_30px_rgba(34,211,238,0.1)]",
          theme === "luxury" && "shadow-[0_0_30px_rgba(200,210,220,0.08)]",
        )}>
          <div className="flex items-start gap-3">
            <Icon name="Sparkles" className={cn("w-5 h-5 mt-0.5 shrink-0", accentText)} />
            <p className={cn("text-sm sm:text-base leading-relaxed", t.cardForeground)}>
              Мы приглашаем к участию девушек <strong>Краснокаменска и Краснокаменского округа</strong> не моложе <strong>18 лет</strong>.
              Для участия в проекте нужно заполнить анкету и загрузить свои фотографии.
            </p>
          </div>

        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-2">
          <h3 className={cn("text-sm font-semibold uppercase tracking-widest mb-2", t.mutedForeground)}>
            Этапы конкурса
          </h3>
          <div className="relative flex flex-col gap-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 relative">
                {/* Line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={cn(
                    "w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 z-10",
                    t.card, t.border,
                    theme === "luxury" && "border-slate-400/50",
                    theme === "neon" && "border-cyan-500/50",
                  )}>
                    <Icon name={step.icon} className={cn("w-4 h-4", accentText)} />
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn("w-px flex-1 my-1", theme === "luxury" ? "bg-slate-400/20" : theme === "neon" ? "bg-cyan-500/20" : t.border, "border-l border-dashed")} />
                  )}
                </div>

                {/* Content */}
                <div className={cn("pb-6 flex flex-col gap-1", i === steps.length - 1 && "pb-0")}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={cn("font-semibold text-sm", t.cardForeground)}>{step.title}</p>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", t.muted, t.mutedForeground)}>
                      {step.date}
                    </span>
                  </div>
                  <p className={cn("text-sm leading-relaxed", t.mutedForeground)}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={cn(
          "rounded-2xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4",
          t.card, t.border,
          theme === "luxury" && "border-slate-400/30",
          theme === "neon" && "border-cyan-500/20",
        )}>
          <div>
            <p className={cn("font-semibold", t.cardForeground)}>Готова участвовать?</p>
            <p className={cn("text-sm", t.mutedForeground)}>Заполни анкету ниже — это займёт 5 минут.</p>
          </div>
          <a
            href="#apply"
            onClick={(e) => { e.preventDefault(); document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" }) }}
            className={cn(
              "shrink-0 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105",
              t.accent, t.accentForeground,
              theme === "neon" && "shadow-[0_0_20px_rgba(34,211,238,0.4)]",
              theme === "luxury" && "shadow-[0_0_20px_rgba(200,210,220,0.3)]",
            )}
          >
            Подать заявку
          </a>
        </div>

      </div>
    </section>
  )
}