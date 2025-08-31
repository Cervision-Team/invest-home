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
    otherInfo: ["education", "age", "address", "cv"],
    privateInfo: ["fullName", "email", "phone", "about1", "about2"],
  };

  // Validate both groups together
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
          return { ...copy, ...newErrors };
        });

        onValidationChange(false);
        return false;
      } else {
        // Unexpected error
        console.error("Validation error:", err);
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

  // ----------------- JSX (your form UI, unchanged except validation wiring uses the new funcs) -----------------
  return (
    <>
      <div className="flex gap-[95px] pb-[16px] border-b-[1px] border-[rgba(0,0,0,0.2)]">
        <div className="basis-[50%]">
          <form action="">
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="">
                  Ad/Soyad<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Ad Soyad"
                  className={`outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${
                    errors.fullName ? "border-red-500" : "border-[black]"
                  }`}
                  type="text"
                  value={formData.fullName || ""}
                  onChange={(e) => {
                    updateForm("fullName", e.target.value);
                    validateField("fullName", e.target.value);
                  }}
                  onBlur={(e) => validateField("fullName", e.target.value)}
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="investhomeaz@gmail.com"
                  className={`outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${
                    errors.email ? "border-red-500" : "border-[black]"
                  }`}
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
                <label htmlFor="">
                  Telefon<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder=""
                  className={`outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${
                    errors.phone ? "border-red-500" : "border-[black]"
                  }`}
                  type="phone"
                  value={formData.phone || ""}
                  onChange={(e) => {
                    updateForm("phone", e.target.value);
                    validateField("phone", e.target.value);
                  }}
                  onBlur={(e) => validateField("phone", e.target.value)}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              {/* About1 */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="">
                  Haqqınızda 1<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="İş Təcrübəniz"
                  className={`outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${
                    errors.about1 ? "border-red-500" : "border-[black]"
                  }`}
                  type="text"
                  value={formData.about1 || ""}
                  onChange={(e) => {
                    updateForm("about1", e.target.value);
                    validateField("about1", e.target.value);
                  }}
                  onBlur={(e) => validateField("about1", e.target.value)}
                />
                {errors.about1 && <p className="text-red-500 text-sm">{errors.about1}</p>}
              </div>

              {/* About2 */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="">Haqqınızda 2</label>
                <input
                  placeholder="İş Təcrübəniz"
                  className={`outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${
                    errors.about2 ? "border-red-500" : "border-[black]"
                  }`}
                  type="text"
                  value={formData.about2 || ""}
                  onChange={(e) => {
                    updateForm("about2", e.target.value);
                    validateField("about2", e.target.value);
                  }}
                  onBlur={(e) => validateField("about2", e.target.value)}
                />
                {errors.about2 && <p className="text-red-500 text-sm">{errors.about2}</p>}
              </div>
            </div>
          </form>
        </div>

        <div className="basis-[50%]">
          <form action="">
            <div className="flex flex-col gap-[16px]">
              {/* Education */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="">
                  Təhsil<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Bakı Dövlət Universiteti"
                  className={`outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${
                    errors.education ? "border-red-500" : "border-[black]"
                  }`}
                  type="text"
                  value={formData.education || ""}
                  onChange={(e) => {
                    updateForm("education", e.target.value);
                    validateField("education", e.target.value);
                  }}
                  onBlur={(e) => validateField("education", e.target.value)}
                />
                {errors.education && <p className="text-red-500 text-sm">{errors.education}</p>}
              </div>

              {/* Age */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="">
                  Yaşınız<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="28"
                  className={`outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${
                    errors.age ? "border-red-500" : "border-[black]"
                  }`}
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
                <label htmlFor="">
                  Yaşadığınız Ünvan<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Xəzər ray., Mərdəkan qəs., Əli İsazade küç."
                  className={`outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${
                    errors.address ? "border-red-500" : "border-[black]"
                  }`}
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => {
                    updateForm("address", e.target.value);
                    validateField("address", e.target.value);
                  }}
                  onBlur={(e) => validateField("address", e.target.value)}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              {/* CV Upload */}
              <div className="flex flex-col gap-[8px]">
                <label htmlFor="">
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
                    className={`px-[14px] py-[10px] border rounded-[8px] flex items-center justify-between transition-all cursor-pointer
                      ${isDragging ? "border-blue-500 bg-blue-50" : ""}
                      ${formData.cv ? "border-[var(--primary-color)] bg-green-50" : "border-[black]"}
                      ${errors.cv ? "border-red-500 bg-red-50" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <p className="text-[14px]/[21px] text-[#7F7F87]">{formData.cv ? formData.cv.name : "CV faylınızı seçin"}</p>
                    <p className="text-[24px]">{isUploading ? <GiSandsOfTime className="text-[var(--primary-color)] text-[18px]" /> : formData.cv ? "✓" : "+"}</p>
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
