import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css";

import { MineralOwnerFilter, Container, SiteHeader, Heading, Text, Footer, MineralOwnerCard, } from "@/components";
import { FreeMode, Navigation } from "swiper/modules";
import baseApi, { endpoints } from "@/services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import SeoHead from "@/components/seo/home.meta";
import ReactPaginate from "react-paginate";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { label } from "@/branding";
import Link from "next/link";
import moment from "moment";


const itemsPerPage = 10;

const Owners = ({
  owners,
  totalPages,
  currentPage,
  locations,
  counties,
  totalItems,
}: any) => {
  const router = useRouter();

  const handleSelectCounty = useCallback(
    (county: string) => {
      const cleanCounty = county.replace(/\s*county\s*$/i, "").trim();
      router.push({
        pathname: "/owners",
        query: { ...router.query, county: cleanCounty },
      });
    },
    [router.query?.county]
  );

  const handlePageClick = useCallback(
    (event: any) => {
      const selectedPage = event.selected + 1;

      router.push({
        pathname: "/owners",
        query: { ...router.query, page: selectedPage },
      });
    },
    [totalPages]
  );

  return (
    <>
      <SeoHead
        title="Search Oil & Gas Well Owners by Name, State & County | Petro411"
        description="Find oil and gas well owners quickly with Petro411's owner search tool. Search by first name, last name, state, or county to locate ownership records across the U.S."
        url="https://www.petro411.com/owners"
      />
      <SiteHeader />
      <div className={`gradientBg text-white`}>
        <Container className="min-h-[60vh] items-center justify-center flex flex-col text-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Search Mineral Search
            {/* {label.YourMineralOwners} */}
          </h1>
          <Text as={"p"} size={"3"} className="w-full md:w-[80%] lg:w-[60%]">
            Search by first name, last name, state, or county to locate
            ownership records across the U.S.
            {/* {label.SimplifiesLandAcquisition} */}
          </Text>
        </Container>
      </div>

      <MineralOwnerFilter
        className="py-10 md:-translate-y-24"
        title={label.SearchMineralOwners}
        paragraph={label.FindMineralOwners}
        dropDownClasses={"w-full lg:w-[180px]"}
        locations={locations}
      />
      <div className="md:-translate-y-12 text-center">
        <Link href={"/map"} className="underline text-center">
          Search through map
        </Link>

        {counties?.length ? (
          <div className="w-10/12 lg:w-9/12 mx-auto py-5 relative county-swiper-wrapper">
            <Swiper
              modules={[FreeMode, Navigation]}
              spaceBetween={16}
              slidesPerView="auto"
              freeMode={true}
              navigation={{
                nextEl: ".county-swiper-next",
                prevEl: ".county-swiper-prev",
              }}
              className="!px-1"
            >
              {counties?.map((item: any, index: number) => (
                <SwiperSlide key={index} style={{ width: "auto" }}>
                  <div
                    onClick={() => handleSelectCounty(item?.name)}
                    className={`px-4 py-2 min-w-56 text-center rounded-full text-sm cursor-pointer whitespace-nowrap border ${
                      item?.name
                        ?.toLowerCase()
                        ?.includes(
                          router?.query?.county?.toString()?.toLowerCase()
                        )
                        ? "bg-primary text-white"
                        : "bg-white"
                    } hover:bg-primary hover:text-white transition-all duration-300`}
                  >
                    {item?.name}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Optional navigation arrows */}
            <button className="county-swiper-prev border absolute -left-12  flex-col items-center justify-center top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full h-10 w-10 hidden lg:flex">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <button className="county-swiper-next border absolute -right-12 flex-col items-center justify-center top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full h-10 w-10 hidden lg:flex">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      <Container className="mb-24">
        {owners?.length ? (
          <Text as="p" size={"2"} color="gray">
            Showing {owners?.length} out of {totalItems}
          </Text>
        ) : (
          ""
        )}
        {!owners?.length ? (
          <Heading
            as="h3"
            className="py-20 text-center text-heading"
            size={"5"}
          >
            No results found!{" "}
          </Heading>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
            {owners?.map((item: any) => (
              <MineralOwnerCard
                key={item._id}
                id={item._id}
                name={item?.names[0] || "Unknown"}
                date={moment(item?.createdAt).format("MMMM DD YYYY")}
              />
            ))}
          </div>
        )}

        {totalPages ? (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            forcePage={currentPage - 1}
            previousLabel="Prev"
            renderOnZeroPageCount={null}
            containerClassName="flex items-center justify-center mt-8 gap-2 flex-wrap"
            pageClassName="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            activeClassName="bg-primary text-white border-primary hover:bg-primary"
            previousClassName="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            nextClassName="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            breakClassName="px-4 py-2 text-gray-500"
          />
        ) : (
          ""
        )}
      </Container>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    name = "",
    ml = "",
    state = "",
    page = "1",
    county = "",
  } = context.query;

  try {
    const res = await baseApi.get(
      `${endpoints.queryOwners}?name=${name}&ml=${ml}&state=${state}&county=${county}&page=${page}&limit=${itemsPerPage}`
    );
    const { owners, totalPages, counties, totalItems } = res.data;
    const locsQuery = await baseApi.get(endpoints.getLocations);

    return {
      props: {
        owners,
        totalPages,
        totalItems,
        currentPage: parseInt(page as string, 10),
        locations: locsQuery?.data?.locations ?? [],
        counties: counties ?? [],
      },
    };
  } catch (error) {
    return {
      props: {
        owners: [],
        totalPages: 0,
        currentPage: 1,
      },
    };
  }
};

export default Owners;
