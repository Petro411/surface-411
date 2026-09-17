"use client";

import Container from "@/components/Container";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SiteHeader from "@/components/SiteHeader";
import baseApi, { endpoints } from "@/services/api";
import { getItem } from "@/utils/Localstorage";
import { Flex, Heading, Separator, Text } from "@radix-ui/themes";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { label } from "@/branding";
import SeoHeadPricing from "@/components/seo/pricing.meta";
import Link from "next/link";

const Pricing = ({ plans }: any) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubscribe = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <>
      <SeoHeadPricing plans={plans} />
      <SiteHeader />
      <PageHeader title="Pricing" description={label.SubscriptionPageDesc} />
      <Container>
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5">
          {plans?.map((item: any, index: number) => (
            <Flex
              key={index}
              direction={"column"}
              className={`min-h-[20vh] border rounded-xl p-6 ${
                item?.recommended ? "bg-blue-500/5 border-yellow" : ""
              }`}
            >
              <Heading as="h2" size={"4"} align={"left"} className="mb-5">
                {item?.title}
              </Heading>
              <Heading as="h3" size={"8"} align={"left"} className="mb-2">
                ${item?.amount}
              </Heading>
              <Heading as="h4" size={"3"} color="gray" align={"left"}>
                {item?.subtitle}
              </Heading>

              {/* Stripe button (always shown) */}
              <button
                onClick={handleSubscribe}
                className={`!mt-5 !border rounded-xl py-3 !border-primary ${
                  item?.recommended
                    ? "!bg-primary !text-white"
                    : "!bg-transparent !text-black hover:!bg-primary hover:!text-white"
                }`}
              >
                Buy
              </button>

              <Heading as="h5" size={"3"} color="gray" className="mt-5 mb-1">
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

              <Text as="p" size={"3"} color="gray" className="mt-3">
                {item?.description}
              </Text>
            </Flex>
          ))}
          <Flex
            direction={"column"}
            className={`h-fit border rounded-xl p-6`}
          >
            <Heading as="h2" size={"4"} align={"left"} className="mb-2">
              Custome Order
            </Heading>
            <Text as="p" size={"3"} color="gray" className="">
              Need something tailored to your specific requirements? Contact us
              with your details and we'll create a custom plan just for you.
            </Text>

            <Link
              href={"/contact"}
              className={`!mt-5 !border rounded-xl py-3 text-center !border-primary !bg-transparent !text-black hover:!bg-primary hover:!text-white`}
            >
              Contact Us
            </Link>
          </Flex>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<any> = async () => {
  try {
    const res = await baseApi.get(endpoints.getPlans);
    return {
      props: {
        plans: res?.data?.plans ?? [],
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        plans: [],
      },
      revalidate: 60,
    };
  }
};

export default Pricing;
