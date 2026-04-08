import { CircleIcon, DownloadIcon, EyeOpenIcon, LockClosedIcon, PersonIcon, ReloadIcon, } from "@radix-ui/react-icons";
import { Flex, Heading, Select, Table, Text, TextField, Tooltip, } from "@radix-ui/themes";
import { ComposableMap, Geographies, Geography, Marker, } from "react-simple-maps";
import React, { memo, ReactNode, useCallback, useEffect, useState, } from "react";
import { downloadMineralList } from "@/utils/downloadMineralList";
import GetApiErrorMessage from "@/utils/GetApiErrorMessage";
import OwnerDetails from "@/components/OwnerDetails";
import baseApi, { endpoints } from "@/services/api";
import SiteHeader from "@/components/SiteHeader";
import { getUser } from "@/context/AuthContext";
import Container from "@/components/Container";
import { getItem } from "@/utils/Localstorage";
import { useQuery } from "@/hooks/useQuery";
import ReactPaginate from "react-paginate";
import { feature } from "topojson-client";
import Footer from "@/components/Footer";
import toast from "react-simple-toasts";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";


const STATES_TOPO_JSON =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

function Map() {
  const user = getUser()?.user;
  const router = useRouter();
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [statesGeo, setStatesGeo] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [displayedCounties, setDisplayedCounties] = useState<string[]>([]);

  const [countySearch, setCountySearch] = useState("");
  const { request, loading } = useQuery();
  const getMineralsApi = useQuery();

  const getCountiesByState = useCallback(async () => {
    try {
      const res = await request(
        `${endpoints.getCountiesByState}?name=${selectedState}`
      );
      setDisplayedCounties(res.locations);
    } catch (error) {
      setDisplayedCounties([]);
      toast(GetApiErrorMessage(error));
    }
  }, [selectedState]);

  const handleDownload = useCallback(() => {
    try {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const data = getMineralsApi.data?.minerals;

      const headers = Object.keys(data[0]);

      const csvRows = [
        headers.join(","), // Header row
        ...data.map((row: any) =>
          headers
            .map((field) => {
              const value = row[field];

              if (Array.isArray(value)) {
                return `"${value.join("; ")}"`; // Join array values with ;
              }

              if (field === "state" && value?.name && value?.code) {
                return `"${value.name}, ${value.code}"`; // Format state
              }

              return `"${value ?? ""}"`; // Default case
            })
            .join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "minerals.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {}
  }, [getMineralsApi.data?.minerals]);

  useEffect(() => {
    try {
      fetch(STATES_TOPO_JSON)
        .then((res) => res.json())
        .then((topology) => {
          const geo = feature(topology, topology.objects.states) as any;
          setStatesGeo(geo);

          const stateIdMap: Record<string, string> = {};
          for (const feature of geo.features) {
            stateIdMap[feature.id] = feature.properties.name;
          }
        });
    } catch (error) {
      console.log(error, "map data error");
    }
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setDisplayedCounties([]);
      return;
    }
    getCountiesByState();
  }, [selectedState]);

  return (
    <div>
      <Head>
        <title>Owners</title>
      </Head>
      <SiteHeader />
      {!statesGeo && (
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
      {statesGeo && (
        <Container className="my-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="col-span-1 bg-white rounded-xl p-5 shadow-md border relative">
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
                  <Geographies geography={statesGeo}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const name = geo.properties.name;
                        const isSelected = name === selectedState;
                        return (
                          <Tooltip content={name}>
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
            <div className="col-span-1 rounded-xl p-5 shadow-md border bg-white h-fit">
              <Heading size={"4"} className="text-heading">
                Counties
              </Heading>

              <TextField.Root
                className="mt-3"
                placeholder="Search counties"
                radius="large"
                value={countySearch}
                onChange={(e) => setCountySearch(e.target.value)}
              />

              {!selectedState ? (
                <ListEmpty
                  description={`No state selected!\nSelect a state to see the counties.`}
                />
              ) : !loading && displayedCounties?.length ? (
                <ul className="mt-3 min-h-[200px] max-h-[250px] overflow-auto">
                  {displayedCounties
                    ?.filter((item: any) =>
                      item?.name
                        ?.toLowerCase()
                        ?.includes(countySearch?.toLowerCase())
                    )
                    ?.map((item: any, index: number) => (
                      <li
                        onClick={(e) => setSelectedCounty(item?.name)}
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
                    ))}
                </ul>
              ) : (
                <ListEmpty
                  description={
                    loading
                      ? "loading counties..."
                      : `No counties listed below this state!`
                  }
                />
              )}
            </div>

            {/* Owners count */}
          </div>
          <MineralsTable state={selectedCounty ?? ""} />
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
};

const MineralsTable = memo(({ state }: MineralsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const user = getUser()?.user;
  const [isDownloading, setIsDownloading] = useState(false);

  const { request, data, loading } = useQuery(
    `${endpoints.getOwnersByCounty}?name=${state}&page=${currentPage}&limit=${limit}`
  );

  // const updateDownloadLimitApi = useQuery();

  const [selectedMineral, setSelectedMineral] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    if (data?.minerals?.length) {
      try {
        setIsDownloading(true)
        const token = getItem("token");
        const res = await baseApi.get(`${endpoints.updateDownloadLimit}?token=${token}&county=${state}`)
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
        setIsDownloading(false)
      }
    }
  }, [state,data?.minerals,]);

  useEffect(() => {
    if (state?.trim()?.length) {
      request().then((res: any) => {
        if (res?.pagination) {
          setTotalPages(res.pagination.totalPages);
        }
      });
    }
  }, [state, currentPage, limit]);

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
              onClick={() => request()}
            />
            {data?.minerals?.length ? (
              !user || !user?.subscription ? (
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

        {loading ? (
          <ListEmpty>
            <ReloadIcon className="animate-spin" height={20} width={20} />
          </ListEmpty>
        ) : data?.minerals?.length ? (
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
                {data.minerals.map((item: any, index: number) => (
                  <Table.Row key={index}>
                    {/* Names */}
                    <Table.Cell>
                      <div className="flex flex-col">
                        {item?.names?.map((name: string, i: number) => (
                          <span key={i}>{name}</span>
                        ))}
                      </div>
                    </Table.Cell>

                    {/* Emails */}
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

                    {/* Phone numbers */}
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

                    {/* Addresses */}
                    <Table.Cell className="!w-[300px]">
                      <div className="flex flex-col">
                        {item?.addresses?.map((addr: string, i: number) => (
                          <span key={i}>{addr}</span>
                        ))}
                      </div>
                    </Table.Cell>

                    {/* State */}
                    <Table.Cell>{item?.state?.name}</Table.Cell>

                    {/* Counties */}
                    <Table.Cell>{item?.counties?.join(", ")}</Table.Cell>


                    <Table.Cell>{item?.city ? item?.city : "-"}</Table.Cell>

                    {/* Zipcode */}
                    <Table.Cell>{item?.zipcode}</Table.Cell>

                    {/* Action */}
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
      {totalPages > 1 && (
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
            pageCount={totalPages}
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
        <Select.Item value="60">60</Select.Item>
        <Select.Item value="70">70</Select.Item>
        <Select.Item value="80">80</Select.Item>
        <Select.Item value="90">90</Select.Item>
        <Select.Item value="100">100</Select.Item>
        <Select.Item value="200">200</Select.Item>
        <Select.Item value="300">300</Select.Item>
        <Select.Item value="400">400</Select.Item>
        <Select.Item value="500">500</Select.Item>
      </Select.Content>
    </Select.Root>
  );
});

export default Map;
