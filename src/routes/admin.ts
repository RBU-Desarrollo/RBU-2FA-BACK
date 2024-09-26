import { Router } from 'express';
import { GET } from '../controllers/admin/route';
import {
  POST as SYSTEM_POST,
  PUT as SYSTEM_PUT
} from '../controllers/admin/systems/route';
import { DELETE as SYSTEM_DELETE } from '../controllers/admin/systems/[id]/route';
import {
  POST as MODULE_POST,
  PUT as MODULE_PUT
} from '../controllers/admin/modules/route';
import { DELETE as MODULE_DELETE } from '../controllers/admin/modules/[id]/route';

const router = Router();

router.get('/admin', GET);

router.post('/admin/systems', SYSTEM_POST);
router.put('/admin/systems', SYSTEM_PUT);
router.delete('/admin/systems/:id', SYSTEM_DELETE);

router.post('/admin/modules', MODULE_POST);
router.put('/admin/modules', MODULE_PUT);
router.delete('/admin/modules/:id', MODULE_DELETE);

export default router;
