import Image from "next/image";
import { agentFormSchema } from "@/lib/schemas/agentSchema";
import { useState, useRef, useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { GiSandsOfTime } from "react-icons/gi";

const OtherInfo = ({ formData, updateForm, onValidationChange, showAllErrors, setShowAllErrors }) => {
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const stepFields = ["educations", "age", "address", "cv"];

  const buildStepData = (overrides = {}) =>
    stepFields.reduce((acc, field) => {
      acc[field] = Object.prototype.hasOwnProperty.call(overrides, field) ? overrides[field] : formData[field];
      return acc;
    }, {});

  const validateField = async (fieldName, value, customError = null) => {
    if (customError) {
      setErrors(prev => ({ ...prev, [fieldName]: customError }));
      onValidationChange(false);
      return;
    }

    // Special-case educations array to capture nested Yup paths like educations[0].endMonth
    if (fieldName === "educations") {
      try {
        await agentFormSchema.validateAt("educations", { ...formData, educations: value });
        setErrors(prev => {
          const copy = { ...prev };
          delete copy.educations;
          Object.keys(copy).forEach(k => {
            if (k.startsWith("educations[")) delete copy[k];
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
            newErrors.educations = err.message;
          }

          setErrors(prev => {
            const copy = { ...prev };
            Object.keys(copy).forEach(k => {
              if (k === "educations" || k.startsWith("educations[")) delete copy[k];
            });
            return { ...copy, ...newErrors };
          });
        }
      }

      await checkFormValidity({ educations: value });
      return;
    }

    try {
      await agentFormSchema.validateAt(fieldName, { ...formData, [fieldName]: value });
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [fieldName]: err.message }));
    }

    await checkFormValidity({ [fieldName]: value });
  };

  const checkFormValidity = async (overrides = {}) => {
    try {
      await agentFormSchema.pick(stepFields).validate(buildStepData(overrides), { abortEarly: false });
      onValidationChange(true);
    } catch (err) {
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
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
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

  const getEduError = (index, field) => errors[`educations[${index}].${field}`];

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

  // File validation
  const validateFile = (file) => {
    // fayl maximum 5 mb ola bilər. 5 mb bit formasında göstəririk
    const maxSize = 5 * 1024 * 1024; // 5MB
    // MIME tipləri brovserə faylın hansı tipdə olduğunu göstərir
    const allowedTypes = [
      'application/pdf', //PDF
      'application/msword', //.doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' //.docx
    ];

    if (!file) return { isValid: false, error: 'Fayl seçilməyib' };
    if (file.size > maxSize) return { isValid: false, error: 'Fayl ölçüsü 5MB-dan çox ola bilməz' };
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Yalnız PDF və Word faylları qəbul edilir' };
    }
    return { isValid: true };
  };

  // Handle file selection
  const handleFileChange = async (file) => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      validateField("cv", "", validation.error);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      // hər 0.1 saniyədə yüklənmə 0-10% aralığında artır. 90% keçəndən sonra avtomatik olaraq dayanır.
      //  qalan 10% real yüklənmə bitəndən sonra yüklənir
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 100);

    try {
      // Create file preview for PDF
      if (file.type === 'application/pdf') {
        // faylı broüserdə preview kimi göstərmək üçün müvəqqəti url yaradır
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      }

      // Convert file to base64 or handle as needed
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        file: file // Store the actual file object
      };

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      //proses tamamlanır
      setUploadProgress(100);
      updateForm("cv", fileData);
      validateField("cv", fileData);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      validateField("cv", "", "Fayl yükləmə zamanı xəta baş verdi");
      setIsUploading(false);
      setUploadProgress(0);
    }

    clearInterval(progressInterval);
  };

  // Drag and drop handlers
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

  // Remove file
  const removeFile = () => {
    updateForm("cv", null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    validateField("cv", null);
  };

  // faylın ölçüsü default olaraq bitlə verilirş bu funksiya onu daha oxunaqlı hala gətirir e.g. 1mb
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        .remove-arrow::-webkit-outer-spin-button,
          .remove-arrow::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .remove-arrow {
            -moz-appearance: textfield;
          }

      `}</style>

      <div className='flex gap-[95px] pb-[16px] min-[768px]:border-b-[1px] border-[rgba(0,0,0,0.2)]'>
        <div className='min-[1200px]:basis-[50%] w-full'>
          <form action="">
            <div className='flex flex-col gap-[16px]'>
              <div className="mt-[8px] flex items-center justify-between">
                <label className="max-[430px]:hidden">Təhsil</label>
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

                  <div className='flex flex-col gap-[8px]'>
                    <label className="max-[430px]:hidden" htmlFor="">Təhsil müəssisəsi<span className="text-red-500">*</span></label>
                    <input
                      placeholder='Bakı Dövlət Universiteti'
                      className={`input-field ${getEduError(index, "institution") ? 'error' : ''}`}
                      type="text"
                      value={edu?.institution || ''}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      onBlur={() => validateField("educations", formData.educations)}
                    />
                    {getEduError(index, "institution") && <p className="text-red-500 text-sm">{getEduError(index, "institution")}</p>}
                  </div>

                  <div className='flex flex-col gap-[8px]'>
                    <label className="max-[430px]:hidden" htmlFor="">İxtisas / Dərəcə<span className="text-red-500">*</span></label>
                    <input
                      placeholder='Məs: Kompüter elmləri (Bakalavr)'
                      className={`input-field ${getEduError(index, "degree") ? 'error' : ''}`}
                      type="text"
                      value={edu?.degree || ''}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      onBlur={() => validateField("educations", formData.educations)}
                    />
                    {getEduError(index, "degree") && <p className="text-red-500 text-sm">{getEduError(index, "degree")}</p>}
                  </div>

                  <div className="grid grid-cols-1 min-[430px]:grid-cols-2 gap-[12px]">
                    <div className='flex flex-col gap-[8px]'>
                      <label className="max-[430px]:hidden" htmlFor="">Başlama tarixi<span className="text-red-500">*</span></label>
                      <input
                        className={`input-field ${getEduError(index, "startMonth") ? 'error' : ''}`}
                        type="month"
                        value={edu?.startMonth || ''}
                        onChange={(e) => updateEducation(index, "startMonth", e.target.value)}
                        onBlur={() => validateField("educations", formData.educations)}
                      />
                      {getEduError(index, "startMonth") && <p className="text-red-500 text-sm">{getEduError(index, "startMonth")}</p>}
                    </div>

                    <div className='flex flex-col gap-[8px]'>
                      <label className="max-[430px]:hidden" htmlFor="">Bitmə tarixi<span className="text-red-500">*</span></label>
                      <input
                        className={`input-field ${getEduError(index, "endMonth") ? 'error' : ''}`}
                        type="month"
                        value={edu?.endMonth || ''}
                        onChange={(e) => updateEducation(index, "endMonth", e.target.value)}
                        onBlur={() => validateField("educations", formData.educations)}
                      />
                      {getEduError(index, "endMonth") && <p className="text-red-500 text-sm">{getEduError(index, "endMonth")}</p>}
                    </div>
                  </div>

                  <div className='flex flex-col gap-[8px]'>
                    <label className="max-[430px]:hidden" htmlFor="">Qeyd</label>
                    <textarea
                      rows={3}
                      placeholder='Qısa qeyd (istəyə bağlı)'
                      className={`input-field ${getEduError(index, "description") ? 'error' : ''}`}
                      value={edu?.description || ''}
                      onChange={(e) => updateEducation(index, "description", e.target.value)}
                      onBlur={() => validateField("educations", formData.educations)}
                    />
                    {getEduError(index, "description") && <p className="text-red-500 text-sm">{getEduError(index, "description")}</p>}
                  </div>
                </div>
              ))}

              {/* Age Field */}
              <div className='flex flex-col gap-[8px]'>
                <label className="max-[430px]:hidden" htmlFor="">Yaşınız<span className="text-red-500">*</span></label>
                <input
                  placeholder='28'
                  className={`input-field remove-arrow ${errors.age ? 'error' : ''}`}
                  type="number"
                  min="18"
                  max="65"
                  value={formData.age || ''}
                  onChange={(e) => {
                    updateForm("age", e.target.value);
                    validateField("age", e.target.value);
                  }}
                  onBlur={(e) => validateField("age", e.target.value)}
                />
                {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
              </div>

              {/* Address Field */}
              <div className='flex flex-col gap-[8px]'>
                <label className="max-[430px]:hidden" htmlFor="">Yaşadığınız Ünvan<span className="text-red-500">*</span></label>
                <input
                  placeholder='Xəzər ray., Mərdəkan qəs., Əli İsazade küç.'
                  className={`input-field ${errors.address ? 'error' : ''}`}
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => {
                    updateForm("address", e.target.value);
                    validateField("address", e.target.value);
                  }}
                  onBlur={(e) => validateField("address", e.target.value)}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              {/* Advanced CV Upload */}
              <div className='flex flex-col gap-[8px]'>
                <label className="max-[430px]:hidden" htmlFor="">CV-nizi yükləyin<span className="text-red-500">*</span></label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />

                {/* Custom styled upload button matching original design */}
                <div
                  className={`
                    relative transition-all duration-200
                    ${isDragging ? 'transform scale-102' : ''}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div
                    className={`input-field
                      max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary
                      px-[14px] py-[10px] border rounded-[8px] flex items-center justify-between transition-all cursor-pointer
                      ${errors.cv ? 'error' : ''}
                    `}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <p className='max-[430px]:text-primary line-clamp-1 truncate text-[14px]/[21px] text-[#7F7F87]'>
                      {formData.cv ? formData.cv.name : 'CV faylınızı seçin'}
                    </p>
                    <div>
                      {isUploading ? <GiSandsOfTime className="text-[var(--primary-color)] text-[18px]" /> : formData.cv ? '✓' : '+'}
                    </div>
                  </div>

                  {/* Upload Progress - positioned below the input */}
                  {isUploading && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Yüklənir...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-[var(--primary-color)] h-1 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* File info - positioned below */}
                  {formData.cv && !isUploading && (
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(formData.cv.size)}</span>
                      <div className="flex gap-2">
                        {previewUrl && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(previewUrl, '_blank');
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

                {/* Error message */}
                {errors.cv && <p className="text-red-500 text-sm">{errors.cv}</p>}
              </div>
            </div>
          </form>
        </div>
        <div className='max-[1200px]:hidden flex items-center basis-[50%]'>
          <Image
            src="/gifs/market.gif"
            alt=""
            width={385}
            height={385}
          />
        </div>
      </div>
    </>
  );
}
export default OtherInfo;