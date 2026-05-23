import { useState } from "react";

const API = "http://localhost:5000/api/generation";

export const useGeneration = (userId: string) => {
    const [generationId, setGenerationId] = useState<string | null>(null);

    // ── Step 1: Call after story is generated ──
    const saveStory = async (title: string, genre: string, storyText: string) => {
        try {
            const res = await fetch(`${API}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, title, genre, storyText }),
            });
            const data = await res.json();
            if (data.success) {
                setGenerationId(data.generationId);
                return data.generationId;
            }
        } catch (err) {
            console.error("saveStory failed:", err);
        }
        return null;
    };

    // ── Step 2: Call after images are generated ──
    const saveImages = async (panelImages: string[], id?: string) => {
        const gid = id || generationId;
        if (!gid) return;
        try {
            await fetch(`${API}/${gid}/images`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ panelImages }),
            });
        } catch (err) {
            console.error("saveImages failed:", err);
        }
    };

    // ── Step 3: Call after flashcards are fetched ──
    const saveFlashcards = async (flashcards: any[], id?: string) => {
        const gid = id || generationId;
        if (!gid) return;
        try {
            await fetch(`${API}/${gid}/flashcards`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ flashcards }),
            });
        } catch (err) {
            console.error("saveFlashcards failed:", err);
        }
    };

    // ── Step 4: Call after quiz is fetched ──
    const saveQuiz = async (quiz: any[], id?: string) => {
        const gid = id || generationId;
        if (!gid) return;
        try {
            await fetch(`${API}/${gid}/quiz`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quiz }),
            });
        } catch (err) {
            console.error("saveQuiz failed:", err);
        }
    };

    // ── Step 5: Call after feedback is received ──
    const saveFeedback = async (
        feedback: string,
        score: number,
        totalQuestions: number,
        id?: string
    ) => {
        const gid = id || generationId;
        if (!gid) return;
        try {
            await fetch(`${API}/${gid}/feedback`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ feedback, score, totalQuestions }),
            });
        } catch (err) {
            console.error("saveFeedback failed:", err);
        }
    };

    return {
        generationId,
        setGenerationId,
        saveStory,
        saveImages,
        saveFlashcards,
        saveQuiz,
        saveFeedback,
    };
};