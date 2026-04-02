import { useState } from "react"
import { useTheme } from "./theme-context"
import { themes } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { HeroSection } from "./hero-section"
import { InfoSection } from "./info-section"
import { ContestantsSection } from "./contestants-section"
import { RulesSection } from "./rules-section"

export function LandingPage() {
  const { theme } = useTheme()
  const themeConfig = themes[theme]

  const [targetDate, setTargetDate] = useState<Date>(() => new Date("2026-04-20T23:59:59"))
  const [days, setDays] = useState("7")
  const [hours, setHours] = useState("0")
  const [minutes, setMinutes] = useState("0")
  const [seconds, setSeconds] = useState("0")
  const [showSettings, setShowSettings] = useState(false)
  const [activeSection, setActiveSection] = useState<"info" | "vote" | "apply" | "rules">("info")

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
      if (value && age < 18) {
        setAgeError("Участие возможно только с 18 лет")
      } else {
        setAgeError("")
      }
    }
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
          category: "Мисс",
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

  const handleFormReset = () => {
    setFormStatus("idle")
  }

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col transition-all duration-500 relative overflow-hidden",
        themeConfig.background,
      )}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 w-[800px] h-[400px] bg-gradient-to-r from-slate-500/5 via-slate-300/8 to-slate-500/5 rounded-full blur-3xl -translate-x-1/2" />
      </div>

      {/* Hero */}
      <HeroSection
        targetDate={targetDate}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
        days={days} hours={hours} minutes={minutes} seconds={seconds}
        onDaysChange={setDays} onHoursChange={setHours}
        onMinutesChange={setMinutes} onSecondsChange={setSeconds}
        onSetTimer={handleSetTimer}
        form={form}
        formStatus={formStatus}
        ageError={ageError}
        photos={photos}
        consentPersonal={consentPersonal}
        consentPhotos={consentPhotos}
        onFormChange={handleFormChange}
        onPhotoAdd={handlePhotoAdd}
        onPhotoRemove={handlePhotoRemove}
        onConsentPersonalChange={setConsentPersonal}
        onConsentPhotosChange={setConsentPhotos}
        onSubmit={handleSubmit}
        onFormReset={handleFormReset}
      />

      {/* Section Tabs */}
      <div className={cn("relative z-10 w-full border-t", themeConfig.border)}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <div className={cn("flex gap-1 p-1 rounded-2xl w-full sm:w-fit mx-auto", themeConfig.muted)}>
            {([
              { key: "info", label: "Информация" },
              { key: "vote", label: "Участницы" },
              { key: "apply", label: "Подать заявку" },
              { key: "rules", label: "Положение" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                className={cn(
                  "flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  themeConfig.fontClass,
                  activeSection === tab.key
                    ? cn(themeConfig.accent, themeConfig.accentForeground, "shadow-[0_0_15px_rgba(251,191,36,0.3)]")
                    : cn(themeConfig.mutedForeground, "hover:opacity-80"),
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeSection === "info" && <InfoSection />}
      {activeSection === "vote" && <ContestantsSection />}
      {activeSection === "rules" && <RulesSection />}
      {activeSection === "apply" && (() => {
        setTimeout(() => document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50)
        return null
      })()}

      {/* Footer */}
      <footer
        className={cn(
          "relative z-10 py-6 sm:py-8 text-center border-t px-4",
          themeConfig.border,
          themeConfig.mutedForeground,
          themeConfig.fontClass,
        )}
      >
        <p className="text-xs sm:text-sm">© 2026 Мисс Интернет Краснокаменск · Конкурс красоты и элегантности</p>
      </footer>
    </div>
  )
}