"use client";
import React, { useEffect, useRef, useState } from "react";
import PrivateInfo from "./form/PrivateInfo";
import OtherInfo from "./form/OtherInfo";
import Preview from "./form/Preview";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { createAgent, getMyAgents } from "@/services/api/endpoints/agentService";
import Loader from "@/components/ui/Loader";
import { formatDateTime } from "@/lib/formatDateTime";

const AgentForm = () => {
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
  const [showAllMyAgents, setShowAllMyAgents] = useState(false);

  const steps = [
    {
      title: "Şəxsi məlumatlar",
      description: "Əlaqə və iş təcrübəsi",
    },
    {
      title: "Digər məlumatlar",
      description: "Təhsil, ünvan və CV",
    },
    {
      title: "Ön baxış",
      description: "Yekun yoxlama və təsdiq",
    },
  ];

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

  // If list is collapsed back to 3 items, ensure the expanded item is visible
  useEffect(() => {
    if (showAllMyAgents) return;
    if (!expandedAgentId) return;
    const visibleIds = myAgents.slice(0, 3).map((a) => a?.id).filter((v) => v != null);
    if (visibleIds.length > 0 && !visibleIds.includes(expandedAgentId)) {
      setExpandedAgentId(null);
    }
  }, [expandedAgentId, myAgents, showAllMyAgents]);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const visibleAgents = showAllMyAgents ? myAgents : myAgents.slice(0, 3);

  const getStatusMeta = (agent) => {
    const raw = agent?.status ?? agent?.agentStatus ?? agent?.state ?? "pending";
    const s = String(raw).trim().toLowerCase();

    if (s === "pending" || s === "awaiting" || s === "in review" || s === "in_review") {
      return {
        key: "pending",
        label: "Gözlənilir",
        className: "bg-[#F59E0B1A] text-[#B45309]",
      };
    }

    if (s === "approved" || s === "accepted" || s === "confirmed") {
      return {
        key: "approved",
        label: "Təsdiqləndi",
        className: "bg-[#10B9811A] text-[#047857]",
      };
    }

    if (s === "rejected" || s === "declined" || s === "denied") {
      return {
        key: "rejected",
        label: "İmtina",
        className: "bg-[#EF44441A] text-[#B91C1C]",
      };
    }

    const fallback = s
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .replace(/(^|\s)\S/g, (m) => m.toUpperCase());

    return {
      key: s || "pending",
      label: fallback || "Gözlənilir",
      className: "bg-[#02836F0D] text-(--primary-color)",
    };
  };

  const getCreatedAt = (agent) => agent?.createdAt ?? agent?.createdDate ?? agent?.created ?? agent?.createDate;

  const tryGetUrl = (value) => {
    if (!value) return null;
    const s = String(value).trim();
    if (!s) return null;
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    return null;
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
  };

  const goToStep = (nextIndex) => {
    if (!Number.isInteger(nextIndex)) return;
    if (nextIndex < 0 || nextIndex > 2) return;
    if (nextIndex > formIndex) return; // only allow navigating back

    setVisitedSections((prev) => {
      const updated = [...prev];
      updated[nextIndex] = true;
      return updated;
    });
    setFormIndex(nextIndex);
  };

  return (
    <>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-[#111] text-[24px] sm:text-[32px] font-semibold">
            Agent olmaq üçün müraciət
          </h1>
          <p className="text-3 mt-2 max-w-2xl">
            Məlumatları addım-addım doldurun. Son addımda ön baxış edib təsdiqləyə bilərsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <aside className="xl:col-span-1 flex flex-col gap-6">
            <div className="order-2 bg-white rounded-2xl shadow-sm border border-neutral-disabled/20 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#111]">Sorğularım</h2>
                  <p className="text-sm text-3 mt-1">Əvvəl göndərdiyiniz müraciətlər</p>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="shrink-0 rounded-xl px-4 py-2 text-sm font-medium border border-neutral-disabled/25 bg-white hover:bg-neutral transition"
                >
                  Formu yenilə
                </button>
              </div>

              <div className="mt-4">
                {myAgentsLoading ? (
                  <div className="py-4 flex items-center justify-center">
                    <Loader />
                  </div>
                ) : myAgentsError ? (
                  <p className="text-red-600 text-sm">{myAgentsError}</p>
                ) : myAgents.length === 0 ? (
                  <p className="text-3 text-sm">Hələ sorğu yoxdur.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div
                      className={
                        "flex flex-col gap-3 pr-1 overflow-y-auto " +
                        (showAllMyAgents ? "max-h-[560px]" : "max-h-[420px]")
                      }
                    >
                      {visibleAgents.map((agent) => {
                        const fullName = `${agent?.name || ""} ${agent?.surname || ""}`.trim();
                        const isExpanded = expandedAgentId === agent?.id;
                        const statusMeta = getStatusMeta(agent);
                        const createdAt = getCreatedAt(agent);

                        const experiences = Array.isArray(agent?.experiences) ? agent.experiences : [];
                        const educations = Array.isArray(agent?.educations) ? agent.educations : [];
                        const cvDisplay = agent?.cvURL ?? agent?.cvUrl ?? agent?.cv ?? null;
                        const cvUrl = tryGetUrl(cvDisplay);

                        return (
                          <div
                            key={agent?.id ?? fullName}
                            className="rounded-xl border border-neutral-disabled/20 bg-white p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-semibold truncate">{fullName || "-"}</p>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <span className="text-3 text-xs">ID: {agent?.id ?? "-"}</span>
                                  <span
                                    className={
                                      "text-xs px-2 py-0.5 rounded-full " +
                                      (statusMeta?.className || "bg-[#F59E0B1A] text-[#B45309]")
                                    }
                                  >
                                    {statusMeta?.label || "Gözlənilir"}
                                  </span>
                                  {createdAt ? (
                                    <span className="text-3 text-xs">{formatDateTime(createdAt, { fallback: "" })}</span>
                                  ) : null}
                                </div>
                                <p className="text-3 text-xs mt-1 truncate">{agent?.email || "-"}</p>
                                <p className="text-3 text-xs mt-1 truncate">{agent?.phoneNumber || "-"}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setExpandedAgentId(isExpanded ? null : agent?.id)}
                                className="shrink-0 rounded-xl px-3 py-2 text-sm font-medium bg-(--primary-color) text-white hover:opacity-90 transition"
                              >
                                {isExpanded ? "Gizlət" : "Ətraflı"}
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="mt-4 rounded-xl border border-neutral-disabled/20 bg-neutral/40 p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-3">Yaş</p>
                                    <p className="text-sm font-medium text-[#111] mt-0.5">{agent?.age ?? "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-3">Ünvan</p>
                                    <p className="text-sm font-medium text-[#111] mt-0.5 wrap-break-word">
                                      {agent?.residentialAddress || "-"}
                                    </p>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <div className="flex items-center justify-between gap-3">
                                      <p className="text-xs text-3">CV</p>
                                      {cvUrl ? (
                                        <a
                                          href={cvUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-xs font-semibold text-(--primary-color) hover:underline"
                                        >
                                          Aç
                                        </a>
                                      ) : null}
                                    </div>
                                    <p className="text-sm font-medium text-[#111] mt-0.5 wrap-break-word">
                                      {cvDisplay || "-"}
                                    </p>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <p className="text-xs text-3">Təcrübə</p>
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-neutral-disabled/20 text-[#111]">
                                        {experiences.length} ədəd
                                      </span>
                                    </div>
                                    {experiences.length === 0 ? (
                                      <p className="text-sm font-medium text-[#111] mt-1">-</p>
                                    ) : (
                                      <div className="mt-2 flex flex-col gap-2">
                                        {experiences.slice(0, 2).map((exp, idx) => {
                                          const title = [exp?.position, exp?.company].filter(Boolean).join(" • ");
                                          const start = exp?.startDate ?? exp?.startMonth ?? "";
                                          const end = exp?.endDate ?? exp?.endMonth ?? "";
                                          const isCurrent = Boolean(exp?.current ?? exp?.isCurrent);
                                          const range = start || end || isCurrent ? `${start || "?"} → ${isCurrent ? "Hazırda" : (end || "?")}` : null;
                                          return (
                                            <div key={exp?.id ?? idx} className="rounded-lg bg-white border border-neutral-disabled/20 p-3">
                                              <p className="text-sm font-semibold text-[#111] truncate">{title || "-"}</p>
                                              {range ? <p className="text-xs text-3 mt-1">{range}</p> : null}
                                            </div>
                                          );
                                        })}
                                        {experiences.length > 2 ? (
                                          <p className="text-xs text-3">+ {experiences.length - 2} daha</p>
                                        ) : null}
                                      </div>
                                    )}
                                  </div>

                                  <div className="sm:col-span-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <p className="text-xs text-3">Təhsil</p>
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-neutral-disabled/20 text-[#111]">
                                        {educations.length} ədəd
                                      </span>
                                    </div>
                                    {educations.length === 0 ? (
                                      <p className="text-sm font-medium text-[#111] mt-1">-</p>
                                    ) : (
                                      <div className="mt-2 flex flex-col gap-2">
                                        {educations.slice(0, 2).map((edu, idx) => {
                                          const title = [edu?.institution, edu?.degree].filter(Boolean).join(" • ");
                                          const start = edu?.startDate ?? edu?.startMonth ?? "";
                                          const end = edu?.endDate ?? edu?.endMonth ?? "";
                                          const range = start || end ? `${start || "?"} → ${end || "?"}` : null;
                                          return (
                                            <div key={edu?.id ?? idx} className="rounded-lg bg-white border border-neutral-disabled/20 p-3">
                                              <p className="text-sm font-semibold text-[#111] truncate">{title || "-"}</p>
                                              {range ? <p className="text-xs text-3 mt-1">{range}</p> : null}
                                            </div>
                                          );
                                        })}
                                        {educations.length > 2 ? (
                                          <p className="text-xs text-3">+ {educations.length - 2} daha</p>
                                        ) : null}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {myAgents.length > 3 ? (
                      <button
                        type="button"
                        onClick={() => setShowAllMyAgents((v) => !v)}
                        className="mt-1 w-full rounded-xl px-4 py-2.5 text-sm font-semibold border border-neutral-disabled/25 bg-white hover:bg-neutral transition"
                      >
                        {showAllMyAgents ? "Daha az" : `Daha çox (${myAgents.length - 3})`}
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <div className="order-1 bg-white rounded-2xl shadow-sm border border-neutral-disabled/20 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[18px] font-semibold text-[#111]">Addımlar</h2>
                <span className="text-sm text-3">{formIndex + 1}/{steps.length}</span>
              </div>

              <ol className="mt-4 flex flex-col gap-2">
                {steps.map((step, idx) => {
                  const isActive = idx === formIndex;
                  const isDone = idx < formIndex;
                  const canGoBack = idx <= formIndex;

                  return (
                    <li key={step.title}>
                      <button
                        type="button"
                        onClick={() => goToStep(idx)}
                        disabled={!canGoBack}
                        className={
                          "w-full flex items-start gap-3 rounded-xl px-3 py-3 border transition text-left " +
                          (isActive
                            ? "border-(--primary-color) bg-[#02836F0D]"
                            : "border-neutral-disabled/20 bg-white") +
                          (canGoBack ? " hover:bg-neutral" : " opacity-60 cursor-not-allowed")
                        }
                      >
                        <div
                          className={
                            "mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 " +
                            (isDone
                              ? "bg-(--primary-color) text-white"
                              : isActive
                                ? "bg-(--primary-color) text-white"
                                : "bg-neutral text-[#111]")
                          }
                        >
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className={"font-medium truncate " + (isActive ? "text-[#111]" : "text-[#111]")}>{step.title}</div>
                          <div className="text-xs text-3 mt-0.5">{step.description}</div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          <section className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-disabled/20 p-5 sm:p-8">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#111]">
                    {steps[formIndex]?.title}
                  </h2>
                  <p className="text-sm text-3 mt-1">{steps[formIndex]?.description}</p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-neutral text-[#111]">
                  Addım {formIndex + 1}
                </span>
              </div>

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
                <p className="text-red-600 mt-6 text-sm">{submitError}</p>
              )}

              <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  {formIndex > 0 ? (
                    <button
                      type="button"
                      onClick={() => changeForm("decrement")}
                      className="w-full sm:w-auto rounded-xl px-5 py-3 text-sm font-semibold border border-neutral-disabled/25 bg-white hover:bg-neutral transition"
                    >
                      Geriyə qayıt
                    </button>
                  ) : null}
                </div>

                {formIndex < 2 ? (
                  <button
                    type="button"
                    onClick={handleNextClick}
                    disabled={!currentStepValid}
                    className={
                      "w-full sm:w-auto rounded-xl px-6 py-3 text-sm font-semibold transition text-white " +
                      (currentStepValid
                        ? "bg-(--primary-color) hover:opacity-90"
                        : "bg-neutral-disabled cursor-not-allowed")
                    }
                  >
                    Növbəti
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmClick}
                    disabled={submitting || !currentStepValid}
                    className={
                      "w-full sm:w-auto rounded-xl px-6 py-3 text-sm font-semibold transition text-white " +
                      (currentStepValid && !submitting
                        ? "bg-(--primary-color) hover:opacity-90"
                        : "bg-neutral-disabled cursor-not-allowed")
                    }
                  >
                    {submitting ? "Göndərilir..." : "Təsdiqlə"}
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>


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
