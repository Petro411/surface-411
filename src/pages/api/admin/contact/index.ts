import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { withAuth } from "@/lib/middlewares/withAuth";
import Contact from "@/lib/mongodb/models/Contact";


async function handler(req: any, res: any) {
 try {
    const contacts = await Contact.find({})
    return res.status(200).json({contacts,success:true});
 } catch (error:any) {
     return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        })
 }
}
export default withCors(withAuth(withMethod(handler,['GET'])))