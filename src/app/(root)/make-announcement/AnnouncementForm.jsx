// Updated AnnouncementForm.jsx with better schema handling

"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Image from "next/image";
import { useFormik } from 'formik';
import { validationSchemas, getValidationSchema, validateStep } from '../../../lib/schemas/announcementSchema';
import arrowRightWhite from "../../../../public/icons/arrow-right-white-small.svg"
import arrowLeftWhite from "../../../../public/icons/arrow-left-white.svg"
import NewAnnc from './NewAnnc';
import ForSale from './for-sale/ForSale';
import ForRent from './for-rent/ForRent';
import Daily from './daily/Daily';
import Roommate from './roommate/Roommate';
import AnncDetails from './for-sale/AnncDetails';
import Location from './for-sale/Location';
import Media from './for-sale/Media';
import RoommateAnncDetails from './roommate/RoommateAnncDetails';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import DailyAnncDetails from './daily/DailyAnncDetails';
import { createAnnouncement } from '@/services/api/endpoints/announcementService';

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
      // Step 1 - NewAnnc
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
      const formData = new FormData();

      // 1️⃣ DTO üçün JSON obyektini formalaşdır
      const dto = {
        announcementType: values.announcementType,
        propertyType: values.propertyType,
        officeType: values.officeType,
        buildingType: values.buildingType,
        repairStatus: values.repairStatus,
        isMortgaged: values.isMortgaged,
        price: +values.price,
        area: +values.area,
        landArea: +values.landArea,
        pricePerSqm: +values.pricePerSqm,
        floor: +values.floor,
        totalFloors: +values.totalFloors,
        rooms: +values.rooms,
        bathrooms: +values.bathrooms,
        dailyPrice: +values.dailyRate,
        guestCount: +values.guestCount,
        nightCount: +values.nightCount,
        checkInTime: values.checkInTime,
        checkOutTime: values.checkOutTime,
        initialPayment: +values.initialPayment,
        monthlyPayment: +values.monthlyPayment,
        remainingYears: +values.remainingYears,
        remainingMonths: +values.remainingMonths,
        yearBuilt: values.yearBuilt,
        condition: values.condition,
        features: values.features,
        exit: values.exit,
        mortgage: values.mortgage === "yes",
        utilities: values.utilities,
        bedType: values.bedType,
        ownerLives: values.ownerLives,
        residentsCount: values.residentsCount,
        houseComposition: values.houseComposition,
        gender: values.gender,
        workStatus: values.workStatus,
        smoking: values.smoking,
        pets: values.pets,
        visitors: +values.visitors,
        description: values.description,
        selectedCity: values.selectedCity,
        selectedDistrict: values.selectedDistrict,
        selectedSettlement: values.selectedSettlement,
        selectedAddress: values.selectedAddress,
        latitude: values.latitude,
        longitude: values.longitude,
        virtualTour: values.virtualTour,
      };

      console.log(dto);

      // 2️⃣ dto JSON kimi əlavə olunur (RequestParam("dto"))
      formData.append("announcement", new Blob(
        [JSON.stringify(dto)],
        { type: "application/json" } // <-- vacibdir
      ));

      // 3️⃣ şəkilləri əlavə et
      values.images.forEach((img) => {
        if (img.file instanceof File) {
          formData.append("images", img.file);
        }
      });

      // 4️⃣ videolar varsa əlavə et
      values.videos.forEach((vid) => {
        if (vid.file instanceof File) {
          formData.append("videos", vid.file);
        }
      });
      // 🔹 Sadə text/string/number tipləri əlavə edirik
      // Object.keys(dto).forEach((key) => {
      //   // images, videos və s. xaric
      //   if (!["images", "videos", "uploadedFiles"].includes(key)) {
      //     formData.append(key, values[key]);
      //   }
      // });
      // 🔹 Əgər əlavə fayllar (uploadedFiles) varsa
      values.uploadedFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append("uploadedFiles", file);
        }
      });



      // 5️⃣ backend çağırışı
      await createAnnouncement(formData);
    },


    validateOnChange: false,
    validateOnBlur: false,
  });


  const getFormType = useCallback((formValues) => {
    if (formValues.announcementType === 'rentIn') return 'rentIn';
    else if (formValues.announcementType === 'buy') return 'buy';
    else return 'default';
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
        const res = await formik.submitForm();
        // console.log(res);

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

    switch (formIndex) {
      case 0:
        return (
          <NewAnnc
            {...commonProps}
            activeButton={formik.values.announcementType}
            onAnnouncementTypeChange={handleAnnouncementTypeChange}
          />
        );
      case 1:
        switch (formik.values.announcementType) {
          case 'sell':
            return (
              <ForSale
                {...commonProps}
                activePropertyType={formik.values.propertyType}
                setActivePropertyType={(type) => formik.setFieldValue('propertyType', type)}
              />
            );
          case 'rentOut':
            return (
              <ForRent
                {...commonProps}
                activePropertyType={formik.values.propertyType}
                setActivePropertyType={(type) => formik.setFieldValue('propertyType', type)}
              />
            );
          case 'buy':
            return (
              <Daily
                {...commonProps}
                activePropertyType={formik.values.propertyType}
                setActivePropertyType={(type) => formik.setFieldValue('propertyType', type)}
              />
            );
          case 'rentIn':
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
      case 2:
        const formType = getFormType(formik.values);
        if (formType === 'rentIn') {
          return <RoommateAnncDetails {...commonProps} activePropertyType={formik.values.propertyType} />;
        } else if (formType === 'buy') {
          return <DailyAnncDetails {...commonProps} activePropertyType={formik.values.propertyType} />
        } else {
          return <AnncDetails {...commonProps} activePropertyType={formik.values.propertyType} />;
        }
      case 3:
        return <Location {...commonProps} />
      case 4:
        return <Media {...commonProps} />
      default:
        return <div></div>;
    }
  };

  const isCurrentStepValid = () => {
    if (isValidatingStep) return false;


    switch (formIndex) {

      case 0:
        return !!formik.values.announcementType && Object.keys(stepErrors).length === 0;

      case 1:

        const hasPropertyType = !!formik.values.propertyType;
        const hasNoStepErrors = Object.keys(stepErrors).length === 0;

        return hasPropertyType && hasNoStepErrors;

      case 2:
        return Object.keys(stepErrors).length === 0;

      case 3:
        return (
          !!formik.values.selectedCity &&
          !!formik.values.selectedDistrict &&
          !!formik.values.selectedSettlement &&
          !!formik.values.selectedAddress?.trim() &&
          formik.values.selectedAddress.length >= 10 &&
          Object.keys(stepErrors).length === 0
        );
      case 4:
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
      <section className='min-[430px]:bg-white min-[430px]:px-8 min-[430px]:pt-10 min-[430px]:pb-[68px] min-[430px]:rounded-xl min-[430px]:shadow-[0_4px_10px_rgba(0,0,0,0.15)]'>
        <div className='flex gap-9'>
          <div className='max-[768px]:hidden w-[340px] h-auto px-[19px] py-[34.5px] rounded-xl border-[0.5px] border-primary shadow-[0_4px_10px_rgba(0,0,0,0.15)]'>
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
                <h1 className='text-center text-[20px] font-semibold main-logo-style'>INVEST <span className='text-primary'>HOME</span></h1>
              </div>
            </div>

            <ul className="mt-[38px] flex flex-col gap-4">
              <div className="accordion">
                <div className='accordion-head flex gap-1.5'>
                  <div
                    className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${formIndex >= 0 ? 'bg-primary' : 'bg-[#9CA3AF]'}`}
                  />
                  <li
                    className={`transition-colors duration-300 ease-in-out w-full font-medium text-[14px] px-5 py-4 rounded-lg ${formIndex === 0
                      ? 'bg-[#02836F1A] text-primary'
                      : formIndex > 0
                        ? 'bg-[#02836F1A] text-primary'
                        : 'bg-white text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]'
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
                  <div className='mt-4 flex flex-col gap-7'>
                    <div className='flex items-center gap-2.5 relative'>
                      <div className="radio-container">
                        <div className={`radio-outline rounded-[100%] flex items-center justify-center border-2 w-5 h-5 transition-colors duration-300 ease-in-out ${formIndex >= 1 ? 'border-primary' : 'border-[#6C707A]'
                          }`}>
                          <div className={`radio-base rounded-[100%] w-2.5 h-2.5 transition-colors duration-300 ease-in-out ${formIndex >= 1 ? 'bg-primary' : 'bg-[#6C707A]'
                            }`}></div>
                        </div>
                      </div>
                      <span className='text-[#737373] text-[16px]'>Xüsusiyyətlər</span>
                      <div className='line absolute w-px h-7 rounded-[1px] bg-primary left-2.5 top-6 translate-x-[-50%] translate-y-0'></div>
                    </div>
                    <div className='flex items-center gap-2.5 relative'>
                      <div className="radio-container">
                        <div className={`radio-outline rounded-[100%] flex items-center justify-center border-2 w-5 h-5 transition-colors duration-300 ease-in-out ${formIndex >= 2 ? 'border-primary' : 'border-[#6C707A]'
                          }`}>
                          <div className={`radio-base rounded-[100%] w-2.5 h-2.5 transition-colors duration-300 ease-in-out ${formIndex >= 2 ? 'bg-primary' : 'bg-[#6C707A]'
                            }`}></div>
                        </div>
                      </div>
                      <span className='text-[#737373] text-[16px]'>Detallar</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion">
                <div className=' accordion-head flex gap-1.5'>
                  <div
                    className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${formIndex >= 3 ? 'bg-primary' : 'bg-[#9CA3AF]'}`}
                  />
                  <li
                    className={`transition-colors duration-300 ease-in-out w-full font-medium text-[14px] px-5 py-4 rounded-lg ${formIndex === 3
                      ? 'bg-[#02836F1A] text-primary'
                      : formIndex > 3
                        ? 'bg-[#02836F1A] text-primary'
                        : 'bg-white text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]'
                      }`}
                  >
                    Ünvan
                  </li>
                </div>
              </div>
              <div className="accordion">
                <div className=' accordion-head flex gap-1.5'>
                  <div
                    className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${formIndex >= 4 ? 'bg-primary' : 'bg-[#9CA3AF]'}`}
                  />
                  <li
                    className={`transition-colors duration-300 ease-in-out w-full font-medium text-[14px] px-5 py-4 rounded-lg ${formIndex === 4
                      ? 'bg-[#02836F1A] text-primary'
                      : formIndex > 4
                        ? 'bg-[#02836F1A] text-primary'
                        : 'bg-white text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]'
                      }`}
                  >
                    Media
                  </li>
                </div>
              </div>
            </ul>
          </div>

          <div className='basis-[calc(100%-376px)] min-[768px]:min-w-[50%] max-[768px]:min-w-full flex flex-col justify-between'>
            {renderFormContent()}

            <div className={`buttons-container ${formIndex === 0 ? "min-[768px]:justify-end" : "justify-between"} flex max-[768px]:flex-col-reverse gap-5 mt-4`}>
              {formIndex === 0 ? (
                <>
                  <button
                    onClick={handleNextClick}
                    disabled={!isCurrentStepValid() || isValidatingStep}
                    className={`max-[768px]:justify-center cursor-pointer flex items-center gap-3 rounded-lg py-3 px-[34px] transition-all duration-200 ${isCurrentStepValid() && !isValidatingStep
                      ? 'bg-primary text-[white] hover:opacity-90'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                  >
                    <span className='font-medium text-[16px]'>
                      {isValidatingStep ? 'Yoxlanılır...' : 'Növbəti'}
                    </span>
                    {!isValidatingStep && <Image src={arrowRightWhite} alt="Arrow Right White" />}
                  </button>
                </>
              ) : formIndex === 4 ? (
                <>
                  <button
                    onClick={() => changeForm("decrement")}
                    disabled={isValidatingStep}
                    className='max-[768px]:justify-center cursor-pointer flex items-center gap-3 text-[white] bg-primary rounded-lg py-3 px-[34px] hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <Image src={arrowLeftWhite} alt="Arrow Left White" />
                    <span className='line-clamp-1 font-medium text-[16px]'>Geriyə Qayıt</span>
                  </button>
                  <button
                    onClick={handleConfirmClick}
                    disabled={!isCurrentStepValid() || isValidatingStep}
                    className={`max-[768px]:justify-center cursor-pointer rounded-lg py-3 px-[34px] transition-all duration-200 ${isCurrentStepValid() && !isValidatingStep
                      ? 'bg-primary text-[white] hover:opacity-90'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                  >
                    <span className='font-medium text-[16px]'>
                      {isValidatingStep ? 'Yoxlanılır...' : 'Təsdiqlə'}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => changeForm("decrement")}
                    disabled={isValidatingStep}
                    className='max-[768px]:justify-center cursor-pointer flex items-center gap-3 text-[white] bg-primary rounded-lg py-3 px-[34px] hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <Image src={arrowLeftWhite} alt="Arrow Left White" />
                    <span className='line-clamp-1 font-medium text-[16px]'>Geriyə Qayıt</span>
                  </button>
                  <button
                    onClick={handleNextClick}
                    disabled={!isCurrentStepValid() || isValidatingStep}
                    className={`max-[768px]:justify-center cursor-pointer flex items-center gap-3 rounded-lg py-3 px-[34px] transition-all duration-200 ${isCurrentStepValid() && !isValidatingStep
                      ? 'bg-primary text-[white] hover:opacity-90'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                  >
                    <span className='font-medium text-[16px]'>
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
          <ConfirmationModal
            isOpen={isModalOpen}
            text={"Təbriklər! Elanınız yoxlanış üçün göndərildi. Təsdiqləndikdən sonra  paylaşılacaq. Təşəkkür edirik."} />
        </>
      )
      }
    </>
  );
};

export default AnnouncementForm