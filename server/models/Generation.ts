import mongoose from "mongoose";

const FlashcardSchema = new mongoose.Schema({
    question: String,
    answer: String,
});

const QuizSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correct: Number,
});

const GenerationSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, index: true },

        // Core
        title:  { type: String, required: true },
        genre:  { type: String, default: "Superhero" },

        // Step 1 — story
        storyText: { type: String, default: "" },

        // Step 2 — images (base64 strings)
        panelImages: { type: [String], default: [] },

        // Step 3 — flashcards
        flashcards: { type: [FlashcardSchema], default: [] },

        // Step 4 — quiz
        quiz: { type: [QuizSchema], default: [] },

        // Step 5 — result
        feedback:    { type: String,  default: "" },
        score:       { type: Number,  default: null },
        totalQuestions: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("Generation", GenerationSchema);