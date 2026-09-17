import "@/lib/mongodb/models/Subscription";

import { withMethod } from "@/lib/middlewares/withMethod";
import { withCors } from "@/lib/middlewares/withCors";
import { HttpException } from "@/utils/HttpException";
import { dbConnect } from "@/lib/mongodb/dbConnect";
import User from "@/lib/mongodb/models/User";
import { label } from "@/branding";
import JWT from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET ?? "";

const handler = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new HttpException(label.TokenMissing, 401);
    }

    const decoded = JWT.verify(token, JWT_SECRET) as { id: string };

    await dbConnect();

    const user = await User.findById(decoded.id).select(["-password", "-permissions"]);

    if (user?.subscription) {
      await user.populate({ path: "subscription", options: { strictPopulate: false } })
    }

    if (!user) {
      throw new HttpException(label.UserNotFound, 404);
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(error?.statusCode ?? 500).json({
      success: false,
      status: error?.statusCode ?? 500,
      message: error?.message || label.InternalServerError,
    });
  }
};

export default withCors(withMethod(handler, ['GET']));
