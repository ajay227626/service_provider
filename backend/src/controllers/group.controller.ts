import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatusCodes } from '../utils/errorCodes';
import Group from '../models/group.models';

export default class GroupController {
    static AddGroup = asyncHandler(async (req: Request, res: Response) => {
        const { name, subscription_validity, group_validity, alias, tools } = req.body;

        if (!name || !subscription_validity || !group_validity || !alias || !tools) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({
                message: 'All fields are required',
            });
            return;
        }

        if (await Group.findOne({ name }) || await Group.findOne({ alias })) {
            res.status(HttpStatusCodes.CONFLICT).json({
                message: 'Group with this name or alias already exists',
            });
            return;
        }

        const newGroup = new Group({
            name,
            subscription_validity,
            group_validity,
            alias,
            tools,
        });

        await newGroup.save();

        res.status(HttpStatusCodes.CREATED).json({
            message: 'Group created successfully',
            data: newGroup,
        });
    });
    static GetGroups = asyncHandler(async (req: Request, res: Response) => {
        const { query } = req.query;

        let filter: any = {};
        if (query) {
          filter = {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { alias: { $regex: query, $options: 'i' } },
              { tools: { $elemMatch: { toolId: { $regex: query, $options: 'i' } } } },
            ],
          };
        }

        const groups = await Group.find(filter);
        res.status(HttpStatusCodes.OK).json({
            message: 'Groups retrieved successfully',
            data: groups,
        });
    });
    static updateGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { groupId } = req.params;
        const updatedData = req.body;

        if (!updatedData || Object.keys(updatedData).length === 0) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Update data is required' });
            return;
        }

        // Update group
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedGroup) {
            res.status(HttpStatusCodes.NOT_FOUND).json({
                message: 'Group not found',
            });
            return;
        }

        res.status(HttpStatusCodes.OK).json({
            message: 'Group updated successfully',
            data: updatedGroup,
        });
    });
    static deleteGroup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { groupId } = req.params;

        if (groupId && groupId !== "batch") {
            const deletedGroup = await Group.findByIdAndDelete(groupId);
            if (!deletedGroup) {
                res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Group not found' });
                return;
            }

            res.status(HttpStatusCodes.OK).json({
                message: 'Group deleted successfully',
                group: deletedGroup,
            });
            return;
        }

        const { groupsIds } = req.body;
        if (!groupsIds || !Array.isArray(groupsIds) || groupsIds.length === 0) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'groupsIds array is required for batch delete' });
            return;
        }

        const result = await Group.deleteMany({ _id: { $in: groupsIds } });

        res.status(HttpStatusCodes.OK).json({
            message: 'Batch delete completed',
            deletedCount: result.deletedCount,
            deletedGroupIds: groupsIds,
        });
        return;
    });
}