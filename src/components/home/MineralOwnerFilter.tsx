import { Button, DropdownMenu, Flex, Heading, Text, TextField, } from "@radix-ui/themes";
import { ChangeEvent, memo, useCallback, useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";

import Container from "../Container";


type Props = {
  title?: string;
  paragraph?: string;
  className?: string;
  formClassName?: string;
  dropDownClasses?: string;
  onSubmit?: () => void;
  locations: any[] | [];
};

export const MineralOwnerFilter = ({
  title,
  paragraph,
  className,
  formClassName,
  dropDownClasses,
  onSubmit,
  locations,
}: Props) => {
  return (
    <Container>
      <MineralSearchForm
        title={title}
        paragraph={paragraph}
        className={className}
        formClassName={formClassName}
        dropDownClasses={dropDownClasses}
        onSubmit={onSubmit}
        locations={locations}
      />
    </Container>
  );
};

const MineralSearchForm = memo(
  ({
    title,
    paragraph,
    className,
    formClassName,
    dropDownClasses,
    onSubmit,
    locations,
  }: Props) => {
    const router = useRouter();
    const [form, setForm] = useState({
      name: "",
      ml: "",
      state: "",
    });

    const handleOnChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setForm((pre) => ({ ...pre, [name]: value }));
      },
      [form]
    );

    const handleSubmit = useCallback(
      (e: any) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
        else router.push({ pathname: "/owners", query: form });
      },
      [form]
    );

    const selectedState = useMemo(() => {
      return locations?.find((item) => item.code === form.state)?.name || "";
    }, [form.state]);

    return (
      <div
        className={`rounded-xl md:shadow-xl bg-white md:py-10 md:p-10 flex flex-col gap-6 ${className}`}
      >
        {title || paragraph ? (
          <Flex direction={"column"} gap={"1"}>
            {title && (
              <Heading as={"h2"} size={"6"} className="text-heading">
                {title}
              </Heading>
            )}
            {paragraph && (
              <Text color="gray" size={"3"}>
                {paragraph}
              </Text>
            )}
          </Flex>
        ) : (
          ""
        )}
        <form onSubmit={handleSubmit}>
          <Flex
            className={`gap-4 lg:gap-8 flex-col lg:flex-row ${formClassName}`}
          >
            <TextField.Root
              size={"3"}
              className="w-full"
              placeholder="First Name/Company name"
              name="name"
              id="name"
              value={form.name}
              onChange={handleOnChange}
            />
            <TextField.Root
              size={"3"}
              className="w-full"
              placeholder="MI/Last Name"
            />
            <Flex className={`${dropDownClasses}`}>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="!w-full">
                  <Button
                    size={"4"}
                    className="!bg-transparent !text-black !flex !flex-row items-center !justify-between"
                    variant="outline"
                    color="gray"
                  >
                    <Text
                      align={"left"}
                      size={"3"}
                      color="gray"
                      aria-multiline={false}
                      className="!font-normal w-full lg:!w-[100px] text-nowrap overflow-hidden"
                    >
                      {selectedState ? selectedState : "County/State"}
                    </Text>
                    <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="max-w-[400px] min-w-[280px] p-3">
                  <TextField.Root
                    inputMode="search"
                    placeholder="Search"
                    size={"2"}
                    className="!rounded-lg !mb-3"
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="18" width="18" />
                    </TextField.Slot>
                  </TextField.Root>
                  <Flex
                    maxHeight={"200px"}
                    overflowY={"auto"}
                    direction={"column"}
                  >
                    {locations?.map((item, index) => {
                      const isSelected = form.state === item?.code;
                      return (
                        <DropdownMenu.Item
                          textValue={item?.name}
                          onClick={() =>
                            setForm((pre) => ({
                              ...pre,
                              state: item?.code,
                            }))
                          }
                          key={index}
                          className={`!py-5 group ${
                            isSelected ? "!bg-primary" : "!bg-transparent"
                          } hover:!bg-primary`}
                        >
                          <Text
                            color="gray"
                            size={"3"}
                            className={`${
                              isSelected ? "!text-white" : "!text-black"
                            } group-hover:!text-white`}
                          >
                            {item?.name}
                          </Text>
                        </DropdownMenu.Item>
                      );
                    })}
                  </Flex>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Flex>

            <Button
              type="submit"
              size={"4"}
              className="!bg-primary !cursor-pointer"
            >
              <Text size={"3"}>Search</Text>
            </Button>
          </Flex>
        </form>
      </div>
    );
  }
);

export default MineralOwnerFilter;
