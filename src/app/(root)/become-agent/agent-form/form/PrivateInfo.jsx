// Updated PrivateInfo.js
import Image from "next/image";
import { useState, useEffect } from "react";
import { agentFormSchema } from "@/lib/schemas/agentSchema";

const PrivateInfo = ({ formData, updateForm, onValidationChange, showAllErrors, setShowAllErrors }) => {
  const [errors, setErrors] = useState({});

  const validateField = async (fieldName, value) => {
    try {
      await agentFormSchema.validateAt(fieldName, { ...formData, [fieldName]: value });
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    } catch (err) {
      if (err.name === "ValidationError") {
        setErrors(prev => ({ ...prev, [fieldName]: err.message }));
      }
    }

    // Check overall form validity
    checkFormValidity();
  };

  const checkFormValidity = async () => {
    try {
      // Only validate fields for the current step (PrivateInfo)
      const currentStepData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        about1: formData.about1,
        about2: formData.about2, // This is optional
      };

      // Create a schema that only validates current step fields
      await agentFormSchema.pick(['fullName', 'email', 'phone', 'about1', 'about2']).validate(currentStepData, { abortEarly: false });
      onValidationChange(true);
    } catch (err) {
      onValidationChange(false);
    }
  };

  const validateAllFields = async () => {
    try {
      // Only validate current step fields
      const currentStepData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        about1: formData.about1,
        about2: formData.about2,
      };

      await agentFormSchema.pick(['fullName', 'email', 'phone', 'about1', 'about2']).validate(currentStepData, { abortEarly: false });
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

  return (
    <>
      <div className='flex gap-[95px] pb-[16px] min-[768px]:border-b-[1px] border-[rgba(0,0,0,0.2)]'>
        <div className='min-[1200px]:basis-[50%] w-full'>
          <form action="">
            <div className='flex flex-col gap-[16px]'>
              <div className='flex flex-col gap-[8px]'>
                <label className="max-[430px]:hidden" htmlFor="">Ad Soyad<span className="text-red-500">*</span></label>
                <input
                  placeholder='Ad Soyad'
                  className={`max-[430px]:placeholder-primary max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${errors.fullName ? 'border-red-500' : 'border-[black]'
                    }`}
                  type="text"
                  value={formData.fullName || ''}
                  onChange={(e) => {
                    updateForm("fullName", e.target.value);
                    validateField("fullName", e.target.value);
                  }}
                  onBlur={(e) => validateField("fullName", e.target.value)}
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>

              <div className='flex flex-col gap-[8px]'>
                <label className="max-[430px]:hidden" htmlFor="">Email<span className="text-red-500">*</span></label>
                <input
                  placeholder='investhomeaz@gmail.com'
                  className={`max-[430px]:placeholder-primary max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${errors.email ? 'border-red-500' : 'border-[black]'
                    }`}
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => {
                    updateForm("email", e.target.value);
                    validateField("email", e.target.value);
                  }}
                  onBlur={(e) => validateField("email", e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className='flex flex-col gap-[8px]'>
                <label className="max-[430px]:hidden" htmlFor="">Telefon<span className="text-red-500">*</span></label>
                <input
                  placeholder='phone'
                  className={`max-[430px]:placeholder-primary max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${errors.phone ? 'border-red-500' : 'border-[black]'
                    }`}
                  type="phone"
                  value={formData.phone || ''}
                  onChange={(e) => {
                    updateForm("phone", e.target.value);
                    validateField("phone", e.target.value);
                  }}
                  onBlur={(e) => validateField("phone", e.target.value)}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              <div className='flex flex-col gap-[8px]'>
                <label className="max-[430px]:hidden" htmlFor="">Haqqınızda 1<span className="text-red-500">*</span></label>
                <input
                  placeholder='İş Təcrübəniz'
                  className={`max-[430px]:placeholder-primary max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${errors.about1 ? 'border-red-500' : 'border-[black]'
                    }`}
                  type="text"
                  value={formData.about1 || ''}
                  onChange={(e) => {
                    updateForm("about1", e.target.value);
                    validateField("about1", e.target.value);
                  }}
                  onBlur={(e) => validateField("about1", e.target.value)}
                />
                {errors.about1 && <p className="text-red-500 text-sm">{errors.about1}</p>}
              </div>

              <div className='flex flex-col gap-[8px]'>
                <label className="max-[430px]:hidden" htmlFor="">Haqqınızda 2</label>
                <input
                  placeholder='İş Təcrübəniz'
                  className={`max-[430px]:placeholder-primary max-[430px]:text-[16px] max-[430px]:p-[16px] max-[430px]:rounded-[16px] max-[430px]:border-primary outline-none px-[14px] py-[10px] text-[14px] border-[1px] rounded-[8px] ${errors.about2 ? 'border-red-500' : 'border-[black]'
                    }`}
                  type="text"
                  value={formData.about2 || ''}
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
        <div className='max-[1200px]:hidden flex items-center basis-[50%]'>
            <Image
              src="/gifs/building.gif"
              alt="building"
              width={519}
              height={389}
            />
        </div>
      </div>
    </>
  );
};

export default PrivateInfo;
