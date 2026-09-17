import { Avatar, Flex, Separator, Text } from "@radix-ui/themes";
import GetApiErrorMessage from "@/utils/GetApiErrorMessage";
import { PinLeftIcon } from "@radix-ui/react-icons";
import { deleteItem } from "@/utils/Localstorage";
import { getUser } from "@/context/AuthContext";
import toast from "react-simple-toasts";
import { useRouter } from "next/router";
import { memo, ReactNode } from "react";
import { destroyCookie } from "nookies";

import SiteHeader from "../SiteHeader";
import Container from "../Container";


type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props) => {
  const userContext = getUser();
  const user = userContext?.user ?? null;
  const router = useRouter();
  const handleLogout = async () => {
    try {
      destroyCookie(null, "token", { path: "/" });
      deleteItem("token");
      router.push("/auth/login");
      userContext?.setUser(null);
      toast("You have been logged out.");
    } catch (error) {
      toast(GetApiErrorMessage(error));
    }
  };

  return (
    <>
      <SiteHeader />
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 mt-8 gap-10">
          <div className="overflow-hidden lg:col-span-4 xl:col-span-3 h-fit border rounded-xl md:sticky top-16">
            <Flex
              direction={"row"}
              align={"center"}
              gap={"3"}
              py={"4"}
              px={"3"}
            >
              <Avatar
                size={"4"}
                radius="full"
                fallback={user?.name[0]?.toUpperCase() ?? "U"}
                title={user?.name}
              />
              <Flex direction={"column"}>
                <Text size={"3"} weight={"medium"}>
                  {user?.name}
                </Text>
                <Text size={"1"} className="line-clamp-1">
                  {user?.email}
                </Text>
              </Flex>
            </Flex>

            <Separator size={"4"} orientation={"horizontal"} />
            <button
              onClick={handleLogout}
              className={`outline-none flex flex-row items-center gap-3 py-3 px-3 border-l-[3px] transition-all duration-300
                    border-transparent
                   hover:!text-primary`}
            >
              <PinLeftIcon height={20} width={20} />
              <Text size={"2"}>Logout</Text>
            </button>
          </div>
          <div className="lg:col-span-8 xl:col-span-9 h-fit">{children}</div>
        </div>
      </Container>
    </>
  );
};

export default memo(Layout);
