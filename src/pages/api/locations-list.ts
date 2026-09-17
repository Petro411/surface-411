import { withMethod } from "@/lib/middlewares/withMethod";
import Location from "@/lib/mongodb/models/Location";


async function handler(req: any, res: any) {
    try {
        const locations = await Location.find({})
            .select(['-__v','-createdAt','-updatedAt']).lean();

        return res.status(200).json({ locations, success: true });
    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        });
    }
}

export default withMethod(handler, ['GET']);
