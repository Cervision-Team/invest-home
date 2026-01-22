"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const FlipCard = ({ icon, heading, description }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const update = () => setCanHover(mediaQuery.matches);
    update();

    mediaQuery.addEventListener?.("change", update);
    return () => mediaQuery.removeEventListener?.("change", update);
  }, []);

  return (
    <div
      onMouseEnter={canHover ? () => setIsFlipped(true) : undefined}
      onMouseLeave={canHover ? () => setIsFlipped(false) : undefined}
      onClick={() => setIsFlipped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped((v) => !v);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? "Kartı ön üzə çevir" : "Kartı arxa üzə çevir"}
      className="mx-auto w-full max-w-[411px] h-[220px] sm:h-60 cursor-pointer select-none"
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 flex flex-col flex-wrap items-center justify-center gap-4 sm:gap-5
             p-4 sm:p-6 box-border border border-solid border-primary
             rounded-3xl sm:rounded-[45px] bg-white"
          style={{
            backfaceVisibility: "hidden",
            boxShadow: "0 2px 0 0 #006C73"
          }}
        >
          <Image
            src={icon}
            alt="Money"
            width={56}
            height={56}
          />
          <h4 className="text-[#1B1F27] text-[20px] sm:text-[28px] lg:text-[32px] font-medium text-center leading-tight">
            {heading}
          </h4>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center p-4 sm:p-6
                     rounded-3xl sm:rounded-[45px] text-center border border-solid border-primary"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            backgroundColor: "white",
            transition: "background-color 0.2s ease 0.2s",
            boxShadow: "0 2px 0 0 #006C73"
          }}
        >
          <p className="text-black text-[14px] sm:text-[16px] lg:text-[18px] leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;