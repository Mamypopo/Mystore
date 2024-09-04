import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    getProducts,
    getProduct,
    addProduct,
    editProduct,
    deleteProduct,

} from './productController.js';

const router = express.Router();

// ตั้งค่า multer สำหรับการอัพโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(path.resolve(), 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Routes สำหรับสินค้า
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', upload.single('image'), addProduct);
router.put('/:id', upload.single('image'), editProduct);
router.delete('/:id', deleteProduct);

export default router;