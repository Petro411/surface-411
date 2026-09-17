import { Button, Flex, Separator, Text, TextField } from "@radix-ui/themes";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import React, { ChangeEvent, useEffect, useState } from "react";
import GetApiErrorMessage from "@/utils/GetApiErrorMessage";
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
import Head from "next/head";


const SignUp = () => {
  const router = useRouter();
  const { request, loading } = useMutation(endpoints.signup);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [secureText, setSecureText] = useState(false);

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLButtonElement>
  ) => {
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
      toast(GetApiErrorMessage(error));
    }
  };

  useEffect(() => {
    router.prefetch("/profile");
  }, []);

  return (
    <>
      <SeoHeadAuth page="signup" />
      <AuthLayout title={label.SignUp}>
        <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit}>
          <TextField.Root
            placeholder={label.Name}
            required
            name="name"
            inputMode="text"
            value={form.name}
            onChange={handleOnChange}
            radius="large"
          />
          <TextField.Root
            placeholder={label.EmailAddress}
            required
            type="email"
            inputMode="email"
            name="email"
            value={form.email}
            onChange={handleOnChange}
            radius="large"
          />
          <TextField.Root
            placeholder={label.Password}
            required
            radius="large"
            minLength={6}
            inputMode="text"
            className="!flex-row-reverse passwordInput"
            name="password"
            type={secureText ? "password" : "text"}
            value={form.password}
            onChange={handleOnChange}
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

          <Button
            className="!mt-5 !bg-btnPrimary"
            size={"4"}
            disabled={loading}
            loading={loading}
          >
            <Text className="!text-white" size={"3"}>
              {label.SignUp}
            </Text>
          </Button>
        </form>
        <Flex direction={"row"} align={"center"} gap={"5"} py={"6"}>
          <Separator size={"4"} />
          <Text>OR</Text>
          <Separator size={"4"} />
        </Flex>

        <Flex className="flex flex-col xl:flex-row xl:items-center" gap={"3"}>
          <GoogleAuth title={label.SignUpWithGoogle} />
        </Flex>

        <Flex direction={"row"} align={"center"} justify={"center"} pt={"5"}>
          <Text size={"3"} color="gray">
            {label.AlreadyHaveAccount}{" "}
            <Link href={"/auth/login"} className="text-primary underline">
              {label.Login}
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

export default SignUp;
