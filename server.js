import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mealRoutes from './src/routes/meal.routes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/meals', mealRoutes);

app.listen(process.env.PORT, () => console.log(`API on ${process.env.PORT}`));