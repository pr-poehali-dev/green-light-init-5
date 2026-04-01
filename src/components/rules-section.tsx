import { useTheme } from "./theme-context"
import { themes } from "@/lib/themes"
import { cn } from "@/lib/utils"
import Icon from "@/components/ui/icon"
import { jsPDF } from "jspdf"

const sections = [
  {
    title: "1. Общие положения",
    items: [
      "1.1. Конкурс «Мисс Интернет Краснокаменск» предоставляет шанс девушкам нашего города продемонстрировать свои таланты и красоту, а также получить уникальные возможности личностного и профессионального роста.",
      "1.2. Права на организацию и проведение конкурса принадлежат оргкомитету конкурса.",
      "1.3. Конкурс проводится в сроки, определяемые оргкомитетом конкурса.",
      "1.4. Определение победительниц происходит по принципу fair play (честной игры) путём открытого народного голосования в сети Интернет.",
      "1.5. По результатам голосования определяются «Мисс Интернет Краснокаменск», «Первая вице-мисс» и «Вторая вице-мисс». Организаторами и партнёрами могут быть определены другие титулы.",
    ],
  },
  {
    title: "2. Условия участия",
    items: [
      "2.1. Участницей может стать девушка не моложе 18 лет, постоянно проживающая в городе Краснокаменск. Семейное положение значения не имеет. Участие в конкурсе бесплатное.",
      "2.2. Для участия необходимо заполнить анкету и предоставить три фотографии, сделанные не ранее 3 лет назад, в цифровом виде с контактными данными.",
      "2.3. Заполнение анкеты и предоставление фотографий понимается как согласие с условиями конкурса.",
      "2.4. Анкеты и фотографии проходят модерацию и появляются на сайте только после одобрения оргкомитетом. Принятые материалы изменению не подлежат.",
      "2.5. Оргкомитет вправе запросить дополнительную информацию, включая копию паспорта.",
      "2.6. Участница должна дать согласие на обработку своих персональных данных.",
      "2.7. Анкеты принятых участниц удалению не подлежат.",
    ],
  },
  {
    title: "3. Требования к фотографиям",
    items: [
      "3.1. Необходимо предоставить три фотографии: первая — портрет, вторая — в полный рост, третья — в свободной форме.",
      "3.2. Принимаются качественные цифровые вертикальные фотографии в формате JPEG, размером не более 600 × 800 px.",
      "3.3. Не принимаются: коллажи; фото с заменой фона; некачественные снимки; фото с порнографией или нехудожественной эротикой; фото с рекламой; фото, отражающие насилие.",
      "3.4. Фотографии должны быть стилистически различными. Участница должна быть изображена на фото одна.",
      "3.5. Допускаются элементы художественной эротики, если снимок эстетичен и не чрезмерно откровенен.",
      "3.6. Участница гарантирует своё авторство на фотографии и отсутствие прав третьих лиц, препятствующих их использованию.",
      "3.7. Отправляя фотографии, участница передаёт неисключительные права на их распространение организаторам.",
    ],
  },
  {
    title: "4. Этапы и сроки проведения",
    items: [
      "Конкурс проводится в три этапа:",
      "• 1 этап: приём заявок — со 2 апреля по 20 апреля 2026 года;",
      "• 2 этап: отборочный тур (публичное интернет-голосование) — с 20 апреля по 20 мая 2026 года;",
      "• 3 этап: финальное интернет-голосование — с 20 апреля по 20 июня 2026 года;",
      "• Церемония награждения — 20 июня 2026 года.",
      "4.3. Прием заявок: участницы заполняют анкеты и присылают фотографии. Одобренные заявки публикуются на сайте.",
      "4.4. Отборочный тур: путём голосования определяются 50 финалисток, набравших максимальное количество голосов.",
      "4.5. Финал: 50 финалисток участвуют в финальном голосовании. Победительница с наибольшим числом голосов получает титул «Мисс Интернет Краснокаменск», второе место — «Первая вице-мисс», третье — «Вторая вице-мисс».",
    ],
  },
  {
    title: "5. Призы конкурса",
    items: [
      "5.1. Победительница получает корону, почётную ленту, сертификат с титулом, а также подарки от партнёров конкурса.",
      "5.2. Участницы, занявшие второе и третье места, а также специальные номинации, получают почётные ленты, сертификаты и подарки от партнёров.",
    ],
  },
  {
    title: "6. Дисквалификация",
    items: [
      "Оргкомитет может дисквалифицировать участницу в следующих случаях:",
      "• При выявлении попыток искусственного увеличения числа голосов;",
      "• Если анкетные данные не соответствуют действительности;",
      "• По решению оргкомитета в случаях грубых нарушений.",
    ],
  },
  {
    title: "7. Обязанности участниц",
    items: [
      "7.1. Фотографии и другие материалы могут быть использованы оргкомитетом в рекламных целях без дополнительного согласия и без уплаты вознаграждения.",
      "7.2. Оргкомитет может привлечь участниц к дополнительной фотосессии. Фотографии могут быть использованы в рекламных целях.",
      "7.3. Оргкомитет вправе привлекать победительниц в течение 1 года для представления конкурса на мероприятиях.",
      "7.4. Победительница обязана принять участие в награждении следующей победительницы конкурса.",
    ],
  },
  {
    title: "8. Заключительные положения",
    items: [
      "8.1. Оргкомитет вправе менять условия конкурса с обязательной публикацией изменений на официальном сайте.",
      "8.2. Оргкомитет не несёт ответственности за неисполнение обязательств, вызванное сбоями сетей, вредоносными программами или действиями третьих лиц.",
      "8.3. Оргкомитет принимает окончательное решение о составе победительниц всех туров голосования.",
      "8.4. Оргкомитет не несёт ответственности за любой ущерб, понесённый участницей вследствие участия в конкурсе. Предоставляя фотографии, участница соглашается с правилами и даёт согласие на обработку персональных данных.",
    ],
  },
]

function downloadPDF() {
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxW = pageW - margin * 2
  let y = margin

  const checkPage = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage()
      y = margin
    }
  }

  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.text("Miss Internet Krasnokamensk", pageW / 2, y, { align: "center" })
  y += 7
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text("Polozhenie o konkurse", pageW / 2, y, { align: "center" })
  y += 12

  sections.forEach((section) => {
    checkPage(12)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    const titleLines = doc.splitTextToSize(section.title, maxW) as string[]
    doc.text(titleLines, margin, y)
    y += titleLines.length * 6 + 2

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    section.items.forEach((item) => {
      const lines = doc.splitTextToSize(item, maxW) as string[]
      checkPage(lines.length * 5 + 2)
      doc.text(lines, margin, y)
      y += lines.length * 5 + 2
    })
    y += 4
  })

  checkPage(16)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  const consent = "Soglasie na obrabotku personal'nykh dannykh — vse uchastnitsy podpisyvayut pri zapolnenii zayavki."
  const consentLines = doc.splitTextToSize(consent, maxW) as string[]
  doc.text(consentLines, margin, y)

  doc.save("polozhenie-miss-internet-krasnokamensk.pdf")
}

export function RulesSection() {
  const { theme } = useTheme()
  const themeConfig = themes[theme]

  return (
    <div className="relative z-10 w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <h2
              className={cn(
                "text-2xl sm:text-3xl font-bold mb-2",
                themeConfig.foreground,
                themeConfig.fontClass,
              )}
            >
              Мисс Интернет Краснокаменск
            </h2>
            <p className={cn("text-sm", themeConfig.mutedForeground, themeConfig.fontClass)}>
              Положение о конкурсе
            </p>
          </div>
          <button
            onClick={downloadPDF}
            className={cn(
              "shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
              themeConfig.accent,
              themeConfig.accentForeground,
              themeConfig.fontClass,
              theme === "neon" && "shadow-[0_0_15px_rgba(34,211,238,0.4)]",
              theme === "luxury" && "shadow-[0_0_15px_rgba(200,210,220,0.3)]",
            )}
          >
            <Icon name="Download" size={16} />
            Скачать PDF
          </button>
        </div>
        <div className={cn("mb-10 border-b", themeConfig.border)} />

        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3
                className={cn(
                  "text-base sm:text-lg font-bold mb-3 pb-2 border-b",
                  themeConfig.foreground,
                  themeConfig.fontClass,
                  themeConfig.border,
                )}
              >
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className={cn(
                      "text-sm leading-relaxed",
                      themeConfig.mutedForeground,
                      themeConfig.fontClass,
                    )}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "mt-10 p-4 rounded-xl border text-sm text-center",
            themeConfig.border,
            themeConfig.mutedForeground,
            themeConfig.fontClass,
          )}
        >
          <span className="font-semibold">Согласие на обработку персональных данных</span> — все участницы подписывают при заполнении заявки.
        </div>
      </div>
    </div>
  )
}