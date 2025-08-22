import { Router } from 'express';
import UserinfoController from '../controllers/userinfo.controller';

const router = Router();

router.post('/newUser', UserinfoController.newUser);
router.get('/getUser', UserinfoController.getUsers);
router.put('/update/:userId', UserinfoController.updateUser);
router.delete('/delete/:userId', UserinfoController.deleteUser);
router.delete('/delete/batch', UserinfoController.deleteUser);

export default router;
