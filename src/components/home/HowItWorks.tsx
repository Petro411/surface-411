import { Flex, Heading, Text } from "@radix-ui/themes";
import React, { memo } from "react";
import { label } from "@/branding";

import Container from "../Container";


const HowItWorks = () => {
  return (
    <div className="py-24 gradientBg flex flex-col justify-center">
      <Container className="flex flex-col items-center gap-14">
        <Flex direction={"column"} gap={"4"} align={"center"}>
          <Heading as={"h2"} size={"8"} className="text-white text-center">
            {label.HowItWorks}
          </Heading>
          <Text as={"p"} size={"3"} className="text-white text-center lg:w-[60%]">
            {label.HowItWorksDes}
          </Text>
        </Flex>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-12">
          {label.HowItWorksCards.map((item:any, index:number) => (
            <Flex
              direction={"column"}
              gap={"4"}
              key={index}
              className="p-8 2xl:p-12 rounded-xl bg-gray-700/50 text-white !relative min-h-52"
              position={"relative"}
              align={"center"}
              justify={"center"}
            >
              <span className="text-primary opacity-60 text-7xl 2xl:text-9xl font-bold absolute top-3 left-3">{index + 1}</span>
              <Text as={"p"} className="!z-10 !text-white" size={"3"} weight={"medium"} >
                {item}
              </Text>
            </Flex>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default memo(HowItWorks);
