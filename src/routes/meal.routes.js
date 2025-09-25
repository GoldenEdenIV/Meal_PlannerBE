import { Router } from 'express';
import { list, create, update, remove, stats } from '../controllers/meal.controller.js';

const r = Router();

r.get('/', list);          // Lấy danh sách với filter/pagination
r.get('/stats', stats);    // Thống kê tổng calo/ngày
r.post('/', create);       // Tạo mới
r.put('/:id', update);     // Cập nhật
r.delete('/:id', remove);  // Xóa

export default r;