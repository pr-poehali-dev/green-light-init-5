import { ArrowRight } from "lucide-react"
import { useTheme } from "./theme-context"
import { themes } from "@/lib/themes"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ApplyFormProps {
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
  onReset: () => void
}

export function ApplyForm({
  form, formStatus, ageError, photos,
  consentPersonal, consentPhotos,
  onFormChange, onPhotoAdd, onPhotoRemove,
  onConsentPersonalChange, onConsentPhotosChange,
  onSubmit, onReset,
}: ApplyFormProps) {
  const { theme } = useTheme()
  const themeConfig = themes[theme]

  return (
    <div
      id="apply-form"
      className={cn(
        "w-full max-w-lg flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border transition-all",
        themeConfig.card,
        themeConfig.border,
        themeConfig.shadow,
        theme === "glass" && "backdrop-blur-xl bg-white/40",
        theme === "neon" && "shadow-[0_0_30px_rgba(34,211,238,0.15)]",
        theme === "luxury" && "shadow-[0_0_30px_rgba(200,210,220,0.1)]",
      )}
    >
      <p className={cn("text-sm font-semibold text-center", themeConfig.cardForeground, themeConfig.fontClass)}>
        Подать заявку на участие
      </p>

      {/* Category description */}
      <div className={cn("text-xs text-center px-3 py-2 rounded-lg", themeConfig.muted, themeConfig.mutedForeground, themeConfig.fontClass)}>
        👑 Мисс · девушки старше 18 лет
      </div>

      {formStatus === "success" ? (
        <div className={cn("text-center py-6 space-y-2", themeConfig.cardForeground, themeConfig.fontClass)}>
          <p className="text-2xl">✨</p>
          <p className="font-semibold">Заявка отправлена!</p>
          <p className={cn("text-sm", themeConfig.mutedForeground)}>Мы свяжемся с вами в ближайшее время.</p>
          <button onClick={onReset} className={cn("text-xs underline mt-2", themeConfig.mutedForeground)}>Отправить ещё</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className={cn("text-xs", themeConfig.mutedForeground, themeConfig.fontClass)}>Имя и фамилия *</Label>
              <Input name="name" value={form.name} onChange={onFormChange} placeholder="Анна Иванова"
                className={cn("text-sm", themeConfig.muted, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass, "placeholder:opacity-40")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className={cn("text-xs", themeConfig.mutedForeground, themeConfig.fontClass)}>
                Возраст (от 18 лет)
              </Label>
              <Input name="age" value={form.age} onChange={onFormChange} placeholder="от 18" type="number"
                className={cn("text-sm", themeConfig.muted, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass, "placeholder:opacity-40", ageError && "border-red-400")} />
              {ageError && <p className="text-xs text-red-400">{ageError}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className={cn("text-xs", themeConfig.mutedForeground, themeConfig.fontClass)}>Телефон *</Label>
              <Input name="phone" value={form.phone} onChange={onFormChange} placeholder="+7 999 000-00-00"
                className={cn("text-sm", themeConfig.muted, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass, "placeholder:opacity-40")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className={cn("text-xs", themeConfig.mutedForeground, themeConfig.fontClass)}>Email</Label>
              <Input name="email" value={form.email} onChange={onFormChange} placeholder="example@mail.ru"
                className={cn("text-sm", themeConfig.muted, themeConfig.cardForeground, themeConfig.border, themeConfig.fontClass, "placeholder:opacity-40")} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className={cn("text-xs", themeConfig.mutedForeground, themeConfig.fontClass)}>Расскажите о себе</Label>
            <Textarea name="about" value={form.about} onChange={onFormChange} placeholder="Увлечения, достижения, мечты..." rows={3}
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
                      <button onClick={() => onPhotoRemove(idx)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-1">
                      <span className="text-xl">📷</span>
                      <span className={cn("text-[10px]", themeConfig.mutedForeground, themeConfig.fontClass)}>Фото {idx + 1}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={onPhotoAdd} disabled={photos.length > idx} />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Consents */}
          <div className="flex flex-col gap-3">
            <label className={cn("flex items-start gap-3 cursor-pointer text-xs leading-relaxed", themeConfig.cardForeground, themeConfig.fontClass)}>
              <input type="checkbox" checked={consentPersonal} onChange={(e) => onConsentPersonalChange(e.target.checked)} className="mt-0.5 shrink-0 w-4 h-4 accent-purple-500" />
              <span>Я даю <b>согласие на обработку персональных данных</b> в соответствии с ФЗ-152 «О персональных данных» для участия в конкурсе «Мисс и Миссис Интернет Краснокаменск 2026».</span>
            </label>
            <label className={cn("flex items-start gap-3 cursor-pointer text-xs leading-relaxed", themeConfig.cardForeground, themeConfig.fontClass)}>
              <input type="checkbox" checked={consentPhotos} onChange={(e) => onConsentPhotosChange(e.target.checked)} className="mt-0.5 shrink-0 w-4 h-4 accent-purple-500" />
              <span>Я даю <b>согласие на использование моих фотографий</b> для публикации на сайте конкурса и проведения интернет-голосования.</span>
            </label>
          </div>

          {formStatus === "error" && (
            <p className="text-xs text-red-500 text-center">Ошибка отправки. Попробуйте ещё раз.</p>
          )}
          <button
            onClick={onSubmit}
            disabled={formStatus === "loading" || !form.name || !form.phone || !!ageError || photos.length < 3 || !consentPersonal || !consentPhotos}
            className={cn(
              "w-full py-3 font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm rounded-xl",
              "hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
              themeConfig.accent,
              themeConfig.accentForeground,
              themeConfig.fontClass,
              theme === "neon" && "shadow-[0_0_25px_rgba(34,211,238,0.5)]",
              theme === "luxury" && "shadow-[0_0_25px_rgba(200,210,220,0.3)]",
            )}
          >
            {formStatus === "loading" ? "Отправляем..." : "Подать заявку"}
            {formStatus !== "loading" && <ArrowRight className="w-4 h-4" />}
          </button>
        </>
      )}
    </div>
  )
}