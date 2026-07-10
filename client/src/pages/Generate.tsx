import { useState } from "react";
import { useParams } from "react-router-dom";
import SoftBackDrop from "../components/SoftBackDrop";
import PreviewPanel from "../components/PreviewPanel";
import type { IComicImage } from "../../public/assets/assets";
import Flashcards from "../components/Flashcards";
import QuizSection from "../components/QuizSection";
import QuizFeedback from "../components/QuizFeedback";
import { ArrowUpRightIcon, Image as ImageIcon, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useGeneration } from "../hooks/useGeneration";

const genres = ["Superhero", "Sci-Fi", "Fantasy", "Thriller"];
type Step = "input" | "script" | "preview" | "flashcards" | "quiz" | "feedback";

const Generate = () => {
    const { id } = useParams();

    // ── Get userId from your auth (adjust to match your auth setup) ──
    const userId = localStorage.getItem("userId") || "guest";

    // Form state
    const [title, setTitle] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("Superhero");

    // Content state
    const [comicText, setComicText] = useState("");
    const [comicImage, setComicImage] = useState<IComicImage | null>(null);

    // Loading
    const [textLoading, setTextLoading]   = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    // Step
    const [step, setStep] = useState<Step>("input");

    // Quiz / feedback state
    const [finalScore, setFinalScore]       = useState(0);
    const [savedQuestions, setSavedQuestions] = useState<any[]>([]);
    const [savedAnswers, setSavedAnswers]   = useState<string[]>([]);
    const [savedIndexes, setSavedIndexes]   = useState<number[]>([]);
    const [hasVisitedFlashcards, setHasVisitedFlashcards] = useState(false);

    // ── Generation save hook ──
    const {
        generationId,
        saveStory,
        saveImages,
        saveFlashcards,
        saveQuiz,
        saveFeedback,
    } = useGeneration(userId);

    // ─────────────────────────────────────────────
    // STEP 1: Generate story + save to DB
    // ─────────────────────────────────────────────
    const handleGenerateText = async () => {
        if (!title) return;
        setTextLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: title, genre: selectedGenre }),
            });
            const data = await response.json();

            if (data.success) {
                setComicText(data.story);
                setComicImage(null);
                setStep("script");

                // ✅ Save story to DB immediately
                await saveStory(title, selectedGenre, data.story);
            } else {
                alert("AI Error: " + data.message);
            }
        } catch (error) {
            console.error("Text generation failed:", error);
            alert("Failed to connect to server.");
        } finally {
            setTextLoading(false);
        }
    };

    // ─────────────────────────────────────────────
    // STEP 2: Generate images + save to DB
    // ─────────────────────────────────────────────
    const handleGenerateImage = async () => {
        if (!comicText) return;
        setImageLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/ai/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ story: comicText, genre: selectedGenre }),
            });
            const data = await response.json();

            if (data.success) {
                const allPanels: string[] = (data.images as string[]).map((img: string) =>
                    img.startsWith("data:image") ? img : `data:image/png;base64,${img}`
                );

                const imageResult: IComicImage = {
                    _id: Date.now().toString(),
                    userId,
                    title,
                    genre: selectedGenre as IComicImage["genre"],
                    storyText: comicText,
                    panel_images: allPanels,
                    image_url: allPanels[0],
                    isGenerating: false,
                };
                setComicImage(imageResult);
                setStep("preview");

                // ✅ Save panel images to DB
                await saveImages(allPanels, generationId ?? undefined);
                console.log("saveImages called with id:", generationId); 
            } else {
                alert("Image Error: " + data.message);
            }
        } catch (error) {
            console.error("Image generation failed:", error);
            alert("Failed to generate image.");
        } finally {
            setImageLoading(false);
        }
    };

    // ─────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────
    return (
        <>
            <SoftBackDrop />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl"
            >
                <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4">

                    {(step === "input" || step === "script" || step === "preview") && (
                        <div className="grid lg:grid-cols-[450px_1fr] gap-8">

                            {/* LEFT: Form */}
                            <div className={`space-y-6 transition-opacity duration-300 ${
                                step !== "input" ? "opacity-50 pointer-events-none" : ""
                            }`}>
                               <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl space-y-8 h-128.75">
                                    <h2 className="text-xl font-bold text-zinc-100 mb-15">Create Your Comic</h2>
                                   <div className="space-y-4 mb-8">
                                        <label className="text-sm text-zinc-400">Title or Topic:</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full  mt-2 mb-6 px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                                            placeholder="e.g., Photosynthesis"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            {genres.map((genre) => (
                                                <button
                                                    key={genre}
                                                    onClick={() => setSelectedGenre(genre)}
                                                    className={`py-2 rounded-lg text-sm border transition-all ${
                                                        selectedGenre === genre
                                                            ? "bg-purple-600 border-purple-400 text-white"
                                                            : "bg-zinc-800 border-transparent text-zinc-400 hover:border-zinc-500"
                                                    }`}
                                                >
                                                    {genre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleGenerateText}
                                        disabled={textLoading || !title}
                                        className="w-full mt-15 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 font-bold text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        {textLoading ? (
                                            <>
                                                <div className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full" />
                                                Generating Story...
                                            </>
                                        ) : (
                                            <>
                                                <FileText size={18} />
                                                Generate Comic
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* RIGHT: Preview */}
                            <div className="space-y-6">
                                {textLoading ? (
                                    <div className="h-128.75 flex items-center justify-center bg-white/5 rounded-2xl border border-dashed border-white/20">
                                        <div className="text-center space-y-4">
                                            <div className="animate-spin size-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
                                            <p className="text-zinc-400">Crafting your story...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <PreviewPanel
                                            comicImage={comicImage}
                                            isLoading={imageLoading}
                                            comicText={comicText}
                                            setComicText={setComicText}
                                            showOnlyText={step !== "preview"}
                                        />

                                        <div className="mt-8 flex justify-center gap-4">
                                            {step === "script" && comicText && (
                                                <div className="flex items-center gap-4">
                                                    {!imageLoading && (
                                                        <button
                                                            onClick={() => setStep("flashcards")}
                                                            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all font-bold"
                                                        >
                                                            Start Learning <ArrowUpRightIcon size={20} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={handleGenerateImage}
                                                        disabled={imageLoading}
                                                        className="flex items-center gap-2 px-8 py-3 bg-purple-600 rounded-xl hover:bg-purple-500 transition-all font-bold shadow-lg shadow-purple-500/20 disabled:opacity-50 text-white"
                                                    >
                                                        {imageLoading ? (
                                                            <>
                                                                <div className="animate-spin size-4 border-2 border-white border-t-transparent rounded-full" />
                                                                Generating Image...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ImageIcon size={20} />
                                                                Generate Comic Image
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}

                                           {step === "preview" && comicImage && (
    <div className="flex items-center gap-4">
        <button
            onClick={() => setStep("flashcards")}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all font-bold"
        >
            Start Learning <ArrowUpRightIcon size={20} />
        </button>

        {hasVisitedFlashcards && (
            <button
                onClick={() => setStep("flashcards")}
                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all font-bold shadow-lg shadow-purple-500/20"
            >
                Continue to Flashcards <ArrowUpRightIcon size={20} />
            </button>
        )}
    </div>
)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Flashcards — save when loaded */}
                    {step === "flashcards" && (
                        <Flashcards
                            topic={title}
                            onComplete={() => setStep("quiz")}
                            onBack={() => {
                              setHasVisitedFlashcards(true);  // ← add this
                         setStep("preview");
                         }}
                            // ✅ Pass save callback — call this inside Flashcards when data loads
                            onDataLoaded={(flashcards: any[]) => saveFlashcards(flashcards)}
                        />
                    )}

                    {/* Quiz — save when loaded */}
                    {step === "quiz" && (
                        <QuizSection
                            topic={comicText}
                            onFinish={(score, questions, answers) => {
                                setFinalScore(score);
                                setSavedQuestions(questions);
                                setSavedAnswers(answers);
                                setStep("feedback");

                                // ✅ Save quiz questions
                                saveQuiz(questions);
                            }}
                            onBack={() => setStep("flashcards")}
                            // ✅ Pass save callback for quiz data
                            onDataLoaded={(quiz: any[]) => saveQuiz(quiz)}
                        />
                    )}

                    {/* Feedback — save when received */}
                    {step === "feedback" && (
                        <QuizFeedback
                            score={finalScore}
                            quizQuestions={savedQuestions}
                            quizAnswers={savedAnswers}
                            selectedIndexes={savedIndexes}
                            onBackToQuiz={() => setStep("quiz")}
                            // ✅ Pass save callback
                            onFeedbackLoaded={(feedback: string) =>
                                saveFeedback(feedback, finalScore, savedQuestions.length)
                            }
                        />
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default Generate;
