import "swiper/css/pagination";
import "swiper/css";

import { StarFilledIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import React, { memo } from "react";
import { label } from "@/branding";
import Image from "next/image";

import Container from "../Container";


const Testimonials = () => {
  return (
    <Container className="flex flex-col items-center gap-10 py-14">
      <Flex direction={"column"} gap={"4"} align={"center"}>
        <Heading as={"h2"} size={"8"} className="text-center text-heading">
          Testimonials
        </Heading>
      </Flex>
      <Swiper
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        centeredSlides={true}
        modules={[Pagination]}
        breakpoints={{
          400: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
        className=""
      >
        {label.Testimonials.map((item: any, index: number) => (
          <SwiperSlide key={index} className="px-2 sm:px-5 pb-14">
            <div className="border p-6 sm:p-10 border-gray-100 shadow-lg rounded-xl min-h-[38vh] gap-8 flex flex-col">
              <Flex direction={"column"} gap={"4"}>
                <Text color="gray" size={"3"}>
                  {item.review}
                </Text>
                <Flex
                  direction={"row"}
                  align={"center"}
                  justify={"center"}
                  gap={"1"}
                >
                  {Array.from({ length: item.rating }).map((_, id) => (
                    <StarFilledIcon
                      key={id}
                      className="text-yellow"
                      height={18}
                      width={18}
                    />
                  ))}
                </Flex>
              </Flex>

              <Flex direction={"column"} gap={"3"}>
                <div className="h-20 w-20 rounded-xl overflow-hidden mx-auto">
                  <Image
                    alt={`${item.name} profile image`}
                    src={item.image}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
                <Heading as="h3" size={"4"}>{item.name}</Heading>
              </Flex>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default memo(Testimonials);
