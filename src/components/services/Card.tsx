import { Flex, Heading, Text } from "@radix-ui/themes";
import React, { memo } from "react";
import Image from "next/image";


type Props = {
  image?: string;
  title?: string;
  description?: string;
};

const Card = ({ image, title, description }: Props) => {
  return (
    <div className="border p-6 2xl:p-8 rounded-xl flex flex-col gap-5 hover:border-primary transition-all duration-300 h-full">
      <div className="">
        <Image alt="" src={image ?? ""} height={45} width={45} />
      </div>
      <Flex direction={"column"} gap={"1"}>
        <Heading size={"4"} className="text-heading">{title}</Heading>
        <Text size={"2"} color="gray">
          {description}
        </Text>
      </Flex>
    </div>
  );
};

export default memo(Card);
