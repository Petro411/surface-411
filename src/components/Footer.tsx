import { footerRoutes } from "@/config/FooterRoutes";
import { homeRoutes } from "@/config/HomeRoutes";
import { Text } from "@radix-ui/themes";
import { label } from "@/branding";
import Link from "next/link";

import Container from "./Container";
import Logo from "./Logo";


export const Footer = () => {
  return (
    <>
      <footer className="border-t border-gray-200 pb-8">
        <Container className="grid gap-8 lg:gap-0 grid-cols-1 lg:grid-cols-2 border-b py-8">
          <div className="space-y-4">
            <Logo />
            <Text as={"p"} size={"3"} className="w-full lg:w-10/12">
              {label.SimplifiesLandAcquisition}
            </Text>
          </div>

          <div className="grid gap-8 sm:gap-0 grid-cols-1 sm:grid-cols-2 text-sm">
            <ul className="space-y-2">
              <li className="mb-2">
                <h4 className="text-lg font-medium">Company</h4>
              </li>
              {homeRoutes.map((item, i) => (
                <li key={i}>
                  <Link href={item.path} className="hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              <li className="mb-2">
                <h4 className="text-lg font-medium">Quick Links</h4>
              </li>
              {footerRoutes.map((item, i) => (
                <li key={i}>
                  <Link href={item.path} className="hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
        <div className="pt-8 flex flex-col items-center justify-center">
          <Text as="p" className="px-6 text-sm" align={"center"}>
            {label.CopyRight}
          </Text>
          {/* <Text as="p" className="px-6 text-xs mt-1" align={"center"}>
            Developed by{" "}
            <Link
              href="https://hasnainalam.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Web Developer Portfolio"
              className="underline hover:opacity-80 hover:text-primary"
            >
              Hasnain Alam
            </Link>
          </Text> */}
        </div>
      </footer>
    </>
  );
};

export default Footer;
