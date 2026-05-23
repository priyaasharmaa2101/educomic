import express from 'express';
import { generateComic,generateComicImage,generateFlashcards } from '../controllers/ComicControllers.js';

const router = express.Router();
// Replace '/main.py' with '/generate'
router.post('/generate', generateComic);
router.post('/generate-image', generateComicImage);
router.post('/generate-flashcards', generateFlashcards);


export default router;