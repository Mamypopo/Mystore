import express from 'express';
import upload from '../upload.js';
import {
    getProducts,
    getProduct,
    addProduct,
    editProduct,
    deleteProduct,

} from './productController.js';
// import { authenticateToken } from '../auth/authMiddleware.js'

const router = express.Router();



// Routes สำหรับสินค้า
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', upload.single('image'), addProduct);
router.put('/:id', upload.single('image'), editProduct);
router.delete('/:id', deleteProduct);

export default router;