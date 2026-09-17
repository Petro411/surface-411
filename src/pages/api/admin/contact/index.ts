import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { withAuth } from "@/lib/middlewares/withAuth";
import Contact from "@/lib/mongodb/models/Contact";


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

        const [contacts, total] = await Promise.all([
            Contact.find({}).select(['-updatedAt', '-__v'])
                .skip(skip)
                .limit(limit)
                .lean(),
            Contact.countDocuments({}),
        ]);

        return res.status(200).json({ contacts, total, success: true });
    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        })
    }
}
export default withCors(withAuth(withMethod(handler, ['GET'])))