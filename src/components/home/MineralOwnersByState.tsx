import { Flex, Heading, Text } from "@radix-ui/themes";
import React, { memo } from "react";
import { label } from "@/branding";
import Image from "next/image";
import Link from "next/link";

import Container from "../Container";


type Props = {
  locations: any[] | [];
};

export const MineralOwnersByState = memo(({ locations }: Props) => {
  return (
    <Container>
      <Flex direction={"column"} gap={"5"}>
        <Flex direction={"column"} align={"center"} gap={"4"}>
          <Heading as={"h2"} size={"8"} className="text-center text-heading">
            {label.MineralOwnersByState}
          </Heading>
          <Text
            as={"p"}
            size={"3"}
            color="gray"
            className="!w-full lg:!w-[70%] text-center"
          >
            {label.ExploreMineralOwnership}
          </Text>
        </Flex>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-y-5 mt-8">
          {locations?.slice(0, 44)?.map((item, index) => (
            <li key={index} className="text-center 2xl:text-start">
              <Link href={`/owners?state=${item?.code}`}>
                <Text size={"3"} className="text-gray-500 hover:!underline">
                  {item?.name}
                </Text>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={"/map"}
          className="bg-white py-2.5 px-5 text-black border hover:bg-gray-100 border-btnPrimary rounded-lg self-center flex flex-row items-center justify-center gap-4"
        >
          <Image
            src={"/assets/images/us.png"}
            alt="Petro411 - USA flag"
            className="rounded overflow-hidden"
            height={30}
            width={30}
          />
          <Text as={"p"} size="3">
            Map Search
          </Text>
        </Link>
      </Flex>
    </Container>
  );
});

export default MineralOwnersByState;
