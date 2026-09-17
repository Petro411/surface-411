import { Flex, Heading, Text } from "@radix-ui/themes";
import React, { memo } from "react";
import { label } from "@/branding";

import MineralOwnerFilter from "../home/MineralOwnerFilter";
import Container from "../Container";


type Props = {
  locations: any[] | [];
};

const WithPetro = ({ locations }: Props) => {
  return (
    <div className="py-24 gradientBg flex flex-col gap-14">
      <Container>
        <Flex direction={"column"} gap={"4"} align={"center"}>
          <Heading as="h2" size={"8"} className="text-white text-center">
            {label.WithBrandName}
          </Heading>
          <Text as="p" size={"4"} className="text-white text-center lg:w-[60%]">
            {label.WithBrandDes}
          </Text>
        </Flex>
      </Container>

      <MineralOwnerFilter
        formClassName="lg:flex-col"
        className="w-full sm:w-10/12 lg:w-5/12 mx-auto p-10 md:py-10"
        locations={locations}
      />
      <Container>
        <Heading as="h3" size={"6"} className="text-white text-center">
          {label.FindTheMineralData}
        </Heading>
      </Container>
    </div>
  );
};

export default memo(WithPetro);
