import express from 'express';
import { register, login, getProfile, } from './authController.js';
import upload from '../upload.js'; // นำเข้า middleware สำหรับการอัปโหลด
import { authenticateToken } from './authMiddleware.js'
const router = express.Router();

// เส้นทางสำหรับการลงทะเบียนผู้ใช้ใหม่
router.post('/register',upload.single('profileImage'), register);

// เส้นทางสำหรับการล็อกอินผู้ใช้
router.post('/login', login);

router.get('/getprofile', authenticateToken, getProfile)


export default router;