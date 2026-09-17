import { Heading } from "@radix-ui/themes";
import React, { memo } from "react";
import Link from "next/link";

import Container from "../Container";


type Props = {
  children?: React.ReactNode;
  title?: string;
};

const AuthLayout = ({ title, children }: Props) => {
  return (
    <>
      <Container className="z-50 flex flex-col min-h-screen justify-center">
        <div className="bg-white rounded-xl p-5 sm:p-8 w-full sm:w-10/12 md:w-8/12 lg:w-5/12 mx-auto shadow-lg">
          <div className="flex flex-row items-center text-sm gap-1">
            <Link href="/" className="text-blue">
              Home
            </Link>
            /<span>{title}</span>
          </div>
          <Heading as="h1" size={"7"}>
            {title}
          </Heading>
          {children}
        </div>
      </Container>
      <div className="gradientBg fixed top-0 left-0 w-full h-1/2 -z-10" />
    </>
  );
};

export default memo(AuthLayout);
