import { formateListToCSV } from "@/utils/downloadMineralList";
import MineralOwner from "@/lib/mongodb/models/MineralOwner";
import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { withAuth } from "@/lib/middlewares/withAuth";
import { dbConnect } from "@/lib/mongodb/dbConnect";
import { label } from "@/branding";


async function handler(req: any, res: any) {
    try {
        const { limit, county, state } = req.query;

        await dbConnect();

        const countiesNormalized = county?.replace(/\s*County\s*$/i, "").trim().toLowerCase();
        const listLength = await MineralOwner.countDocuments({
            "state.name": state,
            countiesNormalized
        });

        if (listLength < 1) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: `No record found in ${county}.`
            });
        }


        const query = MineralOwner.find({
            "state.name": state,
            countiesNormalized
        }).select(['-_id', '-__v', '-countiesNormalized', '-updatedAt', '-createdAt']);

        if (limit && limit !== 'full') {
            const parsedLimit = parseInt(limit as string, 10);
            if (!isNaN(parsedLimit)) {
                query.limit(parsedLimit);
            }
        }

        const list = await query.lean();

        const csv = formateListToCSV(list);

        return res.status(200).json({ csv, total:listLength });
    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            success: false,
            status: error?.statusCode ?? 500,
            message: error?.message || label.InternalServerError,
        });
    }
}

export default withCors(withAuth(withMethod(handler, ["GET"])));

