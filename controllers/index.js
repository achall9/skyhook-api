import { Router } from 'express';

import AuthRouter from './Auth';
import UserRouter from './Users';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);

export default router;
