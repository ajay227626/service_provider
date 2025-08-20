import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatusCodes } from '../utils/errorCodes';
import Tool from '../models/tool.models';

export default class ToolController {
  // setTool_list...
  static AddTool = asyncHandler(async (req, res): Promise<void> => {
    const { toolName, testerId } = req.body;
    console.log('14', toolName, 'tester Id', testerId);

    if (!toolName || !testerId) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'toolName and assignTester fields are required' });
      return;
    }

    const existingTool = await Tool.findOne({ toolName }).lean();

    console.log('existingTool', existingTool);

    if (existingTool != null) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: 'Tool already exists' });
      return;
    }

    // Create new user
    const newTool = new Tool({
      toolName,
      testerId,
    });
    let savedTool = await newTool.save();

    res
      .status(HttpStatusCodes.CREATED)
      .json({ message: 'Tool Added successfully', tool: savedTool });
  });

  // Get Tool_list
  static GetTools = asyncHandler(
    async (_: Request, res: Response): Promise<void> => {
      try {
        const tools = await Tool.find();
        res.status(HttpStatusCodes.OK).json(tools);
      } catch (error) {
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error fetching tool_list', error });
      }
    },
  );
}
