import TextImageColumn from "@/components/TextImageColumn";
import { Flex, Heading, Text } from "@radix-ui/themes";
import OurCompany from "@/components/home/OurCompany";
import baseApi, { endpoints } from "@/services/api";
import SeoHead from "@/components/seo/home.meta";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import { SiteHeader, Footer } from "@/components";
import About from "@/components/home/About";
import Faqs from "@/components/home/Faqs";
import { GetStaticProps } from "next";
import { label } from "@/branding";
import Image from "next/image";


type Props = {
  faqs: any[] | [];
};

const AboutUs = ({ faqs }: Props) => {
  return (
    <>
      <SeoHead
        title="About Petro411 | Mineral Owner Data for Landmen"
        description="Petro411 is built by landmen, for landmen — delivering accurate, verified mineral owner contact data to power faster, smarter land acquisition."
        url="https://www.petro411.com/about"
        faqs={faqs}
      />
      <SiteHeader />
      <PageHeader title="About Us" description={label.AboutUsPageSecOneDes} />
      <Flex direction={"column"} gap={"9"} className="pt-20">
        <About />
        <TextImageColumn
          imageFirst={true}
          title="Our Mission"
          image="/industries/land-3.jpg"
          text1={label.AboutUsPageSecTwoTextOne}
          text2={label.AboutUsPageSecTwoTextTwo}
        />
        <OurCompany />
        <Container className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gradientBg p-8 sm:p-16 2xl:p-20 rounded-xl gap-12 2xl:gap-0">
            <div className="flex flex-col gap-8 text-white">
              <Heading as="h2" size={"8"}>{label.OurVision}</Heading>
              <Flex direction={"column"} gap={"4"}>
                <Text as="p" size={"3"}>{label.OurVisionDes}</Text>
              </Flex>
            </div>
            <div className={`flex flex-row justify-center lg:justify-end`}>
              <Image
                alt="Our Vision - Petro411"
                src={"/industries/land-6.png"}
                height={450}
                width={450}
                className="rounded-lg overflow-x-hidden"
              />
            </div>
          </div>
        </Container>

        <Faqs faqs={faqs} />
      </Flex>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<any> = async () => {
  try {
    const res = await baseApi.get(endpoints.getFaqs);
    return {
      props: {
        faqs: res?.data?.faqs ?? [],
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        faqs: [],
      },
      revalidate: 60,
    };
  }
};

export default AboutUs;
