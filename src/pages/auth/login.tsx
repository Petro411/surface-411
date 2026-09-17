import { Button, Flex, Separator, Text, TextField } from "@radix-ui/themes";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import GetApiErrorMessage from "@/utils/GetApiErrorMessage";
import { ChangeEvent, useEffect, useState } from "react";
import GoogleAuth from "@/components/auth/GoogleAuth";
import AuthLayout from "@/components/auth/AuthLayout";
import SeoHeadAuth from "@/components/seo/auth.meta";
import { useMutation } from "@/hooks/useMutation";
import { setItem } from "@/utils/Localstorage";
import { endpoints } from "@/services/api";
import { GetServerSideProps } from "next";
import toast from "react-simple-toasts";
import { useRouter } from "next/router";
import withApp from "@/utils/withApp";
import { setCookie } from "nookies";
import { label } from "@/branding";
import Link from "next/link";


const Login = () => {
  const router = useRouter();
  const { request, loading } = useMutation(endpoints.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [secureText, setSecureText] = useState(false);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setForm((pre) => ({ ...pre, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const res = await request(form);
      setItem("token", res.token);
      setCookie(null, "token", res?.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      router.push("/profile");
    } catch (error: any) {
      console.log(error);
      toast(GetApiErrorMessage(error));
    }
  };

  useEffect(() => {
    router.prefetch("/profile");
  }, []);

  return (
    <>
     <SeoHeadAuth page="login" />
      <AuthLayout title={label.Login}>
        <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
          <TextField.Root
            placeholder={label.EmailAddress}
            name="email"
            value={form.email}
            onChange={handleOnChange}
            required={true}
            radius="large"
            inputMode="email"
            type="email"
          />
          <TextField.Root
            placeholder={label.Password}
            radius="large"
            minLength={6}
            className="!flex-row-reverse passwordInput"
            name="password"
            inputMode="text"
            value={form.password}
            onChange={handleOnChange}
            required={true}
            type={secureText ? "password" : "text"}
          >
            <TextField.Slot onClick={() => setSecureText(!secureText)}>
              {secureText ? (
                <EyeOpenIcon
                  height={"20"}
                  width={"20"}
                  className="!cursor-pointer"
                />
              ) : (
                <EyeClosedIcon
                  height={"20"}
                  width={"20"}
                  className="!cursor-pointer"
                />
              )}
            </TextField.Slot>
          </TextField.Root>
          <Link href={"/auth/forget-password"} className="text-end">
            <Text
              size={"2"}
              className="!text-primary underline"
              align={"right"}
            >
              {label.ForgetPassword}
            </Text>
          </Link>
          <Button
            className="!mt-2 !bg-btnPrimary hover:!bg-btnHover"
            size={"4"}
            type="submit"
            disabled={loading}
            loading={loading}
          >
            <Text className="!text-white" size={"3"}>
              {label.Login}
            </Text>
          </Button>
        </form>
        <Flex direction={"row"} align={"center"} gap={"5"} py={"6"}>
          <Separator size={"4"} />
          <Text>OR</Text>
          <Separator size={"4"} />
        </Flex>

        <Flex className="flex flex-col xl:flex-row xl:items-center" gap={"3"}>
          <GoogleAuth title={label.LoginWithGoogle} />
        </Flex>

        <Flex direction={"row"} align={"center"} justify={"center"} pt={"5"}>
          <Text size={"3"} color="gray">
            {label.DontHaveAccount}{" "}
            <Link href={"/auth/sign-up"} className="text-primary underline">
              {label.SignUp}
            </Link>
          </Text>
        </Flex>
      </AuthLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return withApp(context);
};

export default Login;
