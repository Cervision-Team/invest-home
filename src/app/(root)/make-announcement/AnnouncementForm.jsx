// Updated AnnouncementForm.jsx with better schema handling

"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Image from "next/image";
import { useFormik } from 'formik';
import { validationSchemas, getValidationSchema, validateStep } from '../../../lib/schemas/announcementSchema';
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
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const AnnouncementForm = () => {
  const accordionRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);
  const [height, setHeights] = useState(["0px", "0px", "0px"])
  const [formIndex, setFormIndex] = useState(0);
  const [visitedSections, setVisitedSections] = useState([true, false, false]);
  const [stepErrors, setStepErrors] = useState({});
  const [isValidatingStep, setIsValidatingStep] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  const formik = useFormik({
    initialValues: {
      // Step 0 - NewAnnc
      newAnnouncement: '',
      
      // Step 1 - TypeOfAnnc
      announcementType: '',
      
      // Step 2 - Property details (conditional based on announcement type)
      propertyType: '',
      officeType: '',
      buildingType: '', // Add this field
      repairStatus: '', // Add this field
      isMortgaged: false,
      
      // For Sale/Rent
      price: '',
      area: '', 
      landArea: '',
      pricePerSqm: '',
      floor: '',
      totalFloors: '',
      rooms: '',
      bathrooms: '',
      
      
      // For Daily
      dailyRate: '',
      guestCount: '',
      nightCount: '',
      checkInTime: '',
      checkOutTime: '',
            
      // Mortgage fields
      initialPayment: '',
      monthlyPayment: '',
      remainingYears: '',
      remainingMonths: '',
      
      // Step 3 - Detailed Property Information
      yearBuilt: '',
      condition: '',
      
      // Features
      exit: '',
      mortgage: '',
      features: [],
      
      // Roommate specific fields
      utilities: '',
      bedType: '',
      ownerLives: '',
      residentsCount: '',
      houseComposition: '',
      gender: '',
      workStatus: '',
      smoking: '',
      pets: '',
      visitors: '',
      activeBuilding: '',
      activeRepaired: '',
      description: '',
      
      // Step 4 - Location
 selectedCity: '',
    selectedDistrict: '',
    selectedSettlement: '',
    selectedAddress: '',
    searchQuery: '',
    selectedLocation: '',
    latitude: null,
    longitude: null,      
      // Step 5 - Media
      selectedMedia: [],
      images: [],
      videos: [],
      uploadedFiles: [],
      virtualTour: '',
      imageDescriptions: [],
    },
    validationSchema: validationSchemas[0],
    onSubmit: async (values) => {
      console.log('Form submitted:', values);
      
    },
    validateOnChange: false, 
    validateOnBlur: false,  
  });

  
  const getFormType = useCallback((formValues) => {
    if (formValues.announcementType === 'roommate') return 'roommate';
    return 'default';
  }, []);

  useEffect(() => {
    openAccordion(0);
  }, []);

  useEffect(() => {
  }, [
    formIndex, 
    formik.values.announcementType, 
    formik.values.propertyType, 
    formik.values.officeType, 
    formik.values.isMortgaged
  ]);

  const handleAnnouncementTypeChange = useCallback((type) => {
    formik.setFieldValue('announcementType', type);
    
    // Reset related fields when announcement type changes
    const fieldsToReset = [
      'propertyType', 'officeType', 'buildingType', 'repairStatus',
      'price', 'monthlyRent', 'dailyRate', 'roomType', 'area', 'landArea',
      'floor', 'totalFloors', 'rooms', 'bathrooms'
    ];
    
    fieldsToReset.forEach(field => {
      formik.setFieldValue(field, '');
    });
    
    setStepErrors({});
  }, [formik]);

  // Validate current step with better error handling
  const validateCurrentStep = async () => {
    setIsValidatingStep(true);
    
    try {
      const result = await validateStep(formIndex, formik.values);
      setStepErrors(result.errors || {});
      return result.isValid;
    } catch (error) {
      console.error('Validation error:', error);
      setStepErrors({ general: 'Validation xətası baş verdi' });
      return false;
    } finally {
      setIsValidatingStep(false);
    }
  };

  const handleNextClick = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid) {
      changeForm("increment");
    } else {
      // Scroll to first error field
      setTimeout(() => {
        const firstErrorField = document.querySelector('.error-field');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  };

  const handleConfirmClick = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid) {
      try {
        await formik.submitForm();
        setIsModalOpen(true);
      } catch (error) {
        console.error('Form submission error:', error);
        setStepErrors({ general: 'Form göndərilməsində xəta' });
      }
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
      if (index < updated.length) {
        updated[index] = true;
      }
      return updated;
    });

    setFormIndex(index);
    openAccordion(index);
    
    setStepErrors({});
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

  const renderFormContent = () => {
    const commonProps = {
      formik,
      stepErrors,
      setStepErrors,
      isValidating: isValidatingStep
    };

    switch(formIndex) {
      case 0:
        return <NewAnnc {...commonProps} setIsValidating={setIsValidatingStep} />;
      case 1:
        return (
          <TypeOfAnnc 
            {...commonProps}
            activeButton={formik.values.announcementType}
            onAnnouncementTypeChange={handleAnnouncementTypeChange}
          />
        );
      case 2:
        switch(formik.values.announcementType) {
          case 'sell':
            return (
              <ForSale 
                {...commonProps}
                activePropertyType={formik.values.propertyType}
                setActivePropertyType={(type) => formik.setFieldValue('propertyType', type)}
              />
            );
          case 'rent':
            return (
              <ForRent 
                {...commonProps}
                activePropertyType={formik.values.propertyType}
                setActivePropertyType={(type) => formik.setFieldValue('propertyType', type)}
              />
            );
          case 'daily':
            return (
              <Daily
                {...commonProps}
                activePropertyType={formik.values.propertyType}
                setActivePropertyType={(type) => formik.setFieldValue('propertyType', type)}
              />
            );
          case 'roommate':
            return (
              <Roommate 
                {...commonProps}
                activePropertyType={formik.values.propertyType}
                setActivePropertyType={(type) => formik.setFieldValue('propertyType', type)}
              />
            );
          default:
            return (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Zəhmət olmasa əvvəlcə elan növü seçin
              </div>
            );
        }
      case 3:
        const formType = getFormType(formik.values);
        if (formType === 'roommate') {
          return <RoommateAnncDetails {...commonProps} activePropertyType={formik.values.propertyType} />;
        } else {
          return <AnncDetails {...commonProps} activePropertyType={formik.values.propertyType} />;
        }
      case 4:
        return <Location {...commonProps} />
      case 5:
        return <Media {...commonProps} />
      default:
        return <div></div>;
    }
  };

const isCurrentStepValid = () => {
  if (isValidatingStep) return false;
  

  switch (formIndex) {
    case 0:
      return !!formik.values.newAnnouncement && Object.keys(stepErrors).length === 0;

    case 1:
      return !!formik.values.announcementType && Object.keys(stepErrors).length === 0;

case 2:
  
  const hasPropertyType = !!formik.values.propertyType;
  const hasNoStepErrors = Object.keys(stepErrors).length === 0;
    
  return hasPropertyType && hasNoStepErrors;

    case 3:
      return Object.keys(stepErrors).length === 0;

    case 4:
 return (
        !!formik.values.selectedCity &&
        !!formik.values.selectedDistrict &&
        !!formik.values.selectedSettlement &&
        !!formik.values.selectedAddress?.trim() &&
        formik.values.selectedAddress.length >= 10 &&
        Object.keys(stepErrors).length === 0
      );
      case 5:
      return (
        formik.values.selectedMedia?.length > 0 &&
        formik.values.uploadedFiles?.length > 0 &&
        Object.keys(stepErrors).length === 0
      );

    default:
      return Object.keys(stepErrors).length === 0;
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
                  disabled={!isCurrentStepValid() || isValidatingStep}
                  className={`cursor-pointer flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${
                    isCurrentStepValid() && !isValidatingStep
                      ? 'bg-[var(--primary-color)] text-[white] hover:opacity-90' 
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  <span className='font-[500] text-[16px]'>
                    {isValidatingStep ? 'Yoxlanılır...' : 'Növbəti'}
                  </span>
                  {!isValidatingStep && <Image src={arrowRightWhite} alt="Arrow Right White" />}
                </button>
              ) : formIndex === 5 ? (
                <>
                  <button 
                    onClick={() => changeForm("decrement")} 
                    disabled={isValidatingStep}
                    className='cursor-pointer flex items-center gap-[12px] text-[white] bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <Image src={arrowLeftWhite} alt="Arrow Left White" />
                    <span className='font-[500] text-[16px]'>Geriyə Qayıt</span>
                  </button>
                  <button 
                    onClick={handleConfirmClick}
                    disabled={!isCurrentStepValid() || isValidatingStep}
                    className={`cursor-pointer rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${
                      isCurrentStepValid() && !isValidatingStep
                        ? 'bg-[var(--primary-color)] text-[white] hover:opacity-90' 
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                  >
                    <span className='font-[500] text-[16px]'>
                      {isValidatingStep ? 'Yoxlanılır...' : 'Təsdiqlə'}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => changeForm("decrement")} 
                    disabled={isValidatingStep}
                    className='cursor-pointer flex items-center gap-[12px] text-[white] bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <Image src={arrowLeftWhite} alt="Arrow Left White" />
                    <span className='font-[500] text-[16px]'>Geriyə Qayıt</span>
                  </button>
                  <button 
                    onClick={handleNextClick}
                    disabled={!isCurrentStepValid() || isValidatingStep}
                    className={`cursor-pointer flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${
                      isCurrentStepValid() && !isValidatingStep
                        ? 'bg-[var(--primary-color)] text-[white] hover:opacity-90'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                  >
                    <span className='font-[500] text-[16px]'>
                      {isValidatingStep ? 'Yoxlanılır...' : 'Növbəti'}
                    </span>
                    {!isValidatingStep && <Image src={arrowRightWhite} alt="Arrow Right White" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {isModalOpen && (
        <>
          <ConfirmationModal isOpen={isModalOpen} />
        </>
      )
      }
    </>
  );
};

export default AnnouncementForm