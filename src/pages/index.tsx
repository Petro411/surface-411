import { MineralOwnersByState, MineralOwnerFilter, Flex } from "@/components";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";
import baseApi, { endpoints } from "@/services/api";
import { Footer, SiteHeader } from "@/components";
import SeoHead from "@/components/seo/home.meta";
import NewsLetter from "@/components/NewsLetter";
import Hero from "@/components/home/Hero";
import Faqs from "@/components/home/Faqs";
import { GetStaticProps } from "next";
import { label } from "@/branding";


type Props = {
  faqs: any[] | [];
  locations: any[] | [];
};

const Home = ({ faqs, locations }: Props) => {
  return (
    <>
      <SeoHead faqs={faqs} />
      <main>
        <SiteHeader />
        <Hero />
        <MineralOwnerFilter
          className="py-10 md:-translate-y-24"
          title={label.SearchMineralOwners}
          paragraph={label.FindMineralOwners}
          dropDownClasses={"w-full lg:w-[180px]"}
          locations={locations}
        />
        <Flex direction={"column"} gap={"9"}>
          <MineralOwnersByState locations={locations} />
          <HowItWorks />
          <Testimonials />
          <NewsLetter />
          <Faqs faqs={faqs} />
        </Flex>
        <Footer />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<any> = async () => {
  try {
    const faqsQuery = await baseApi.get(endpoints.getFaqs);
    const locsQuery = await baseApi.get(endpoints.getLocations);
    return {
      props: {
        faqs: faqsQuery?.data?.faqs ?? [],
        locations: locsQuery?.data?.locations ?? [],
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        faqs: [],
        locations: [],
      },
      revalidate: 60,
    };
  }
};

export default Home;
