import { getTemplate } from "@/lib/nodemailer/get-template";
import { withMethod } from "@/lib/middlewares/withMethod";
import { transporter } from "@/lib/nodemailer/transport";
import { HttpException } from "@/utils/HttpException";
import Contact from "@/lib/mongodb/models/Contact";
import { label } from "@/branding";


async function handler(req: any, res: any) {
    try {
        const { name, email, phone, message } = req.body
        if (!name?.trim()?.length || !email?.trim()?.length || !phone?.trim()?.length || !message?.trim()?.length) throw new HttpException(label.AllFieldsReq, 400);

        await Contact.create(req.body);

        await transporter.sendMail({
            to: 'info@petro411.com',
            subject: 'Surface411 Contact Form',
            html: getTemplate('contact', {
                name,
                email,
                phone,
                message,
            }),
        });

        return res.status(200).json({ success: true });
    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        })
    }
}
export default (withMethod(handler, ['POST']))