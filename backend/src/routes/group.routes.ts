import { Router } from 'express';
import GroupController from '../controllers/group.controller';

const router = Router();

router.post('/add_group', GroupController.AddGroup);
router.get('/getGroups', GroupController.GetGroups);
router.put('/groups/:groupId', GroupController.updateGroup);
router.delete('/groups/:groupId', GroupController.deleteGroup);
router.delete('/groups/batchDelete', GroupController.deleteGroup);

export default router;
