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

  const validateField = async (fieldName, value, customError = null) => {
    if (customError) {
      setErrors(prev => ({ ...prev, [fieldName]: customError }));
      onValidationChange(false);
      return;
    }

    try {
      await agentFormSchema.validateAt(fieldName, { ...formData, [fieldName]: value });
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [fieldName]: err.message }));
    }

    // Check overall current step validity
    checkFormValidity();
  };

  const checkFormValidity = async () => {
    try {
      // Only validate fields for the current step (OtherInfo)
      const currentStepData = {
        education: formData.education,
        age: formData.age,
        address: formData.address,
        cv: formData.cv,
      };

      // Create a schema that only validates current step fields
      await agentFormSchema.pick(['education', 'age', 'address', 'cv']).validate(currentStepData, { abortEarly: false });
      console.log('✅ Other Info step is valid, setting currentStepValid to true');
      onValidationChange(true);
    } catch (err) {
      console.log('❌ Other Info step is invalid:', err.message);
      onValidationChange(false);
    }
  };

  const validateAllFields = async () => {
    try {
      // Only validate current step fields
      const currentStepData = {
        education: formData.education,
        age: formData.age,
        address: formData.address,
        cv: formData.cv,
      };

      await agentFormSchema.pick(['education', 'age', 'address', 'cv']).validate(currentStepData, { abortEarly: false });
      console.log('✅ All current step fields valid, clearing errors');
      setErrors({});
      onValidationChange(true);
    } catch (err) {
      if (err.name === "ValidationError") {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        console.log('❌ Validation errors found:', newErrors);
        setErrors(newErrors);
        onValidationChange(false);
      }
    }
  };

  // Validate all fields when showAllErrors becomes true
  useEffect(() => {
    if (showAllErrors) {
      validateAllFields();
      setShowAllErrors(false); // Reset the trigger
    }
  }, [showAllErrors]);

  // Check initial validation
  useEffect(() => {
    checkFormValidity();
  }, [formData]);

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
      <div className='flex gap-[95px] pb-[16px] min-[768px]:border-b-[1px] border-[rgba(0,0,0,0.2)]'>
        <div className='min-[1200px]:basis-[50%] w-full'>
          <form action="">
            <div className='flex flex-col gap-[16px]'>
              {/* Education Field */}
              <div className='flex flex-col gap-[8px]'>
                <label className="max-[430px]:hidden" htmlFor="">Təhsil<span className="text-red-500">*</span></label>
                <input
                  placeholder='Bakı Dövlət Universiteti'
                  className={`max-[430px]:placeholder-primary max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${errors.education ? 'border-red-500' : 'border-[black]'
                    }`}
                  type="text"
                  value={formData.education || ''}
                  onChange={(e) => {
                    updateForm("education", e.target.value);
                    validateField("education", e.target.value);
                  }}
                  onBlur={(e) => validateField("education", e.target.value)}
                />
                {errors.education && <p className="text-red-500 text-sm">{errors.education}</p>}
              </div>

              {/* Age Field */}
              <div className='flex flex-col gap-[8px]'>
                <label className="max-[430px]:hidden" htmlFor="">Yaşınız<span className="text-red-500">*</span></label>
                <input
                  placeholder='28'
                  className={`max-[430px]:placeholder-primary max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${errors.age ? 'border-red-500' : 'border-[black]'
                    }`}
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
                  className={`max-[430px]:placeholder-primary max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${errors.address ? 'border-red-500' : 'border-[black]'
                    }`}
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
                    className={`
                      max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary
                      px-[14px] py-[10px] border rounded-[8px] flex items-center justify-between transition-all cursor-pointer
                      ${isDragging ? 'border-blue-500 bg-blue-50' : ''}
                      ${formData.cv ? 'border-[var(--primary-color)] bg-green-50' : 'border-[black]'}
                      ${errors.cv ? 'border-red-500 bg-red-50' : ''}
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