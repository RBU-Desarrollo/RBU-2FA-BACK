import { Router } from 'express';
import { GET, PUT } from '../controllers/auth/change-password/controller';

const router = Router();

router.get('/auth/change-password', GET);
router.put('/auth/change-password', PUT);

export default router;
