"use client";
import { useState } from "react";

const FlipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      className="w-full max-w-[628px] h-40 md:h-48 lg:h-52 xl:h-[200px] rounded-2xl md:rounded-[35px] lg:rounded-[45px] mx-auto max-sm:hidden"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 flex flex-row flex-wrap items-center justify-center gap-4
                     p-6 sm:p-8 md:p-10 box-border border border-solid border-[#B3E5DD]
                     shadow-[0_3px_0_0_#B3E5DD] rounded-[45px]
                     bg-[#26B5A0]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h2 className="text-[#F8F9FC] text-[60px]  leading-none flex-shrink-0 max-[420px]:text-[40px] max-[350px]:text-[30px]">
            01
          </h2>
          <h4 className="text-[#FAFAFA] text-[34px] leading-snug text-center max-[420px]:text-[28px] max-[350px]:text-[22px]">
            Agent ol nədir? <br /> Nə üçündür?
          </h4>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-10
                     rounded-[45px] text-center"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            backgroundColor: isFlipped ? "#02836F" : "#26B5A0",
            transition: "background-color 0.2s ease 0.2s",
          }}
        >
          <p className="text-[#FAFAFA] text-sm sm:text-base md:text-lg leading-relaxed">
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
