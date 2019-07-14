import { Router } from 'express'; 

import { Users } from '../models';

const router = Router();

router.post('/', Users.createUser);
router.get('/', Users.getAllUsers);
router.get('/:id', Users.getUserById);
router.post('/:id', Users.getUserById);

export default router;
