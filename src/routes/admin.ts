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
import {
  PUT as USER_PUT,
  POST as USER_POST
} from '../controllers/admin/users/route';
import { GET as USER_GET } from '../controllers/admin/users/[rut]/route';
import { DELETE as USER_DELETE } from '../controllers/admin/users/[id]/route';
import { PUT as USER_ACTIVATE_PUT } from '../controllers/admin/users/[id]/activate/route';

const router = Router();

router.get('/admin', GET);

router.post('/admin/systems', SYSTEM_POST);
router.put('/admin/systems', SYSTEM_PUT);
router.delete('/admin/systems/:id', SYSTEM_DELETE);

router.post('/admin/modules', MODULE_POST);
router.put('/admin/modules', MODULE_PUT);
router.delete('/admin/modules/:id', MODULE_DELETE);

router.get('/admin/users/:rut', USER_GET);
router.post('/admin/users', USER_POST);
router.put('/admin/users', USER_PUT);
router.put('/admin/users/:id/activate', USER_ACTIVATE_PUT);
router.delete('/admin/users/:id', USER_DELETE);

export default router;
