import { Router } from "express";
import Generation from "../models/Generation.js";

const router = Router();

// ── CREATE ──
router.post("/create", async (req, res) => {
    try {
        const { userId, title, genre, storyText } = req.body;
        if (!userId || !title) {
            return res.status(400).json({ success: false, message: "userId and title required" });
        }
        const gen = await Generation.create({ userId, title, genre, storyText });
        res.json({ success: true, generationId: gen._id });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── UPDATE IMAGES ──
router.patch("/:id/images", async (req, res) => {
    try {
        const { panelImages } = req.body;
        await Generation.findByIdAndUpdate(req.params.id, { panelImages });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── UPDATE FLASHCARDS ──
router.patch("/:id/flashcards", async (req, res) => {
    try {
        const { flashcards } = req.body;
        await Generation.findByIdAndUpdate(req.params.id, { flashcards });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── UPDATE QUIZ ──
router.patch("/:id/quiz", async (req, res) => {
    try {
        const { quiz } = req.body;
        await Generation.findByIdAndUpdate(req.params.id, { quiz });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── UPDATE FEEDBACK + SCORE ──
router.patch("/:id/feedback", async (req, res) => {
    try {
        const { feedback, score, totalQuestions } = req.body;
        await Generation.findByIdAndUpdate(req.params.id, { feedback, score, totalQuestions });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET ALL (My Generation page) ──
router.get("/user/:userId", async (req, res) => {
    try {
        const gens = await Generation.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .select("-panelImages -storyText -flashcards -quiz -feedback");
        res.json({ success: true, generations: gens });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── GET SINGLE ──
router.get("/:id", async (req, res) => {
    try {
        const gen = await Generation.findById(req.params.id);
        if (!gen) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, generation: gen });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── DELETE ──
router.delete("/:id", async (req, res) => {
    try {
        await Generation.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;