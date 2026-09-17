import { Heading, Text } from "@radix-ui/themes";
import React, { memo } from "react";
import { label } from "@/branding";
import Image from "next/image";

import Container from "../Container";


const OurCompany = () => {
  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        
        <div className="flex flex-col gap-4 order-2 lg:order-1">
          <Heading as="h2" size={"8"} className="text-heading">
            {label.OurCompany}
          </Heading>
          <div className="flex flex-col gap-4 mt-5">
            <Text as="p" size={"3"} color="gray">
            {label.TeamHasTheRequired}
            </Text>
          </div>
        </div>

        <div className="flex flex-row order-1 lg:order-2 justify-center lg:justify-end">
          <Image
            alt="Our Company - Petro411"
            src={"/industries/land-8.png"}
            className="rounded-lg overflow-x-hidden"
            height={450}
            width={450}
          />
        </div>
      </div>
    </Container>
  );
};

export default memo(OurCompany);
