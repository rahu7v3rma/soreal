import React from "react";
import Image from "next/image";

export function SorealLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={
          "https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png"
        }
        alt="Soreal"
        width={120}
        height={32}
        style={{ height: "auto" }}
        priority
        quality={95}
      />
    </div>
  );
}
