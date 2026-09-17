import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";


const Logo = () => {
  return (
    <Link href={"/"} className="flex items-end flex-row">
      <Image
        className=""
        src={"/logo-name.png"}
        alt="Surface411 - Logo"
        title="Surface411 - Logo"
        height={155}
        width={155}
        preload
      />
    </Link>
  );
};

export default memo(Logo);
