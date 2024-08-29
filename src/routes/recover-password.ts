import { Router } from 'express';
import { GET, POST } from '../controllers/auth/recover-password/controller';

const router = Router();

router.get('/auth/recover-password', GET);
router.post('/auth/recover-password', POST);

export default router;
