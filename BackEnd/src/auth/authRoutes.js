import express from 'express';
import { register, login } from './authController.js';

const router = express.Router();

// เส้นทางสำหรับการลงทะเบียนผู้ใช้ใหม่
router.post('/register', register);

// เส้นทางสำหรับการล็อกอินผู้ใช้
router.post('/login', login);

export default router;
