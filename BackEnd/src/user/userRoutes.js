import express from 'express';
import upload from '../upload.js';

import { getUserById, updateUser } from '../user/userController.js';


const router = express.Router();

router.get('/:id', getUserById);

// เส้นทางสำหรับอัปเดตข้อมูลผู้ใช้
router.patch('/:id', upload.single('profileImage'), updateUser);  // เมื่อมีการเรียก PATCH /:id ให้เรียกฟังก์ชัน updateUser

export default router;
