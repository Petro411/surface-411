import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { withAuth } from "@/lib/middlewares/withAuth";
import { HttpException } from "@/utils/HttpException";
import Faq from "@/lib/mongodb/models/Faq";
import { label } from "@/branding";


const handler = async (req: any, res: any) => {
    try {
        const {id} = req.query; 
        const { title, description } = req.body;
        if (!title?.trim() || !description?.trim() || !id?.length) throw new HttpException(label.AllFieldsReq, 400);
        const faq = await Faq.findByIdAndUpdate(id, { title, description }, {new:true});
        return res.status(200).json({ faq, success: true });
    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        })
    }
}
export default withCors(withAuth(withMethod(handler, ['PUT'])));