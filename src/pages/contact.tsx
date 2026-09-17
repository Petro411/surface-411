import { Button, Flex, TextArea, TextField } from "@radix-ui/themes";
import { PageHeader, Footer, SiteHeader } from "@/components";
import GetApiErrorMessage from "@/utils/GetApiErrorMessage";
import baseApi, { endpoints } from "@/services/api";
import SeoHead from "@/components/seo/home.meta";
import Container from "@/components/Container";
import Faqs from "@/components/home/Faqs";
import { useSendMessage } from "@/hooks";
import toast from "react-simple-toasts";
import React, { useState } from "react";
import { GetStaticProps } from "next";
import { label } from "@/branding";
import Image from "next/image";


const ContactPage = ({ faqs }: { faqs: any[] | [] }) => {
  const { mutate, isPending } = useSendMessage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        toast("Message submitted!");
        setForm({ name: "", email: "", phone: "", message: "" });
      },
      onError: (error) => toast(GetApiErrorMessage(error)),
    });
  };

  return (
    <>
      <SeoHead
        title="Contact Us | Petro411"
        description="Have questions or need assistance? Reach out to the Petro411 team for support, inquiries, or feedback. We're here to help you with your mineral owner data needs."
        url="https://www.petro411.com/contact"
        faqs={faqs}
        allowIndexing={true}
      />
      <SiteHeader />
      <PageHeader
        title={label.ContactUs}
        description={label.ContactUsDesc}
        className="!min-h-[40vh]"
        containerClassname="!min-h-[40vh]"
      />
      <Container>
        <div className="bg-white border shadow-lg mt-20 p-12 rounded-xl grid grid-cols-2 gap-10">
          <div className="flex flex-col items-center justify-center">
            <Image
              alt=";"
              src={"/industries/contact.png"}
              height={450}
              width={450}
            />
          </div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <TextField.Root
              size="3"
              placeholder="Name"
              required
              name="name"
              type="text"
              minLength={3}
              value={form.name}
              onChange={handleChange}
            />
            <TextField.Root
              size="3"
              type="email"
              placeholder="Email address"
              required
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <TextField.Root
              size="3"
              required
              placeholder="Phone number"
              type="tel"
              name="phone"
              minLength={10}
              value={form.phone}
              onChange={handleChange}
            />
            <TextArea
              size="3"
              required
              placeholder="Message"
              rows={8}
              name="message"
              maxLength={2000}
              value={form.message}
              onChange={handleChange}
            />
            <Button
              loading={isPending}
              disabled={isPending}
              size="3"
              className="!self-start !bg-btnPrimary"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>

      <Flex direction="column" gap="9" className="pt-20">
        <Faqs faqs={faqs} />
      </Flex>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<any> = async () => {
  try {
    const faqsQuery = await baseApi.get(endpoints.getFaqs);
    return {
      props: {
        faqs: faqsQuery?.data?.faqs ?? [],
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        faqs: [],
      },
    };
  }
};

export default ContactPage;
