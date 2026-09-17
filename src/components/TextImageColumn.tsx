import { Heading, Text } from "@radix-ui/themes";
import { memo, ReactNode } from "react";
import Image from "next/image";

import Container from "./Container";


type Props = {
  title?: string;
  text1?: string;
  text2?: string;
  children?: ReactNode;
  image?: string;
  imageFirst?: boolean;
};

const TextImageColumn = ({
  title,
  text1,
  text2,
  children,
  image,
  imageFirst,
}: Props) => {
  return (
    <Container className="py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        <div
          className={`flex flex-col gap-4 ${
            imageFirst ? "lg:order-2 order-1" : ""
          }`}
        >
          <Heading as="h2" size={"8"} className="!text-heading">{title}</Heading>
          <div className="flex flex-col gap-4 mt-5">
            {children ? (
              children
            ) : (
              <>
                {text1 && (
                  <Text as="p" size={"3"} color="gray">
                    {text1}
                  </Text>
                )}
                {text2 && (
                  <Text as="p" size={"3"} color="gray">
                    {text2}
                  </Text>
                )}
              </>
            )}
          </div>
        </div>
        <div
          className={`flex flex-row justify-center ${
            imageFirst ? "lg:order-1 order-2 lg:justify-start" : "lg:justify-end"
          }`}
        >
          <Image
            alt={title ? `${title} - Petro411` : "Petro411"}
            src={image ? image : "/assets/images/empty-img.jpg"}
            height={450}
            className="rounded-lg overflow-x-hidden"
            width={450}
          />
        </div>
      </div>
    </Container>
  );
};

export default memo(TextImageColumn);
