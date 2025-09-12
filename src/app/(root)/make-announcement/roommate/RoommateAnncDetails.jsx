import React, { useState, useCallback, useEffect } from 'react';
import { getValidationSchema } from '@/lib/schemas/announcementSchema';

const RoommateAnncDetails = ({ 
  formik,
  stepErrors = {},
  setStepErrors,
  isValidating,
  activePropertyType 
}) => {
  const [houseComposition, setHouseComposition] = useState(formik?.values?.houseComposition || null);
  
  const [localErrors, setLocalErrors] = useState({});

  const clearErrorForField = useCallback((fieldName) => {
    if (typeof setStepErrors === 'function') {
      setStepErrors(prev => {
        if (!prev || !prev[fieldName]) return prev || {};
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      });
    } else {
      setLocalErrors(prev => {
        if (!prev || !prev[fieldName]) return prev || {};
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      });
    }
  }, [setStepErrors]);

  const handleInputChange = useCallback((fieldName, value) => {
    formik.setFieldValue(fieldName, value);
    clearErrorForField(fieldName);
  }, [formik, clearErrorForField]);

  const handleBlur = useCallback(async (fieldName) => {
    const currentValues = formik.values;
    const schema = getValidationSchema(3, 'roommate', currentValues);

    try {
      await schema.validateAt(fieldName, currentValues);
      clearErrorForField(fieldName);
    } catch (err) {
      const message = err.message;
      setStepErrors
        ? setStepErrors((p) => ({ ...p, [fieldName]: message }))
        : setLocalErrors((p) => ({ ...p, [fieldName]: message }));
    }
  }, [formik, clearErrorForField, setStepErrors]);

  const handleRadioChange = useCallback((fieldName, value) => {
    handleInputChange(fieldName, value);
  }, [handleInputChange]);

  const handleFeatureChange = useCallback((feature) => {
    const currentFeatures = formik.values.features || [];
    let newFeatures;
    
    if (currentFeatures.includes(feature)) {
      newFeatures = currentFeatures.filter(f => f !== feature);
    } else {
      newFeatures = [...currentFeatures, feature];
    }
    
    handleInputChange('features', newFeatures);
  }, [formik.values.features, handleInputChange]);

  const updateHouseComposition = useCallback((composition) => {
    setHouseComposition(composition);
    handleInputChange('houseComposition', composition);
  }, [handleInputChange]);

  const displayedErrors = { ...(localErrors || {}), ...(stepErrors || {}) };

  const getErrorMessage = (fieldName) => displayedErrors[fieldName];
  const hasError = (fieldName) => !!displayedErrors[fieldName];

  useEffect(() => {
    setHouseComposition(formik?.values?.houseComposition || null);
  }, [formik?.values?.houseComposition]);

  return (
    <>
      <style>
        {`
          .svg-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            border: 2px solid #d1d5db;
            border-radius: 6px;
            background-color: white;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
          }

          .svg-checkbox:checked {
            background-color: #1B8F7D;
            border-color: #1B8F7D;
          }

          .svg-checkbox:checked::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
            background-size: contain;
            background-repeat: no-repeat;
          }

          .svg-checkbox:hover {
            border-color: #1B8F7D;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
          }

          .svg-checkbox:focus {
            outline: none;
            border-color: #1B8F7D;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.2);
          }

           .remove-arrow::-webkit-outer-spin-button,
          .remove-arrow::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .remove-arrow {
            -moz-appearance: textfield;
          }
          
          .error-field {
            border-color: #ef4444 !important;
          }
          .error-text {
            color: #ef4444;
            font-size: 14px;
            margin-top: 4px;
          }
        `}
      </style>
      
      <div className="h-full pb-[16px] border-b border-[rgba(0,0,0,0.2)]">
        <div className="flex items-start justify-start gap-[95px] max-h-[444px] overflow-y-auto hide-scrollbar pl-[2px]">
          <form className="w-full"> 
            <div className='flex flex-col items-start justify-center'>
              <h5 className='text-[#000] text-[24px]/[28px] font-medium'>
                Detallar
              </h5>

              <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
                <p className='text-[#000] text-[16px]/[20px] font-medium'>Kommunal qiymətə daxildir?</p>
                {hasError('utilities') && <p className="error-text">{getErrorMessage('utilities')}</p>}
                <div className='flex flex-row items-center justify-center mt-[9px]'>
                  <input 
                    type="radio" 
                    id="utilitiesYes" 
                    name="utilities" 
                    value="yes" 
                    className='w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.utilities === 'yes'}
                    onChange={(e) => handleRadioChange('utilities', e.target.value)}
                    onBlur={() => handleBlur('utilities')}
                  />
                  <label htmlFor="utilitiesYes" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Bəli</label>
                  <input 
                    type="radio" 
                    id="utilitiesNo" 
                    name="utilities" 
                    value="no" 
                    className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.utilities === 'no'}
                    onChange={(e) => handleRadioChange('utilities', e.target.value)}
                    onBlur={() => handleBlur('utilities')}
                  />
                  <label htmlFor="utilitiesNo" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Xeyr</label>
                </div>
              </div>

              <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
                <p className='text-[#000] text-[16px]/[20px] font-medium'>Otaq tipi</p>
                {hasError('roomType') && <p className="error-text">{getErrorMessage('roomType')}</p>}
                <div className='flex flex-row items-center justify-center mt-[9px]'>
                  <input 
                    type="radio" 
                    id="separate" 
                    name="roomType" 
                    value="separate" 
                    className='w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.roomType === 'separate'}
                    onChange={(e) => handleRadioChange('roomType', e.target.value)}
                    onBlur={() => handleBlur('roomType')}
                  />
                  <label htmlFor="separate" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Ayrı</label>
                  <input 
                    type="radio" 
                    id="shared" 
                    name="roomType" 
                    value="shared" 
                    className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.roomType === 'shared'}
                    onChange={(e) => handleRadioChange('roomType', e.target.value)}
                    onBlur={() => handleBlur('roomType')}
                  />
                  <label htmlFor="shared" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Ortaq</label>
                </div>
              </div>

              <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
                <p className='text-[#000] text-[16px]/[20px] font-medium'>Yataq otağının tipi</p>
                {hasError('bedType') && <p className="error-text">{getErrorMessage('bedType')}</p>}
                <div className='flex flex-row items-center justify-center mt-[9px]'>
                  <input 
                    type="radio" 
                    id="bedTypeSofa" 
                    name="bedType" 
                    value="sofa" 
                    className='w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.bedType === 'sofa'}
                    onChange={(e) => handleRadioChange('bedType', e.target.value)}
                    onBlur={() => handleBlur('bedType')}
                  />
                  <label htmlFor="bedTypeSofa" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Divan</label>
                  <input 
                    type="radio" 
                    id="bedTypeBed" 
                    name="bedType" 
                    value="bed" 
                    className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.bedType === 'bed'}
                    onChange={(e) => handleRadioChange('bedType', e.target.value)}
                    onBlur={() => handleBlur('bedType')}
                  />
                  <label htmlFor="bedTypeBed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Çarpayı</label>
                  <input 
                    type="radio" 
                    id="bedTypeWoodenBed" 
                    name="bedType" 
                    value="woodenBed" 
                    className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.bedType === 'woodenBed'}
                    onChange={(e) => handleRadioChange('bedType', e.target.value)}
                    onBlur={() => handleBlur('bedType')}
                  />
                  <label htmlFor="bedTypeWoodenBed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Taxt</label>
                  <input 
                    type="radio" 
                    id="bedTypeOneSideWoodenBed" 
                    name="bedType" 
                    value="oneSideWoodenBed" 
                    className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.bedType === 'oneSideWoodenBed'}
                    onChange={(e) => handleRadioChange('bedType', e.target.value)}
                    onBlur={() => handleBlur('bedType')}
                  />
                  <label htmlFor="bedTypeOneSideWoodenBed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Taxtın bir tərəfi</label>
                  <input 
                    type="radio" 
                    id="bedTypeFoldingBed" 
                    name="bedType" 
                    value="foldingBed" 
                    className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.bedType === 'foldingBed'}
                    onChange={(e) => handleRadioChange('bedType', e.target.value)}
                    onBlur={() => handleBlur('bedType')}
                  />
                  <label htmlFor="bedTypeFoldingBed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Raskladuşka</label>
                </div>
              </div>

              <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
                <p className='text-[#000] text-[16px]/[20px] font-medium'>Ev sahibi evdə yaşayacaq?</p>
                {hasError('ownerLives') && <p className="error-text">{getErrorMessage('ownerLives')}</p>}
                <div className='flex flex-row items-center justify-center mt-[9px]'>
                  <input 
                    type="radio" 
                    id="ownerLivesYes" 
                    name="ownerLives" 
                    value="yes" 
                    className='w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.ownerLives === 'yes'}
                    onChange={(e) => handleRadioChange('ownerLives', e.target.value)}
                    onBlur={() => handleBlur('ownerLives')}
                  />
                  <label htmlFor="ownerLivesYes" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Bəli</label>
                  <input 
                    type="radio" 
                    id="ownerLivesNo" 
                    name="ownerLives" 
                    value="no" 
                    className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                    checked={formik.values.ownerLives === 'no'}
                    onChange={(e) => handleRadioChange('ownerLives', e.target.value)}
                    onBlur={() => handleBlur('ownerLives')}
                  />
                  <label htmlFor="ownerLivesNo" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Xeyr</label>
                </div>
              </div>

              <div className='flex flex-row items-end justify-center gap-5 mt-[28px]'>
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="residentsCount" className='text-[#000] text-[20px]/[24px]'>Evdə yaşayanların sayı</label>
                  <input
                    type="number"
                    id="residentsCount"
                    value={formik.values.residentsCount || ''}
                    onChange={(e) => handleInputChange('residentsCount', e.target.value)}
                    onBlur={() => handleBlur('residentsCount')}
                    className={`w-[350px] h-[46px] px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 remove-arrow ${
                      hasError('residentsCount') ? 'error-field' : 'border-black hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#1B8F7D] focus:border-[#1B8F7D]'
                    }`}
                    placeholder="Evdə yaşayanların sayı"
                  />
                  {hasError('residentsCount') && <p className="error-text">{getErrorMessage('residentsCount')}</p>}
                </div>

                <div className='flex flex-col items-start justify-center gap-[12px]'>
                  <h6 className='text-[#000] text-[20px]/[24px]'>
                    Evin tərkibi
                  </h6>

                  <div className='flex flex-row items-center justify-center'>
                    <button
                      type="button"
                      className={`w-[110px] h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${houseComposition === 'male' ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                      onClick={() => updateHouseComposition('male')}
                    >
                      Bəy
                    </button>
                    <button
                      type="button"
                      className={`w-[110px] h-[46px] flex justify-center items-center border border-solid text-[14px] transition-colors duration-200
                        ${houseComposition === 'female' ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                      onClick={() => updateHouseComposition('female')}
                    >
                      Xanım
                    </button>
                    <button
                      type="button"
                      className={`w-[110px] h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${houseComposition === 'mixed' ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                      onClick={() => updateHouseComposition('mixed')}
                    >
                      Qarışıq
                    </button>
                  </div>
                  {hasError('houseComposition') && <p className="error-text">{getErrorMessage('houseComposition')}</p>}
                </div>
              </div>

              <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
                <p className='text-[#000] text-[20px]/[24px]'>Xüsusiyyətlər</p>
                {hasError('features') && <p className="error-text">{getErrorMessage('features')}</p>}
                <div className='grid gap-x-[62px] gap-y-[13px] mt-[9px] w-full grid-cols-3'>
                  {[
                    { id: 'parking', label: 'Parking' },
                    { id: 'furniture', label: 'Mebel' },
                    { id: 'bigAppliances', label: 'Böyük məişət texnikası' },
                    { id: 'balcony', label: 'Çardaq' },
                    { id: 'lift', label: 'Lift' },
                    { id: 'smallAppliances', label: 'Kiçik məişət texnikası' },
                    { id: 'heatingSystem', label: 'İstilik sistemi' },
                    { id: 'coolingSystem', label: 'Soyutma sistemi' },
                    { id: 'security', label: 'Təhlükəsizlik sistemi' }
                  ].map((feature) => (
                    <div key={feature.id} className='flex items-center'>
                      <input 
                        type="checkbox" 
                        id={feature.id} 
                        name="features" 
                        value={feature.id} 
                        className='svg-checkbox'
                        checked={(formik.values.features || []).includes(feature.id)}
                        onChange={() => handleFeatureChange(feature.id)}
                      />
                      <label htmlFor={feature.id} className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>
                        {feature.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
                <p className='text-[#000] text-[20px]/[24px] font-medium'>Otaq yoldaşında axtarılan xüsusiyyətlər</p>

                <div className='flex flex-col items-start justify-center gap-2 mt-[12px]'> 
                  <p className='text-[#000] text-[16px]/[20px] font-medium'>Cinsi</p>
                  {hasError('gender') && <p className="error-text">{getErrorMessage('gender')}</p>}
                  <div className='flex flex-row items-center justify-center mt-[9px]'>
                    <input 
                      type="radio" 
                      id="genderFemale" 
                      name="gender" 
                      value="female" 
                      className='w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.gender === 'female'}
                      onChange={(e) => handleRadioChange('gender', e.target.value)}
                      onBlur={() => handleBlur('gender')}
                    />
                    <label htmlFor="genderFemale" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Qadın</label>
                    <input 
                      type="radio" 
                      id="genderMale" 
                      name="gender" 
                      value="male" 
                      className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.gender === 'male'}
                      onChange={(e) => handleRadioChange('gender', e.target.value)}
                      onBlur={() => handleBlur('gender')}
                    />
                    <label htmlFor="genderMale" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Kişi</label>
                    <input 
                      type="radio" 
                      id="genderAny" 
                      name="gender" 
                      value="any" 
                      className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.gender === 'any'}
                      onChange={(e) => handleRadioChange('gender', e.target.value)}
                      onBlur={() => handleBlur('gender')}
                    />
                    <label htmlFor="genderAny" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Fərqi yoxdur</label>
                  </div>
                </div>

                <div className='flex flex-col items-start justify-center gap-2 mt-[30px]'> 
                  <p className='text-[#000] text-[16px]/[20px] font-medium'>İş statusu</p>
                  {hasError('workStatus') && <p className="error-text">{getErrorMessage('workStatus')}</p>}
                  <div className='flex flex-row items-center justify-center mt-[9px]'>
                    <input 
                      type="radio" 
                      id="workStatusWorking" 
                      name="workStatus" 
                      value="working" 
                      className='w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.workStatus === 'working'}
                      onChange={(e) => handleRadioChange('workStatus', e.target.value)}
                      onBlur={() => handleBlur('workStatus')}
                    />
                    <label htmlFor="workStatusWorking" className='ml-[6px] text-[#000] text-[16px]/[22px]'>İşləyir</label>
                    <input 
                      type="radio" 
                      id="workStatusStudent" 
                      name="workStatus" 
                      value="student" 
                      className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.workStatus === 'student'}
                      onChange={(e) => handleRadioChange('workStatus', e.target.value)}
                      onBlur={() => handleBlur('workStatus')}
                    />
                    <label htmlFor="workStatusStudent" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Tələbə</label>
                    <input 
                      type="radio" 
                      id="workStatusAny" 
                      name="workStatus" 
                      value="any" 
                      className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.workStatus === 'any'}
                      onChange={(e) => handleRadioChange('workStatus', e.target.value)}
                      onBlur={() => handleBlur('workStatus')}
                    />
                    <label htmlFor="workStatusAny" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Fərqi yoxdur</label>
                  </div>
                </div>

                <div className='flex flex-col items-start justify-center gap-2 mt-[30px]'> 
                  <p className='text-[#000] text-[16px]/[20px] font-medium'>Siqaret çəkməsi</p>
                  {hasError('smoking') && <p className="error-text">{getErrorMessage('smoking')}</p>}
                  <div className='flex flex-row items-center justify-center mt-[9px]'>
                    <input 
                      type="radio" 
                      id="smokingAllowed" 
                      name="smoking" 
                      value="allowed" 
                      className='w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.smoking === 'allowed'}
                      onChange={(e) => handleRadioChange('smoking', e.target.value)}
                      onBlur={() => handleBlur('smoking')}
                    />
                    <label htmlFor="smokingAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olar</label>
                    <input 
                      type="radio" 
                      id="smokingNotAllowed" 
                      name="smoking" 
                      value="notAllowed" 
                      className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.smoking === 'notAllowed'}
                      onChange={(e) => handleRadioChange('smoking', e.target.value)}
                      onBlur={() => handleBlur('smoking')}
                    />
                    <label htmlFor="smokingNotAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olmaz</label>
                    <input 
                      type="radio" 
                      id="smokingAny" 
                      name="smoking" 
                      value="any" 
                      className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.smoking === 'any'}
                      onChange={(e) => handleRadioChange('smoking', e.target.value)}
                      onBlur={() => handleBlur('smoking')}
                    />
                    <label htmlFor="smokingAny" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Fərqi yoxdur</label>
                  </div>
                </div>

                <div className='flex flex-col items-start justify-center gap-2 mt-[30px]'> 
                  <p className='text-[#000] text-[16px]/[20px] font-medium'>Ev heyvanı</p>
                  {hasError('pets') && <p className="error-text">{getErrorMessage('pets')}</p>}
                  <div className='flex flex-row items-center justify-center mt-[9px]'>
                    <input 
                      type="radio" 
                      id="petsAllowed" 
                      name="pets" 
                      value="allowed" 
                      className='w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.pets === 'allowed'}
                      onChange={(e) => handleRadioChange('pets', e.target.value)}
                      onBlur={() => handleBlur('pets')}
                    />
                    <label htmlFor="petsAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olar</label>
                    <input 
                      type="radio" 
                      id="petsNotAllowed" 
                      name="pets" 
                      value="notAllowed" 
                      className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.pets === 'notAllowed'}
                      onChange={(e) => handleRadioChange('pets', e.target.value)}
                      onBlur={() => handleBlur('pets')}
                    />
                    <label htmlFor="petsNotAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olmaz</label>
                    <input 
                      type="radio" 
                      id="petsAny" 
                      name="pets" 
                      value="any" 
                      className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.pets === 'any'}
                      onChange={(e) => handleRadioChange('pets', e.target.value)}
                      onBlur={() => handleBlur('pets')}
                    />
                    <label htmlFor="petsAny" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Fərqi yoxdur</label>
                  </div>
                </div>

                <div className='flex flex-col items-start justify-center gap-2 mt-[30px]'> 
                  <p className='text-[#000] text-[16px]/[20px] font-medium'>Əks cinsin gəlməsi</p>
                  {hasError('visitors') && <p className="error-text">{getErrorMessage('visitors')}</p>}
                  <div className='flex flex-row items-center justify-center mt-[9px]'>
                    <input 
                      type="radio" 
                      id="visitorsAllowed" 
                      name="visitors" 
                      value="allowed" 
                      className='w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.visitors === 'allowed'}
                      onChange={(e) => handleRadioChange('visitors', e.target.value)}
                      onBlur={() => handleBlur('visitors')}
                    />
                    <label htmlFor="visitorsAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olar</label>
                    <input 
                      type="radio" 
                      id="visitorsNotAllowed" 
                      name="visitors" 
                      value="notAllowed" 
                      className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.visitors === 'notAllowed'}
                      onChange={(e) => handleRadioChange('visitors', e.target.value)}
                      onBlur={() => handleBlur('visitors')}
                    />
                    <label htmlFor="visitorsNotAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olmaz</label>
                    <input 
                      type="radio" 
                      id="visitorsAny" 
                      name="visitors" 
                      value="any" 
                      className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'
                      checked={formik.values.visitors === 'any'}
                      onChange={(e) => handleRadioChange('visitors', e.target.value)}
                      onBlur={() => handleBlur('visitors')}
                    />
                    <label htmlFor="visitorsAny" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Fərqi yoxdur</label>
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
                <p className='text-[#000] text-[20px]/[24px]'>Təsviri</p>
                <div className='mt-[9px] w-full'>
                  <textarea
                    className={`w-[647px] min-h-[120px] border rounded-[8px] p-[12px] text-[16px] resize-y transition-all duration-200 ${
                      hasError('description') ? 'error-field' : 'border-[#E9E9E9] focus:outline-none focus:border-[#1B8F7D]'
                    }`}
                    placeholder="Əlavə məlumat daxil edin"
                    value={formik.values.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    onBlur={() => handleBlur('description')}
                    maxLength={5000}
                    minLength={50}
                  />
                  <p className='text-[#6C707A] text-[14px] mt-[8px] text-right'>
                    {(formik.values.description || '').length}/5000
                  </p>              
                </div>
                {hasError('description') && <p className="error-text">{getErrorMessage('description')}</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default RoommateAnncDetails