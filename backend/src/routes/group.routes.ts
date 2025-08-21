import { Router } from 'express';
import GroupController from '../controllers/group.controller';

const router = Router();

router.post('/add_group', GroupController.AddGroup);
router.get('/getGroups', GroupController.GetGroups);
router.put('/update/:groupId', GroupController.updateGroup);
router.delete('/delete/:groupId', GroupController.deleteGroup);
router.delete('/delete/batch', GroupController.deleteGroup);

export default router;
