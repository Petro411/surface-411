import { Button, Flex, Heading, Separator, Text } from "@radix-ui/themes";
import GetApiErrorMessage from "@/utils/GetApiErrorMessage";
import baseApi, { endpoints } from "@/services/api";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import { loadStripe } from "@stripe/stripe-js";
import { getItem } from "@/utils/Localstorage";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import withAuth from "@/utils/withAuth";
import toast from "react-simple-toasts";
import { label } from "@/branding";
import Head from "next/head";


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ""
);

enum SubscriptionStatusQueryParams {
  Success = "success",
  Cancel = "cancel",
  Error = "error",
}

const Subscription = ({ plans }: any) => {
  const checkOutStatus = useSubscriptionStatus();
  const [selectedPrice, setSelectedPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscription = async (id: string) => {
    try {
      setIsLoading(true);
      setSelectedPrice(id);
      const res = await baseApi.post(endpoints.checkout, {
        priceId: id,
        token: getItem("token"),
        returnUrl: getReturnUrl(),
      });
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: res?.data.session });
      setSelectedPrice("");
      setIsLoading(false);
    } catch (error) {
      toast(GetApiErrorMessage(error));
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Subscription</title>
        <meta
        name="robots"
        content={"noindex, nofollow, noarchive, nosnippet"}
      />
      </Head>
      <PageHeader
        title="Subscription"
        description={label.SubscriptionPageDesc}
      />
      {checkOutStatus && <PlansStatusAlert status={checkOutStatus} />}
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 2xl:w-10/12 mx-auto gap-5">
          {plans?.map((item: any, index: number) => (
            <Flex
              key={index}
              direction={"column"}
              className={`min-h-[20vh] border rounded-xl p-6 ${
                item?.recommended ? "bg-blue-500/5 border-yellow" : ""
              }`}
            >
              <Heading size={"4"} align={"left"} className="mb-5">
                {item?.title}
              </Heading>
              <Heading size={"8"} align={"left"} className="mb-2">
                ${item?.amount}
              </Heading>
              <Heading size={"3"} color="gray" align={"left"}>
                {item?.subtitle}
              </Heading>

              <Button
                onClick={() => handleSubscription(item.priceId)}
                disabled={!item.priceId || isLoading}
                loading={isLoading && item.priceId === selectedPrice}
                variant="outline"
                color="yellow"
                size={"4"}
                className={`!mt-5 !rounded-xl py-3 ${
                  item?.recommended
                    ? "!bg-primary !text-white"
                    : "!bg-transparent !text-black hover:!bg-primary hover:!text-white"
                }`}
              >
                <Text size={"3"}>Buy</Text>
              </Button>

              <Heading size={"3"} color="gray" className="mt-5 mb-1">
                Features
              </Heading>
              <Separator className="!w-full mb-2" />

              {item?.features?.map((feat: string, id: number) => (
                <Flex key={id} direction={"row"} align={"center"} gap={"3"}>
                  <Text size={"3"} color="gray">
                    {feat}
                  </Text>
                </Flex>
              ))}

              <Separator className="!w-full mt-2" />

              <Text size={"3"} color="gray" className="mt-3">
                {item?.description}
              </Text>
            </Flex>
          ))}
        </div>
      </Container>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    await withAuth(context);
    const res = await baseApi.get(endpoints.getPlans);
    return {
      props: {
        plans: res?.data?.plans ?? [],
      },
    };
  } catch (error) {
    return {
      props: {
        plans: [],
      },
    };
  }
};

export default Subscription;

function getReturnUrl() {
  return typeof window !== "undefined"
    ? [window.location.origin, window.location.pathname].join("")
    : undefined;
}

function useSubscriptionStatus() {
  const [status, setStatus] = useState<SubscriptionStatusQueryParams>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const error = params.has(SubscriptionStatusQueryParams.Error);
    const canceled = params.has(SubscriptionStatusQueryParams.Cancel);
    const success = params.has(SubscriptionStatusQueryParams.Success);

    if (canceled) {
      setStatus(SubscriptionStatusQueryParams.Cancel);
    } else if (success) {
      setStatus(SubscriptionStatusQueryParams.Success);
    } else if (error) {
      setStatus(SubscriptionStatusQueryParams.Error);
    }
  }, []);

  return status;
}

function PlansStatusAlert({
  status,
}: {
  status: SubscriptionStatusQueryParams;
}) {
  switch (status) {
    case SubscriptionStatusQueryParams.Cancel:
      toast("Checkout was canceled");
      break;
    case SubscriptionStatusQueryParams.Error:
      toast("Something went wrong please tryagain letter.");
      break;
    case SubscriptionStatusQueryParams.Success:
      toast("Successfull");
      break;
  }

  return <></>;
}
