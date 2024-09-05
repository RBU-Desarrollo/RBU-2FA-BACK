import { Router } from 'express';
import { GET, POST } from '../controllers/active-token/controller';

const router = Router();

router.get('/active-token', GET);
router.post('/active-token', POST);

export default router;
