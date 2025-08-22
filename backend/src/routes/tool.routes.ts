import { Router } from 'express';
import ToolController from '../controllers/tool.controller';

const router = Router();

    /**
   * @swagger
   * /api/tools/add_tool:
   *   post:
   *     summary: Add new tools
   *     description: Adds a list of new tools to the database
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               tools:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     toolId:
   *                       type: string
   *                     description:
   *                       type: string
   *                     licenseType:
   *                       type: string
   *                     version:
   *                       type: string
   *     responses:
   *       201:
   *         description: Tools added successfully
   *       400:
   *         description: Bad request
   *       409:
   *         description: Conflict
   */
router.post('/add_tool', ToolController.AddTool);
    /**
   * @swagger
   * /api/tools/getTools:
   *   get:
   *     summary: Get list of tools
   *     description: Retrieves a list of tools with optional search query
   *     parameters:
   *       - in: query
   *         name: query
   *         schema:
   *           type: string
   *         description: Search query to filter tools by toolId, description, licenseType, or version
   *     responses:
   *       200:
   *         description: List of tools retrieved successfully
   *       500:
   *         description: Internal server error
   */
router.get('/getTools', ToolController.GetTools);
    /**
   * @swagger
   * /api/tools/update/:toolId:
   *   put:
   *     summary: Update a tool
   *     description: Updates a tool by its ID
   *     parameters:
   *       - in: path
   *         name: toolId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               description:
   *                 type: string
   *               licenseType:
   *                 type: string
   *               version:
   *                 type: string
   *     responses:
   *       200:
   *         description: Tool updated successfully
   *       400:
   *         description: Bad request
   *       404:
   *         description: Tool not found
   */
router.put('/update/:toolId', ToolController.updateTool);
    /**
     * @swagger
     * /api/tools/update/batch:
     *   put:
     *     summary: Batch update tools
     *     description: Updates multiple tools in batch mode
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               updates:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     toolId:
     *                       type: string
     *                     description:
     *                       type: string
     *                     licenseType:
     *                       type: string
     *                     version:
     *                       type: string
     */
router.put('/update/batch', ToolController.updateTool);
    /**
     * @swagger
     * /api/tools/delete/:toolId:
     *   delete:
     *     summary: Delete a tool
     *     description: Deletes a tool by its ID
     *     parameters:
     *       - in: path
     *         name: toolId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Tool deleted successfully
     *       404:
     *         description: Tool not found
     */
router.delete('/delete/:toolId', ToolController.deleteTool);
    /**
     * @swagger
     * /api/tools/delete/batch:
     *   delete:
     *     summary: Batch delete tools
     *     description: Deletes multiple tools in batch mode
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               toolIds:
     *                 type: array
     *                 items:
     *                   type: string
     */
router.delete('/delete/batch', ToolController.deleteTool);

export default router;
