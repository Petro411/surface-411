import Newsletter from "@/lib/mongodb/models/Newsletter";
import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { withAuth } from "@/lib/middlewares/withAuth";


async function handler(req: any, res: any) {
 try {
    const newsletters = await Newsletter.find({}).select(['-updatedAt','-__v']).lean()
    return res.status(200).json({newsletters,success:true});
 } catch (error:any) {
     return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        })
 }
}
export default withCors(withAuth(withMethod(handler,['GET'])))