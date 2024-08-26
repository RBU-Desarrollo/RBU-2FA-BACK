import { Router } from 'express';
import { GET, POST } from '../controllers/auth/controller';

const router = Router();

router.get('/auth', GET);
router.post('/auth', POST);

export default router;
