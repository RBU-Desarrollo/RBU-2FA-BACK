import { Router } from 'express';
import { testDatabaseConnection } from '../controllers/test-connection';

const router = Router();

router.get('/test-connection', testDatabaseConnection);

export default router;
