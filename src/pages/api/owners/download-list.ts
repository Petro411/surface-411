import { formateListToCSV } from "@/utils/downloadMineralList";
import Subscription from "@/lib/mongodb/models/Subscription";
import MineralOwner from "@/lib/mongodb/models/MineralOwner";
import { withMethod } from "@/lib/middlewares/withMethod";
import { HttpException } from "@/utils/HttpException";
import { dbConnect } from "@/lib/mongodb/dbConnect";
import User from "@/lib/mongodb/models/User";
import { NextApiResponse } from "next";
import { label } from "@/branding";
import JWT from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET ?? "";

async function handler(req: any, res: NextApiResponse) {
  try {
    const { token, county, state } = req.query;
    if (!token || !county) {
      throw new HttpException("Unauthorized", 401);
    }

    const decoded = JWT.verify(token, JWT_SECRET) as { id: string };

    await dbConnect();

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new HttpException(label.UserNotFound, 404);
    }

    const plan = await Subscription.findById(user?.subscription);

    if (!plan) {
      throw new Error(
        "Please purchase a subscription to download the full list"
      );
    }

    if (plan.expires_at && plan.expires_at < Date.now()) {
      throw new Error(
        "Your subscription has expired. Please renew to continue."
      );
    }

    if (plan.totalDownloads >= plan.monthlyDownloadLimit) {
      throw new Error(
        "You have reached your monthly download limit. Please upgrade or wait for reset."
      );
    }
    const countiesNormalized = county?.replace(/\s*County\s*$/i, "").trim().toLowerCase();
    const list = await MineralOwner.find({
      "state.name": state,
      countiesNormalized
    }).select(['-_id','-__v','-countiesNormalized','-updatedAt','-createdAt']).lean();

    const listLength = await MineralOwner.countDocuments({
      "state.name": state,
      countiesNormalized
    });

    if (!plan?.downloads_list?.find((item:any)=>item?.county?.toLowerCase()=== county?.toLowerCase())) {
      plan.totalDownloads = plan.totalDownloads + 1;
      let currentDownloadsList= plan?.downloads_list || []
      plan.downloads_list=[...currentDownloadsList,{county:county?.toLowerCase(),items_count:listLength}]
      await plan.save();
    }

    const csv = formateListToCSV(list);

    return res.status(200).json({ csv });
  } catch (error: any) {
    return res.status(error?.statusCode ?? 500).json({
      success: false,
      status: error?.statusCode ?? 500,
      message: error?.message || label.InternalServerError,
    });
  }
}

export default withMethod(handler, ["GET"]);
