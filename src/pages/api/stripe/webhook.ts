import { buildOrganizationSubscription } from "@/lib/stripe/build-organization-subscription";
import Subscription from "@/lib/mongodb/models/Subscription";
import { withMethod } from "@/lib/middlewares/withMethod";
import { dbConnect } from "@/lib/mongodb/dbConnect";
import User from "@/lib/mongodb/models/User";
import Plan from "@/lib/mongodb/models/Plan";
import { NextApiResponse } from "next";
import getRawBody from 'raw-body';
import Stripe from "stripe";


const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

enum StripeWebhooks {
    AsyncPaymentSuccess = 'checkout.session.async_payment_succeeded',
    Completed = 'checkout.session.completed',
    AsyncPaymentFailed = 'checkout.session.async_payment_failed',
    SubscriptionDeleted = 'customer.subscription.deleted',
    SubscriptionUpdated = 'customer.subscription.updated',
}

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const siteUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SITE_URL : 'http://localhost:3000';
export const config = {
    api: {
        bodyParser: false,
    },
};


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

const webhookSecret = process.env.NODE_ENV === "development" ? process.env.STRIPE_WEBHOOK_SECRET : process.env.STRIPE_WEBHOOK_SECRET_LIVE
const webhookSecretKey = webhookSecret ?? "";


async function handler(
    req: any,
    res: NextApiResponse
) {

    try {

        const signature = req.headers[STRIPE_SIGNATURE_HEADER];
        const rawBody = await getRawBody(req);
        const event = await stripe.webhooks.constructEvent(rawBody, signature, webhookSecretKey);
        await dbConnect();

        switch (event.type) {
            case StripeWebhooks.Completed: {
                const session = event.data.object as Stripe.Checkout.Session;
                const subscriptionId = session.subscription as string;
                const subscription = await stripe.subscriptions.retrieve(
                    subscriptionId
                );

                await onCheckoutCompleted(session, subscription);
                break;
            }

            case StripeWebhooks.AsyncPaymentSuccess: {
                const session = event.data.object as Stripe.Checkout.Session;
                const subscriptionId = session.subscription as string;

                if (!subscriptionId) {
                    console.error("No subscriptionId found in session:", session.id);
                    break;
                }

                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                await onSubscriptionUpdated(session, subscription);
                break;
            }

            case StripeWebhooks.SubscriptionDeleted: {
                const subscription = event.data.object as Stripe.Subscription;

                await Subscription.findOneAndUpdate(
                    { subscriptionId: subscription.id },
                    {
                        status: "canceled",
                        canceled_at: subscription.canceled_at || Date.now(),
                        ended_at: subscription.ended_at || Date.now(),
                    }
                );

                break;
            }

            case StripeWebhooks.SubscriptionUpdated: {
                const session = event.data.object as Stripe.Subscription;
                const subscriptionId = session.items?.data[0]?.subscription;
                const subscription = await stripe.subscriptions.retrieve(
                    subscriptionId
                );

                await onSubscriptionUpdated(session, subscription);

                break;
            }
        }

        res.status(200).send({ success: true });



    } catch (error: any) {
        // console.log(error)
        return res.status(error?.statusCode ?? 500).json({
            message: error?.message,
            success: false,
            status: error?.statusCode ?? 500
        })
        // res.redirect([`${siteUrl}/subscription`, 'error=true'].join("?"));

    }

}

export default withMethod(handler, ['POST']);


//yahn pr plane subscription se id le k yahn object ma download limit add karna hai
async function onCheckoutCompleted(
    session: Stripe.Checkout.Session,
    subscription: Stripe.Subscription
) {
    const userId = session.client_reference_id as string;
    const customerId = session.customer as string;
    const status = getOrderStatus(session.payment_status);

    // Get the plan details to get the download limit
    const lineItem = subscription.items.data[0];
    const priceId = lineItem.price.id;
    let downloadLimit = 0;
    try {
        const plan = await Plan.findOne({ priceId });
        downloadLimit = plan?.downloadLimit || 0;
    } catch (error) {
        console.log("Error fetching plan for download limit:", error);
    }

    const subscriptionData = buildOrganizationSubscription({
        ...subscription,
        userId,
        monthlyDownloadLimit: downloadLimit.toString()
    }, status);

    const userSubscription = await Subscription.create(subscriptionData);
    await User.findByIdAndUpdate(userId, {
        subscription: userSubscription._id,
        customer_id: customerId,
        isOnboarded: true
    })
};

async function onSubscriptionUpdated(
    session: any,
    subscription: Stripe.Subscription
) {
    try {


        const customerId = session.customer as string;
        const status = getOrderStatus(session.payment_status);

        const lineItem = subscription.items.data[0];
        const priceId = lineItem.price.id;

        let downloadLimit = 0;

        const plan = await Plan.findOne({ priceId });
        downloadLimit = plan?.downloadLimit || 0;


        const user = await User.findOne({ customer_id: customerId });
        const currentSubscription = await Subscription.findById(user?.subscription);

        const newSubscriptionData = await buildOrganizationSubscription({
            ...subscription,
            userId: user?._id,
            monthlyDownloadLimit: downloadLimit?.toString(),
            totalDownloads: currentSubscription?.totalDownloads || 0,
            downloadsThisMonth: currentSubscription?.downloadsThisMonth || 0
        }, status);

        await Subscription.findByIdAndUpdate(user?.subscription, newSubscriptionData);
    } catch (error) {
        console.log(error)
    }
};


function getOrderStatus(paymentStatus: string) {
    const isPaid = paymentStatus === 'paid';

    return isPaid
        ? UserPlanStatus.Paid
        : UserPlanStatus.AwaitingPayment;
}

enum UserPlanStatus {
    AwaitingPayment = 'awaitingPayment',
    Paid = 'paid',
}