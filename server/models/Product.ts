import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  subtitle: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tagline?: string;
  featured: boolean;
  available: boolean;
  cardBgColor?: string;
  buttonBgColor?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  calories?: string;
  allergens?: string[];
  ingredients?: string[];
  createdAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    tagline: { type: String },
    featured: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    cardBgColor: { type: String },
    buttonBgColor: { type: String },
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 42 },
    tags: [{ type: String }],
    calories: { type: String },
    allergens: [{ type: String }],
    ingredients: [{ type: String }],
  },
  { timestamps: true }
);

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
