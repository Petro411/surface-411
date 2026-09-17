import MineralOwner from "@/lib/mongodb/models/MineralOwner";
import { withMethod } from "@/lib/middlewares/withMethod";
import { HttpException } from "@/utils/HttpException";
import { NextApiResponse } from "next";
import { label } from "@/branding";


async function handler(req: any, res: NextApiResponse) {
    try {
        const { id } = req.query;
        if (!id) {
            throw new HttpException(label.SomethingWentWrong, 500);
        }
 
        const owner = await MineralOwner.findById(id).lean();

        return res.status(200).json({ owner });

    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            success: false,
            status: error?.statusCode ?? 500,
            message: error?.message || label.InternalServerError,
        });
    }
}

export default withMethod(handler, ['GET']);
