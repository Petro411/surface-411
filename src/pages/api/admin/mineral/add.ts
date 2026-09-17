import { withRoleAuth } from "@/lib/middlewares/withRoleAuth";
import MineralOwner from "@/lib/mongodb/models/MineralOwner";
import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { withAuth } from "@/lib/middlewares/withAuth";


const handler = async (req: any, res: any) => {
    try {

        const data = await MineralOwner.create({
            ...req.body,
            countiesNormalized: req.body?.counties.map((c: string) =>
                c.replace(/\s*County\s*$/i, "").trim().toLowerCase()
            )
        });

        return res.status(200).json({
            data,
            success: true
        });
    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        })
    }
};


export default withCors(withAuth(withRoleAuth(withMethod(handler, ['POST']), ['admin'])));
