import MineralOwner from "@/lib/mongodb/models/MineralOwner";
import { withMethod } from "@/lib/middlewares/withMethod";
import { NextApiResponse } from "next";
import { label } from "@/branding";


async function handler(req: any, res: NextApiResponse) {
    try {
        const { name, page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page as string, 10) || 1;
        const limitNum = parseInt(limit as string, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const query: any = {};
        if (name && name.trim().length > 0) {
            query.counties = { $elemMatch: { $regex: new RegExp(`^${name?.replace(/\s*county\s*$/i, "").trim()}(\\s*county)?$`, 'i') } };
        }

         const sanitizedFilter = {
            ...query,
            "counties.0": { $exists: true },
            "state.code": { $exists: true },
            "state.name": { $exists: true },
        };

        const total = await MineralOwner.countDocuments(sanitizedFilter);

        const minerals = await MineralOwner.find(sanitizedFilter)
            .skip(skip)
            .limit(limitNum);

        return res.status(200).json({
            success: true,
            minerals,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            success: false,
            status: error?.statusCode ?? 500,
            message: error?.message || label.InternalServerError,
        });
    }
}

export default withMethod(handler, ['GET']);
