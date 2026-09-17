import { LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import { Flex, Heading, Separator, Text } from "@radix-ui/themes";
import baseApi, { endpoints } from "@/services/api";
import SiteHeader from "@/components/SiteHeader";
import { getUser } from "@/context/AuthContext";
import Container from "@/components/Container";
import React, { Fragment, memo } from "react";
import Footer from "@/components/Footer";
import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";


type Owner = {
  _id: string;
  names: string[];
  emails: string[];
  numbers: string[];
  addresses: string[];
  counties: string[];
  zipcode: string;
  city: string;
  state: { name: string; code: string };
  ownerState: { name: string; code: string };
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// ── small reusable pieces ─────────────────────────────────────────────────────

const FieldBlock = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Flex direction="column" mt="4">
    <Text size="3" weight="medium">
      {label}
    </Text>
    <Separator size="4" orientation="horizontal" my="1" />
    {children}
  </Flex>
);

const GrayText = ({ value }: { value: string }) => (
  <Text size="3" color="gray">
    {value}
  </Text>
);

const TagList = ({ items }: { items: string[] }) => (
  <Flex direction="row" wrap="wrap" gap="1">
    {items.map((item, i) => (
      <Text key={i} size="3" color="gray">
        {item}
        {i < items.length - 1 ? "," : ""}
      </Text>
    ))}
  </Flex>
);

const LockedSection = memo(({ user }: { user: any }) => (
  <div className="flex flex-row gap-2 relative overflow-hidden px-2 min-h-10">
    <div className="backdrop-blur-sm absolute inset-0 flex items-center justify-center">
      <Link
        href={user ? "/pricing" : "/auth/login"}
        className="bg-primary rounded-lg flex items-center gap-2 px-3 py-1.5 text-white"
      >
        {!user ? <PersonIcon /> : <LockClosedIcon />}
        <Text>{!user ? "Login" : "Upgrade plan"}</Text>
      </Link>
    </div>
    {/* blurred placeholder rows */}
    {["example@gmail.com", "example@gmail.com", "example@gmail.com"].map(
      (e, i) => (
        <span key={i}>{e}</span>
      )
    )}
  </div>
));

// ── address sections ─────────────────────────────────────────────────────────

/**
 * Mineral Owner Address:
 *   Street Address(es)
 *   City, OwnerState  ZIP
 */
const MineralOwnerAddress = ({ owner }: { owner: Owner }) => {
  const { addresses, city, ownerState, zipcode, state } = owner;
  const cityLine = [city, ...new Set([ownerState?.name, state?.name])]
    .filter(Boolean)
    .join(", ");
  const cityZipLine = [cityLine, zipcode].filter(Boolean).join("  ");

  return (
    <Flex direction="row" align="start" wrap={"wrap"} gap={"1"}>
      <Flex direction="row" align="start" wrap={"wrap"}>
        {addresses?.map((addr, i) => (
          <Fragment key={i}>
            <GrayText value={addr} />
            {","}
          </Fragment>
        ))}
      </Flex>
      {cityZipLine && <GrayText value={cityZipLine} />}
    </Flex>
  );
};

/**
 * Mineral Address (property location):
 *   County County
 *   State
 *   Description
 */
const MineralAddress = ({ owner }: { owner: Owner }) => {
  const { counties, state } = owner;

  return (
    <Flex direction="row" align="start" wrap={"wrap"} gap={"1"}>
      {counties?.map((c, i) => (
        <Fragment key={i}>
          <GrayText value={`${c} County`} />
          {","}
        </Fragment>
      ))}
      {state?.name && <GrayText value={`${state.name}`} />}
    </Flex>
  );
};

// ── locked-or-visible helper ──────────────────────────────────────────────────

const LockedOrVisible = ({ user, items }: { user: any; items: string[] }) => {
  if (user?.subscription) return <TagList items={items} />;
  return <LockedSection user={user} />;
};

// ── main component ────────────────────────────────────────────────────────────
type Props = {
  owner: Owner;
};
const OwnerDetails = ({ owner }: Props) => {
  const authContext = getUser();
  const user = authContext?.user;

  return (
    <>
    <Head>
      <title>Petro411 | Mineral Owner - {owner?.names?.[0]}</title>
      <meta
        name="robots"
        content={ "noindex, nofollow, noarchive, nosnippet"}
      />
    </Head>
      <SiteHeader />
      {owner && (
        <Container>
          <Flex direction="column" className="py-8 mx-auto w-6/12">
            <Heading as="h1" size="4" className="!max-w-[90%]">
              {owner.names?.[0]}
            </Heading>

            <Flex direction="column" mt="4">
              {owner.names?.length > 0 && (
                <FieldBlock label="Names">
                  <Flex direction="column" gap="1">
                    {owner.names.map((n: any, i: number) => (
                      <GrayText key={i} value={n} />
                    ))}
                  </Flex>
                </FieldBlock>
              )}

              <FieldBlock label="Emails">
                {owner.emails?.length ? (
                  <LockedOrVisible user={user} items={owner.emails} />
                ) : (
                  <GrayText value="—" />
                )}
              </FieldBlock>

              <FieldBlock label="Phone Numbers">
                {owner.numbers?.length ? (
                  <LockedOrVisible user={user} items={owner.numbers} />
                ) : (
                  <GrayText value="—" />
                )}
              </FieldBlock>

              {/* Mineral Owner Address */}
              <FieldBlock label="Mineral Owner Address">
                <MineralOwnerAddress owner={owner} />
              </FieldBlock>

              <FieldBlock label="Mineral Address">
                <MineralAddress owner={owner} />
              </FieldBlock>

              <FieldBlock label="Legal Description">
                {owner?.description && <GrayText value={owner.description} />}
              </FieldBlock>
            </Flex>
          </Flex>
        </Container>
      )}
      <Footer />
    </>
  );
};
export const getStaticPaths = async () => {
  // const res = await baseApi.get(endpoints.getOwnerIds);
  // const paths =
  //   res.data?.owners?.map((id: string) => ({
  //     params: { id },
  //   })) || [];

  return {
    paths:[],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  const res = await baseApi.get(`${endpoints.ownerDetails}?id=${id}`);
  const owner = res.data?.owner || null;

  if (!owner) {
    return { notFound: true };
  }

  return {
    props: { owner },
    revalidate: 300,
  };
};

export default OwnerDetails;
