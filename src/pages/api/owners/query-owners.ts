import MineralOwner from "@/lib/mongodb/models/MineralOwner";
import { withMethod } from "@/lib/middlewares/withMethod";
import Location from "@/lib/mongodb/models/Location";
import { dbConnect } from "@/lib/mongodb/dbConnect";
import { NextApiResponse } from "next";
import { label } from "@/branding";


async function handler(req: any, res: NextApiResponse) {
    await dbConnect(); // ensure DB is connected

    try {
        const { state, name, lName, ml, page = '1', limit = '10', county = '' } = req.query;

        const ownerName = typeof name === "string" ? name.toLowerCase() : '';
        const ownerCity = typeof state === "string" ? state.toLowerCase() : name ? name?.toLowerCase() : '';
        const legalMatch = typeof ml === "string" ? ml.toLowerCase() : '';
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const filter: any = {};
        if (ownerName) {
            filter.names = { $elemMatch: { $regex: new RegExp(ownerName, "i") } };
        }
        if (ownerCity) {
            filter['state.code'] = { $regex: new RegExp(ownerCity, 'i') };
        }
        if (county) {
            const countyName = county.replace(/county/i, '').trim();
            filter.counties = {
                $regex: new RegExp(`^${countyName}\\s*(county)?$`, 'i')
            };
        }

        const sanitizedFilter = {
            ...filter,
            "counties.0": { $exists: true },
            "state.code": { $exists: true },
            "state.name": { $exists: true },
        };

        const [owners, totalItems, counties] = await Promise.all([
            MineralOwner.find(sanitizedFilter).skip(skip).limit(limitNum),
            MineralOwner.countDocuments(sanitizedFilter),
            Location.find({ type: "county", "state.code": { $regex: new RegExp(ownerCity, 'i') } }).sort({ name: 1 })
        ]);

        return res.status(200).json({
            owners,
            currentPage: pageNum,
            totalItems,
            totalPages: Math.ceil(totalItems / limitNum),
            counties: ownerCity?.length ? counties : []
        });

    } catch (error: any) {
        console.log(error)
        return res.status(error?.statusCode ?? 500).json({
            success: false,
            status: error?.statusCode ?? 500,
            message: error?.message || label.InternalServerError,
        });
    }
}

export default withMethod(handler, ['GET']);
