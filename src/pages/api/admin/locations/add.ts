import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { withAuth } from "@/lib/middlewares/withAuth";
import { HttpException } from "@/utils/HttpException";
import Location from "@/lib/mongodb/models/Location";
import { label } from "@/branding";


const handler = async (req: any, res: any) => {
    try {
        const { name, type } = req.body;
        if (!name?.trim() || !type?.trim()) throw new HttpException(label.AllFieldsReq, 400);
        let cleanName: string;
        if (type === 'state') {
            cleanName = name.replace(/\s*State\s*$/i, "").trim();
        }else{
            cleanName = name.replace(/\s*County\s*$/i, "").trim();
        }

        const checkDublicate = await Location.findOne({ name: type === "state" ? { $regex: new RegExp(`^${cleanName}\\s*(state)?$`, 'i') } : { $regex: new RegExp(`^${cleanName}\\s*(County)?$`, 'i') } });

        if (checkDublicate) {
            throw new Error(`${type === "state" ? "State" : "County"} with this name already exists`)
        }

        const location = await Location.create({
            name: req.body?.name?.trim(),
            code: req.body?.code?.trim() || "",
            ...req.body
        });
        return res.status(200).json({ location, success: true });
    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        })
    }
}
export default withCors(withAuth(withMethod(handler, ['POST'])));