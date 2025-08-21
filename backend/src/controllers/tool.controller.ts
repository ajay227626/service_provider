import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatusCodes } from '../utils/errorCodes';
import Tool from '../models/tool.models';

export default class ToolController {
  static AddTool = asyncHandler(async (req, res): Promise<void> => {
    const { tools } = req.body; // expect array

    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'Tools array is required' });
      return;
    }

    // Check for duplicates in DB
    const toolIds = tools.map((t) => t.toolId);
    const existingTools = await Tool.find({ toolId: { $in: toolIds } }).lean();
    const existingToolIds = existingTools.map((t) => t.toolId);

    // Filter out duplicates
    const newTools = tools.filter(
      (t) => !existingToolIds.includes(t.toolId)
    );

    if (newTools.length === 0) {
      res
        .status(HttpStatusCodes.CONFLICT)
        .json({ message: 'All tools already exist' });
      return;
    }

    // Insert batch
    const savedTools = await Tool.insertMany(newTools);

    res.status(HttpStatusCodes.CREATED).json({
      message: 'Tools added successfully',
      added: savedTools,
      skipped: existingToolIds,
    });
  });

  // Get Tool_list with optional search query
  static GetTools = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { query } = req.query;

        let filter: any = {};
        if (query) {
          // Agar query string aayi hai to multiple fields me search kare
          filter = {
            $or: [
              { toolId: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { licenseType: { $regex: query, $options: 'i' } },
              { version: { $regex: query, $options: 'i' } },
            ],
          };
        }

        const tools = await Tool.find(filter);
        res.status(HttpStatusCodes.OK).json(tools);
      } catch (error) {
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error fetching tool_list', error });
      }
    },
  );

  static updateTool = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const toolId = req.params.toolId;
    console.log('Updating tool with ID:', toolId);

    // 🔹 SINGLE UPDATE
    if (toolId && toolId !== 'batch') {
      const updateData = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Update data is required' });
        return;
      }

      const updatedTool = await Tool.findOneAndUpdate({ toolId }, updateData, { new: true });
      if (!updatedTool) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Tool not found' });
        return;
      }

      res.status(HttpStatusCodes.OK).json({
        message: 'Tool updated successfully',
        tool: updatedTool,
      });
      return;
    }

    // 🔹 BATCH UPDATE
    const { updates, tools } = req.body;
    const batchData = updates || tools;

    if (!batchData || !Array.isArray(batchData) || batchData.length === 0) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Updates array is required for batch mode' });
      return;
    }

    const results: any[] = [];
    for (const upd of batchData) {
      if (!upd.toolId) continue;
      const updated = await Tool.findOneAndUpdate(
        { toolId: upd.toolId },
        { $set: upd },
        { new: true }
      );
      if (updated) results.push(updated);
    }

    res.status(HttpStatusCodes.OK).json({
      message: 'Batch update completed',
      updatedCount: results.length,
      updatedTools: results,
    });
  });

  static deleteTool = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { toolId } = req.params;

      // 🔹 Single delete mode
      if (toolId && toolId !== 'batch') {
        const deletedTool = await Tool.findOneAndDelete({ toolId });
        if (!deletedTool) {
          res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Tool not found' });
          return;
        }

        res.status(HttpStatusCodes.OK).json({
          message: 'Tool deleted successfully',
          tool: deletedTool,
        });
        return;
      }

      // 🔹 Batch delete mode
      const { toolIds } = req.body;
      if (!toolIds || !Array.isArray(toolIds) || toolIds.length === 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'toolIds array is required for batch delete' });
        return;
      }

      const result = await Tool.deleteMany({ toolId: { $in: toolIds } });

      res.status(HttpStatusCodes.OK).json({
        message: 'Batch delete completed',
        deletedCount: result.deletedCount,
        deletedToolIds: toolIds,
      });

    } catch (error) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting tool(s)', error });
    }
  });
}
