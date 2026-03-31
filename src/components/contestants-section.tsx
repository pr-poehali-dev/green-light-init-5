import { useState, useEffect } from "react"
import { useTheme } from "./theme-context"
import { themes } from "@/lib/themes"
import { cn } from "@/lib/utils"
import Icon from "@/components/ui/icon"

const VOTE_OPEN_DATE = new Date("2026-04-20T23:59:59")
const GET_URL = "https://functions.poehali.dev/611c34b9-f1c1-44b3-b99d-f8f3198e92c8"
const VOTE_URL = "https://functions.poehali.dev/e12c6252-777d-43da-9e53-21e165ef9e01"

interface Contestant {
  id: number
  name: string
  age: number | null
  category: string
  about: string | null
  photo1: string | null
  photo2: string | null
  photo3: string | null
  votes: number
}

export function ContestantsSection() {
  const { theme } = useTheme()
  const themeConfig = themes[theme]
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [loading, setLoading] = useState(true)
  const [votingFor, setVotingFor] = useState<number | null>(null)
  const [votedIds, setVotedIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("voted_ids") || "[]") } catch { return [] }
  })
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string } | null>(null)
  const [activeCategory, setActiveCategory] = useState<"all" | "Мисс" | "Миссис">("all")

  const votingOpen = new Date() >= VOTE_OPEN_DATE

  const fetchContestants = async () => {
    try {
      const res = await fetch(GET_URL)
      const data = await res.json()
      setContestants(data.contestants || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContestants() }, [])

  const handleVote = async (id: number) => {
    if (!votingOpen || votedIds.includes(id) || votingFor) return
    setVotingFor(id)
    try {
      const res = await fetch(VOTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contestant_id: id }),
      })
      const data = await res.json()
      if (data.success) {
        const newVoted = [...votedIds, id]
        setVotedIds(newVoted)
        localStorage.setItem("voted_ids", JSON.stringify(newVoted))
        setContestants((prev) =>
          [...prev.map((c) => c.id === id ? { ...c, votes: data.votes } : c)]
            .sort((a, b) => b.votes - a.votes)
        )
      }
    } finally {
      setVotingFor(null)
    }
  }

  const filtered = contestants.filter((c) => activeCategory === "all" || c.category === activeCategory)
  const leaders = contestants.slice(0, 10)

  const inputClass = cn(
    "rounded-xl border transition-all",
    themeConfig.card, themeConfig.cardForeground, themeConfig.border, themeConfig.shadow
  )

  return (
    <section className={cn("w-full py-12 px-4 sm:px-6", themeConfig.fontClass)}>
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Leaders block */}
        {contestants.length > 0 && (
          <div className={cn("rounded-2xl border p-5 sm:p-6", themeConfig.card, themeConfig.border, themeConfig.shadow,
            theme === "neon" && "shadow-[0_0_30px_rgba(34,211,238,0.15)]",
            theme === "luxury" && "shadow-[0_0_30px_rgba(251,191,36,0.1)]",
          )}>
            <div className="flex items-center gap-2 mb-5">
              <Icon name="Trophy" className={cn("w-5 h-5", theme === "luxury" ? "text-amber-400" : theme === "neon" ? "text-cyan-400" : "")} />
              <h2 className={cn("text-lg font-bold", themeConfig.cardForeground)}>Лидеры голосования</h2>
            </div>
            <div className="flex flex-col gap-2">
              {leaders.map((c, i) => (
                <div key={c.id} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl", themeConfig.muted)}>
                  <span className={cn("text-sm font-bold w-6 text-center shrink-0",
                    i === 0 ? "text-amber-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : themeConfig.mutedForeground
                  )}>
                    {i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                  </span>
                  {c.photo1 && (
                    <img src={c.photo1} alt={c.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", themeConfig.cardForeground)}>{c.name}</p>
                    <p className={cn("text-xs", themeConfig.mutedForeground)}>{c.category}</p>
                  </div>
                  <span className={cn("text-sm font-bold shrink-0", theme === "luxury" ? "text-amber-400" : theme === "neon" ? "text-cyan-400" : themeConfig.cardForeground)}>
                    {c.votes} {getVoteWord(c.votes)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category filter */}
        {contestants.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className={cn("text-xl font-bold", themeConfig.cardForeground)}>Все участницы</h2>
              <span className={cn("text-sm px-2 py-0.5 rounded-full", themeConfig.muted, themeConfig.mutedForeground)}>{filtered.length}</span>
            </div>
            <div className={cn("flex gap-2 p-1 rounded-xl w-fit", themeConfig.muted)}>
              {(["all", "Мисс", "Миссис"] as const).map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                    activeCategory === cat
                      ? cn(themeConfig.accent, themeConfig.accentForeground)
                      : cn(themeConfig.mutedForeground, "hover:opacity-80")
                  )}>
                  {cat === "all" ? "Все" : cat === "Мисс" ? "👑 Мисс" : "💍 Миссис"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Voting not open notice */}
        {!votingOpen && contestants.length > 0 && (
          <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border text-sm", themeConfig.muted, themeConfig.border, themeConfig.mutedForeground)}>
            <Icon name="Lock" className="w-4 h-4 shrink-0" />
            Голосование откроется 20 апреля 2026 года
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("rounded-2xl border h-80 animate-pulse", themeConfig.muted, themeConfig.border)} />
            ))}
          </div>
        )}

        {/* No contestants yet */}
        {!loading && contestants.length === 0 && (
          <div className={cn("text-center py-16", themeConfig.mutedForeground)}>
            <p className="text-4xl mb-3">✨</p>
            <p className="font-medium">Заявки ещё не поступали</p>
            <p className="text-sm mt-1">Подайте заявку первой!</p>
          </div>
        )}

        {/* Cards grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c, idx) => {
              const rank = contestants.findIndex((x) => x.id === c.id)
              const alreadyVoted = votedIds.includes(c.id)
              return (
                <div key={c.id} className={cn(
                  "rounded-2xl border flex flex-col overflow-hidden transition-all hover:scale-[1.01]",
                  inputClass,
                  theme === "neon" && "hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]",
                  theme === "luxury" && "hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]",
                )}>
                  {/* Photos */}
                  <div className="grid grid-cols-3 h-44 overflow-hidden">
                    {[c.photo1, c.photo2, c.photo3].map((photo, pi) => (
                      photo ? (
                        <img key={pi} src={photo} alt={`${c.name} фото ${pi + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedPhoto({ url: photo, name: c.name })} />
                      ) : (
                        <div key={pi} className={cn("w-full h-full flex items-center justify-center", themeConfig.muted)}>
                          <Icon name="Image" className={cn("w-5 h-5", themeConfig.mutedForeground)} />
                        </div>
                      )
                    ))}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-3 p-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          {rank < 3 && <span>{rank === 0 ? "👑" : rank === 1 ? "🥈" : "🥉"}</span>}
                          <h3 className={cn("font-bold text-base", themeConfig.cardForeground)}>{c.name}</h3>
                        </div>
                        <p className={cn("text-xs mt-0.5", themeConfig.mutedForeground)}>
                          {c.category}{c.age ? ` · ${c.age} лет` : ""}
                        </p>
                      </div>
                      <div className={cn("text-right shrink-0")}>
                        <p className={cn("text-lg font-bold", theme === "luxury" ? "text-amber-400" : theme === "neon" ? "text-cyan-400" : themeConfig.cardForeground)}>{c.votes}</p>
                        <p className={cn("text-xs", themeConfig.mutedForeground)}>{getVoteWord(c.votes)}</p>
                      </div>
                    </div>

                    {c.about && (
                      <p className={cn("text-xs leading-relaxed line-clamp-3", themeConfig.mutedForeground)}>{c.about}</p>
                    )}

                    <button
                      onClick={() => handleVote(c.id)}
                      disabled={!votingOpen || alreadyVoted || votingFor === c.id}
                      className={cn(
                        "mt-auto w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                        "hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
                        alreadyVoted
                          ? cn(themeConfig.muted, themeConfig.mutedForeground)
                          : cn(themeConfig.accent, themeConfig.accentForeground),
                        theme === "neon" && !alreadyVoted && "shadow-[0_0_15px_rgba(34,211,238,0.4)]",
                        theme === "luxury" && !alreadyVoted && "shadow-[0_0_15px_rgba(251,191,36,0.3)]",
                      )}
                    >
                      {!votingOpen ? (
                        <><Icon name="Lock" className="w-4 h-4" /> Голосование с 20 апреля</>
                      ) : alreadyVoted ? (
                        <><Icon name="Check" className="w-4 h-4" /> Вы проголосовали</>
                      ) : votingFor === c.id ? (
                        "Отправляем..."
                      ) : (
                        <><Icon name="Heart" className="w-4 h-4" /> Проголосовать</>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Photo lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.url} alt={selectedPhoto.name} className="w-full max-h-[80vh] object-contain rounded-2xl" />
            <button onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80">
              <Icon name="X" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function getVoteWord(n: number): string {
  const abs = Math.abs(n)
  const mod10 = abs % 10
  const mod100 = abs % 100
  if (mod100 >= 11 && mod100 <= 19) return "голосов"
  if (mod10 === 1) return "голос"
  if (mod10 >= 2 && mod10 <= 4) return "голоса"
  return "голосов"
}
