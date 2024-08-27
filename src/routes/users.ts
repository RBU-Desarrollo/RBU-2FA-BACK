import { Router } from 'express';
import { GET } from '../controllers/users/[id]/controller';

const router = Router();

router.get('/users/:idUsuario', GET);

export default router;
