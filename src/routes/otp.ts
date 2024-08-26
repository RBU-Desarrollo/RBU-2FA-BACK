import { Router } from 'express';
import { GET } from '../controllers/auth/otp/controller';

const router = Router();

router.get('/auth/otp', GET);

export default router;
