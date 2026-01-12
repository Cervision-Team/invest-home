import { useState, useEffect } from "react";
import { agentFormSchema } from "@/lib/schemas/agentSchema";

const PrivateInfo = ({
  formData,
  updateForm,
  onValidationChange,
  showAllErrors,
  setShowAllErrors,
}) => {
  const [errors, setErrors] = useState({});
  const stepFields = ["name", "surname", "email", "phoneNumber", "experiences"];

  const buildStepData = (overrides = {}) =>
    stepFields.reduce((acc, field) => {
      acc[field] = Object.prototype.hasOwnProperty.call(overrides, field) ? overrides[field] : formData[field];
      return acc;
    }, {});

  const validateField = async (fieldName, value) => {
    // Special-case experiences: Yup may produce nested paths like experiences[0].endMonth
    if (fieldName === "experiences") {
      try {
        await agentFormSchema.validateAt("experiences", { ...formData, experiences: value });
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.experiences;
          Object.keys(copy).forEach((k) => {
            if (k.startsWith("experiences[")) delete copy[k];
          });
          return copy;
        });
      } catch (err) {
        if (err?.name === "ValidationError") {
          const newErrors = {};
          if (Array.isArray(err.inner) && err.inner.length) {
            err.inner.forEach((e) => {
              if (e.path) newErrors[e.path] = e.message;
            });
          } else if (err.path) {
            newErrors[err.path] = err.message;
          } else {
            newErrors.experiences = err.message;
          }

          setErrors((prev) => {
            const copy = { ...prev };
            Object.keys(copy).forEach((k) => {
              if (k === "experiences" || k.startsWith("experiences[")) delete copy[k];
            });
            return { ...copy, ...newErrors };
          });
        }
      }

      await checkFormValidity({ experiences: value });
      return;
    }

    try {
      await agentFormSchema.validateAt(fieldName, { ...formData, [fieldName]: value });
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    } catch (err) {
      if (err?.name === "ValidationError") {
        setErrors((prev) => ({ ...prev, [fieldName]: err.message }));
      }
    }
    await checkFormValidity({ [fieldName]: value });
  };

  const checkFormValidity = async (overrides = {}) => {
    try {
      await agentFormSchema.pick(stepFields).validate(buildStepData(overrides), { abortEarly: false });

      onValidationChange(true);
    } catch {
      onValidationChange(false);
    }
  };

  const validateAllFields = async () => {
    try {
      await agentFormSchema.pick(stepFields).validate(buildStepData(), { abortEarly: false });

      setErrors({});
      onValidationChange(true);
    } catch (err) {
      if (err.name === "ValidationError") {
        const newErrors = {};
        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
        onValidationChange(false);
      }
    }
  };

  useEffect(() => {
    if (showAllErrors) {
      validateAllFields();
      setShowAllErrors(false);
    }
  }, [showAllErrors]);

  useEffect(() => {
    checkFormValidity();
  }, [formData]);

  const inputClass = (field) =>
    `max-[430px]:placeholder-primary max-[430px]:text-[16px]
     max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary
     w-full outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px]
     input-field ${errors[field] ? "error" : ""}`;

  const baseInputClass = (hasError) =>
    `max-[430px]:placeholder-primary max-[430px]:text-[16px]
     max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary
     w-full outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px]
     input-field ${hasError ? "error" : ""}`;

  const getExpError = (index, field) => errors[`experiences[${index}].${field}`];

  const updateExperience = (index, field, value) => {
    const next = Array.isArray(formData.experiences) ? [...formData.experiences] : [];
    const current = next[index] || {
      position: "",
      company: "",
      startMonth: "",
      endMonth: "",
      isCurrent: false,
      description: "",
    };
    next[index] = { ...current, [field]: value };
    updateForm("experiences", next);
    validateField("experiences", next);
  };

  const addExperience = () => {
    const next = Array.isArray(formData.experiences) ? [...formData.experiences] : [];
    next.push({
      position: "",
      company: "",
      startMonth: "",
      endMonth: "",
      isCurrent: false,
      description: "",
    });
    updateForm("experiences", next);
  };

  const removeExperience = (index) => {
    const next = Array.isArray(formData.experiences) ? [...formData.experiences] : [];
    next.splice(index, 1);
    updateForm("experiences", next);
    validateField("experiences", next);
  };

  return (
    <>
      <style>{`
        .input-field {
          padding: 12px 16px;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(0, 0, 0, 0.12);
          border-radius: 12px;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          appearance: none;
          color: #1f2937;
        }


        .input-field:hover {
          border-color: #26B5A0;
        }

        .input-field:focus {
          outline: none;
          border-color: #1B8F7D;
          background-color: rgba(255, 255, 255, 0.98);
        }

        .input-field.error {
          border-color: #ef4444;
          background-color: rgba(254, 242, 242, 0.95);
          animation: shake 0.5s ease-in-out;
        }

        .input-field.error:hover {
          border-color: #dc2626;
        }

        .input-field.error:focus {
          border-color: #dc2626;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      <div className="w-full">
        <form>
          <div className="flex flex-col gap-4">
              {[
                { name: "name", label: "Ad", required: true, placeholder: "Ad" },
                { name: "surname", label: "Soyad", required: true, placeholder: "Soyad" },
                { name: "email", label: "Email", required: true, placeholder: "investhomeaz@gmail.com", type: "email" },
                { name: "phoneNumber", label: "Telefon", required: true, placeholder: "phoneNumber" },
              ].map(({ name, label, required, placeholder, type = "text" }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className={inputClass(name)}
                    value={formData[name] || ""}
                    onChange={(e) => {
                      updateForm(name, e.target.value);
                      validateField(name, e.target.value);
                    }}
                    onBlur={(e) => validateField(name, e.target.value)}
                  />
                  {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
                </div>
              ))}

              <div className="mt-2 flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-slate-700">Təcrübələr</label>
                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  + Təcrübə əlavə et
                </button>
              </div>

              {errors.experiences && <p className="text-red-500 text-sm">{errors.experiences}</p>}

              {(formData.experiences || []).map((exp, index) => (
                <div key={index} className="rounded-xl border border-black/10 bg-white p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-slate-900">Təcrübə {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Sil
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Vəzifə<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Məs: Satış meneceri"
                      className={baseInputClass(Boolean(getExpError(index, "position")))}
                      value={exp?.position || ""}
                      onChange={(e) => updateExperience(index, "position", e.target.value)}
                      onBlur={() => validateField("experiences", formData.experiences)}
                    />
                    {getExpError(index, "position") && <p className="text-red-500 text-sm">{getExpError(index, "position")}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Şirkət<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Məs: Invest Home"
                      className={baseInputClass(Boolean(getExpError(index, "company")))}
                      value={exp?.company || ""}
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
                      onBlur={() => validateField("experiences", formData.experiences)}
                    />
                    {getExpError(index, "company") && <p className="text-red-500 text-sm">{getExpError(index, "company")}</p>}
                  </div>

                  <div className="grid grid-cols-1 min-[430px]:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700">Başlama tarixi<span className="text-red-500">*</span></label>
                      <input
                        type="month"
                        className={baseInputClass(Boolean(getExpError(index, "startMonth")))}
                        value={exp?.startMonth || ""}
                        onChange={(e) => updateExperience(index, "startMonth", e.target.value)}
                        onBlur={() => validateField("experiences", formData.experiences)}
                      />
                      {getExpError(index, "startMonth") && <p className="text-red-500 text-sm">{getExpError(index, "startMonth")}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-700">Bitmə tarixi{exp?.isCurrent ? "" : <span className="text-red-500">*</span>}</label>
                      <input
                        type="month"
                        disabled={Boolean(exp?.isCurrent)}
                        className={baseInputClass(Boolean(getExpError(index, "endMonth")))}
                        value={exp?.isCurrent ? "" : (exp?.endMonth || "")}
                        onChange={(e) => updateExperience(index, "endMonth", e.target.value)}
                        onBlur={() => validateField("experiences", formData.experiences)}
                      />
                      {getExpError(index, "endMonth") && <p className="text-red-500 text-sm">{getExpError(index, "endMonth")}</p>}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      style={{ appearance: "auto", WebkitAppearance: "checkbox", accentColor: "var(--primary-color)" }}
                      checked={Boolean(exp?.isCurrent)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const next = Array.isArray(formData.experiences) ? [...formData.experiences] : [];
                        const current = next[index] || {
                          position: "",
                          company: "",
                          startMonth: "",
                          endMonth: "",
                          isCurrent: false,
                          description: "",
                        };
                        next[index] = {
                          ...current,
                          isCurrent: checked,
                          endMonth: checked ? "" : current.endMonth,
                        };
                        updateForm("experiences", next);
                        validateField("experiences", next);
                      }}
                    />
                    Hazırda burada işləyirəm
                  </label>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Təsvir</label>
                    <textarea
                      rows={3}
                      placeholder="Qısa təsvir (istəyə bağlı)"
                      className={baseInputClass(Boolean(getExpError(index, "description")))}
                      value={exp?.description || ""}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      onBlur={() => validateField("experiences", formData.experiences)}
                    />
                    {getExpError(index, "description") && <p className="text-red-500 text-sm">{getExpError(index, "description")}</p>}
                  </div>
                </div>
              ))}
          </div>
        </form>
      </div>
    </>
  );
};

export default PrivateInfo;
