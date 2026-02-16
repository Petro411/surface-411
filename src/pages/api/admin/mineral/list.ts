import MineralOwner from "@/lib/mongodb/models/MineralOwner";
import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { withAuth } from "@/lib/middlewares/withAuth";


async function handler(req: any, res: any) {
  try {
    let {
      page = 1,
      limit = 10,
      name,
      stateName,
      stateCode,
      counties,
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (name) {
      filter.names = { $regex: name, $options: "i" };
    }

    if (stateCode) {
      filter["state.code"] = { $regex: stateCode, $options: "i" };
    }

    if (counties) {
      const countiesArray = Array.isArray(counties)
        ? counties
        : counties.split(",");

      filter.counties = { $in: countiesArray };
    }

    const [minerals, total] = await Promise.all([
      MineralOwner.find(filter)
        .skip(skip)
        .limit(limit)
        .lean(),
      MineralOwner.countDocuments(filter),
    ]);

    return res.status(200).json({
      minerals,
      total,
      page,
      limit,
      success: true,
    });
  } catch (error: any) {
    return res.status(error?.statusCode ?? 500).json({
      message: error?.message,
      success: false,
    });
  }
}

export default withCors(withAuth(withMethod(handler, ["GET"])));
