import Meal from '../models/meal.model.js';

// GET /api/meals?mealType=sáng&page=1&limit=10
export const list = async (req, res) => {
  const { mealType, page = 1, limit = 10 } = req.query;
  const query = {};
  if (mealType) query.mealType = mealType;

  const skip = (Number(page) - 1) * Number(limit);
  const items = await Meal.find(query).skip(skip).limit(Number(limit)).sort({ date: -1 });
  const total = await Meal.countDocuments(query);

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
};

// POST /api/meals { name, mealType, calories, date }
export const create = async (req, res) => {
  const { name, mealType, calories, date } = req.body;
  if (!name || !mealType || !calories) return res.status(400).json({ error: 'Missing fields' });

  const meal = new Meal({ name, mealType, calories, date: date ? new Date(date) : new Date() });
  await meal.save();
  res.status(201).json(meal);
};

// PUT /api/meals/:id { name, mealType, calories, date }
export const update = async (req, res) => {
  const { id } = req.params;
  const updated = await Meal.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
};

// DELETE /api/meals/:id
export const remove = async (req, res) => {
  const { id } = req.params;
  await Meal.findByIdAndDelete(id);
  res.status(204).send();
};

// GET /api/meals/stats?date=2025-09-24 (tổng calo theo ngày, nếu không có date thì tất cả ngày)
export const stats = async (req, res) => {
  const { date } = req.query;
  const match = date ? { date: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) } } : {};

  const byDay = await Meal.aggregate([
    { $match: match },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, totalCalories: { $sum: '$calories' } } },
    { $sort: { _id: 1 } }
  ]);

  res.json(byDay);
};