import { ChevronDownIcon, Flex, Heading, Text } from "@radix-ui/themes";
import * as Accordion from "@radix-ui/react-accordion";
import { memo } from "react";

import Container from "../Container";


const Faqs = ({ faqs=[] }: any) => {
  return (
    <>
      {faqs?.length ? (
        <Container className="flex flex-col items-center gap-14 pb-20">
          <Flex direction={"column"} gap={"4"} align={"center"}>
            <Heading as={"h2"} size={"8"} className="text-center text-heading">
              FAQ
            </Heading>
          </Flex>
          <Flex direction={"column"} className="w-full">
            <Accordion.Root type="single" collapsible className="w-full">
              {faqs?.map((item: any, index: number) => (
                <Accordion.Item
                  value={item?.title}
                  key={index}
                  className="border-t py-4"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="flex w-full items-center justify-between text-left text-md font-medium">
                      {item?.title}
                      <ChevronDownIcon className="transition-transform duration-200 AccordionChevron" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="py-2 text-gray-600">
                    <Text size={"2"}>{item?.description}</Text>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Flex>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(Faqs);
