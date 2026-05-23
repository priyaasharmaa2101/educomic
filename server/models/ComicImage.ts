import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComicImage extends Document {
    userId: string;
    title: string;
    genre: string;
    storyText: string;
    image_url: string;
    prompt_used?: string;
    user_prompt?: string;
    isGenerating?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const ComicImageSchema = new Schema<IComicImage>(
    {
        userId: { type: String, required: true },
        title: { type: String, required: true },
        genre: { type: String, required: true },
        storyText: { type: String, default: "" },
        image_url: { type: String, default: "" },
        prompt_used: { type: String, default: "" },
        user_prompt: { type: String, default: "" },
        isGenerating: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const ComicImage: Model<IComicImage> =
    mongoose.models.ComicImage ||
    mongoose.model<IComicImage>("ComicImage", ComicImageSchema);

export default ComicImage;