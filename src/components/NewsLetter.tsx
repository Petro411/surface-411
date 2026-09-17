import { ChangeEvent, FormEvent, memo, useCallback, useState } from "react";
import { Button, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import GetApiErrorMessage from "@/utils/GetApiErrorMessage";
import { useRegisterNewsLetter } from "@/hooks";
import toast from "react-simple-toasts";
import { label } from "@/branding";
import Image from "next/image";

import Container from "./Container";


const NewsLetter = () => {
  const { mutate, isPending } = useRegisterNewsLetter();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((pre) => ({ ...pre, [name]: value }));
    },
    [form]
  );

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        toast("Email registered for newsletter.");
        setForm({ name: "", email: "" });
      },
      onError: (e) => toast(GetApiErrorMessage(e)),
    });
  };

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-2 gradientBg rounded-xl gap-12 2xl:gap-0 overflow-hidden border items-center">
        <div className="flex flex-col gap-8 text-white p-8 sm:p-12 2xl:p-16">
          <Heading as={"h2"} size={"8"}>
            {label.StayInLoop}
          </Heading>
          <Flex direction={"column"} gap={"4"}>
            <Text as={"p"} size={"3"}>
              {label.StayInLoopDes}
            </Text>
          </Flex>
          <form
            className="flex flex-col gap-5 2xl:w-[70%] newsLetterFrom"
            onSubmit={handleOnSubmit}
          >
            <TextField.Root
              name="name"
              minLength={3}
              value={form.name}
              onChange={handleOnChange}
              size={"3"}
              type="text"
              className="!bg-white"
              placeholder="Your name"
            />
            <TextField.Root
              type="email"
              name="email"
              value={form.email}
              onChange={handleOnChange}
              required={true}
              size={"3"}
              className="!bg-white"
              placeholder="Email address"
            />
            <Button
              loading={isPending}
              disabled={isPending}
              className="!self-start !mt-5 !bg-primary !cursor-pointer !text-white hover:!bg-primary group"
              size={"4"}
            >
              <Text size={"3"} className="group-hover:!text-white">
                Submit
              </Text>
            </Button>
          </form>
        </div>
        <div className={`h-full`}>
          <Image
            src={"/assets/images/newsletter.jpg"}
            alt="Petro411 - Stay in the loop with our newsletter"
            className="h-full w-full object-cover"
            height={400}
            width={400}
          />
        </div>
      </div>
    </Container>
  );
};

export default memo(NewsLetter);
