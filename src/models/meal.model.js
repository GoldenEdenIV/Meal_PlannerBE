import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mealType: { type: String, required: true, enum: ['sáng', 'trưa', 'tối'] },
  calories: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now }, // Để filter và stats theo ngày
}, { timestamps: true });

export default mongoose.model('Meal', MealSchema);