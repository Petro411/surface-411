import { ArrowRightIcon, TextAlignRightIcon } from "@radix-ui/react-icons";
import { Avatar, Flex, Text } from "@radix-ui/themes";
import { homeRoutes } from "@/config/HomeRoutes";
import { getUser } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import Link from "next/link";

import Container from "./Container";
import Sidebar from "./Sidebar";
import Logo from "./Logo";


type Props = {
  hideNavigation?: boolean;
  className?: string;
};

const hideRoutes = ["/pricing"];

export const SiteHeader = memo(({ hideNavigation = false, className }: Props) => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;
  const toggleSidebar = () => setVisible(!visible);
  const user = getUser()?.user ?? null;
  const filteredRoutes = (item : any) =>
    user ? !hideRoutes.includes(item.path): item;
  return (
    <>
      <div className={`sticky top-0 py-3 bg-white z-50 shadow ${className}`}>
        <Container>
          <div className="grid  grid-cols-2 lg:grid-cols-12 items-center">
            <div className=" lg:col-span-2">
              <Logo />
            </div>
            {!hideNavigation && (
              <>
                <div className="hidden lg:col-span-8 lg:flex flex-row items-center justify-center gap-10">
                  {homeRoutes.filter(filteredRoutes).map((item, index) => (
                    <Link
                      key={index}
                      href={item.path}
                      className={`
                        hover:text-primary
                        ${
                          pathname === item.path
                            ? "text-primary font-medium"
                            : "text-gray-500"
                        }`}
                    >
                      <Text size={"2"}>{item.name}</Text>
                    </Link>
                  ))}
                </div>
                <div className="lg:col-span-2 flex flex-row justify-end items-center gap-4">
                  {user?.name ? (
                    <>
                    <Flex
                      gap={"3"}
                      className="!cursor-pointer"
                      onClick={() => router.push("/profile")}
                      align={"center"}
                      direction={"row"}
                      as="span"
                    >
                      <Text className="!hidden sm:!block" size={"2"}>
                        {user?.name}
                      </Text>
                      <Avatar
                        radius="full"
                        src={user?.picture}
                        fallback={user?.name[0]?.toUpperCase() ?? "U"}
                        title={user?.name}
                      />
                    </Flex>
                    </>

                  ) : (
                    <>
                      <Link
                        href={"/auth/sign-up"}
                        className="!hidden lg:!block rounded-lg !bg-primary !cursor-pointer !border !border-btnPrimary rt-BaseButton rt-Button rt-r-size-3 py-1.5"
                      >
                        <Text size={"2"} className="!text-white ">
                          Get Started
                        </Text>
                      </Link>
                      <Link
                        href={"/auth/login"}
                        className="!hidden sm:!flex border-2 border-btnPrimary hover:bg-btnPrimary group py-1.5 rt-r-size-3 rt-BaseButton rt-Button"
                      >
                        <Text size={"2"} className="group-hover:!text-white">
                          Login
                        </Text>
                        <ArrowRightIcon
                          height={18}
                          width={18}
                          className="group-hover:!text-white group-hover:!animate-pulse"
                        />
                      </Link>
                    </>
                  )}

                  <button
                    onClick={toggleSidebar}
                    className="block lg:!hidden rounded-lg !bg-yellow !cursor-pointer !border !border-btnPrimary rt-BaseButton rt-Button rt-r-size-3 py-1.5"
                  >
                    <TextAlignRightIcon
                      height={25}
                      width={25}
                      className="text-white"
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
      <Sidebar visible={visible} setVisible={setVisible} />
    </>
  );
});

export default SiteHeader;
