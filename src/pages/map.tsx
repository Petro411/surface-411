import { DownloadIcon, EyeOpenIcon, LockClosedIcon, PersonIcon, ReloadIcon, } from "@radix-ui/react-icons";
import { Flex, Heading, Select, Table, Text, Tooltip } from "@radix-ui/themes";
import { useCountiesByState, useOwnersByCounty, useStatesMap } from "@/hooks";
import { memo, ReactNode, useCallback, useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import GetApiErrorMessage from "@/utils/GetApiErrorMessage";
import OwnerDetails from "@/components/OwnerDetails";
import baseApi, { endpoints } from "@/services/api";
import { Footer, SiteHeader } from "@/components";
import SeoHead from "@/components/seo/home.meta";
import { getUser } from "@/context/AuthContext";
import Container from "@/components/Container";
import { getItem } from "@/utils/Localstorage";
import ReactPaginate from "react-paginate";
import toast from "react-simple-toasts";
import Link from "next/link";


function Map() {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const countiesQuery = useCountiesByState(selectedState || "");
  const statesGeo= useStatesMap();

  return (
    <div>
      <SeoHead
        title="Surface Owners Map | Search by State & County | Surface411"
        description="Explore Petro411's interactive map to find surface owners near you. Select a state, choose a county, and view detailed surface ownership listings instantly."
        url="https://www.petro411.com/map"
      />
      <SiteHeader />
      <div className={`gradientBg text-white`}>
        <Container className="min-h-[40vh] items-center justify-center flex flex-col text-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Surface Owners Map
            {/* {label.YourMineralOwners} */}
          </h1>
          <Text as={"p"} size={"3"} className="w-full md:w-[80%] lg:w-[60%]">
            Select a state on the map to view its counties, then choose a county
            to see the list of surface owners in that area.
            {/* {label.SimplifiesLandAcquisition} */}
          </Text>
        </Container>
      </div>
      {!statesGeo?.data && (
        <Flex
          direction={"column"}
          align={"center"}
          justify={"center"}
          className="min-h-[70vh]"
        >
          <ReloadIcon
            className="animate-spin"
            height={25}
            width={25}
            color="gray"
          />
          <Text size={"3"} color="gray" mt={"3"}>
            Loading...
          </Text>
        </Flex>
      )}
      {statesGeo?.data && (
        <Container className="my-12">
          <div className="flex flex-row gap-8">
            <div className="w-6/12 mx-auto bg-white rounded-xl p-5 shadow-md border relative">
              <div className="flex flex-row items-center justify-between">
                <Heading size={"4"} className="text-heading">
                  Select State
                </Heading>

                {selectedState && (
                  <Text size={"2"} color="gray">
                    {selectedState}
                  </Text>
                )}
              </div>
              <div className="relative">
                <ComposableMap
                  projection="geoAlbersUsa"
                  className=""
                  width={900}
                  height={900}
                >
                  <Geographies geography={statesGeo.data}>
                    {({ geographies }) =>
                      geographies.map((geo,i) => {
                        const name = geo.properties.name;
                        const isSelected = name === selectedState;
                        return (
                          <Tooltip key={i} content={name}>
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onClick={() => {
                                setSelectedState(name);
                              }}
                              style={{
                                default: {
                                  fill: isSelected ? "#2563EB" : "#93C5FD",
                                  outline: "none",
                                },
                                hover: {
                                  fill: "#1E40AF",
                                  outline: "none",
                                },
                                pressed: {
                                  fill: "#1E3A8A",
                                  outline: "none",
                                },
                              }}
                            />
                          </Tooltip>
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </div>
            </div>

            {/* Counties list */}
            {selectedState && (
              <div className="w-6/12 rounded-xl p-5 shadow-md border bg-white h-fit">
                <Heading size={"4"} className="text-heading">
                  Counties
                </Heading>

                {!countiesQuery.isPending &&
                countiesQuery?.data?.locations?.length ? (
                  <ul className="mt-3 min-h-[200px] max-h-[250px] overflow-auto">
                    {countiesQuery?.data?.locations?.map(
                      (item: any, index: number) => (
                        <li
                          onClick={() => setSelectedCounty(item?.name)}
                          key={index}
                          value={item?.name}
                          className={`cursor-pointer   px-3 py-2 rounded-lg text-sm ${
                            selectedCounty === item?.name
                              ? "bg-primary text-white"
                              : "hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200"
                          }`}
                        >
                          {item?.name}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <ListEmpty
                    description={
                      countiesQuery?.isPending
                        ? "loading counties..."
                        : `No counties listed below this state!`
                    }
                  />
                )}
              </div>
            )}

            {/* Owners count */}
          </div>
          {selectedState && selectedCounty && (
            <MineralsTable
              state={selectedState ?? ""}
              county={selectedCounty ?? ""}
            />
          )}
        </Container>
      )}
      <Footer />
    </div>
  );
}

type ListEmptyProps = {
  description?: string;
  children?: ReactNode;
};

const ListEmpty = memo(({ description, children }: ListEmptyProps) => {
  return (
    <Flex
      direction={"column"}
      align={"center"}
      justify={"center"}
      className="min-h-[200px]"
    >
      {description && (
        <Text size={"2"} color="gray" align={"center"}>
          {description}
        </Text>
      )}
      {children && children}
    </Flex>
  );
});

type MineralsTableProps = {
  state: string;
  county: string;
};

const MineralsTable = memo(({ state, county }: MineralsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const user = getUser()?.user;
  const [isDownloading, setIsDownloading] = useState(false);

  const ownersQuery = useOwnersByCounty({
    state,
    county,
    page:currentPage,
    limit
  })

  const [selectedMineral, setSelectedMineral] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    if (ownersQuery?.data?.minerals?.length) {
      try {
        setIsDownloading(true);
        const token = getItem("token");
        const res = await baseApi.get(
          `${endpoints.updateDownloadLimit}?token=${token}&state=${state}&county=${county}`
        );
        const blob = new Blob([res.data?.csv], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast("Mineral list has been downloaded.");
      } catch (error) {
        toast(GetApiErrorMessage(error));
      } finally {
        setIsDownloading(false);
      }
    }
  }, [state, county, ownersQuery?.data?.minerals]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const handleLimitChange = (value: any) => {
    setLimit(Number(value));
    setCurrentPage(1);
  };

  return (
    <>
      <Flex direction={"column"} gap={"2"} mt={"8"}>
        <Flex
          className="border-b"
          direction={"row"}
          align={"center"}
          justify={"between"}
        >
          <h2 className="text-lg font-semibold mb-2">Mineral Owners</h2>
          <Flex
            direction={"row"}
            align={"center"}
            justify={"end"}
            gap={"4"}
            mb={"4"}
          >
            <ReloadIcon
              height={18}
              width={18}
              color="gray"
              className="cursor-pointer"
              onClick={()=>ownersQuery.refetch()}
            />
            {ownersQuery?.data?.minerals?.length ? (
              !user || !user?.subscription
               ? (
                <></>
              ) : (
                <>
                  {isDownloading ? (
                    <ReloadIcon
                      height={18}
                      width={18}
                      color="gray"
                      className="animate-spin ease-in-out duration-300"
                    />
                  ) : (
                    <DownloadIcon
                      className="cursor-pointer"
                      onClick={handleDownload}
                      height={20}
                      width={20}
                      color="gray"
                    />
                  )}
                </>
              )
            ) : null}
          </Flex>
        </Flex>

        {ownersQuery.isPending ? (
          <ListEmpty>
            <ReloadIcon className="animate-spin" height={20} width={20} />
          </ListEmpty>
        ) : ownersQuery?.data?.minerals?.length ? (
          <div className="overflow-x-auto">
            <Table.Root className="min-w-[1200px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Phone numbers</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Address</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>State</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>County</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>City</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Zipcode</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {ownersQuery?.data.minerals.map((item: any, index: number) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <div className="flex flex-col">
                        {item?.names?.map((name: string, i: number) => (
                          <span key={i} className="line-clamp-3">
                            {name}
                          </span>
                        ))}
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      {!user || !user?.subscription ? (
                        <LockedSection user={user} />
                      ) : (
                        <div className="flex flex-col">
                          {item?.emails?.map((email: string, i: number) => (
                            <span key={i}>{email}</span>
                          ))}
                        </div>
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      {!user || !user?.subscription ? (
                        <LockedSection user={user} />
                      ) : (
                        <div className="flex flex-col">
                          {item?.numbers?.map((num: string, i: number) => (
                            <span key={i}>{num}</span>
                          ))}
                        </div>
                      )}
                    </Table.Cell>

                    <Table.Cell className="!w-[300px]">
                      <div className="flex flex-col">
                        {item?.addresses?.map((addr: string, i: number) => (
                          <span key={i}>{addr}</span>
                        ))}
                      </div>
                    </Table.Cell>

                    <Table.Cell>{item?.state?.name}</Table.Cell>

                    <Table.Cell>{item?.counties?.join(", ")}</Table.Cell>

                    <Table.Cell>{item?.city ? item?.city : "-"}</Table.Cell>

                    <Table.Cell>{item?.zipcode}</Table.Cell>

                    <Table.Cell className="w-[30px]">
                      <EyeOpenIcon
                        onClick={() => setSelectedMineral(item?._id)}
                        className="cursor-pointer"
                        height={20}
                        width={20}
                        color="gray"
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        ) : (
          <ListEmpty description="No results found!" />
        )}
      </Flex>
      {ownersQuery?.data?.pagination?.totalPages > 1 && (
        <Flex direction={"row"} align={"center"} justify={"between"} mt={"4"}>
          <NumberOfRows
            value={limit?.toString()}
            onChange={handleLimitChange}
          />
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={ownersQuery?.data?.pagination?.totalPages || 0}
            forcePage={currentPage - 1}
            previousLabel="Prev"
            renderOnZeroPageCount={null}
            containerClassName="flex items-center justify-center gap-2 flex-wrap"
            pageClassName="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            activeClassName="bg-primary text-white border-primary hover:bg-primary"
            previousClassName="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            nextClassName="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            breakClassName="px-4 py-2 text-gray-500"
            marginPagesDisplayed={2}
          />
        </Flex>
      )}

      <OwnerDetails id={selectedMineral} setSelectedId={setSelectedMineral} />
    </>
  );
});
type LockedSectionProps = {
  user: any;
};

const LockedSection = memo(({ user }: LockedSectionProps) => (
  <div className="flex flex-row gap-2 relative overflow-hidden px-2 min-h-10">
    <div className="backdrop-blur-sm absolute top-0 left-0 w-full !h-full flex flex-row items-center justify-center">
      <Link
        href={"/auth/login"}
        className="bg-primary rounded-lg w-fit flex flex-row items-center justify-center gap-2 px-3 py-1.5 text-white"
      >
        {!user ? <PersonIcon /> : !user?.subscription ? <LockClosedIcon /> : ""}
        {/* <Text>
          {!user ? "Login" : !user?.subscription ? "Upgrade plan" : ""}
        </Text> */}
      </Link>
    </div>
    <span>example@gmail.com</span>
  </div>
));

type NumberOfRowsProps = {
  value: string;
  onChange: (val: any) => void;
};
const NumberOfRows = memo(({ value, onChange }: NumberOfRowsProps) => {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="w-[150px]" placeholder="Number of rows" />
      <Select.Content className="w-[150px]">
        <Select.Item value="10">10</Select.Item>
        <Select.Item value="20">20</Select.Item>
        <Select.Item value="30">30</Select.Item>
        <Select.Item value="40">40</Select.Item>
        <Select.Item value="50">50</Select.Item>
      </Select.Content>
    </Select.Root>
  );
});

export default Map;
