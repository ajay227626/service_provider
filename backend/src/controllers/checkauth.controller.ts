import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatusCodes } from '../utils/errorCodes';
import Userinfo from '../models/userinfo.models';

export default class CheckauthController {
    static checkauth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const lic_code = req.headers['lic_code'] as string || req.headers['lic-code'] as string;
        const userEmail = req.headers['useremail'] as string || req.headers['user-email'] as string;
        const userMobile = req.headers['user'] as string || req.headers['user-mobile'] as string;
        console.log('License Code:', lic_code);
        console.log('User Email:', userEmail);
        console.log('User Mobile:', userMobile);
        const today = new Date();

        // 🔹 Query using $or for email or mobile
        const foundUser = await Userinfo.findOne({
            $or: [
                { email: userEmail },
                { mobile: userMobile }
            ],
            groupslist: {
                $elemMatch: {
                    groupname: lic_code,
                    $or: [
                        { expirydate: null },
                        { expirydate: { $gte: today } }
                    ]
                }
            }
        });

        if (!foundUser) {
            res.status(401).json({ message: 'Unauthorized or license expired' });
            return;
        }

        // 🔹 Get the specific group for info
        const activeGroup = foundUser.groupslist.find(
            (g) => g.groupname === lic_code && (!g.expirydate || g.expirydate >= today)
        );

        res.status(200).json({
            message: 'License valid',
            user: {
                contactname: foundUser.contactname,
                email: foundUser.email,
                mobile: foundUser.mobile,
                companyname: foundUser.companyname,
                activeGroup
            }
        });
    });
}
