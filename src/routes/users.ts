import { Router } from 'express';
import { GET, PUT } from '../controllers/users/[id]/controller';

const router = Router();

router.get('/users/:idUsuario', GET);
router.put('/users/:idUsuario', PUT);

export default router;
