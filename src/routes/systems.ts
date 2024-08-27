import { Router } from 'express';
import { GET } from '../controllers/systems/controller';

const router = Router();

router.get('/systems', GET);

export default router;
