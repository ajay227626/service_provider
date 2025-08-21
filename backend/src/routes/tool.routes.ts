import { Router } from 'express';
import ToolController from '../controllers/tool.controller';

const router = Router();

router.post('/add_tool', ToolController.AddTool);
router.get('/getTools', ToolController.GetTools);
router.put('/tools/:toolId', ToolController.updateTool);
router.put('/tools/batchUpdate', ToolController.updateTool);
router.delete('/tools/:toolId', ToolController.deleteTool);
router.delete('/tools/batchDelete', ToolController.deleteTool);

export default router;
