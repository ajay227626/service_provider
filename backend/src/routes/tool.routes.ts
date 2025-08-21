import { Router } from 'express';
import ToolController from '../controllers/tool.controller';

const router = Router();

router.post('/add_tool', ToolController.AddTool);
router.get('/getTools', ToolController.GetTools);
router.put('/update/:toolId', ToolController.updateTool);
router.put('/update/batch', ToolController.updateTool);
router.delete('/delete/:toolId', ToolController.deleteTool);
router.delete('/delete/batch', ToolController.deleteTool);

export default router;
