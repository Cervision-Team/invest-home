"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PrivateInfo from "./form/PrivateInfo";
import OtherInfo from "./form/OtherInfo";
import Preview from "./form/Preview";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import arrowRightWhite from "../../../../../public/icons/arrow-right-white-small.svg";
import arrowLeftWhite from "../../../../../public/icons/arrow-left-white.svg";
import { agentApplicationService, AgentApplicationStatus } from "@/services/agentApplicationService";

const AgentForm = () => {
  const accordionRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);
  const [height, setHeights] = useState(["0px", "0px", "0px"]);
  const [formIndex, setFormIndex] = useState(0);
  const [visitedSections, setVisitedSections] = useState([true, false, false]);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    experiences: [],
    educations: [],
    age: "",
    address: "",
    cv: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStepValid, setCurrentStepValid] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [mockApplication, setMockApplication] = useState(null);
  const [showSubmittedDetails, setShowSubmittedDetails] = useState(false);

  useEffect(() => {
    openAccordion(0);
  }, []);

  useEffect(() => {
    (async () => {
      const existing = await agentApplicationService.getMyApplication();
      if (existing) setMockApplication(existing);
    })();
  }, []);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusMeta = (status) => {
    switch (status) {
      case AgentApplicationStatus.APPROVED:
        return { label: "Təsdiqləndi", className: "bg-[#02836F1A] text-[var(--primary-color)]" };
      case AgentApplicationStatus.REJECTED:
        return { label: "Rədd edildi", className: "bg-[rgba(239,68,68,0.12)] text-red-600" };
      case AgentApplicationStatus.PENDING:
      default:
        return { label: "Gözləmədə", className: "bg-[#02836F1A] text-[var(--primary-color)]" };
    }
  };

  const resetMockApplication = () => {
    agentApplicationService.clearMyApplication();
    setMockApplication(null);
    setShowSubmittedDetails(false);
    setIsModalOpen(false);
    setCurrentStepValid(false);
    setShowAllErrors(false);
    setSubmitError(null);
    setSubmitting(false);

    setFormData({
      name: "",
      surname: "",
      email: "",
      phone: "",
      experiences: [],
      educations: [],
      age: "",
      address: "",
      cv: null,
    });

    setFormIndex(0);
    setVisitedSections([true, false, false]);
    openAccordion(0);
  };

  const handleNextClick = () => {
    if (currentStepValid) {
      changeForm("increment");
    } else {
      setShowAllErrors(true);
    }
  };

  const handleConfirmClick = async () => {
    if (!currentStepValid) {
      setShowAllErrors(true);
      return;
    }

    console.log("formData", formData);

    // Mock submit (no backend yet). When API is ready, swap service implementation.
    const record = await agentApplicationService.submitMyApplication(formData);
    console.log(record);
    setMockApplication(record);
    setShowSubmittedDetails(false);
    

    /*
      setSubmitting(true);
      setSubmitError(null);
      try {
        const formPayload = new FormData();
        const payload = {
          ...formData,
          // keep compatibility if backend expects fullName
          fullName: `${formData.name || ""} ${formData.surname || ""}`.trim(),
        };

        Object.entries(payload).forEach(([key, value]) => {
          if (value !== null) formPayload.append(key, value);
        });

        const res = await fetch("/api/agents/apply", {
          method: "POST",
          body: formPayload,
        });

        if (!res.ok) throw new Error("Failed to submit form");
        setIsModalOpen(true);
      } catch (err) {
        setSubmitError(err.message);
      } finally {
        setSubmitting(false);
      }
    */

    setIsModalOpen(true);
  };

  const changeForm = action => {
    let index = formIndex;
    if (action === "increment" && index < 2) index++;
    else if (action === "decrement" && index > 0) index--;
    else return;

    setVisitedSections(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });

    setFormIndex(index);
    openAccordion(index);
  };

  const openAccordion = indexToOpen => {
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
      {mockApplication ? (
        <section className="min-[430px]:bg-white min-[430px]:px-[32px] min-[430px]:pt-[40px] min-[430px]:pb-[40px] min-[430px]:rounded-[12px] min-[430px]:shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-start justify-between gap-[12px]">
              <div>
                <h2 className="text-[20px] font-[600]">Agent müraciətiniz</h2>
                <p className="text-[#737373] text-[14px] mt-[4px]">
                  Müraciət ID: <span className="font-[500]">{mockApplication.id}</span>
                </p>
                <p className="text-[#737373] text-[14px] mt-[2px]">
                  Göndərilmə tarixi: <span className="font-[500]">{new Date(mockApplication.submittedAt).toLocaleString()}</span>
                </p>
              </div>

              <span
                className={`px-[12px] py-[6px] rounded-[999px] text-[13px] font-[500] ${getStatusMeta(mockApplication.status).className}`}
              >
                {getStatusMeta(mockApplication.status).label}
              </span>
            </div>

            <div className="flex flex-wrap gap-[10px]">
              <button
                type="button"
                onClick={() => setShowSubmittedDetails((v) => !v)}
                className="text-white bg-[var(--primary-color)] rounded-[10px] py-[10px] px-[14px] hover:opacity-90"
              >
                {showSubmittedDetails ? "Formanı gizlət" : "Göndərdiyim formanı gör"}
              </button>

              <button
                type="button"
                onClick={resetMockApplication}
                className="rounded-[10px] py-[10px] px-[14px] border-[1px] border-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.03)]"
              >
                Yeni müraciət yarat
              </button>
            </div>

            {showSubmittedDetails && (
              <div className="mt-[8px] border-[1px] border-[rgba(0,0,0,0.12)] rounded-[12px] p-[14px]">
                <div className="grid grid-cols-1 min-[768px]:grid-cols-2 gap-[12px]">
                  <div>
                    <p className="text-[13px] text-[#737373]">Ad Soyad</p>
                    <p className="font-[500]">{mockApplication.data?.fullName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#737373]">Əlaqə</p>
                    <p className="font-[500]">{mockApplication.data?.email || "-"} • {mockApplication.data?.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#737373]">Yaş</p>
                    <p className="font-[500]">{mockApplication.data?.age || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#737373]">Ünvan</p>
                    <p className="font-[500]">{mockApplication.data?.address || "-"}</p>
                  </div>
                </div>

                <div className="mt-[14px]">
                  <p className="text-[14px] font-[600]">Təcrübələr</p>
                  {(mockApplication.data?.experiences || []).length === 0 ? (
                    <p className="text-[#737373] text-[14px] mt-[4px]">Təcrübə əlavə edilməyib.</p>
                  ) : (
                    <div className="mt-[8px] flex flex-col gap-[10px]">
                      {(mockApplication.data?.experiences || []).map((exp, idx) => (
                        <div key={idx} className="border-[1px] border-[rgba(0,0,0,0.12)] rounded-[10px] p-[10px]">
                          <p className="font-[500]">{exp?.position || "-"} • {exp?.company || "-"}</p>
                          <p className="text-[#737373] text-[14px]">
                            {exp?.startMonth || "-"} — {exp?.endMonth || "-"}
                          </p>
                          {exp?.description ? (
                            <p className="text-[#737373] text-[14px] mt-[4px]">{exp.description}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-[14px]">
                  <p className="text-[14px] font-[600]">Təhsil</p>
                  {(mockApplication.data?.educations || []).length === 0 ? (
                    <p className="text-[#737373] text-[14px] mt-[4px]">Təhsil əlavə edilməyib.</p>
                  ) : (
                    <div className="mt-[8px] flex flex-col gap-[10px]">
                      {(mockApplication.data?.educations || []).map((edu, idx) => (
                        <div key={idx} className="border-[1px] border-[rgba(0,0,0,0.12)] rounded-[10px] p-[10px]">
                          <p className="font-[500]">{edu?.institution || "-"}</p>
                          <p className="text-[#737373] text-[14px]">{edu?.degree || "-"}</p>
                          <p className="text-[#737373] text-[14px]">
                            {edu?.startMonth || "-"} — {edu?.endMonth || "-"}
                          </p>
                          {edu?.description ? (
                            <p className="text-[#737373] text-[14px] mt-[4px]">{edu.description}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-[14px]">
                  <p className="text-[14px] font-[600]">CV</p>
                  {(
                    typeof mockApplication.data?.cv === "string"
                      ? mockApplication.data.cv
                      : mockApplication.data?.cv?.name
                  ) ? (
                    <p className="text-[#737373] text-[14px] mt-[4px]">
                      {typeof mockApplication.data?.cv === "string"
                        ? mockApplication.data.cv
                        : mockApplication.data?.cv?.name}
                    </p>
                  ) : (
                    <p className="text-[#737373] text-[14px] mt-[4px]">CV əlavə edilməyib.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="min-[430px]:bg-white min-[430px]:px-[32px] min-[430px]:pt-[40px] min-[430px]:pb-[68px] min-[430px]:rounded-[12px] min-[430px]:shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
          <div className="flex gap-[36px]">
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

          <div className="basis-[calc(100%-376px)] min-[768px]:min-w-[50%] max-[768px]:min-w-[100%] flex flex-col justify-between">
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

            {submitError && (
              <p className="text-red-500 mt-4 text-center">{submitError}</p>
            )}

            <div className={`buttons-container ${formIndex === 0 ? "min-[768px]:justify-end" : "justify-between"} flex max-[768px]:flex-col-reverse gap-[20px] mt-[16px]`}>
              {formIndex === 0 ? (
                <button
                  onClick={handleNextClick}
                  disabled={!currentStepValid}
                  className={`flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${
                    currentStepValid
                      ? "bg-[var(--primary-color)] text-white hover:opacity-90"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                >
                  <span className="font-[500] text-[16px]">Növbəti</span>
                  <Image src={arrowRightWhite} alt="Arrow Right" />
                </button>
              ) : formIndex === 2 ? (
                <>
                  <button
                    onClick={() => changeForm("decrement")}
                    className="flex items-center gap-[12px] text-white bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] hover:opacity-90"
                  >
                    <Image src={arrowLeftWhite} alt="Arrow Left" />
                    <span className="font-[500] text-[16px]">Geriyə Qayıt</span>
                  </button>
                  <button
                    onClick={handleConfirmClick}
                    disabled={submitting || !currentStepValid}
                    className={`rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${
                      currentStepValid && !submitting
                        ? "bg-[var(--primary-color)] text-white hover:opacity-90"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                  >
                    {submitting ? "Yüklənir..." : "Təsdiqlə"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => changeForm("decrement")}
                    className="flex items-center gap-[12px] text-white bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] hover:opacity-90"
                  >
                    <Image src={arrowLeftWhite} alt="Arrow Left" />
                    <span className="font-[500] text-[16px]">Geriyə Qayıt</span>
                  </button>
                  <button
                    onClick={handleNextClick}
                    disabled={!currentStepValid}
                    className={`flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${
                      currentStepValid
                        ? "bg-[var(--primary-color)] text-white hover:opacity-90"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                  >
                    <span className="font-[500] text-[16px]">Növbəti</span>
                    <Image src={arrowRightWhite} alt="Arrow Right" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        </section>
      )}

      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          text="Təşəkkürlər! CV-niz uğurla yükləndi. Seçim nəticələri e-poçt vasitəsilə göndəriləcək."
          url=""
          // buttonText=""
        />
      )}
    </>
  );
};

export default AgentForm;
