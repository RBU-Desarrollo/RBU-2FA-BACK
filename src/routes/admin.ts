import { Router } from 'express';
import { GET } from '../controllers/admin/route';
import { POST, PUT } from '../controllers/admin/systems/route';
import { DELETE } from '../controllers/admin/systems/[id]/route';

const router = Router();

router.get('/admin', GET);

router.post('/admin/systems', POST);
router.put('/admin/systems', PUT);
router.delete('/admin/systems/:id', DELETE);

export default router;
