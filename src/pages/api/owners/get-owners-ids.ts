import MineralOwner from "@/lib/mongodb/models/MineralOwner";
import { withMethod } from "@/lib/middlewares/withMethod";
import { NextApiResponse } from "next";
import { label } from "@/branding";


async function handler(req: any, res: NextApiResponse) {
  try {
    const owner = await MineralOwner.find({
      "names.0": { $exists: true },
      "counties.0": { $exists: true },
      "state.code": { $exists: true },
      "state.name": { $exists: true },
    }).select(['_id']).lean();

    return res.status(200).json({ owners: owner.map((o) => o._id), success: true });
  } catch (error: any) {
    return res.status(error?.statusCode ?? 500).json({
      success: false,
      status: error?.statusCode ?? 500,
      message: error?.message || label.InternalServerError,
    });
  }
}

export default withMethod(handler, ["GET"]);
