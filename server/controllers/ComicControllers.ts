// server/controllers/ComicControllers.ts
import { Request, Response } from 'express';
import Lesson from '../models/Lesson.js';

export const generateComic = async (req: Request, res: Response) => {
    try {
        const { topic, genre } = req.body;
        const userId = req.session?.userId;

        const response = await fetch('http://localhost:8000/generate-comic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lesson_text: topic,
                genre: genre || "educational"
            })
        });

        if (!response.ok) throw new Error(`Python Error: ${response.statusText}`);

        const data = await response.json();

        if (userId) {
            await new Lesson({
                user: userId,
                lessonText: topic,
                genre: genre || "educational",
                quizResponse: data.comic_story
            }).save();
        }

        res.status(200).json({ success: true, story: data.comic_story });

    } catch (error: any) {
        console.error("Story Error:", error.message);
        res.status(500).json({ success: false, message: "AI Service is offline or busy" });
    }
};

export const generateComicImage = async (req: Request, res: Response) => {
    try {
        const { story, genre } = req.body;

        if (!story) {
            res.status(400).json({ success: false, message: "Story is required" });
            return;
        }

        const response = await fetch('http://localhost:8000/generate-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comic_story: story,
                genre: genre || "educational"
            })
        });

        if (!response.ok) throw new Error(`Python Image Error: ${response.statusText}`);

        const data = await response.json();

        res.status(200).json({ success: true, images: data.images });

    } catch (error: any) {
        console.error("Image Error:", error.message);
        res.status(500).json({ success: false, message: "Image generation failed" });
    }
};


export const generateFlashcards = async (req: Request, res: Response) => {
    try {
        const { topic, story } = req.body;

        const response = await fetch('http://localhost:8000/generate-flashcards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                topic, 
                story // Story bhej rahe hain taaki flashcards context-aware hon
            })
        });

        if (!response.ok) throw new Error("AI service failed to generate flashcards");

        const data = await response.json();
        // Umeed hai Python service { flashcards: [{q: '...', a: '...'}, ...] } bhej rahi hai
        res.status(200).json({ success: true, flashcards: data.flashcards });

    } catch (error) {
        console.error("Flashcard Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to load flashcards" });
    }
};