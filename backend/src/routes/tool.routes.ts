import { Router } from 'express';
import ToolController from '../controllers/tool.controller';

const router = Router();

router.post('/add_tool', ToolController.AddTool);
router.get('/getTools', ToolController.GetTools);

export default router;
