import { Router } from 'express';

import userRoutes from './user/userRoutes.js';

const router = Router();


router.use('/', userRoutes);
router.use('/users', userRoutes);


export default router;
