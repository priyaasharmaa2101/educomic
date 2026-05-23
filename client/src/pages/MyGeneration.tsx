import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    BookOpenIcon, ImageIcon, BrainIcon, ClipboardListIcon,
    MessageSquareIcon, CalendarIcon, TrashIcon, XIcon,
    ChevronRightIcon, TrophyIcon, Loader2Icon
} from "lucide-react";
import SoftBackDrop from "../components/SoftBackDrop";

const API = "http://localhost:5000/api/generation";

const GENRE_COLORS: Record<string, string> = {
    Superhero: "bg-red-500/20 text-red-300 border-red-500/30",
    "Sci-Fi":  "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    Fantasy:   "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Thriller:  "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const GENRE_ICONS: Record<string, string> = {
    Superhero: "🦸", "Sci-Fi": "🚀", Fantasy: "🧙", Thriller: "🔪",
};

type GenSummary = {
    _id: string;
    title: string;
    genre: string;
    score: number | null;
    totalQuestions: number;
    createdAt: string;
};

type GenFull = GenSummary & {
    storyText: string;
    panelImages: string[];
    flashcards: { question: string; answer: string }[];
    quiz: { question: string; options: string[]; correct: number }[];
    feedback: string;
};

type ModalTab = "comic" | "script" | "flashcards" | "quiz" | "feedback";

// ── MODAL ──────────────────────────────────────────────────────────────────
const ViewModal = ({
    id, onClose,
}: {
    id: string;
    onClose: () => void;
}) => {
    const [data, setData]       = useState<GenFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab]         = useState<ModalTab>("comic");
    const [flipped, setFlipped] = useState<number | null>(null);

    useEffect(() => {
        fetch(`${API}/${id}`)
            .then((r) => r.json())
            .then((d) => { setData(d.generation); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);

    const tabs: { key: ModalTab; label: string; icon: any }[] = [
        { key: "comic",      label: "Comic",      icon: ImageIcon },
        { key: "script",     label: "Script",     icon: BookOpenIcon },
        { key: "flashcards", label: "Flashcards", icon: BrainIcon },
        { key: "quiz",       label: "Quiz",       icon: ClipboardListIcon },
        { key: "feedback",   label: "Feedback",   icon: MessageSquareIcon },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{GENRE_ICONS[data?.genre ?? ""] ?? "📖"}</span>
                        <div>
                            <h2 className="text-lg font-bold text-white">{data?.title ?? "Loading..."}</h2>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${GENRE_COLORS[data?.genre ?? ""] ?? ""}`}>
                                {data?.genre}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-all">
                        <XIcon size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-4 pt-3 pb-0 shrink-0 border-b border-white/10">
                    {tabs.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-medium transition-all border-b-2 ${
                                tab === key
                                    ? "border-purple-500 text-white bg-purple-500/10"
                                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                            }`}
                        >
                            <Icon size={14} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2Icon className="animate-spin size-8 text-purple-500" />
                        </div>
                    ) : !data ? (
                        <p className="text-zinc-500 text-center mt-20">Failed to load data.</p>
                    ) : (
                        <>
                            {/* ── COMIC TAB ── */}
                            {tab === "comic" && (
                                <div className="space-y-3">
                                    {data.panelImages?.length > 0 ? (
                                        <>
                                            <div className="text-center font-black text-base uppercase tracking-widest bg-yellow-400 text-black py-2 rounded-md border-2 border-black">
                                                {data.title}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {data.panelImages.map((src, i) => (
                                                    <div key={i} className="relative border-2 border-black rounded-md overflow-hidden aspect-square bg-zinc-800">
                                                        <img src={src} alt={`Panel ${i + 1}`} className="w-full h-full object-cover" />
                                                        <span className="absolute top-1.5 left-1.5 bg-black text-white text-xs font-black px-2 py-0.5 rounded-full">
                                                            {i + 1}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-zinc-500">
                                            <ImageIcon size={40} className="opacity-30" />
                                            <p>No images were generated for this comic.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── SCRIPT TAB ── */}
                            {tab === "script" && (
                                <pre className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed font-sans">
                                    {data.storyText || "No script saved."}
                                </pre>
                            )}

                            {/* ── FLASHCARDS TAB ── */}
                            {tab === "flashcards" && (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {data.flashcards?.length > 0 ? data.flashcards.map((fc, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setFlipped(flipped === i ? null : i)}
                                            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-5 transition-all min-h-[100px] flex flex-col justify-between"
                                        >
                                            <p className="text-sm text-zinc-400 mb-2">Q {i + 1}</p>
                                            <p className="text-zinc-100 font-medium">
                                                {flipped === i ? (
                                                    <span className="text-purple-300">{fc.answer}</span>
                                                ) : fc.question}
                                            </p>
                                            <p className="text-xs text-zinc-600 mt-3">
                                                {flipped === i ? "Click to see question" : "Click to reveal answer"}
                                            </p>
                                        </div>
                                    )) : (
                                        <p className="col-span-2 text-zinc-500 text-center mt-10">No flashcards saved.</p>
                                    )}
                                </div>
                            )}

                            {/* ── QUIZ TAB ── */}
                            {tab === "quiz" && (
                                <div className="space-y-6">
                                    {data.quiz?.length > 0 ? data.quiz.map((q, i) => (
                                        <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
                                            <p className="text-zinc-100 font-medium mb-3">
                                                <span className="text-purple-400 mr-2">{i + 1}.</span>
                                                {q.question}
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {q.options.map((opt, oi) => (
                                                    <div
                                                        key={oi}
                                                        className={`px-3 py-2 rounded-lg text-sm border ${
                                                            oi === q.correct
                                                                ? "bg-green-500/20 border-green-500/40 text-green-300"
                                                                : "bg-white/5 border-white/10 text-zinc-400"
                                                        }`}
                                                    >
                                                        {oi === q.correct && "✓ "}{opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-zinc-500 text-center mt-10">No quiz saved.</p>
                                    )}
                                </div>
                            )}

                            {/* ── FEEDBACK TAB ── */}
                            {tab === "feedback" && (
                                <div className="space-y-6">
                                    {/* Score */}
                                    <div className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10">
                                        <TrophyIcon className="size-10 text-yellow-400 shrink-0" />
                                        <div>
                                            <p className="text-zinc-400 text-sm">Final Score</p>
                                            <p className="text-3xl font-black text-white">
                                                {data.score ?? "—"}
                                                <span className="text-zinc-500 text-lg font-normal">
                                                    /{data.totalQuestions ?? "—"}
                                                </span>
                                            </p>
                                            {data.totalQuestions > 0 && (
                                                <div className="mt-2 h-2 w-48 rounded-full bg-zinc-700">
                                                    <div
                                                        className="h-2 rounded-full bg-purple-500"
                                                        style={{ width: `${(data.score! / data.totalQuestions) * 100}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Feedback text */}
                                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                                        <p className="text-zinc-400 text-sm mb-2">AI Feedback</p>
                                        <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                            {data.feedback || "No feedback saved."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// ── CARD ───────────────────────────────────────────────────────────────────
const GenerationCard = ({
    gen,
    onView,
    onDelete,
}: {
    gen: GenSummary;
    onView: () => void;
    onDelete: () => void;
}) => {
    const percent = gen.totalQuestions > 0
        ? Math.round((gen.score! / gen.totalQuestions) * 100)
        : null;

    const scoreColor =
        percent === null ? "text-zinc-500" :
        percent >= 80    ? "text-green-400" :
        percent >= 50    ? "text-yellow-400" :
                           "text-red-400";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative flex flex-col gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 hover:bg-white/8 transition-all duration-300"
        >
            {/* Genre badge + delete */}
            <div className="flex items-start justify-between">
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${GENRE_COLORS[gen.genre] ?? ""}`}>
                    {GENRE_ICONS[gen.genre]} {gen.genre}
                </span>
                <button
                    onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-all"
                >
                    <TrashIcon size={14} />
                </button>
            </div>

            {/* Title */}
            <h3 className="text-white font-bold text-lg leading-tight">{gen.title}</h3>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                    <CalendarIcon size={12} />
                    {new Date(gen.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                    })}
                </span>
                {percent !== null && (
                    <span className={`flex items-center gap-1 font-bold ${scoreColor}`}>
                        <TrophyIcon size={12} />
                        {percent}%
                    </span>
                )}
            </div>

            {/* Progress bar (score) */}
            {percent !== null && (
                <div className="h-1.5 w-full rounded-full bg-zinc-800">
                    <div
                        className={`h-1.5 rounded-full transition-all ${
                            percent >= 80 ? "bg-green-500" :
                            percent >= 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            )}

            {/* View button */}
            <button
                onClick={onView}
                className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white text-sm font-medium transition-all duration-300"
            >
                View Generation <ChevronRightIcon size={16} />
            </button>
        </motion.div>
    );
};

// ── PAGE ───────────────────────────────────────────────────────────────────
const MyGeneration = () => {
    const userId = localStorage.getItem("userId") || "guest";

    const [generations, setGenerations] = useState<GenSummary[]>([]);
    const [loading, setLoading]         = useState(true);
    const [viewId, setViewId]           = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API}/user/${userId}`)
            .then((r) => r.json())
            .then((d) => {
                setGenerations(d.generations ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [userId]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this generation?")) return;
        await fetch(`${API}/${id}`, { method: "DELETE" });
        setGenerations((prev) => prev.filter((g) => g._id !== id));
    };

    return (
        <>
            <SoftBackDrop />
            <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 pb-16">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-3xl font-black text-white">My Generations</h1>
                    <p className="text-zinc-400 mt-1">
                        {generations.length} comic{generations.length !== 1 ? "s" : ""} created
                    </p>
                </motion.div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <Loader2Icon className="animate-spin size-8 text-purple-500" />
                    </div>
                )}

                {/* Empty state */}
                {!loading && generations.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-64 gap-4 text-zinc-500"
                    >
                        <BookOpenIcon size={48} className="opacity-30" />
                        <p className="text-lg">No generations yet.</p>
                        <a
                            href="/generate"
                            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-all"
                        >
                            Create your first comic
                        </a>
                    </motion.div>
                )}

                {/* Grid */}
                {!loading && generations.length > 0 && (
                    <motion.div
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    >
                        <AnimatePresence>
                            {generations.map((gen) => (
                                <GenerationCard
                                    key={gen._id}
                                    gen={gen}
                                    onView={() => setViewId(gen._id)}
                                    onDelete={() => handleDelete(gen._id)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {viewId && (
                    <ViewModal
                        id={viewId}
                        onClose={() => setViewId(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default MyGeneration;
