import { agentFormSchema } from "@/lib/schemas/agentSchema";
import { useState, useRef, useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { GiSandsOfTime } from "react-icons/gi";

const Preview = ({ formData, updateForm, onValidationChange, showAllErrors, setShowAllErrors }) => {
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const stepFields = {
    otherInfo: ["educations", "age", "residentialAddress", "cv"],
    privateInfo: ["name", "surname", "email", "phoneNumber", "experiences"],
  };

  const allFields = [...stepFields.privateInfo, ...stepFields.otherInfo];

  // Validate a single field (and then re-check all fields using an override so latest value is included)
  const validateField = async (fieldName, value, customError = null) => {
    if (typeof customError === "string" && customError) {
      // set provided custom error and mark invalid
      setErrors(prev => ({ ...prev, [fieldName]: customError }));
      onValidationChange(false);
      return;
    }

    // Try per-field Yup validation (uses a merged object so the immediate value is considered)
    // Special-case experiences/educations because Yup produces nested paths like experiences[0].endMonth
    if (fieldName === "experiences" || fieldName === "educations") {
      const nestedPrefix = fieldName;
      try {
        await agentFormSchema.validateAt(nestedPrefix, { ...formData, [nestedPrefix]: value });
        setErrors(prev => {
          const copy = { ...prev };
          delete copy[nestedPrefix];
          Object.keys(copy).forEach(k => {
            if (k.startsWith(`${nestedPrefix}[`)) delete copy[k];
          });
          return copy;
        });
      } catch (err) {
        if (err && err.name === "ValidationError") {
          const newErrors = {};
          if (Array.isArray(err.inner) && err.inner.length) {
            err.inner.forEach(e => {
              if (e.path) newErrors[e.path] = e.message;
            });
          } else if (err.path) {
            newErrors[err.path] = err.message;
          } else {
            newErrors[nestedPrefix] = err.message;
          }

          setErrors(prev => {
            const copy = { ...prev };
            Object.keys(copy).forEach(k => {
              if (k === nestedPrefix || k.startsWith(`${nestedPrefix}[`)) delete copy[k];
            });
            return { ...copy, ...newErrors };
          });
        }
      }

      await checkFormValidity({ [nestedPrefix]: value });
      return;
    }

    try {
      await agentFormSchema.validateAt(fieldName, { ...formData, [fieldName]: value });
      // remove field-specific error if it passed
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
    } catch (err) {
      if (err && err.name === "ValidationError") {
        setErrors(prev => ({ ...prev, [fieldName]: err.message }));
      }
    }

    // Now check overall validity for all fields, including this override value
    await checkFormValidity({ [fieldName]: value });
  };

  // Validate allFields (or with overrides). Builds errors map that only contains failing fields.
  const checkFormValidity = async (overrides = {}) => {
    // Build combined data from formData + overrides
    const currentStepData = allFields.reduce((acc, field) => {
      acc[field] = Object.prototype.hasOwnProperty.call(overrides, field) ? overrides[field] : formData[field];
      return acc;
    }, {});

    try {
      await agentFormSchema.pick(allFields).validate(currentStepData, { abortEarly: false });
      // success -> remove errors for these fields
      setErrors(prev => {
        const copy = { ...prev };
        allFields.forEach(f => delete copy[f]);
        // also remove nested experiences/educations errors
        Object.keys(copy).forEach(k => {
          if (k.startsWith("experiences[")) delete copy[k];
          if (k.startsWith("educations[")) delete copy[k];
        });
        return copy;
      });
      onValidationChange(true);
      return true;
    } catch (err) {
      // If Yup validation error - extract inner array and set errors accordingly
      if (err && err.name === "ValidationError") {
        const newErrors = {};
        err.inner.forEach(e => {
          if (e.path) newErrors[e.path] = e.message;
        });

        setErrors(prev => {
          // Remove any previous errors for fields that no longer fail
          const copy = { ...prev };
          allFields.forEach(f => {
            if (!newErrors[f]) delete copy[f];
          });
          // Remove any previous nested experiences errors that no longer fail
          Object.keys(copy).forEach(k => {
            if (k.startsWith("experiences[") && !newErrors[k]) delete copy[k];
              if (k.startsWith("educations[") && !newErrors[k]) delete copy[k];
          });
          return { ...copy, ...newErrors };
        });

        onValidationChange(false);
        return false;
      } else {
        onValidationChange(false);
        return false;
      }
    }
  };

  // validateAllFields - explicitly shows errors for all fields (used when showAllErrors triggered)
  const validateAllFields = async () => {
    await checkFormValidity();
  };

  // Trigger validateAllFields when showAllErrors becomes true
  useEffect(() => {
    if (showAllErrors) {
      validateAllFields();
      setShowAllErrors(false); // Reset the trigger
    }
  }, [showAllErrors]);

  // Re-run validity check when form data changes
  useEffect(() => {
    checkFormValidity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // Extra safety: if any error exists in local state, make sure parent knows step is invalid
  useEffect(() => {
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) onValidationChange(false);
  }, [errors, onValidationChange]);

  // ------------ File helpers (unchanged logic, but using validateField override) ------------
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!file) return { isValid: false, error: "Fayl seçilməyib" };
    if (file.size > maxSize) return { isValid: false, error: "Fayl ölçüsü 5MB-dan çox ola bilməz" };
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: "Yalnız PDF və Word faylları qəbul edilir" };
    }
    return { isValid: true };
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      // pass custom error
      validateField("cv", "", validation.error);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 100);

    try {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      }

      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        file: file,
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadProgress(100);

      updateForm("cv", fileData);
      // validate field and re-check all fields using override so latest value is included
      await validateField("cv", fileData);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      validateField("cv", "", "Fayl yükləmə zamanı xəta baş verdi");
      setIsUploading(false);
      setUploadProgress(0);
    }

    clearInterval(progressInterval);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const removeFile = () => {
    updateForm("cv", null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // remove cv error if any
    setErrors(prev => {
      const copy = { ...prev };
      delete copy.cv;
      return copy;
    });
    // re-check validity after removal
    checkFormValidity();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getExpError = (index, field) => errors[`experiences[${index}].${field}`];
  const getEduError = (index, field) => errors[`educations[${index}].${field}`];

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
    validateField("experiences", next);
  };

  const removeExperience = (index) => {
    const next = Array.isArray(formData.experiences) ? [...formData.experiences] : [];
    next.splice(index, 1);
    updateForm("experiences", next);
    validateField("experiences", next);
  };

  const updateEducation = (index, field, value) => {
    const next = Array.isArray(formData.educations) ? [...formData.educations] : [];
    const current = next[index] || {
      institution: "",
      degree: "",
      startMonth: "",
      endMonth: "",
      description: "",
    };
    next[index] = { ...current, [field]: value };
    updateForm("educations", next);
    validateField("educations", next);
  };

  const addEducation = () => {
    const next = Array.isArray(formData.educations) ? [...formData.educations] : [];
    next.push({
      institution: "",
      degree: "",
      startMonth: "",
      endMonth: "",
      description: "",
    });
    updateForm("educations", next);
    validateField("educations", next);
  };

  const removeEducation = (index) => {
    const next = Array.isArray(formData.educations) ? [...formData.educations] : [];
    next.splice(index, 1);
    updateForm("educations", next);
    validateField("educations", next);
  };

  // ----------------- JSX (your form UI, unchanged except validation wiring uses the new funcs) -----------------
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
          .remove-arrow::-webkit-outer-spin-button,
          .remove-arrow::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .remove-arrow {
            -moz-appearance: textfield;
          }

      `}</style>

      <div className="min-w-0 max-[430px]:gap-[16px] max-[430px]:flex-col flex max-[1200px]:gap-[40px] gap-[95px] pb-[16px] min-[768px]:border-b-[1px] border-[rgba(0,0,0,0.2)]">
        <div className="min-w-0 basis-[50%]">
          <form action="">
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label className="max-[430px]:hidden" htmlFor="">
                  Ad<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Ad"
                  className={`input-field ${errors.name ? "error" : ""}`}
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => {
                    updateForm("name", e.target.value);
                    validateField("name", e.target.value);
                  }}
                  onBlur={(e) => validateField("name", e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="max-[430px]:hidden" htmlFor="">
                  Soyad<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Soyad"
                  className={`input-field ${errors.surname ? "error" : ""}`}
                  type="text"
                  value={formData.surname || ""}
                  onChange={(e) => {
                    updateForm("surname", e.target.value);
                    validateField("surname", e.target.value);
                  }}
                  onBlur={(e) => validateField("surname", e.target.value)}
                />
                {errors.surname && <p className="text-red-500 text-sm">{errors.surname}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <label className="max-[430px]:hidden" htmlFor="">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="investhomeaz@gmail.com"
                  className={`input-field ${errors.email ? "error" : ""}`}
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => {
                    updateForm("email", e.target.value);
                    validateField("email", e.target.value);
                  }}
                  onBlur={(e) => validateField("email", e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-[8px]">
                <label className="max-[430px]:hidden" htmlFor="">
                  Telefon<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder=""
                  className={`input-field ${errors.phoneNumber ? "error" : ""}`}
                  type="phone"
                  value={formData.phoneNumber || ""}
                  onChange={(e) => {
                    updateForm("phoneNumber", e.target.value);
                    validateField("phoneNumber", e.target.value);
                  }}
                  onBlur={(e) => validateField("phoneNumber", e.target.value)}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
              </div>

              <div className="mt-[8px] flex items-center justify-between">
                <label className="max-[430px]:hidden">
                  Təcrübələr
                </label>
                <button
                  type="button"
                  onClick={addExperience}
                  className="text-white bg-[var(--primary-color)] rounded-[8px] py-[8px] px-[14px] hover:opacity-90"
                >
                  + Təcrübə əlavə et
                </button>
              </div>

              {errors.experiences && <p className="text-red-500 text-sm">{errors.experiences}</p>}

              {(formData.experiences || []).map((exp, index) => (
                <div key={index} className="border-[1px] border-[rgba(0,0,0,0.12)] rounded-[12px] p-[12px] flex flex-col gap-[12px]">
                  <div className="flex items-center justify-between">
                    <p className="font-[500] text-[14px]">Təcrübə {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-800 text-[14px]"
                    >
                      Sil
                    </button>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="max-[430px]:hidden">Vəzifə<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Məs: Satış meneceri"
                      className={`input-field ${getExpError(index, "position") ? "error" : ""}`}
                      value={exp?.position || ""}
                      onChange={(e) => updateExperience(index, "position", e.target.value)}
                      onBlur={() => validateField("experiences", formData.experiences)}
                    />
                    {getExpError(index, "position") && <p className="text-red-500 text-sm">{getExpError(index, "position")}</p>}
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="max-[430px]:hidden">Şirkət<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Məs: Invest Home"
                      className={`input-field ${getExpError(index, "company") ? "error" : ""}`}
                      value={exp?.company || ""}
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
                      onBlur={() => validateField("experiences", formData.experiences)}
                    />
                    {getExpError(index, "company") && <p className="text-red-500 text-sm">{getExpError(index, "company")}</p>}
                  </div>

                  <div className="grid grid-cols-1 min-[430px]:grid-cols-2 gap-[12px]">
                    <div className="flex flex-col gap-[8px]">
                      <label className="max-[430px]:hidden">Başlama tarixi<span className="text-red-500">*</span></label>
                      <input
                        type="month"
                        className={`input-field ${getExpError(index, "startMonth") ? "error" : ""}`}
                        value={exp?.startMonth || ""}
                        onChange={(e) => updateExperience(index, "startMonth", e.target.value)}
                        onBlur={() => validateField("experiences", formData.experiences)}
                      />
                      {getExpError(index, "startMonth") && <p className="text-red-500 text-sm">{getExpError(index, "startMonth")}</p>}
                    </div>

                    <div className="flex flex-col gap-[8px]">
                      <label className="max-[430px]:hidden">Bitmə tarixi{exp?.isCurrent ? "" : <span className="text-red-500">*</span>}</label>
                      <input
                        type="month"
                        disabled={Boolean(exp?.isCurrent)}
                        className={`input-field ${getExpError(index, "endMonth") ? "error" : ""}`}
                        value={exp?.isCurrent ? "" : (exp?.endMonth || "")}
                        onChange={(e) => updateExperience(index, "endMonth", e.target.value)}
                        onBlur={() => validateField("experiences", formData.experiences)}
                      />
                      {getExpError(index, "endMonth") && <p className="text-red-500 text-sm">{getExpError(index, "endMonth")}</p>}
                    </div>
                  </div>

                  <label className="flex items-center gap-[10px] text-[14px] text-[#737373]">
                    <input
                      type="checkbox"
                      className="w-[16px] h-[16px] cursor-pointer"
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

                  <div className="flex flex-col gap-[8px]">
                    <label className="max-[430px]:hidden">Təsvir</label>
                    <textarea
                      rows={3}
                      placeholder="Qısa təsvir (istəyə bağlı)"
                      className={`input-field ${getExpError(index, "description") ? "error" : ""}`}
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

        <div className="min-w-0 basis-[50%]">
          <form action="">
            <div className="flex flex-col gap-[16px]">
              {/* Educations */}
              <div className="mt-[8px] flex items-center justify-between">
                <label className="max-[430px]:hidden">
                  Təhsil
                </label>
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-white bg-[var(--primary-color)] rounded-[8px] py-[8px] px-[14px] hover:opacity-90"
                >
                  + Təhsil əlavə et
                </button>
              </div>

              {errors.educations && <p className="text-red-500 text-sm">{errors.educations}</p>}

              {(formData.educations || []).map((edu, index) => (
                <div key={index} className="border-[1px] border-[rgba(0,0,0,0.12)] rounded-[12px] p-[12px] flex flex-col gap-[12px]">
                  <div className="flex items-center justify-between">
                    <p className="font-[500] text-[14px]">Təhsil {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-800 text-[14px]"
                    >
                      Sil
                    </button>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="max-[430px]:hidden">Təhsil müəssisəsi<span className="text-red-500">*</span></label>
                    <input
                      placeholder="Bakı Dövlət Universiteti"
                      className={`input-field ${getEduError(index, "institution") ? "error" : ""}`}
                      type="text"
                      value={edu?.institution || ""}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      onBlur={() => validateField("educations", formData.educations)}
                    />
                    {getEduError(index, "institution") && <p className="text-red-500 text-sm">{getEduError(index, "institution")}</p>}
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="max-[430px]:hidden">İxtisas / Dərəcə<span className="text-red-500">*</span></label>
                    <input
                      placeholder="Məs: Kompüter elmləri (Bakalavr)"
                      className={`input-field ${getEduError(index, "degree") ? "error" : ""}`}
                      type="text"
                      value={edu?.degree || ""}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      onBlur={() => validateField("educations", formData.educations)}
                    />
                    {getEduError(index, "degree") && <p className="text-red-500 text-sm">{getEduError(index, "degree")}</p>}
                  </div>

                  <div className="grid grid-cols-1 min-[430px]:grid-cols-2 gap-[12px]">
                    <div className="flex flex-col gap-[8px]">
                      <label className="max-[430px]:hidden">Başlama tarixi<span className="text-red-500">*</span></label>
                      <input
                        type="month"
                        className={`input-field ${getEduError(index, "startMonth") ? "error" : ""}`}
                        value={edu?.startMonth || ""}
                        onChange={(e) => updateEducation(index, "startMonth", e.target.value)}
                        onBlur={() => validateField("educations", formData.educations)}
                      />
                      {getEduError(index, "startMonth") && <p className="text-red-500 text-sm">{getEduError(index, "startMonth")}</p>}
                    </div>

                    <div className="flex flex-col gap-[8px]">
                      <label className="max-[430px]:hidden">Bitmə tarixi<span className="text-red-500">*</span></label>
                      <input
                        type="month"
                        className={`input-field ${getEduError(index, "endMonth") ? "error" : ""}`}
                        value={edu?.endMonth || ""}
                        onChange={(e) => updateEducation(index, "endMonth", e.target.value)}
                        onBlur={() => validateField("educations", formData.educations)}
                      />
                      {getEduError(index, "endMonth") && <p className="text-red-500 text-sm">{getEduError(index, "endMonth")}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="max-[430px]:hidden">Qeyd</label>
                    <textarea
                      rows={3}
                      placeholder="Qısa qeyd (istəyə bağlı)"
                      className={`input-field ${getEduError(index, "description") ? "error" : ""}`}
                      value={edu?.description || ""}
                      onChange={(e) => updateEducation(index, "description", e.target.value)}
                      onBlur={() => validateField("educations", formData.educations)}
                    />
                    {getEduError(index, "description") && <p className="text-red-500 text-sm">{getEduError(index, "description")}</p>}
                  </div>
                </div>
              ))}

              {/* Age */}
              <div className="flex flex-col gap-[8px]">
                <label className="max-[430px]:hidden" htmlFor="">
                  Yaşınız<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="28"
                  className={`input-field remove-arrow ${errors.age ? "error" : ""}`}
                  type="number"
                  min="18"
                  max="65"
                  value={formData.age || ""}
                  onChange={(e) => {
                    updateForm("age", e.target.value);
                    validateField("age", e.target.value);
                  }}
                  onBlur={(e) => validateField("age", e.target.value)}
                />
                {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
              </div>

              {/* Address */}
              <div className="flex flex-col gap-[8px]">
                <label className="max-[430px]:hidden" htmlFor="">
                  Yaşadığınız Ünvan<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Xəzər ray., Mərdəkan qəs., Əli İsazade küç."
                  className={`input-field ${errors.residentialAddress ? "error" : ""}`}
                  type="text"
                  value={formData.residentialAddress || ""}
                  onChange={(e) => {
                    updateForm("residentialAddress", e.target.value);
                    validateField("residentialAddress", e.target.value);
                  }}
                  onBlur={(e) => validateField("residentialAddress", e.target.value)}
                />
                {errors.residentialAddress && <p className="text-red-500 text-sm">{errors.residentialAddress}</p>}
              </div>

              {/* CV Upload */}
              <div className="flex flex-col gap-[8px]">
                <label className="max-[430px]:hidden" htmlFor="">
                  CV-nizi yükləyin<span className="text-red-500">*</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />

                <div
                  className={`relative transition-all duration-200 ${isDragging ? "transform scale-102" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div
                    className={`input-field
                      max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary
                      px-[14px] py-[10px] border rounded-[8px] flex items-center justify-between transition-all cursor-pointer
                      ${errors.cv ? 'error' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <p className="max-[430px]:text-primary line-clamp-1 truncate text-[14px]/[21px] text-[#7F7F87]">{formData.cv ? formData.cv.name : "CV faylınızı seçin"}</p>
                    <div >{isUploading ? <GiSandsOfTime className="text-[var(--primary-color)] text-[18px]" /> : formData.cv ? "✓" : "+"}</div>
                  </div>

                  {isUploading && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Yüklənir...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-[var(--primary-color)] h-1 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {formData.cv && !isUploading && (
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(formData.cv.size)}</span>
                      <div className="flex gap-2">
                        {previewUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(previewUrl, "_blank");
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaRegEye className="text-[var(--primary-color)] text-[16px]" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile();
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <LuX className="text-[16px]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {errors.cv && <p className="text-red-500 text-sm">{errors.cv}</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Preview;
