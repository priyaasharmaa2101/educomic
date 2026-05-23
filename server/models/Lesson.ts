// server/models/Lesson.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Interface banayein taaki TS ko pata chale data kaisa dikhega
export interface ILesson extends Document {
  user: mongoose.Types.ObjectId;
  lessonText: string;
  genre: string;
  quizResponse: string;
  createdAt: Date;
}

// 2. Schema define karein[cite: 7]
const lessonSchema: Schema<ILesson> = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // Ye 'User' model se connect karega[cite: 7]
    required: true 
  },
  lessonText: { 
    type: String, 
    required: true 
  },
  genre: { 
    type: String, 
    required: true 
  },
  quizResponse: { 
    type: String, 
    default: "" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 3. Model ko export karein
const Lesson: Model<ILesson> = mongoose.model<ILesson>("Lesson", lessonSchema);
export default Lesson;