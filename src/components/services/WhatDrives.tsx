import { Flex, Heading, Text } from "@radix-ui/themes";
import React, { memo } from "react";
import { label } from "@/branding";

import Container from "../Container";
import Card from "./Card";


const WhatDrives = () => {
  return (
    <Container>
      <Flex direction={"column"} gap={"4"} align={"center"}>
        <Heading as="h2" size={"8"} className=" text-center text-heading">
          What Drives Us
        </Heading>
        <Text as="p" size={"4"} className=" text-center lg:w-[60%]">
          {label.WhatDrivesUsDesc}
        </Text>
      </Flex>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-20 gap-8 items-center">
        {label.WhatDrivesCards.map((item: any, index: number) => (
          <Card key={index} {...item} />
        ))}
      </div>
    </Container>
  );
};

export default memo(WhatDrives);
