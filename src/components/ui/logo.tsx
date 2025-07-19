import React from "react";

export function SorealLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="https://api.soreal.app/assets/png/logo/soreal-logo-rgb-transparent-2x.png"
        alt="Soreal"
        width={120}
        height={32}
        style={{ height: "auto" }}
      />
    </div>
  );
}
