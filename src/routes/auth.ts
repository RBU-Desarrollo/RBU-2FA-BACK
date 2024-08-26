import { Router } from 'express';
import { testDatabaseConnection } from '../controllers/auth';

const router = Router();

router.get('/test', testDatabaseConnection);

export default router;
