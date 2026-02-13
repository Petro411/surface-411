import { withMethod } from "@/lib/middlewares/withMethod";
import { dbConnect } from "@/lib/mongodb/dbConnect";
import Plan from "@/lib/mongodb/models/Plan";


async function handler(req: any, res: any) {
    try {
        await dbConnect();
        const plans = await Plan.find({}).sort({ amount: 1 });
        return res.status(200).json({ plans, success: true });
    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        })
    }
}
export default withMethod(handler, ['GET'])