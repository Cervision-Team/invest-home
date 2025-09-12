"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from "next/image";
import PrivateInfo from './form/PrivateInfo';
import OtherInfo from './form/OtherInfo';
import Preview from './form/Preview';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import arrowRightWhite from "../../../../../public/icons/arrow-right-white-small.svg"
import arrowLeftWhite from "../../../../../public/icons/arrow-left-white.svg"

const AgentForm = () => {
  const accordionRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);
  const [height, setHeights] = useState(["0px", "0px", "0px"])
  const [formIndex, setFormIndex] = useState(0);
  const [visitedSections, setVisitedSections] = useState([true, false, false]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    about1: "",
    about2: "",
    education: "",
    age: "",
    address: "",
    cv: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStepValid, setCurrentStepValid] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);

  useEffect(() => {
    openAccordion(0);
  }, []);

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextClick = () => {
    if (currentStepValid) {
      changeForm("increment");
    } else {
      setShowAllErrors(true);
    }
  };

  const handleConfirmClick = () => {
    if (currentStepValid) {
      setIsModalOpen(true);
    } else {
      setShowAllErrors(true);
    }
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

    setVisitedSections(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });

    setFormIndex(index);
    openAccordion(index);
  };

  const openAccordion = (indexToOpen) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const newHeights = accordionRefs.current.map((ref, i) => {
          if (i === indexToOpen && ref.current) {
            return `${ref.current.scrollHeight}px`;
          }
          return "0px";
        });
        setHeights(newHeights);
      });
    });
  };

  return (
    <>
      <section className='min-[430px]:bg-white min-[430px]:px-[32px] min-[430px]:pt-[40px] min-[430px]:pb-[68px] min-[430px]:rounded-[12px] min-[430px]:shadow-[0_4px_10px_rgba(0,0,0,0.15)]'>
        <div className='flex gap-[36px]'>
          <div className='max-[768px]:hidden basis-[340px] min-h-[512px] px-[19px] pt-[34.5px] pb-[46px] rounded-[12px] border-[0.5px] border-[var(--primary-color)] shadow-[0_4px_10px_rgba(0,0,0,0.15)]'>
            <div className="logo-container my-[15.5px]">
              <div className='image-container flex items-center justify-center'>
                <Image
                  src="/images/logo_Invest_Home.png"
                  alt="logo"
                  width={57}
                  height={57}
                />
              </div>
              <div className='mt-[7px]'>
                <h1 className='text-center text-[20px] font-[600] main-logo-style'>INVEST <span className='text-[var(--primary-color)]'>HOME</span></h1>
              </div>
            </div>
            <ul className="mt-[38px] flex flex-col gap-[16px]">
              <div className="accordion">
                {/* accordion-head */}
                <div className='accordion-head flex gap-[6px]'>
                  <div
                    className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${formIndex >= 0 ? 'bg-[var(--primary-color)]' : 'bg-[#9CA3AF]'
                      }`}
                  />
                  <li
                    className={`transition-colors duration-300 ease-in-out w-[100%] font-[500] text-[14px] px-[20px] py-[16px] rounded-[8px] ${formIndex === 0
                      ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                      : formIndex > 0
                        ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                        : 'bg-[#fff] text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]'
                      }`}
                  >
                    Şəxsi məlumatlar
                  </li>
                </div>
                {/* accordion-body */}
                <div
                  ref={accordionRefs.current[0]}
                  style={{ maxHeight: height[0] }}
                  className={`transition-[max-height] overflow-hidden duration-300 ease-in-out accordion-body ml-[9px]`}
                >
                  <div className='mt-[16px] flex flex-col gap-[28px]'>
                    <div className='flex items-center gap-[10px] relative'>
                      <div className="radio-container">
                        <div className="radio-outline rounded-[100%] flex items-center justify-center border-[2px] border-[var(--primary-color)] w-[20px] h-[20px]">
                          <div className="radio-base rounded-[100%] bg-[var(--primary-color)] w-[10px] h-[10px]"></div>
                        </div>
                      </div>
                      <span className='text-[#737373] text-[16px]'>İş təcrübəsi 1</span>
                      <div className='line absolute w-[1px] h-[28px] rounded-[1px] bg-[var(--primary-color)] left-[10px] top-[24px] translate-x-[-50%] translate-y-[0]'></div>
                    </div>
                    <div className='flex items-center gap-[10px] relative'>
                      <div className="radio-container">
                        <div className="radio-outline rounded-[100%] flex items-center justify-center border-[2px] border-[var(--primary-color)] w-[20px] h-[20px]">
                          <div className="radio-base rounded-[100%] bg-[var(--primary-color)] w-[10px] h-[10px]"></div>
                        </div>
                      </div>
                      <span className='text-[#737373] text-[16px]'>İş təcrübəsi 2</span>
                      <div className='line absolute w-[1px] h-[28px] rounded-[1px] bg-[var(--primary-color)] left-[10px] top-[24px] translate-x-[-50%] translate-y-[0]'></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion">
                <div className='accordion-head flex gap-[6px]'>
                  <div
                    className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${formIndex >= 1 ? 'bg-[var(--primary-color)]' : 'bg-[#9CA3AF]'
                      }`}
                  />
                  <li
                    className={`transition-colors duration-300 ease-in-out w-[100%] font-[500] text-[14px] px-[20px] py-[16px] rounded-[8px] ${formIndex === 1
                      ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                      : formIndex > 1
                        ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                        : 'bg-[#fff] text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]'
                      }`}
                  >
                    Digər məlumatlar
                  </li>
                </div>
                <div
                  ref={accordionRefs.current[1]}
                  style={{ maxHeight: height[1] }}
                  className={`transition-[max-height] overflow-hidden duration-300 ease-in-out accordion-body ml-[9px]`}
                >
                  <div className='mt-[16px] flex flex-col gap-[28px]'>
                    <div className='flex items-center gap-[10px] relative'>
                      <div className="radio-container">
                        <div className="radio-outline rounded-[100%] flex items-center justify-center border-[2px] border-[var(--primary-color)] w-[20px] h-[20px]">
                          <div className="radio-base rounded-[100%] bg-[var(--primary-color)] w-[10px] h-[10px]"></div>
                        </div>
                      </div>
                      <span className='text-[#737373] text-[16px]'>Ünvanınız</span>
                      <div className='line absolute w-[1px] h-[28px] rounded-[1px] bg-[var(--primary-color)] left-[10px] top-[24px] translate-x-[-50%] translate-y-[0]'></div>
                    </div>
                    <div className='flex items-center gap-[10px] relative'>
                      <div className="radio-container">
                        <div className="radio-outline rounded-[100%] flex items-center justify-center border-[2px] border-[var(--primary-color)] w-[20px] h-[20px]">
                          <div className="radio-base rounded-[100%] bg-[var(--primary-color)] w-[10px] h-[10px]"></div>
                        </div>
                      </div>
                      <span className='text-[#737373] text-[16px]'>CV faylınızı yükləyin</span>
                      <div className='line absolute w-[1px] h-[28px] rounded-[1px] bg-[var(--primary-color)] left-[10px] top-[24px] translate-x-[-50%] translate-y-[0]'></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion">
                <div className=' accordion-head flex gap-[6px]'>
                  <div
                    className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${formIndex >= 2 ? 'bg-[var(--primary-color)]' : 'bg-[#9CA3AF]'
                      }`}
                  />
                  <li
                    className={`transition-colors duration-300 ease-in-out w-[100%] font-[500] text-[14px] px-[20px] py-[16px] rounded-[8px] ${formIndex === 2
                      ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                      : formIndex > 2
                        ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                        : 'bg-[#fff] text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]'
                      }`}
                  >
                    Ön Baxış
                  </li>
                </div>
              </div>
            </ul>
          </div>

          <div className='basis-[calc(100%-376px)] min-[768px]:min-w-[50%] max-[768px]:min-w-[100%] flex flex-col justify-between'>
            {formIndex === 0 ? (
              <PrivateInfo
                formData={formData}
                updateForm={updateForm}
                onValidationChange={setCurrentStepValid}
                showAllErrors={showAllErrors}
                setShowAllErrors={setShowAllErrors}
              />
            ) : formIndex === 1 ? (
              <OtherInfo
                formData={formData}
                updateForm={updateForm}
                onValidationChange={setCurrentStepValid}
                showAllErrors={showAllErrors}
                setShowAllErrors={setShowAllErrors}
              />
            ) : (
              <Preview
                formData={formData}
                updateForm={updateForm}
                onValidationChange={setCurrentStepValid}
                showAllErrors={showAllErrors}
                setShowAllErrors={setShowAllErrors}
              />
            )}

            <div className={`buttons-container ${formIndex === 0 ? "min-[768px]:justify-end" : "justify-between"} flex max-[768px]:flex-col-reverse gap-[20px] mt-[16px]`}>
              {formIndex == 0 ? (
                <>
                  <button
                    onClick={handleNextClick}
                    className={`max-[768px]:justify-center cursor-pointer flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${currentStepValid
                      ? 'bg-[var(--primary-color)] text-[white] hover:opacity-90'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                  >
                    <span className='font-[500] text-[16px]'>Növbəti</span>
                    <Image src={arrowRightWhite} alt="Arrow Right White" />
                  </button>
                </>
              ) : formIndex == 2 ? (
                <>
                  <button
                    onClick={() => changeForm("decrement")}
                    className='max-[768px]:justify-center cursor-pointer flex items-center gap-[12px] text-[white] bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] hover:opacity-90'
                  >
                    <Image src={arrowLeftWhite} alt="Arrow Left White" />
                    <span className='line-clamp-1 font-[500] text-[16px]'>Geriyə Qayıt</span>
                  </button>
                  <button
                    onClick={handleConfirmClick}
                    className={`cursor-pointer rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${currentStepValid
                      ? 'bg-[var(--primary-color)] text-[white] hover:opacity-90'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                  >
                    <span className='font-[500] text-[16px]'>Təsdiqlə</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => changeForm("decrement")}
                    className='max-[768px]:justify-center cursor-pointer flex items-center gap-[12px] text-[white] bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] hover:opacity-90'
                  >
                    <Image src={arrowLeftWhite} alt="Arrow Left White" />
                    <span className='line-clamp-1 font-[500] text-[16px]'>Geriyə Qayıt</span>
                  </button>
                  <button
                    onClick={handleNextClick}
                    className={`max-[768px]:justify-center cursor-pointer flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${currentStepValid
                      ? 'bg-[var(--primary-color)] text-[white] hover:opacity-90'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                  >
                    <span className='font-[500] text-[16px]'>Növbəti</span>
                    <Image src={arrowRightWhite} alt="Arrow Right White" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {isModalOpen && (
        <>
          <ConfirmationModal 
          isOpen={isModalOpen}
          text={"Təşəkkürlər! CV-niz uğurla yükləndi. Seçim nəticələri e-poçt vasitəsilə göndəriləcək."} />
        </>
      )
      }
    </>
  );
};

export default AgentForm;