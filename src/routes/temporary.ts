import { Router } from 'express';
import { PLEASE_WORK } from '../controllers/temporary/controller';

const router = Router();

router.get('/temporary', PLEASE_WORK);

export default router;
