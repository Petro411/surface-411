import { sortLocations } from "@/utils/sortLocations";
import baseApi, { endpoints } from "@/services/api";
import { Footer, SiteHeader } from "@/components";
import SeoHead from "@/components/seo/home.meta";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import { GetStaticProps } from "next";
import Link from "next/link";


type Props = {
  locations: any[] | [];
};

const StatesAndCounties = ({ locations }: Props) => {
  return (
    <>
      <SeoHead
        title="Browse Mineral Owner Records by State & County | Petro411"
        description="Explore mineral ownership data across the U.S. by state and county. Find accurate, up-to-date mineral owner contact information for land acquisition and oil & gas research on Petro411."
        url="https://www.petro411.com/states-and-counties"
      />
      <SiteHeader />
      <PageHeader
        title="States & Counties"
        description="Select a state to explore its counties and access detailed mineral owner records, including ownership data and verified contact information for individuals and companies across the U.S."
      />
      <Container>
        <div className="grid grid-cols-4 gap-5 py-10">
          {sortLocations(locations)?.map((state, si) => (
            <div key={si} className="">
              <Link href={`/owners?state=${state.code}`} className="group">
                <div className="p-2 bg-primary rounded-lg text-white">
                  <span className="group-hover:underline">{state.name}</span>
                </div>
              </Link>

              <ul className="space-y-1 mt-1">
                {state?.counties?.map((coun: any, ci: number) => (
                  <li key={ci}>
                    <Link
                      href={`/owners?state=${state.code}&county=${coun.name}`}
                      className="hover:underline hover:text-blue"
                    >
                      {coun?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  );
};
export const getStaticProps: GetStaticProps<any> = async () => {
  try {
    const locations = await baseApi.get(endpoints.locationsList);

    return {
      props: {
        locations: locations?.data?.locations ?? [],
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        locations: [],
      },
      revalidate: 60,
    };
  }
};

export default StatesAndCounties;
