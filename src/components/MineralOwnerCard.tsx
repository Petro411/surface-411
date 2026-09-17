import { Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { memo } from "react";


type Props = {
  id: string;
  name: string;
  date: string;
};

export const MineralOwnerCard = memo(({ id, name, date }: Props) => {
  return (
    <Link
      href={`/owners/${id}`}
      className="cursor-pointer flex flex-col p-5 rounded-lg border hover:border-primary transition-all duration-300 hover:shadow-lg shadow-md"
    >
      <Heading as="h3" size={"3"} className="text-heading !line-clamp-2">
        {name}
      </Heading>
      <Text as="p" size={"1"} align={"right"} color="gray">
        {date}
      </Text>
    </Link>
  );
});
