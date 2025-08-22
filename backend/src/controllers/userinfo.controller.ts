import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatusCodes } from '../utils/errorCodes';
import Userinfo from '../models/userinfo.models';

export default class UserinfoController {
    static newUser = asyncHandler(async (req: Request, res: Response) => {
        const { contactname, email, mobile, companyname, whatsappuser, whatsappapi, address, state, city, pin, gstin, domain, groupslist } = req.body;
        if (!contactname || !email || !mobile || !companyname ) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({
                message: 'All fields are required',
            });
            return;
        }
        if (await Userinfo.findOne({ email }) || await Userinfo.findOne({ mobile })) {
            res.status(HttpStatusCodes.CONFLICT).json({
                message: 'User with this email or mobile number already exists',
            });
            return;
        }
        const newUser = new Userinfo({
            contactname,
            email,
            mobile,
            companyname,
            whatsappuser,
            whatsappapi,
            address,
            state,
            city,
            pin,
            gstin,
            domain,
            groupslist
        });
        await newUser.save();
        res.status(HttpStatusCodes.CREATED).json({
            message: 'New member added successfully',
            user: newUser
        });
    });

    static getUsers = asyncHandler(async (req: Request, res: Response) => {
        const { query } = req.query;

        let filter: any = {};
        if (query) {
            const isNumber = !isNaN(Number(query));

            filter = {
            $or: [
                { contactname: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
                { mobile: { $regex: query, $options: "i" } },
                { companyname: { $regex: query, $options: "i" } },
                { address: { $regex: query, $options: "i" } },
                { state: { $regex: query, $options: "i" } },
                { city: { $regex: query, $options: "i" } },
                { gstin: { $regex: query, $options: "i" } },
                { domain: { $regex: query, $options: "i" } },
                ...(isNumber ? [{ pin: Number(query) }] : []),
            ],
            };
        }

        const userinfos = await Userinfo.find(filter);
        res.status(HttpStatusCodes.OK).json(userinfos);
    });

    static updateUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.userId;
        console.log("Updating groupslist for user:", userId);

        if (!userId) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "User ID is required" });
            return;
        }

        // Get the new group list from body
        const newGroups = req.body.groupslist;
        if (!newGroups || !Array.isArray(newGroups) || newGroups.length === 0) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Valid groupslist array is required" });
            return;
        }

        // Replace old groupslist with newGroups
        const updatedUser = await Userinfo.findByIdAndUpdate(
            { _id: userId },
            { $set: { groupslist: newGroups } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            res.status(HttpStatusCodes.NOT_FOUND).json({ message: "User not found" });
            return;
        }

        res.status(HttpStatusCodes.OK).json({
            message: "Groupslist replaced successfully",
            user: updatedUser,
        });
    });

    static deleteUser = asyncHandler(async (req: Request, res: Response) => {
      const { userId } = req.params;

      // 🔹 Single delete mode
      if (userId && userId !== 'batch') {
        const deletedUser = await Userinfo.findOneAndDelete({ _id: userId });
        if (!deletedUser) {
          res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'User not found' });
          return;
        }

        res.status(HttpStatusCodes.OK).json({
          message: 'User deleted successfully',
          user: deletedUser,
        });
        return;
      }

      // 🔹 Batch delete mode
      const { userIds } = req.body;
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'userIds array is required for batch delete' });
        return;
      }

      const result = await Userinfo.deleteMany({ _id: { $in: userIds } });

      res.status(HttpStatusCodes.OK).json({
        message: 'Batch delete completed',
        deletedCount: result.deletedCount,
        deletedUserIds: userIds,
      });
      return;
    });
}
