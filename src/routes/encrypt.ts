import { Router } from 'express';
import { PUT } from '../controllers/encrypt/controller';
import { GET as GET_USUARIO } from '../controllers/encrypt/[id]/controller';

const router = Router();

//router.get('/encrypt', GET);
router.put('/encrypt', PUT);

router.get('/encrypt/:idUsuario', GET_USUARIO);

export default router;
