"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from "next/image";
import arrowRightWhite from "../../../../public/icons/arrow-right-white-small.svg"
import arrowLeftWhite from "../../../../public/icons/arrow-left-white.svg"
import NewAnnc from './NewAnnc';
import TypeOfAnnc from './TypeOfAnnc';
import ForSale from './for-sale/ForSale';
import ForRent from './for-rent/ForRent';
import Daily from './daily/Daily';
import Roommate from './roommate/Roommate';
import AnncDetails from './for-sale/AnncDetails';
import Location from './for-sale/Location';
import Media from './for-sale/Media';
import RoommateAnncDetails from './roommate/RoommateAnncDetails';

const AnnouncementForm = () => {
  const accordionRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);
  const [height, setHeights] = useState(["0px", "0px", "0px"])
  const [formIndex, setFormIndex] = useState(0);
  const [visitedSections, setVisitedSections] = useState([true, false, false]);
  const [currentStepValid, setCurrentStepValid] = useState(true);
  
  // Add state for announcement type
  const [announcementType, setAnnouncementType] = useState(null);
  
  // Add state for property type (for ForSale component)
  const [activePropertyType, setActivePropertyType] = useState(null);

  useEffect(() => {
    openAccordion(0);
  }, []);

  // Function to handle announcement type selection from TypeOfAnnc
  const handleAnnouncementTypeChange = (type) => {
    setAnnouncementType(type);
    setCurrentStepValid(true); // Enable next button when type is selected
    
    // Reset property type when announcement type changes
    setActivePropertyType(null);
  };

  const handleNextClick = () => {
    // For TypeOfAnnc step, check if announcement type is selected
    if (formIndex === 1 && !announcementType) {
      setCurrentStepValid(false);
      return;
    }
    
    if (currentStepValid) {
      changeForm("increment");
    }
  };

  const handleConfirmClick = () => {
    if (currentStepValid) {
      // setIsModalOpen(true);
    }
  };

  const changeForm = (action) => {
    let index = formIndex;

    if (action === "increment" && index < 5) {
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

  const openAccordion = (currentFormIndex) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const newHeights = accordionRefs.current.map((ref, i) => {
          if ((i === currentFormIndex || (i === 0 && currentFormIndex < 4)) && ref.current) {
            return `${ref.current.scrollHeight}px`;
          }
          return "0px";
        });
        setHeights(newHeights);
      });
    });
  };

  // Function to render the appropriate form component
  const renderFormContent = () => {
    switch(formIndex) {
      case 0:
        return <NewAnnc />;
      case 1:
        return (
          <TypeOfAnnc 
            activeButton={announcementType}
            onAnnouncementTypeChange={handleAnnouncementTypeChange}
          />
        );
      case 2:
        switch(announcementType) {
          case 'sell':
            return (
              <ForSale 
                activePropertyType={activePropertyType}
                setActivePropertyType={setActivePropertyType}
              />
            );
          case 'rent':
            return <ForRent 
                activePropertyType={activePropertyType}
                setActivePropertyType={setActivePropertyType}/>;
          case 'daily':
            return <Daily
                activePropertyType={activePropertyType}
                setActivePropertyType={setActivePropertyType} />;
          case 'roommate':
            return <Roommate 
                            activePropertyType={activePropertyType}
                setActivePropertyType={setActivePropertyType} />;
          default:
            return <div>Please select an announcement type first</div>;
        }
      case 3:
        switch(announcementType) {
          case 'sell':
            return <AnncDetails 
              activePropertyType={activePropertyType}
            />;
          case 'rent':
            return <AnncDetails 
              activePropertyType={activePropertyType}
            />;
          case 'daily':
            return <AnncDetails 
              activePropertyType={activePropertyType}
            />;
          case 'roommate':
            return <RoommateAnncDetails 
              activePropertyType={activePropertyType}
            />;
        }
      case 4:
        return <Location />
      case 5:
        return <Media />
      default:
        return <div></div>;
    }
  };

  return (
    <>
      <section className='h-auto pb-[40px] bg-white px-[32px] pt-[40px] rounded-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.15)]'>
        <div className='flex gap-[36px]'>
          <div className='basis-[340px] min-h-[512px] px-[19px] pt-[34.5px] rounded-[12px] border-[0.5px] border-[var(--primary-color)] shadow-[0_4px_10px_rgba(0,0,0,0.15)]'>
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
                <div className='accordion-head flex gap-[6px]'>
                  <div
                    className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${formIndex >= 0 ? 'bg-[var(--primary-color)]' : 'bg-[#9CA3AF]'}`}
                  />
                  <li
                    className={`transition-colors duration-300 ease-in-out w-[100%] font-[500] text-[14px] px-[20px] py-[16px] rounded-[8px] ${
                      formIndex === 0
                        ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                        : formIndex > 0
                        ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                        : 'bg-[#fff] text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]'
                    }`}
                  >
                    Əsas məlumat
                  </li>
                </div>
                <div
                  ref={accordionRefs.current[0]}
                  style={{ maxHeight: height[0] }}
                  className={`transition-[max-height] overflow-hidden duration-300 ease-in-out accordion-body ml-[9px]`}
                >
                  <div className='mt-[16px] flex flex-col gap-[28px]'>
                    <div className='flex items-center gap-[10px] relative'>
                      <div className="radio-container">
                        <div className={`radio-outline rounded-[100%] flex items-center justify-center border-[2px] w-[20px] h-[20px] transition-colors duration-300 ease-in-out ${
                          formIndex >= 2 ? 'border-primary' : 'border-[#6C707A]'
                        }`}>
                          <div className={`radio-base rounded-[100%] w-[10px] h-[10px] transition-colors duration-300 ease-in-out ${
                            formIndex >= 2 ? 'bg-primary' : 'bg-[#6C707A]'
                          }`}></div>
                        </div>
                      </div>
                      <span className='text-[#737373] text-[16px]'>Xüsusiyyətlər</span>
                      <div className='line absolute w-[1px] h-[28px] rounded-[1px] bg-[var(--primary-color)] left-[10px] top-[24px] translate-x-[-50%] translate-y-[0]'></div>
                    </div>
                    <div className='flex items-center gap-[10px] relative'>
                      <div className="radio-container">
                        <div className={`radio-outline rounded-[100%] flex items-center justify-center border-[2px] w-[20px] h-[20px] transition-colors duration-300 ease-in-out ${
                          formIndex >= 3 ? 'border-primary' : 'border-[#6C707A]'
                        }`}>
                          <div className={`radio-base rounded-[100%] w-[10px] h-[10px] transition-colors duration-300 ease-in-out ${
                            formIndex >= 3 ? 'bg-primary' : 'bg-[#6C707A]'
                          }`}></div>
                        </div>
                      </div>
                      <span className='text-[#737373] text-[16px]'>Detallar</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion">
                <div className=' accordion-head flex gap-[6px]'>
                  <div
                    className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${formIndex >= 4 ? 'bg-[var(--primary-color)]' : 'bg-[#9CA3AF]'}`}
                  />
                  <li
                    className={`transition-colors duration-300 ease-in-out w-[100%] font-[500] text-[14px] px-[20px] py-[16px] rounded-[8px] ${formIndex === 4
                      ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                      : formIndex > 4
                        ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                        : 'bg-[#fff] text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]'
                      }`}
                  >
                    Ünvan
                  </li>
                </div>
              </div>
              <div className="accordion">
                <div className=' accordion-head flex gap-[6px]'>
                  <div
                    className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${formIndex >= 5 ? 'bg-[var(--primary-color)]' : 'bg-[#9CA3AF]'}`}
                  />
                  <li
                    className={`transition-colors duration-300 ease-in-out w-[100%] font-[500] text-[14px] px-[20px] py-[16px] rounded-[8px] ${formIndex === 5
                      ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                      : formIndex > 5
                        ? 'bg-[#02836F1A] text-[var(--primary-color)]'
                        : 'bg-[#fff] text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]'
                      }`}
                  >
                    Media
                  </li>
                </div>
              </div>
            </ul>
          </div>
          
          <div className='basis-[calc(100%-376px)] flex flex-col justify-between'>
            {renderFormContent()}
          
            <div className={`buttons-container ${formIndex === 0 ? 'justify-end' : 'justify-between'} flex mt-[16px]`}>
              {formIndex === 0 ? (
                <button 
                  onClick={handleNextClick}
                  className={`cursor-pointer flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${
                    currentStepValid 
                      ? 'bg-[var(--primary-color)] text-[white] hover:opacity-90' 
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  <span className='font-[500] text-[16px]'>Növbəti</span>
                  <Image src={arrowRightWhite} alt="Arrow Right White" />
                </button>
              ) : formIndex === 5 ? (
                <>
                  <button 
                    onClick={() => changeForm("decrement")} 
                    className='cursor-pointer flex items-center gap-[12px] text-[white] bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] hover:opacity-90 transition-all duration-200'
                  >
                    <Image src={arrowLeftWhite} alt="Arrow Left White" />
                    <span className='font-[500] text-[16px]'>Geriyə Qayıt</span>
                  </button>
                  <button 
                    onClick={handleConfirmClick}
                    className={`cursor-pointer rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${
                      currentStepValid 
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
                    className='cursor-pointer flex items-center gap-[12px] text-[white] bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] hover:opacity-90 transition-all duration-200'
                  >
                    <Image src={arrowLeftWhite} alt="Arrow Left White" />
                    <span className='font-[500] text-[16px]'>Geriyə Qayıt</span>
                  </button>
                  <button 
                    onClick={handleNextClick}
                    className={`cursor-pointer flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${
                      (formIndex === 1 && !announcementType) || !currentStepValid
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-[var(--primary-color)] text-[white] hover:opacity-90'
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
    </>
  );
};

export default AnnouncementForm