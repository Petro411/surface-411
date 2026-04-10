import { Dialog, Flex, Heading, IconButton, Separator, Spinner, Text, } from "@radix-ui/themes";
import { Cross1Icon, LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import React, { Fragment, memo, useEffect } from "react";
import { getUser } from "@/context/AuthContext";
import { useQuery } from "@/hooks/useQuery";
import { endpoints } from "@/services/api";
import Link from "next/link";


type Props = {
  id: string | null;
  setSelectedId: (id: string | null) => void;
};

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
  const cityLine = [city, ownerState?.name, state?.name].filter(Boolean).join(", ");
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
    <Flex  direction="row" align="start" wrap={"wrap"} gap={"1"}>
      {counties?.map((c, i) => (
          <Fragment key={i}>
        <GrayText value={`${c} County`} />{","}
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

const OwnerDetails = ({ id, setSelectedId }: Props) => {
  const authContext = getUser();
  const { data, loading, error, request, abort } = useQuery();
  const owner: Owner | undefined = data?.owner;
  const user = authContext?.user;

  useEffect(() => {
    if (id) request(`${endpoints.ownerDetails}?id=${id}`);
    return () => abort();
  }, [id]);

  return (
    <Dialog.Root open={!!id}>
      <Dialog.Content className="max-h-[60vh] overflow-y-auto">
        {/* close button */}
        <Flex justify="end">
          <IconButton
            size="1"
            onClick={() => setSelectedId(null)}
            radius="large"
            className="!bg-primary !outline-none"
          >
            <Cross1Icon height={16} width={16} />
          </IconButton>
        </Flex>

        {loading && (
          <Flex className="!min-h-[10vh]" align="center" justify="center">
            <Spinner size="3" />
          </Flex>
        )}

        {error && (
          <Flex p="8" direction="column" justify="center" gap="3">
            <Heading size="5" align="center" className="text-heading">
              Unexpected Error :(
            </Heading>
            <Text size="3" className="text-center" color="gray">
              An unexpected error occurred. Please try again later or contact
              support if the issue persists.
            </Text>
          </Flex>
        )}

        {owner && (
          <Flex direction="column">
            <Heading size="4" className="!max-w-[90%]">
              {owner.names?.[0]}
            </Heading>

            <Flex direction="column" mt="4">
              {/* Names */}
              {owner.names?.length > 0 && (
                <FieldBlock label="Names">
                  <Flex direction="column" gap="1">
                    {owner.names.map((n, i) => (
                      <GrayText key={i} value={n} />
                    ))}
                  </Flex>
                </FieldBlock>
              )}

              {/* Emails — subscription gated */}
              <FieldBlock label="Emails">
                {owner.emails?.length ? (
                  <LockedOrVisible user={user} items={owner.emails} />
                ) : (
                  <GrayText value="—" />
                )}
              </FieldBlock>

              {/* Phone numbers — subscription gated */}
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

              {/* Mineral Address */}
              <FieldBlock label="Mineral Address">
                <MineralAddress owner={owner} />
              </FieldBlock>

              <FieldBlock label="Legal Description">
                {owner?.description && <GrayText value={owner.description} />}
              </FieldBlock>
            </Flex>
          </Flex>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default memo(OwnerDetails);
