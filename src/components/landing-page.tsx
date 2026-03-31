import { useState } from "react"
import { ThemedCountdown } from "./themed-countdown"
import { ThemeSwitcher } from "./theme-switcher"
import { useTheme } from "./theme-context"
import { themes, type ThemeMode } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Bell, Sparkles, Zap, Shield, Star } from "lucide-react"
import { ContestantsSection } from "./contestants-section"

export function LandingPage() {
  const { theme } = useTheme()
  const themeConfig = themes[theme]

  const [targetDate, setTargetDate] = useState<Date>(() => {
    return new Date("2026-04-20T23:59:59")
  })

  const [days, setDays] = useState("7")
  const [hours, setHours] = useState("0")
  const [minutes, setMinutes] = useState("0")
  const [seconds, setSeconds] = useState("0")
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<"miss" | "missus">("miss")
  const emptyForm = { name: "", age: "", phone: "", email: "", about: "" }
  const [form, setForm] = useState(emptyForm)
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [ageError, setAgeError] = useState("")
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
  const [consentPersonal, setConsentPersonal] = useState(false)
  const [consentPhotos, setConsentPhotos] = useState(false)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === "age") {
      const age = Number(value)
      if (activeTab === "miss" && value && (age < 18 || age > 35)) {
        setAgeError("Категория Мисс: возраст от 18 до 35 лет")
      } else if (activeTab === "missus" && value && (age < 18 || age > 45)) {
        setAgeError("Категория Миссис: возраст от 18 до 45 лет")
      } else {
        setAgeError("")
      }
    }
  }

  const handleTabChange = (tab: "miss" | "missus") => {
    setActiveTab(tab)
    setForm(emptyForm)
    setAgeError("")
    setFormStatus("idle")
    setPhotos([])
    setConsentPersonal(false)
    setConsentPhotos(false)
  }

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = 3 - photos.length
    files.slice(0, remaining).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotos((prev) => prev.length < 3 ? [...prev, { file, preview: ev.target?.result as string }] : prev)
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ""
  }

  const handlePhotoRemove = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.phone || ageError || photos.length < 3 || !consentPersonal || !consentPhotos) return
    setFormStatus("loading")
    try {
      const res = await fetch("https://functions.poehali.dev/b7548504-a532-4f31-a3d5-72a96123996e", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category: activeTab === "miss" ? "Мисс" : "Миссис",
          photos: photos.map((p) => p.preview),
          consentPersonal,
          consentPhotos,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setFormStatus("success")
        setForm(emptyForm)
        setPhotos([])
        setConsentPersonal(false)
        setConsentPhotos(false)
      } else {
        setFormStatus("error")
      }
    } catch {
      setFormStatus("error")
    }
  }

  const handleSetTimer = () => {
    const newTarget = new Date()
    newTarget.setDate(newTarget.getDate() + Number.parseInt(days || "0"))
    newTarget.setHours(newTarget.getHours() + Number.parseInt(hours || "0"))
    newTarget.setMinutes(newTarget.getMinutes() + Number.parseInt(minutes || "0"))
    newTarget.setSeconds(newTarget.getSeconds() + Number.parseInt(seconds || "0"))
    setTargetDate(newTarget)
    setShowSettings(false)
  }

  // Theme-specific content
  const content: Record<
    ThemeMode,
    {
      badge: string
      title: string
      highlight: string
      subtitle: string
      cta: string
      features: { icon: typeof Sparkles; text: string }[]
    }
  > = {
    "minimal-light": {
      badge: "Голосование открывается скоро",
      title: "Мисс и Миссис Интернет",
      highlight: "Краснокаменск 2026",
      subtitle:
        "Интернет-голосование за самых ярких участниц конкурса красоты и элегантности. Поддержи свою фаворитку!",
      cta: "Уведомить меня о старте",
      features: [
        { icon: Sparkles, text: "Онлайн-голосование" },
        { icon: Star, text: "32 участницы" },
        { icon: Shield, text: "Честное голосование" },
      ],
    },
    dark: {
      badge: "Голосование скоро",
      title: "Мисс и Миссис Интернет",
      highlight: "Краснокаменск 2026",
      subtitle: "Реши судьбу конкурса — голосуй за самых достойных. Каждый голос важен.",
      cta: "Уведомить меня о старте",
      features: [
        { icon: Sparkles, text: "Онлайн-голосование" },
        { icon: Star, text: "32 участницы" },
        { icon: Shield, text: "Честное голосование" },
      ],
    },
    retro: {
      badge: "Конкурс красоты 2026",
      title: "Мисс и Миссис Интернет",
      highlight: "Краснокаменск 2026",
      subtitle: "Традиционный конкурс красоты и элегантности. Поддержи участницу своим голосом!",
      cta: "Уведомить меня о старте",
      features: [
        { icon: Sparkles, text: "Онлайн-голосование" },
        { icon: Star, text: "32 участницы" },
        { icon: Shield, text: "Честное голосование" },
      ],
    },
    neon: {
      badge: "[ ГОЛОСОВАНИЕ СКОРО ]",
      title: "МИСС И МИССИС ИНТЕРНЕТ",
      highlight: "КРАСНОКАМЕНСК 2026",
      subtitle: "Интернет-голосование за участниц конкурса красоты. Твой голос решает всё.",
      cta: "УВЕДОМИТЬ О СТАРТЕ",
      features: [
        { icon: Sparkles, text: "ОНЛАЙН-ГОЛОСОВАНИЕ" },
        { icon: Star, text: "32 УЧАСТНИЦЫ" },
        { icon: Shield, text: "ЧЕСТНЫЙ ПОДСЧЁТ" },
      ],
    },
    monochrome: {
      badge: "Конкурс 2026",
      title: "Мисс и Миссис Интернет",
      highlight: "Краснокаменск 2026",
      subtitle: "Изысканный конкурс красоты и элегантности. Голосуй за свою фаворитку.",
      cta: "Уведомить меня о старте",
      features: [
        { icon: Sparkles, text: "Онлайн-голосование" },
        { icon: Star, text: "32 участницы" },
        { icon: Shield, text: "Честное голосование" },
      ],
    },
    glass: {
      badge: "Голосование открывается скоро",
      title: "Мисс и Миссис Интернет",
      highlight: "Краснокаменск 2026",
      subtitle: "Поддержи самую яркую участницу конкурса красоты. Голосование совсем скоро!",
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
      subtitle: "// голосование за участниц конкурса. ожидание открытия...",
      cta: "$ subscribe --notify",
      features: [
        { icon: Sparkles, text: "--онлайн" },
        { icon: Star, text: "--32 участницы" },
        { icon: Shield, text: "--честно" },
      ],
    },
    luxury: {
      badge: "Конкурс красоты · 2026",
      title: "Мисс и Миссис Интернет",
      highlight: "Краснокаменск 2026",
      subtitle:
        "Изысканный конкурс красоты, грации и элегантности. Отдайте голос за достойнейшую.",
      cta: "Уведомить меня о старте",
      features: [
        { icon: Sparkles, text: "Онлайн-голосование" },
        { icon: Star, text: "32 участницы" },
        { icon: Shield, text: "Честное голосование" },
      ],
    },
  }

  const currentContent = content[theme]

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col transition-all duration-500 relative overflow-hidden",
        themeConfig.background,
      )}
    >
      {/* Subtle background decoration */}
      {theme === "neon" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      )}
      {theme === "glass" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-300/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-pink-300/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
      )}
      {theme === "luxury" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 w-[800px] h-[400px] bg-gradient-to-r from-amber-500/5 via-yellow-500/10 to-amber-500/5 rounded-full blur-3xl -translate-x-1/2" />
        </div>
      )}

      {/* Header with Theme Switcher */}
      <header className="relative z-50 w-full">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center text-center justify-center">
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Content */}
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
              theme === "luxury" && "border-amber-500/30",
            )}
          >
            <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
            {currentContent.badge}
          </div>

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
                    "bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent",
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
              onClick={() => setShowSettings(!showSettings)}
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
                  <Label htmlFor="days" className={cn("text-[10px] sm:text-xs", themeConfig.mutedForeground)}>
                    Дни
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    min="0"
                    max="99"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className={cn(
                      "w-full sm:w-16 text-center text-sm",
                      themeConfig.card,
                      themeConfig.cardForeground,
                      themeConfig.border,
                      themeConfig.fontClass,
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <Label htmlFor="hours" className={cn("text-[10px] sm:text-xs", themeConfig.mutedForeground)}>
                    Часы
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className={cn(
                      "w-full sm:w-16 text-center text-sm",
                      themeConfig.card,
                      themeConfig.cardForeground,
                      themeConfig.border,
                      themeConfig.fontClass,
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <Label htmlFor="minutes" className={cn("text-[10px] sm:text-xs", themeConfig.mutedForeground)}>
                    Мин
                  </Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className={cn(
                      "w-full sm:w-16 text-center text-sm",
                      themeConfig.card,
                      themeConfig.cardForeground,
                      themeConfig.border,
                      themeConfig.fontClass,
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <Label htmlFor="seconds" className={cn("text-[10px] sm:text-xs", themeConfig.mutedForeground)}>
                    Сек
                  </Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className={cn(
                      "w-full sm:w-16 text-center text-sm",
                      themeConfig.card,
                      themeConfig.cardForeground,
                      themeConfig.border,
                      themeConfig.fontClass,
                    )}
                  />
                </div>
              </div>
              <button
                onClick={handleSetTimer}
                className={cn(
                  "w-full sm:w-auto px-5 py-2 rounded-lg font-medium transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  themeConfig.accent,
                  themeConfig.accentForeground,
                  themeConfig.fontClass,
                  theme === "neon" && "shadow-[0_0_20px_rgba(34,211,238,0.5)]",
                  theme === "luxury" && "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
                )}
              >
                {theme === "terminal" ? "execute()" : "Задать"}
              </button>
            </div>
          )}

          {/* Application Form */}
          <div
            className={cn(
              "w-full max-w-lg flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border transition-all",
              themeConfig.card,
              themeConfig.border,
              themeConfig.shadow,
              theme === "glass" && "backdrop-blur-xl bg-white/40",
              theme === "neon" && "shadow-[0_0_30px_rgba(34,211,238,0.15)]",
              theme === "luxury" && "shadow-[0_0_30px_rgba(251,191,36,0.1)]",
            )}
          >
            <p className={cn("text-sm font-semibold text-center", themeConfig.cardForeground, themeConfig.fontClass)}>
              Подать заявку на участие
            </p>

            {/* Category tabs */}
            <div className={cn("grid grid-cols-2 rounded-xl p-1 gap-1", themeConfig.muted)}>
              {(["miss", "missus"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                    activeTab === tab
                      ? cn(themeConfig.accent, themeConfig.accentForeground, theme === "neon" && "shadow-[0_0_15px_rgba(34,211,238,0.4)]", theme === "luxury" && "shadow-[0_0_15px_rgba(251,191,36,0.3)]")
                      : cn(themeConfig.mutedForeground, "hover:opacity-80"),
                    themeConfig.fontClass,
                  )}
                >
                  {tab === "miss" ? "👑 Мисс" : "💍 Миссис"}
                </button>
              ))}
            </div>

            {/* Category description */}
            <div className={cn("text-xs text-center px-2 py-2 rounded-lg", themeConfig.muted, themeConfig.mutedForeground, themeConfig.fontClass)}>
              {activeTab === "miss"
                ? "Незамужние девушки · 18–35 лет"
                : "Замужние девушки и женщины · 18–45 лет"}
            </div>

            {formStatus === "success" ? (
              <div className={cn("text-center py-6 space-y-2", themeConfig.cardForeground, themeConfig.fontClass)}>
                <p className="text-2xl">✨</p>
                <p className="font-semibold">Заявка отправлена!</p>
                <p className={cn("text-sm", themeConfig.mutedForeground)}>Мы свяжемся с вами в ближайшее время.</p>
                <button onClick={() => setFormStatus("idle")} className={cn("text-xs underline mt-2", themeConfig.mutedForeground)}>Отправить ещё</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className={cn("text-xs", themeConfig.mutedForeground, themeConfig.fontClass)}>Имя и фамилия *</Label>
                    <Input name="name" value={form.name} onChange={handleFormChange} placeholder="Анна Иванова"
                      className={cn("text-sm", themeConfig.muted, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass, "placeholder:opacity-40")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className={cn("text-xs", themeConfig.mutedForeground, themeConfig.fontClass)}>
                      Возраст {activeTab === "miss" ? "(18–35)" : "(18–45)"}
                    </Label>
                    <Input name="age" value={form.age} onChange={handleFormChange} placeholder={activeTab === "miss" ? "18–35" : "18–45"} type="number"
                      className={cn("text-sm", themeConfig.muted, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass, "placeholder:opacity-40", ageError && "border-red-400")} />
                    {ageError && <p className="text-xs text-red-400">{ageError}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className={cn("text-xs", themeConfig.mutedForeground, themeConfig.fontClass)}>Телефон *</Label>
                    <Input name="phone" value={form.phone} onChange={handleFormChange} placeholder="+7 999 000-00-00"
                      className={cn("text-sm", themeConfig.muted, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass, "placeholder:opacity-40")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className={cn("text-xs", themeConfig.mutedForeground, themeConfig.fontClass)}>Email</Label>
                    <Input name="email" value={form.email} onChange={handleFormChange} placeholder="example@mail.ru"
                      className={cn("text-sm", themeConfig.muted, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass, "placeholder:opacity-40")} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className={cn("text-xs", themeConfig.mutedForeground, themeConfig.fontClass)}>Расскажите о себе</Label>
                  <Textarea name="about" value={form.about} onChange={handleFormChange} placeholder="Увлечения, достижения, мечты..." rows={3}
                    className={cn("text-sm resize-none", themeConfig.muted, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass, "placeholder:opacity-40")} />
                </div>

                {/* Photo upload */}
                <div className="flex flex-col gap-2">
                  <Label className={cn("text-xs font-semibold", themeConfig.cardForeground, themeConfig.fontClass)}>
                    Фотографии * <span className={cn("font-normal", themeConfig.mutedForeground)}>({photos.length}/3)</span>
                  </Label>
                  <div className={cn("text-xs rounded-lg px-3 py-2 leading-relaxed", themeConfig.muted, themeConfig.mutedForeground, themeConfig.fontClass)}>
                    📋 Необходимо прикрепить <b>3 любых фотографии</b>, где вы одна. Фотографии должны быть <b>не старше 3 лет</b>.
                  </div>
                  <div className={cn("text-xs rounded-lg px-3 py-2", "bg-amber-50 text-amber-700 border border-amber-200", themeConfig.fontClass)}>
                    ⚠️ Фотографии будут опубликованы на сайте конкурса для интернет-голосования.
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className={cn("relative aspect-square rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all", themeConfig.border, photos[idx] ? "border-solid" : "")}>
                        {photos[idx] ? (
                          <>
                            <img src={photos[idx].preview} alt={`Фото ${idx + 1}`} className="w-full h-full object-cover" />
                            <button onClick={() => handlePhotoRemove(idx)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-1">
                            <span className="text-xl">📷</span>
                            <span className={cn("text-[10px]", themeConfig.mutedForeground, themeConfig.fontClass)}>Фото {idx + 1}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoAdd} disabled={photos.length > idx} />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consents */}
                <div className="flex flex-col gap-3">
                  <label className={cn("flex items-start gap-3 cursor-pointer text-xs leading-relaxed", themeConfig.cardForeground, themeConfig.fontClass)}>
                    <input type="checkbox" checked={consentPersonal} onChange={(e) => setConsentPersonal(e.target.checked)} className="mt-0.5 shrink-0 w-4 h-4 accent-purple-500" />
                    <span>Я даю <b>согласие на обработку персональных данных</b> в соответствии с ФЗ-152 «О персональных данных» для участия в конкурсе «Мисс и Миссис Интернет Краснокаменск 2026».</span>
                  </label>
                  <label className={cn("flex items-start gap-3 cursor-pointer text-xs leading-relaxed", themeConfig.cardForeground, themeConfig.fontClass)}>
                    <input type="checkbox" checked={consentPhotos} onChange={(e) => setConsentPhotos(e.target.checked)} className="mt-0.5 shrink-0 w-4 h-4 accent-purple-500" />
                    <span>Я даю <b>согласие на использование моих фотографий</b> для публикации на сайте конкурса и проведения интернет-голосования.</span>
                  </label>
                </div>

                {formStatus === "error" && (
                  <p className="text-xs text-red-500 text-center">Ошибка отправки. Попробуйте ещё раз.</p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={formStatus === "loading" || !form.name || !form.phone || !!ageError || photos.length < 3 || !consentPersonal || !consentPhotos}
                  className={cn(
                    "w-full py-3 font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm rounded-xl",
                    "hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
                    themeConfig.accent,
                    themeConfig.accentForeground,
                    themeConfig.fontClass,
                    theme === "neon" && "shadow-[0_0_25px_rgba(34,211,238,0.5)]",
                    theme === "luxury" && "shadow-[0_0_25px_rgba(251,191,36,0.3)]",
                  )}
                >
                  {formStatus === "loading" ? "Отправляем..." : "Подать заявку"}
                  {formStatus !== "loading" && <ArrowRight className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>

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
                    theme === "luxury" && "text-amber-400",
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
                      theme === "luxury" && "text-amber-400",
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

      {/* Contestants & Voting */}
      <ContestantsSection />

      {/* Footer */}
      <footer
        className={cn(
          "relative z-10 py-6 sm:py-8 text-center border-t px-4",
          themeConfig.border,
          themeConfig.mutedForeground,
          themeConfig.fontClass,
        )}
      >
        <p className="text-xs sm:text-sm">
          {theme === "terminal"
            ? "© 2025 // launchpad_inc | privacy --policy | terms --conditions"
            : "© 2026 Мисс и Миссис Краснокаменск · Конкурс красоты и элегантности"}
        </p>
      </footer>
    </div>
  )
}