import { Dialog, Flex, Heading, IconButton, Separator, Spinner, Text, } from "@radix-ui/themes";
import { Cross1Icon, LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import React, { Fragment, memo, useCallback, useEffect } from "react";
import { getUser } from "@/context/AuthContext";
import { useQuery } from "@/hooks/useQuery";
import { endpoints } from "@/services/api";
import Link from "next/link";
import _ from "lodash";


type Props = {
  id: string | null;
  setSelectedId: (id: string | null) => void;
};

const OwnerDetails = ({ id, setSelectedId }: Props) => {
  const authContext = getUser();
  const { data, loading, error, request, abort } = useQuery();

  useEffect(() => {
    if (id) {
      request(`${endpoints.ownerDetails}?id=${id}`);
    }
    return () => {
      abort();
    };
  }, [id]);

  const renderFieldsValues = useCallback(() => {
    const a = _.omit(data?.owner, [
      "_id",
      "__v",
      "updatedAt",
      "createdAt",
      "description",
    ]);
    return Object.entries(a).map(([key, value]) => (
      <Fragment key={key}>
        <Text size={"3"} weight={"medium"} mt={"4"}>
          {key === "zipcode" ? (
            "Zip code"
          ) : key === "numbers" ? (
            "Phone numbers"
          ) : (
            <>
              {key[0]?.toUpperCase()}
              {key?.slice(1, key?.length)}
            </>
          )}
        </Text>
        <Separator size={"4"} orientation={"horizontal"} my={"1"} />
        {typeof value === "string" || typeof value === "number" ? (
          <Text size="3" color="gray">
            {value}
          </Text>
        ) : key === "state" ? (
          <Text size="3" color="gray">
            {value?.name}
          </Text>
        ) : key === "names" ? (
          <Flex direction={"column"} gap={"1"}>
            {value?.map((name: string, id: number) => (
              <Text key={id} size="3" color="gray">
                {name}
              </Text>
            ))}
          </Flex>
        ) : key === "emails" ? (
          !authContext?.user || !authContext?.user?.subscription ? (
            <LockedSection user={authContext?.user} />
          ) : authContext?.user && authContext?.user?.subscription ? (
            <MapArray value={value} />
          ) : (
            ""
          )
        ) : key === "numbers" ? (
          !authContext?.user || !authContext?.user?.subscription ? (
            <LockedSection user={authContext?.user} />
          ) : authContext?.user && authContext?.user?.subscription ? (
            <MapArray value={value} />
          ) : (
            ""
          )
        ) : key === "counties" ? (
          <MapArray value={value} />
        ) : key === "addresses" ? (
          <Flex direction={"column"} gap={"1"}>
            {value?.map((addr: string, id: number) => (
              <Text key={id} size="3" color="gray">
                {addr}
              </Text>
            ))}
          </Flex>
        ) : (
          ""
        )}
      </Fragment>
    ));
  }, [data, id]);

  return (
    <Dialog.Root open={id ? true : false}>
      <Dialog.Content className="max-h-[60vh] overflow-y-auto ">
        <Flex direction={"row"} justify={"end"}>
          <IconButton
            size={"1"}
            onClick={() => setSelectedId(null)}
            radius="large"
            className="!bg-primary !outline-none"
          >
            <Cross1Icon height={16} width={16} />
          </IconButton>
          <br />
        </Flex>
        {loading && (
          <Flex className="!min-h-[10vh]" align={"center"} justify={"center"}>
            <Spinner size={"3"} />
          </Flex>
        )}
        {error && (
          <Flex p={"8"} direction={"column"} justify={"center"} gap={"3"}>
            <Heading size={"5"} align={"center"} className="text-heading">
              Unexpected Error :(
            </Heading>
            <Text size={"3"} className="text-center" color="gray">
              An unexpected error occurred while processing your request. Please
              try again later or contact support if the issue persists.
            </Text>
          </Flex>
        )}
        {data && (
          <Flex direction={"column"}>
            <Heading size={"4"} className="!max-w-[90%]">
              {data?.owner?.Name}
            </Heading>
            <Flex direction={"column"} className="mt-4">
              <Flex direction={"column"} className="mt-4">
                {renderFieldsValues()}
                <Text size={"3"} weight={"medium"} mt={"4"}>
                  Description
                </Text>
                <Separator size={"4"} orientation={"horizontal"} my={"1"} />
                <Text size="3" color="gray">
                  {data?.owner?.description}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

type MapArrayProps = {
  value?: string[];
};

const MapArray = memo(({ value }: MapArrayProps) => {
  return (
    <Flex
      direction={"row"}
      align={"center"}
      justify={"start"}
      gap={"1"}
      wrap="wrap"
    >
      {value?.map((county: string, id: number) => (
        <Text key={id} size="3" color="gray">
          {county}
          {value?.length > 1 ? "," : ""}
        </Text>
      ))}
    </Flex>
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
        <Text>
          {!user ? "Login" : !user?.subscription ? "Upgrade plan" : ""}
        </Text>
      </Link>
    </div>
    <span>example@gmail.com</span>
    <span>example@gmail.com</span>
    <span>example@gmail.com</span>
  </div>
));

export default memo(OwnerDetails);
