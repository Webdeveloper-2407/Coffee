import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  author: string;
  role?: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  itemOrdered?: string;
  verified: boolean;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    author: { type: String, required: true },
    role: { type: String },
    avatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: String, required: true },
    comment: { type: String, required: true },
    itemOrdered: { type: String },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ReviewModel = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
