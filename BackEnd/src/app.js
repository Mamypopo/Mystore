import express from 'express';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './user/userRoutes.js';
import authRoutes from './auth/authRoutes.js';
import cartRoutes from './cart/cartRoutes.js';
import productRoutes from './product/productRoutes.js';
import orderRoutes from './order/orderRoutes.js';

import { fileURLToPath } from 'url';

dotenv.config(); // โหลด .env

const app = express(); // สร้าง instance ของ Express
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRoutes);


// ตั้งค่า storage สำหรับ multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // โฟลเดอร์ที่เก็บไฟล์ที่อัพโหลด
    },
    filename: (req, file, cb) => {
      // ตั้งชื่อไฟล์ใหม่โดยใช้ timestamp และนามสกุลไฟล์เดิม
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  // สร้าง instance ของ multer
  const upload = multer({ storage });
  
  app.use(express.json()); // ใช้ middleware สำหรับการจัดการ JSON body
  app.use(express.urlencoded({ extended: true })); // ใช้ middleware สำหรับการจัดการ URL-encoded body
  
  // เสิร์ฟไฟล์ static จากโฟลเดอร์ uploads
  app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));


// ใช้ routes
app.use('/api/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', orderRoutes);



// เสิร์ฟไฟล์ static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const port = process.env.PORT || 8000; // ใช้พอร์ต 8000 หรือพอร์ตที่กำหนดใน .env

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

