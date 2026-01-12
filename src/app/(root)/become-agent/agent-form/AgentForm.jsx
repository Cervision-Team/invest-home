"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PrivateInfo from "./form/PrivateInfo";
import OtherInfo from "./form/OtherInfo";
import Preview from "./form/Preview";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import arrowRightWhite from "../../../../../public/icons/arrow-right-white-small.svg";
import arrowLeftWhite from "../../../../../public/icons/arrow-left-white.svg";
import { createAgent, getMyAgents } from "@/services/api/endpoints/agentService";
import Loader from "@/components/ui/Loader";

const AgentForm = () => {
  const accordionRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);
  const [height, setHeights] = useState(["0px", "0px", "0px"]);
  const [formIndex, setFormIndex] = useState(0);
  const [visitedSections, setVisitedSections] = useState([true, false, false]);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
    experiences: [],
    educations: [],
    age: "",
    residentialAddress: "",
    cv: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStepValid, setCurrentStepValid] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [myAgents, setMyAgents] = useState([]);
  const [myAgentsLoading, setMyAgentsLoading] = useState(true);
  const [myAgentsError, setMyAgentsError] = useState(null);
  const [expandedAgentId, setExpandedAgentId] = useState(null);

  useEffect(() => {
    openAccordion(0);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setMyAgentsLoading(true);
        setMyAgentsError(null);
        const data = await getMyAgents({ pageIndex: 0, pageSize: 50 });
        const content = Array.isArray(data?.content) ? data.content : [];
        if (alive) setMyAgents(content);
      } catch (e) {
        if (alive) setMyAgentsError("Sorğular yüklənmədi");
      } finally {
        if (alive) setMyAgentsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setCurrentStepValid(false);
    setShowAllErrors(false);
    setSubmitError(null);
    setSubmitting(false);
    setFormData({
      name: "",
      surname: "",
      email: "",
      phoneNumber: "",
      experiences: [],
      educations: [],
      age: "",
      residentialAddress: "",
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

    setSubmitting(true);
    setSubmitError(null);
    const toISODate = (value) => {
      if (!value) return null;
      if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
      }
      const s = String(value).trim();
      if (!s) return null;
      // Accept YYYY-MM-DD or YYYY-MM; normalize month-only to first day.
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
      if (/^\d{4}-\d{2}$/.test(s)) return `${s}-01`;
      return null;
    };

    const agentPayload = {
      name: formData?.name || "",
      surname: formData?.surname || "",
      age: formData?.age === "" ? null : Number(formData?.age),
      phoneNumber: formData?.phoneNumber || "",
      email: formData?.email || "",
      residentialAddress: formData?.residentialAddress || "",
      about: formData?.about ?? null,
      // Some backends persist this field directly; keep both casings for compatibility.
      cvURL: formData?.cv?.name || null,
      experiences: (formData?.experiences || []).map((exp) => {
        const isCurrent = Boolean(exp?.isCurrent ?? exp?.current);
        return {
          position: exp?.position || "",
          company: exp?.company || "",
          startDate: toISODate(exp?.startDate ?? exp?.startMonth),
          endDate: isCurrent ? null : toISODate(exp?.endDate ?? exp?.endMonth),
          description: exp?.description || "",
          current: isCurrent,
        };
      }),
      educations: (formData?.educations || []).map((edu) => ({
        institution: edu?.institution || "",
        degree: edu?.degree || "",
        startDate: toISODate(edu?.startDate ?? edu?.startMonth),
        endDate: toISODate(edu?.endDate ?? edu?.endMonth),
        description: edu?.description || "",
      })),
    };

    console.log("agentPayload", agentPayload);

    const formData1 = new FormData();
    formData1.append(
      "agent",
      new Blob([JSON.stringify(agentPayload)], { type: "application/json" })
    );

    if (formData?.cv) {
      formData1.append("file", formData.cv);
    } 

    try {
      for (const [key, value] of formData1.entries()) {
        if (typeof File !== "undefined" && value instanceof File) {
          console.log("FormData part", key, { name: value.name, size: value.size, type: value.type });
        } else {
          console.log("FormData part", key, value);
        }
      }
    } catch (e) {
      // ignore
    }

    try {
      await createAgent(formData1);
      const data = await getMyAgents({ pageIndex: 0, pageSize: 50 });
      const content = Array.isArray(data?.content) ? data.content : [];
      setMyAgents(content);
      resetForm();
      setIsModalOpen(true);
    } catch (err) {
      setSubmitError(err?.message || "Göndərmək mümkün olmadı");
    } finally {
      setSubmitting(false);
    }

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
      <section className="min-[430px]:bg-white min-[430px]:px-[32px] min-[430px]:pt-[40px] min-[430px]:pb-[40px] min-[430px]:rounded-[12px] min-[430px]:shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-start justify-between gap-[12px]">
            <div>
              <h2 className="text-[20px] font-[600]">Sorğularım</h2>
              {/* <p className="text-[#737373] text-[14px] mt-[4px]">Backend tokenə görə yalnız sənin göndərdiklərini göstərir.</p> */}
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-[10px] py-[10px] px-[14px] border-[1px] border-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.03)]"
            >
              Yeni müraciət yarat
            </button>
          </div>

          {myAgentsLoading ? (
            <div className="py-2">
              <Loader />
            </div>
          ) : myAgentsError ? (
            <p className="text-red-600 text-[14px]">{myAgentsError}</p>
          ) : myAgents.length === 0 ? (
            <p className="text-[#737373] text-[14px]">Hələ sorğu yoxdur.</p>
          ) : (
            <div className="flex flex-col gap-[10px]">
              {myAgents.map((agent) => {
                const fullName = `${agent?.name || ""} ${agent?.surname || ""}`.trim();
                const isExpanded = expandedAgentId === agent?.id;
                return (
                  <div key={agent?.id ?? fullName} className="border-[1px] border-[rgba(0,0,0,0.12)] rounded-[12px] p-[14px]">
                    <div className="flex flex-wrap items-center justify-between gap-[10px]">
                      <div className="min-w-0">
                        <p className="font-[600] truncate">{fullName || "-"}</p>
                        <p className="text-[#737373] text-[14px]">ID: {agent?.id ?? "-"} • {agent?.email || "-"} • {agent?.phoneNumber || "-"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedAgentId(isExpanded ? null : agent?.id)}
                        className="text-white bg-[var(--primary-color)] rounded-[10px] py-[8px] px-[12px] hover:opacity-90"
                      >
                        {isExpanded ? "Gizlət" : "Ətraflı"}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-[12px] grid grid-cols-1 min-[768px]:grid-cols-2 gap-[12px]">
                        <div>
                          <p className="text-[13px] text-[#737373]">Yaş</p>
                          <p className="font-[500]">{agent?.age ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-[13px] text-[#737373]">Ünvan</p>
                          <p className="font-[500]">{agent?.residentialAddress || "-"}</p>
                        </div>
                        <div className="min-[768px]:col-span-2">
                          <p className="text-[13px] text-[#737373]">CV</p>
                          <p className="font-[500]">{agent?.cvURL || "-"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

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
                    className={`flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${currentStepValid
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
                      className={`rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${currentStepValid && !submitting
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
                      className={`flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] transition-all duration-200 ${currentStepValid
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
