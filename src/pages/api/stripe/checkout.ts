import { withMethod } from "@/lib/middlewares/withMethod";
import { dbConnect } from "@/lib/mongodb/dbConnect";
import User from "@/lib/mongodb/models/User";
import { NextApiResponse } from "next";
import JWT from "jsonwebtoken";
import Stripe from "stripe";


const JWT_SECRET = process.env.JWT_SECRET ?? "";
const siteUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SITE_URL : 'http://localhost:3000';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});


async function handler(
    req: any,
    res: NextApiResponse
) {

    try {

        const { priceId, token } = req.body;

        if (!token) {
            res.redirect('/auth/login');
        }

        const decoded = JWT.verify(token, JWT_SECRET) as { id: string };

        await dbConnect();

        const user = await User.findById(decoded.id).select(['-password']);

        if (!user) {
            res.redirect('/auth/sign-up');
        }


        const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
            quantity: 1,
            price: priceId,
        };

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [lineItem],
            success_url: `${siteUrl}/profile`,
            cancel_url: `${siteUrl}/profile`,
            payment_method_types: ['card'],
            client_reference_id:user?._id?.toString(),
            metadata: {
                userId: user._id.toString(),
                monthlyDownloadLimit:10
              }
        });

        res.send({session:session.id})

    } catch (error: any) {
        res.redirect([`${siteUrl}/subscription`, 'error=true'].join("?"));
    }

}

export default withMethod(handler, ['POST']);