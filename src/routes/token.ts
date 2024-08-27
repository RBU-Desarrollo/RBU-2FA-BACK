import { Router } from 'express';
import { GET } from '../controllers/auth/token/controller';

const router = Router();

router.get('/auth/token', GET);

export default router;
