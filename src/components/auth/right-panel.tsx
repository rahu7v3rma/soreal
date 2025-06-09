import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SorealLogo } from "@/components/shared/logo";
import { images, content } from "@/constants/components/auth/right-panel";

export function AuthRightPanel({
  variant = "default",
}: {
  variant?: "default" | "signup" | "forgot-password" | "change-password";
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { heading } = content[variant];
  const currentImage = images[currentImageIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:block h-full w-full relative">
      <div className="absolute inset-0">
        <Image
          src={currentImage}
          alt="Soreal background"
          fill
          style={{ objectFit: "cover" }}
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black bg-opacity-15"></div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <div className="flex justify-end w-full mb-10">
          <div className="text-right" style={{ maxWidth: "90%" }}>
            <div className="flex items-center justify-end mb-2">
              <SorealLogo className="h-8 md:h-10 mr-3 w-auto" />
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold whitespace-nowrap text-white"
                style={{
                  textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                {heading}
              </h2>
            </div>
            <p
              className="text-xl md:text-2xl lg:text-3xl font-medium tracking-wide text-white"
              style={{
                textShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
                marginTop: "0.25rem",
              }}
            >
              AI that captures <span style={{ color: "#2fceb9" }}>reality</span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
