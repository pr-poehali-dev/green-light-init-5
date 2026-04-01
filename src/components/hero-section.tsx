import { Bell, Star } from "lucide-react"
import { ThemedCountdown } from "./themed-countdown"
import { useTheme } from "./theme-context"
import { themes } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { themeContent } from "./theme-content"
import { ApplyForm } from "./apply-form"

interface HeroSectionProps {
  targetDate: Date
  showSettings: boolean
  onToggleSettings: () => void
  days: string
  hours: string
  minutes: string
  seconds: string
  onDaysChange: (v: string) => void
  onHoursChange: (v: string) => void
  onMinutesChange: (v: string) => void
  onSecondsChange: (v: string) => void
  onSetTimer: () => void
  form: { name: string; age: string; phone: string; email: string; about: string }
  formStatus: "idle" | "loading" | "success" | "error"
  ageError: string
  photos: { file: File; preview: string }[]
  consentPersonal: boolean
  consentPhotos: boolean
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onPhotoAdd: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPhotoRemove: (idx: number) => void
  onConsentPersonalChange: (v: boolean) => void
  onConsentPhotosChange: (v: boolean) => void
  onSubmit: () => void
  onFormReset: () => void
}

export function HeroSection({
  targetDate, showSettings, onToggleSettings,
  days, hours, minutes, seconds,
  onDaysChange, onHoursChange, onMinutesChange, onSecondsChange, onSetTimer,
  form, formStatus, ageError, photos,
  consentPersonal, consentPhotos,
  onFormChange, onPhotoAdd, onPhotoRemove,
  onConsentPersonalChange, onConsentPhotosChange,
  onSubmit, onFormReset,
}: HeroSectionProps) {
  const { theme } = useTheme()
  const themeConfig = themes[theme]
  const currentContent = themeContent[theme]

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative z-10">
      <div className="max-w-4xl w-full flex flex-col items-center gap-6 sm:gap-10">

        {/* Badge */}
        <div
          className={cn(
            "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition-all",
            themeConfig.muted,
            themeConfig.border,
            themeConfig.mutedForeground,
            themeConfig.fontClass,
            theme === "neon" && "shadow-[0_0_15px_rgba(34,211,238,0.3)] border-cyan-500/50",
            theme === "luxury" && "border-slate-400/30",
          )}
        >
          <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
          {currentContent.badge}
        </div>

        {/* Crown image */}
        {theme === "luxury" ? (
          <div className="w-full -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-24 xl:-mx-32">
            <img
              src="https://cdn.poehali.dev/projects/a9c62102-7235-42c6-a141-66004f7200f2/bucket/a1129d70-1271-407a-aa50-fb06415f78b0.png"
              alt="Конкурс красоты"
              className="w-full object-cover select-none pointer-events-none"
              style={{ maxHeight: "480px", objectPosition: "center top" }}
            />
          </div>
        ) : (
          <div className="flex justify-center -mb-4">
            <img
              src="https://cdn.poehali.dev/projects/a9c62102-7235-42c6-a141-66004f7200f2/bucket/adaff1de-d6c9-45f1-9edd-f445b938a23d.jpeg"
              alt="Корона"
              className="select-none pointer-events-none"
              style={{
                width: "180px",
                mixBlendMode: (theme === "dark" || theme === "neon" || theme === "terminal") ? "screen" : "multiply",
                filter: theme === "dark" || theme === "neon" || theme === "terminal"
                  ? "invert(1) brightness(1.5)"
                  : "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
              }}
            />
          </div>
        )}

        {/* Main Headline */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1
            className={cn(
              "text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-balance leading-[1.1]",
              themeConfig.foreground,
              themeConfig.fontClass,
            )}
          >
            {currentContent.title}{" "}
            <span
              className={cn(
                "relative inline-block",
                theme === "neon" && "text-cyan-400 [text-shadow:0_0_40px_rgba(34,211,238,0.6)]",
                theme === "luxury" &&
                  "bg-gradient-to-r from-slate-300 via-white to-slate-300 bg-clip-text text-transparent",
                theme === "glass" && "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
                theme === "retro" && "text-amber-700",
                theme === "terminal" && "text-green-300",
                (theme === "minimal-light" || theme === "monochrome" || theme === "dark") && themeConfig.foreground,
              )}
            >
              {currentContent.highlight}
            </span>
          </h1>
          <p
            className={cn(
              "text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-pretty leading-relaxed px-2 sm:px-0",
              themeConfig.mutedForeground,
              themeConfig.fontClass,
            )}
          >
            {currentContent.subtitle}
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="w-full flex flex-col items-center gap-2 sm:gap-3">
          <p
            className={cn(
              "text-xs sm:text-sm uppercase tracking-widest",
              themeConfig.mutedForeground,
              themeConfig.fontClass,
            )}
          >
            {theme === "terminal" ? "// time_remaining:" : "До окончания приёма заявок"}
          </p>
          <ThemedCountdown targetDate={targetDate} />
          <button
            onClick={onToggleSettings}
            className={cn(
              "text-xs underline-offset-4 hover:underline transition-all",
              themeConfig.mutedForeground,
              themeConfig.fontClass,
            )}
          >
            {theme === "terminal" ? "// modify_timer" : "Настроить таймер"}
          </button>
        </div>

        {/* Timer Settings (Collapsible) */}
        {showSettings && (
          <div
            className={cn(
              "flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border transition-all duration-500 animate-in fade-in slide-in-from-top-2 w-full sm:w-auto",
              themeConfig.muted,
              themeConfig.border,
              theme === "neon" && "shadow-[0_0_30px_rgba(34,211,238,0.15)]",
              theme === "glass" && "backdrop-blur-xl bg-white/40",
            )}
          >
            <div className="grid grid-cols-4 gap-2 sm:flex sm:items-end sm:gap-3 sm:flex-wrap sm:justify-center w-full sm:w-auto">
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <Label htmlFor="days" className={cn("text-[10px] sm:text-xs", themeConfig.mutedForeground)}>Дни</Label>
                <Input id="days" type="number" min="0" max="99" value={days}
                  onChange={(e) => onDaysChange(e.target.value)}
                  className={cn("w-full sm:w-16 text-center text-sm", themeConfig.card, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass)} />
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <Label htmlFor="hours" className={cn("text-[10px] sm:text-xs", themeConfig.mutedForeground)}>Часы</Label>
                <Input id="hours" type="number" min="0" max="23" value={hours}
                  onChange={(e) => onHoursChange(e.target.value)}
                  className={cn("w-full sm:w-16 text-center text-sm", themeConfig.card, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass)} />
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <Label htmlFor="minutes" className={cn("text-[10px] sm:text-xs", themeConfig.mutedForeground)}>Мин</Label>
                <Input id="minutes" type="number" min="0" max="59" value={minutes}
                  onChange={(e) => onMinutesChange(e.target.value)}
                  className={cn("w-full sm:w-16 text-center text-sm", themeConfig.card, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass)} />
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <Label htmlFor="seconds" className={cn("text-[10px] sm:text-xs", themeConfig.mutedForeground)}>Сек</Label>
                <Input id="seconds" type="number" min="0" max="59" value={seconds}
                  onChange={(e) => onSecondsChange(e.target.value)}
                  className={cn("w-full sm:w-16 text-center text-sm", themeConfig.card, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass)} />
              </div>
            </div>
            <button
              onClick={onSetTimer}
              className={cn(
                "w-full sm:w-auto px-5 py-2 rounded-lg font-medium transition-all duration-200",
                "hover:scale-105 active:scale-95",
                themeConfig.accent,
                themeConfig.accentForeground,
                themeConfig.fontClass,
                theme === "neon" && "shadow-[0_0_20px_rgba(34,211,238,0.5)]",
                theme === "luxury" && "shadow-[0_0_20px_rgba(200,210,220,0.3)]",
              )}
            >
              {theme === "terminal" ? "execute()" : "Задать"}
            </button>
          </div>
        )}

        {/* Application Form */}
        <ApplyForm
          form={form}
          formStatus={formStatus}
          ageError={ageError}
          photos={photos}
          consentPersonal={consentPersonal}
          consentPhotos={consentPhotos}
          onFormChange={onFormChange}
          onPhotoAdd={onPhotoAdd}
          onPhotoRemove={onPhotoRemove}
          onConsentPersonalChange={onConsentPersonalChange}
          onConsentPhotosChange={onConsentPhotosChange}
          onSubmit={onSubmit}
          onReset={onFormReset}
        />

        {/* Features */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 flex-wrap">
          {currentContent.features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm",
                themeConfig.mutedForeground,
                themeConfig.fontClass,
              )}
            >
              <feature.icon
                className={cn(
                  "w-3.5 h-3.5 sm:w-4 sm:h-4",
                  theme === "neon" && "text-cyan-400",
                  theme === "luxury" && "text-slate-300",
                  theme === "glass" && "text-indigo-500",
                )}
              />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 sm:pt-6",
            themeConfig.mutedForeground,
            themeConfig.fontClass,
          )}
        >
          <div className="flex -space-x-2">
            {[
              "/professional-woman-headshot.png",
              "/young-man-portrait-smiling.jpg",
              "/asian-woman-professional-photo.jpg",
              "/bearded-man-headshot.png",
              "/smiling-black-woman-portrait.png",
            ].map((src, i) => (
              <img
                key={i}
                src={src || "/placeholder.svg"}
                alt={`User ${i + 1}`}
                className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 object-cover",
                  theme === "dark" || theme === "neon" || theme === "terminal" || theme === "luxury"
                    ? "border-zinc-800"
                    : "border-white",
                )}
              />
            ))}
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current",
                    theme === "luxury" && "text-slate-300",
                    theme === "neon" && "text-cyan-400",
                    theme === "retro" && "text-amber-600",
                    (theme === "minimal-light" ||
                      theme === "dark" ||
                      theme === "monochrome" ||
                      theme === "glass" ||
                      theme === "terminal") &&
                      "text-current",
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs">
              {theme === "terminal" ? "// 1240 voters_ready" : "Уже 1 240+ готовы голосовать"}
            </span>
          </div>
        </div>

      </div>
    </main>
  )
}