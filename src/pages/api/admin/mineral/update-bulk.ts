import MineralOwner from "@/lib/mongodb/models/MineralOwner";
import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { withAuth } from "@/lib/middlewares/withAuth";
import { dbConnect } from "@/lib/mongodb/dbConnect";


async function handler(req: any, res: any) {
    try {
        const { skip, limit } = req.query;
        await dbConnect();
        let updatedcounties = await MineralOwner.find({
            "counties.0": { $exists: true },
            "state.code": { $exists: true },
            "state.name": { $exists: true },
            countiesNormalized: { $exists: false }

        }).select(['counties', 'countiesNormalized']).lean().skip(Number(skip)).limit(Number(limit));

        let updates = updatedcounties.map((item) => {
            return {
                ...item,
                countiesNormalized: item?.counties.map((c: string) =>
                    c.replace(/\s*County\s*$/i, "").trim().toLowerCase()
                )
            }
        });

        for (let i = 0; i < updates.length; i++) {
            await MineralOwner.findByIdAndUpdate(updates[i]?._id, {
                countiesNormalized: updates[i].counties.map((c: string) =>
                    c.replace(/\s*County\s*$/i, "").trim().toLowerCase()
                )
            })
        }

        return res.status(200).json({ success: true });
    } catch (error: any) {
        return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        });
    }
}

export default withCors(withAuth(withMethod(handler, ["PUT"])));
