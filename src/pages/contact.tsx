import { Button, Flex, TextArea, TextField } from "@radix-ui/themes";
import React, { useCallback, useEffect, useState } from "react";
import GetApiErrorMessage from "@/utils/GetApiErrorMessage";
import baseApi, { endpoints } from "@/services/api";
import { useMutation } from "@/hooks/useMutation";
import SiteHeader from "@/components/SiteHeader";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import { useQuery } from "@/hooks/useQuery";
import Faqs from "@/components/home/Faqs";
import Footer from "@/components/Footer";
import toast from "react-simple-toasts";
import { GetStaticProps } from "next";
import { label } from "@/branding";
import Image from "next/image";
import Head from "next/head";


const ContactPage = () => {
  const [faqs, setFaqs] = useState([]);

  const getFaqsApi = useQuery(endpoints.getFaqs);

  const { request, loading } = useMutation(endpoints.contact);

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

    try {
      await request(form);
      toast("Message submitted!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast(GetApiErrorMessage(error));
      console.error("Error submitting form:", error);
    }
  };

  const fetchFaqs = useCallback(async () => {
    try {
      const res = await baseApi.get(endpoints.getFaqs);
      setFaqs(res?.data?.faqs ?? []);
    } catch (error) {}
  }, [faqs]);
  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <>
      <Head>
        <title>Services</title>
      </Head>
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
              loading={loading}
              disabled={loading}
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
        {/* <NewsLetter /> */}
        <Faqs faqs={faqs} />
      </Flex>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<any> = async () => {
  try {
    const res = await baseApi.get(endpoints.getFaqs);
    return {
      props: {},
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

export default ContactPage;
