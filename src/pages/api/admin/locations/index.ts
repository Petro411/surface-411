import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import Location from "@/lib/mongodb/models/Location";
import { dbConnect } from "@/lib/mongodb/dbConnect";


async function handler(req: any, res: any) {
    try {
        let {
            page = 1,
            limit = 10,
        } = req.query;

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const skip = (page - 1) * limit;

        await dbConnect();

        const [locations, total] = await Promise.all([
            Location.find({})
                .skip(skip)
                .limit(limit)
                .sort({name:1})
                .lean(),
            Location.countDocuments({}),
        ]);

        return res.status(200).json({ locations, total, success: true });
    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        })
    }
}
export default withCors(withMethod(handler, ['GET']))