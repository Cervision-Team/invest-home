"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import arrowRightWhite from "../../../../public/icons/arrow-right-white-small.svg";
import arrowLeftWhite from "../../../../public/icons/arrow-left-white.svg";

const Terms = () => {
  const accordionRefs = useRef([React.createRef(), React.createRef()]);
  const [height, setHeights] = useState(["0px", "0px"]);
  const [formIndex, setFormIndex] = useState(0);
  const [visitedSections, setVisitedSections] = useState([true, false]);
  const [isValidatingStep, setIsValidatingStep] = useState(false);

  useEffect(() => {
    openAccordion(0);
  }, []);

  const handleNextClick = () => {
    changeForm("increment");
  };

  const changeForm = (action) => {
    let index = formIndex;

    if (action === "increment" && index < 2) {
      index++;
    } else if (action === "decrement" && index > 0) {
      index--;
    } else {
      return;
    }

    setVisitedSections((prev) => {
      const updated = [...prev];
      if (index < updated.length) {
        updated[index] = true;
      }
      return updated;
    });

    setFormIndex(index);
    openAccordion(index);
  };

  const openAccordion = (currentFormIndex) => {
    const newHeights = accordionRefs.current.map((ref, i) => {
      if (i === 0 && currentFormIndex < 2 && ref.current) {
        return `${ref.current.scrollHeight}px`;
      }
      if (i === 1 && currentFormIndex >= 2 && ref.current) {
        return `${ref.current.scrollHeight}px`;
      }
      return "0px";
    });
    setHeights(newHeights);
  };

  return (
    <section className="h-auto pb-[40px] bg-white px-[32px] pt-[40px] rounded-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
      <div className="flex gap-[36px]">
        {/* Sidebar */}
        <div className="basis-[340px] min-h-[512px] px-[19px] pt-[34.5px] rounded-[12px] border-[0.5px] border-[var(--primary-color)] shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
          <div className="logo-container my-[15.5px]">
            <div className="image-container flex items-center justify-center">
              <Image
                src="/images/logo_Invest_Home.png"
                alt="logo"
                width={57}
                height={57}
              />
            </div>
            <div className="mt-[7px]">
              <h1 className="text-center text-[20px] font-[600] main-logo-style">
                INVEST <span className="text-[var(--primary-color)]">HOME</span>
              </h1>
            </div>
          </div>

          <ul className="mt-[38px] flex flex-col gap-[16px]">
            {/* 1-ci Accordion */}
            <div className="accordion">
              <div className="accordion-head flex gap-[6px]">
                <div
                  className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${
                    formIndex >= 2
                      ? "bg-[var(--primary-color)]"
                      : "bg-[#9CA3AF]"
                  }`}
                />
                <li
                  className={`transition-colors duration-300 ease-in-out w-[100%] font-[500] text-[14px] px-[20px] py-[16px] rounded-[8px] ${
                    formIndex >= 0
                      ? "bg-[#02836F1A] text-[var(--primary-color)]"
                      : "bg-[#fff] text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]"
                  }`}
                >
                  Məxfilik və istifadə şərtləri
                </li>
              </div>
              <div
                ref={accordionRefs.current[0]}
                style={{ maxHeight: height[0] }}
                className="transition-[max-height] overflow-hidden duration-300 ease-in-out accordion-body ml-[9px]"
              >
                <div className="mt-[16px] flex flex-col gap-[28px]">
                  <div className="flex items-center gap-[10px] relative">
                    <div className="radio-container">
                      <div
                        className={`radio-outline rounded-[100%] flex items-center justify-center border-[2px] w-[20px] h-[20px] ${
                          formIndex >= 0 ? "border-primary" : "border-[#6C707A]"
                        }`}
                      >
                        <div
                          className={`radio-base rounded-[100%] w-[10px] h-[10px] ${
                            formIndex >= 0 ? "bg-primary" : "bg-[#6C707A]"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-[#737373] text-[16px]">
                      Biz Kimik ?
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px] relative">
                    <div className="radio-container">
                      <div
                        className={`radio-outline rounded-[100%] flex items-center justify-center border-[2px] w-[20px] h-[20px] ${
                          formIndex >= 1 ? "border-primary" : "border-[#6C707A]"
                        }`}
                      >
                        <div
                          className={`radio-base rounded-[100%] w-[10px] h-[10px] ${
                            formIndex >= 1 ? "bg-primary" : "bg-[#6C707A]"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-[#737373] text-[16px]">
                      Məxfilik öhdəliyimiz
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-ci Accordion */}
            <div className="accordion">
              <div className="accordion-head flex gap-[6px]">
                <div
                  className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${
                    formIndex >= 2
                      ? "bg-[var(--primary-color)]"
                      : "bg-[#9CA3AF]"
                  }`}
                />
                <li
                  className={`transition-colors duration-300 ease-in-out w-[100%] font-[500] text-[14px] px-[20px] py-[16px] rounded-[8px] ${
                    formIndex >= 2
                      ? "bg-[#02836F1A] text-[var(--primary-color)]"
                      : "bg-[#fff] text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]"
                  }`}
                >
                  Şərtlər və qaydalar
                </li>
              </div>
              <div
                ref={accordionRefs.current[1]}
                style={{ maxHeight: height[1] }}
                className="transition-[max-height] overflow-hidden duration-300 ease-in-out accordion-body ml-[9px]"
              >
                <div className="mt-[16px] flex flex-col gap-[28px]">
                  <div className="flex items-center gap-[10px] relative">
                    <div className="radio-container">
                      <div
                        className={`radio-outline rounded-[100%] flex items-center justify-center border-[2px] w-[20px] h-[20px] ${
                          formIndex >= 2 ? "border-primary" : "border-[#6C707A]"
                        }`}
                      >
                        <div
                          className={`radio-base rounded-[100%] w-[10px] h-[10px] ${
                            formIndex >= 2 ? "bg-primary" : "bg-[#6C707A]"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-[#737373] text-[16px]">
                      İstifadə qaydaları
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ul>
        </div>

        {/* Main Content */}
        <div className="basis-[calc(100%-376px)] flex flex-col justify-between">
          <div className="step-content">
            {formIndex === 0 && (
              <div className="grid grid-cols-2">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Biz kimik?</h2>
                  <p className="mb-2"></p>
                </div>
                <img src="/images/terms-1.png" alt="" />
              </div>
            )}

            {formIndex === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Məxfilik öhdəliyimiz
                </h2>
                <p></p>
              </div>
            )}

            {formIndex === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Şərtlər və Qaydalar
                </h2>
                <p></p>
              </div>
            )}
          </div>

          <div
            className={`buttons-container ${
              formIndex === 0 ? "justify-end" : "justify-between"
            } flex mt-[16px]`}
          >
            {formIndex === 0 ? (
              <button
                onClick={handleNextClick}
                disabled={isValidatingStep}
                className="cursor-pointer flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] bg-[var(--primary-color)] text-white hover:opacity-90 transition-all duration-200"
              >
                <span className="font-[500] text-[16px]">Növbəti</span>
                <Image src={arrowRightWhite} alt="Arrow Right White" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => changeForm("decrement")}
                  disabled={isValidatingStep}
                  className="cursor-pointer flex items-center gap-[12px] text-white bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Image src={arrowLeftWhite} alt="Arrow Left White" />
                  <span className="font-[500] text-[16px]">Geriyə Qayıt</span>
                </button>
                <button
                  onClick={handleNextClick}
                  disabled={isValidatingStep}
                  className="cursor-pointer flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] bg-[var(--primary-color)] text-white hover:opacity-90 transition-all duration-200"
                >
                  <span className="font-[500] text-[16px]">Növbəti</span>
                  <Image src={arrowRightWhite} alt="Arrow Right White" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
