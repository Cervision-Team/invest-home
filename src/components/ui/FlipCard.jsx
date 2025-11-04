"use client";
import Image from "next/image";
import { useState } from "react";

const FlipCard = ({icon, heading}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      className="mx-auto max-sm:hidden"
      style={{ 
        perspective: "1000px",
        width: "411px",
        height: "240px"
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
  className="absolute inset-0 flex flex-col flex-wrap items-center justify-center gap-5
             p-6 box-border border border-solid border-primary
             rounded-[45px] bg-white"
  style={{ 
    backfaceVisibility: "hidden",
    boxShadow: "0 2px 0 0 #006C73"
  }}
>
  <Image
    src={icon}
    alt="Money"
    width={60}
    height={60}
  />
  <h4 className="text-[#1B1F27] text-[32px] font-medium text-center">
    {heading}
  </h4>
</div>
        <div
          className="absolute inset-0 flex items-center justify-center p-6
                     rounded-[45px] text-center border border-solid border-primary"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            backgroundColor: "white",
            transition: "background-color 0.2s ease 0.2s",
            boxShadow: "0 2px 0 0 #006C73"
          }}
        >
          <p className="text-black text-base leading-relaxed">
            "Agent ol" – əmlak elanlarını paylaşaraq satışdan qazanc əldə etmə
            yoludur. Buradakı əsas məqsəd müştərilərə arzuladıqları əmlakı
            doğru, tez və asan bir şəkildə tapmaqdır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;