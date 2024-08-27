import { Router } from 'express';
import {
  GET,
  POST,
  PUT
} from '../controllers/auth/recover-password/controller';

const router = Router();

router.get('/auth/recover-password', GET);
router.post('/auth/recover-password', POST);
router.put('/auth/recover-password', PUT);

export default router;
