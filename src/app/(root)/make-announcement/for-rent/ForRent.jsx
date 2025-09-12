import PropertyTypeButton from '@/components/ui/PropertyTypeButton';
import React, { useState, useEffect, useCallback } from 'react';
import "../../../globals.css";
import { getValidationSchema } from '@/lib/schemas/announcementSchema';

const ForRent = ({
  formik,
  stepErrors = {},
  setStepErrors,
  isValidating,
  activePropertyType,
  setActivePropertyType
}) => {
  const [activeOfficeType, setActiveOfficeType] = useState(formik?.values?.officeType || null);
  const [activeBuilding, setActiveBuilding] = useState(formik?.values?.buildingType || null);
  const [activeRepaired, setActiveRepaired] = useState(formik?.values?.repairStatus || null);
  const [isMortgaged, setIsMortgaged] = useState(formik?.values?.isMortgaged || false);

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
  const schema = getValidationSchema(2, 'default', currentValues);

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
  const clearFieldsForPropertyType = useCallback((propertyType) => {
    const fieldsToAlwaysClear = ['officeType', 'buildingType'];
    
    let fieldsToClear = [...fieldsToAlwaysClear];
    
    if (propertyType === 'land') {
      fieldsToClear.push('area', 'repairStatus', 'floor', 'totalFloors', 'rooms', 'bathrooms');
    } else if (propertyType === 'house') {
      fieldsToClear.push('floor', 'buildingType');
    } else if (propertyType === 'garage') {
      fieldsToClear.push('landArea', 'rooms', 'bathrooms');
    } else if (propertyType === 'apartment') {
      fieldsToClear.push('landArea');
    }

    fieldsToClear.forEach(field => {
      formik.setFieldValue(field, '');
      clearErrorForField(field);
    });
  }, [formik, clearErrorForField]);

  const updatePropertyType = useCallback((type) => {
    setActivePropertyType(type);
    formik.setFieldValue('propertyType', type);
    clearErrorForField('propertyType');
    
    clearFieldsForPropertyType(type);
    
    if (activePropertyType === 'office' && type !== 'office') {
      setActiveOfficeType(null);
    }
  }, [setActivePropertyType, formik, clearErrorForField, clearFieldsForPropertyType, activePropertyType]);

  const updateOfficeType = useCallback((type) => {
    setActiveOfficeType(type);
    formik.setFieldValue('officeType', type);
    clearErrorForField('officeType');
    
    if (type === 'gardenHouse') {
      formik.setFieldValue('buildingType', '');
      setActiveBuilding(null);
      clearErrorForField('buildingType');
    }
  }, [formik, clearErrorForField]);

  const updateBuildingType = useCallback((type) => {
    setActiveBuilding(type);
    formik.setFieldValue('buildingType', type);
    clearErrorForField('buildingType');
  }, [formik, clearErrorForField]);

  const updateRepairStatus = useCallback((status) => {
    setActiveRepaired(status);
    formik.setFieldValue('repairStatus', status);
    clearErrorForField('repairStatus');
  }, [formik, clearErrorForField]);

  const updateMortgageStatus = useCallback((status) => {
    setIsMortgaged(status);
    formik.setFieldValue('isMortgaged', status);
    clearErrorForField('isMortgaged');
    
    if (!status) {
      const mortgageFields = ['initialPayment', 'monthlyPayment', 'remainingYears', 'remainingMonths'];
      mortgageFields.forEach(field => {
        formik.setFieldValue(field, '');
        clearErrorForField(field);
      });
    }
  }, [formik, clearErrorForField]);

  const displayedErrors = { ...(localErrors || {}), ...(stepErrors || {}) };

  const getErrorMessage = (fieldName) => displayedErrors[fieldName];
  const hasError = (fieldName) => !!displayedErrors[fieldName];

  useEffect(() => {
    setActiveBuilding(formik?.values?.buildingType || null);
    setActiveRepaired(formik?.values?.repairStatus || null);
    setActiveOfficeType(formik?.values?.officeType || null);
    setIsMortgaged(!!formik?.values?.isMortgaged);
  }, [formik?.values?.buildingType, formik?.values?.repairStatus, formik?.values?.officeType, formik?.values?.isMortgaged]);

  const shouldShowField = useCallback((fieldName) => {
    switch (fieldName) {
      case 'area':
        return activePropertyType && activePropertyType !== 'land';
      case 'landArea':
        return activePropertyType === 'house' || 
               activePropertyType === 'land' || 
               (activePropertyType === 'office' && activeOfficeType === 'gardenHouse');
      case 'floor':
        return activePropertyType === 'apartment' || 
               activePropertyType === 'object' || 
               (activePropertyType === 'office' && activeOfficeType !== 'gardenHouse');
      case 'totalFloors':
        return activePropertyType === 'apartment' || 
               activePropertyType === 'house' || 
               activePropertyType === 'office' || 
               activePropertyType === 'object';
      case 'rooms':
      case 'bathrooms':
        return activePropertyType === 'apartment' || 
               activePropertyType === 'house' || 
               activePropertyType === 'object' || 
               (activePropertyType === 'office' && activeOfficeType !== 'businessCenter');
      case 'price':
        return  activePropertyType === "house" || 
      activePropertyType === "object" || 
      (activePropertyType === "office" && activeOfficeType === "apartmentOffice") ||
      activePropertyType === "garage" ||
      activePropertyType === "land";
      case 'buildingType':
        return (activePropertyType === 'apartment' || 
                activePropertyType === 'object' || 
                (activePropertyType === 'office' && activeOfficeType !== 'gardenHouse'));
      case 'repairStatus':
        return activePropertyType && activePropertyType !== 'land';
      default:
        return true;
    }
  }, [activePropertyType, activeOfficeType]);

  return (
    <>
      <style>
        {`
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

      <div className='h-full flex items-start justify-start gap-[95px] pb-[16px] border-b-[1px] border-[rgba(0,0,0,0.2)] max-h-[444px] overflow-y-auto hide-scrollbar pl-[2px]'>
        <form action="">
          <div className='flex flex-col items-start justify-center gap-[30px]'>
            <h5 className='text-[#000] text-[24px]/[28px] font-medium'>Xüsusiyyətlər</h5>

            <div>
              <h6 className='text-[#000] text-[20px]/[24px]'>Əmlak növü</h6>
              {hasError('propertyType') && <p className="error-text">{getErrorMessage('propertyType')}</p>}
            </div>

            <div className='w-[647px] flex flex-row flex-wrap gap-x-[23px] gap-y-[32px]'>
              <PropertyTypeButton
                src={"/icons/apartment-black.svg"}
                srcOnHover={"/icons/apartment-white.svg"}
                text={"Mənzil"}
                isActive={activePropertyType === 'apartment'}
                onClick={() => updatePropertyType('apartment')}
              />
              <PropertyTypeButton
                src={"/icons/home-sale-black.svg"}
                srcOnHover={"/icons/home-sale-white.svg"}
                text={"Obyekt"}
                isActive={activePropertyType === 'object'}
                onClick={() => updatePropertyType('object')}
              />
              <PropertyTypeButton
                src={"/icons/land-black.svg"}
                srcOnHover={"/icons/land-white.svg"}
                text={"Torpaq"}
                isActive={activePropertyType === 'land'}
                onClick={() => updatePropertyType('land')}
              />
              <PropertyTypeButton
                src={"/icons/house-black.svg"}
                srcOnHover={"/icons/house-white.svg"}
                text={"Həyət/Bağ/Villa"}
                isActive={activePropertyType === 'house'}
                onClick={() => updatePropertyType('house')}
              />
              <PropertyTypeButton
                src={"/icons/office-black.svg"}
                srcOnHover={"/icons/office-white.svg"}
                text={"Ofis"}
                isActive={activePropertyType === 'office'}
                onClick={() => updatePropertyType('office')}
              />
              <PropertyTypeButton
                src={"/icons/garage-black.svg"}
                srcOnHover={"/icons/garage-white.svg"}
                text={"Qaraj"}
                isActive={activePropertyType === 'garage'}
                onClick={() => updatePropertyType('garage')}
              />
            </div>
          </div>

          {activePropertyType === 'office' && (
            <div className='flex flex-col items-start justify-center gap-[12px] mt-[36px]'>
              <h6 className='text-[#000] text-[20px]/[24px]'>Ofisin tipi</h6>

              <div className='flex flex-row items-center justify-center'>
                <button
                  type="button"
                  className={`w-[181px] h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                    ${activeOfficeType === 'businessCenter' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                  onClick={() => updateOfficeType('businessCenter')}
                >
                  Biznes mərkəzi
                </button>
                <button
                  type="button"
                  className={`w-[181px] h-[46px] flex justify-center items-center border border-solid text-[14px] transition-colors duration-200
                    ${activeOfficeType === 'apartmentOffice' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                  onClick={() => updateOfficeType('apartmentOffice')}
                >
                  Mənzil
                </button>
                <button
                  type="button"
                  className={`w-[181px] h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                    ${activeOfficeType === 'gardenHouse' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                  onClick={() => updateOfficeType('gardenHouse')}
                >
                  Bağ evi
                </button>
              </div>
            {hasError('officeType') && <p className="error-text">{getErrorMessage('officeType')}</p>}
            </div>
          )}

                {(
                  (activePropertyType && activePropertyType !== 'office') ||
                  (activePropertyType === 'office' && activeOfficeType)
                ) && (   
                <>
              {shouldShowField('repairStatus') && (
                <div className='w-full flex flex-row items-center justify-start gap-[35px] mt-[28px]'>
                  {shouldShowField('buildingType') && (
                    <div className='flex flex-col items-start justify-center gap-[12px]'>
                      <h6 className='text-[#000] text-[20px]/[24px]'>Bina</h6>

                      <div className='flex flex-row items-center justify-center'>
                        <button
                          type="button"
                          className={`w-[181px] h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                            ${activeBuilding === 'newBuilding' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                          onClick={() => updateBuildingType('newBuilding')}
                        >
                          Yeni tikili
                        </button>
                        <button
                          type="button"
                          className={`w-[181px] h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                            ${activeBuilding === 'oldBuilding' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                          onClick={() => updateBuildingType('oldBuilding')}
                        >
                          Köhnə tikili
                        </button>
                      </div>
                    {hasError('buildingType') && <p className="error-text">{getErrorMessage('buildingType')}</p>}
                    </div>
                  )}

                  <div className='flex flex-col items-start justify-center gap-[12px]'>
                    <h6 className='text-[#000] text-[20px]/[24px]'>Təmiri</h6>

                    <div className='flex flex-row items-center justify-center'>
                      <button
                        type="button"
                        className={`w-[181px] h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${activeRepaired === 'renewed' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => updateRepairStatus('renewed')}
                      >
                        Təmirli
                      </button>
                      <button
                        type="button"
                        className={`w-[181px] h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${activeRepaired === 'notRenewed' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => updateRepairStatus('notRenewed')}
                      >
                        Təmirsiz
                      </button>
                    </div>
                    {hasError('repairStatus') && <p className="error-text">{getErrorMessage('repairStatus')}</p>}
                  </div>
                </div>
              )}

              <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
                <p className='text-[#000] text-[16px]/[20px] font-medium'>Hazırda ipotekadadır?</p>

                <div className='flex flex-row items-center justify-center mt-[9px]'>
                  <input
                    type="radio"
                    id="yes"
                    name="mortgaged"
                    className='w-[20px] h-[20px] accent-primary'
                    onChange={() => updateMortgageStatus(true)}
                    checked={isMortgaged === true}
                  />
                  <label htmlFor="yes" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Bəli</label>

                  <input
                    type="radio"
                    id="no"
                    name="mortgaged"
                    className='ml-[60px] w-[20px] h-[20px] accent-primary'
                    onChange={() => updateMortgageStatus(false)}
                    checked={isMortgaged === false}
                  />
                  <label htmlFor="no" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Xeyr</label>
                </div>
                {hasError('isMortgaged') && <p className="error-text">{getErrorMessage('isMortgaged')}</p>}
              </div>

              {isMortgaged && (
                <div className='flex flex-col items-start justify-center gap-[18px] mt-[40px]'>
                  <p className='text-[#000] text-[16px]/[20px] font-medium'>İpoteka detalları</p>

                  <div className='w-full flex flex-row items-center justify-start gap-[24px]'>
                    <div className='flex flex-col items-start justify-center gap-2'>
                      <label htmlFor="initialPayment" className='text-[#000] text-[16px]/[20px]'>İlkin ödəniş</label>
                      <input
                        type="number"
                        id="initialPayment"
                        value={formik.values.initialPayment || ''}
                        onChange={(e) => handleInputChange('initialPayment', e.target.value)}
                        onBlur={() => handleBlur("initialPayment")}
                        className={`w-[200px] h-10 px-[10px] py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 remove-arrow ${hasError('initialPayment') ? 'error-field' : 'border-black'}`}
                        placeholder="Məs: 10000"
                      />
                      {hasError('initialPayment') && <p className="error-text">{getErrorMessage('initialPayment')}</p>}
                    </div>

                    <div className='flex flex-col items-start justify-center gap-2'>
                      <label htmlFor="monthlyPayment" className='text-[#000] text-[16px]/[20px]'>Aylıq ödəniş</label>
                      <input
                        type="number"
                        id="monthlyPayment"
                        value={formik.values.monthlyPayment || ''}
                        onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
                        onBlur={() => handleBlur("monthlyPayment")}
                        className={`w-[200px] h-10 px-[10px] py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 remove-arrow ${hasError('monthlyPayment') ? 'error-field' : 'border-black'}`}
                        placeholder="Məs: 500"
                      />
                      {hasError('monthlyPayment') && <p className="error-text">{getErrorMessage('monthlyPayment')}</p>}
                    </div>

                    <div className='flex flex-col items-start justify-center gap-2'>
                      <label htmlFor="remainingYears" className='text-[#000] text-[16px]/[20px]'>Qalıq il</label>
                      <input
                        type="number"
                        id="remainingYears"
                        value={formik.values.remainingYears || ''}
                        onChange={(e) => handleInputChange('remainingYears', e.target.value)}
                        onBlur={() => handleBlur("remainingYears")}
                        className={`w-[200px] h-10 px-[10px] py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 remove-arrow ${hasError('remainingYears') ? 'error-field' : 'border-black'}`}
                        placeholder="Məs: 10"
                      />
                      {hasError('remainingYears') && <p className="error-text">{getErrorMessage('remainingYears')}</p>}
                    </div>

                    <div className='flex flex-col items-start justify-center gap-2'>
                      <label htmlFor="remainingMonths" className='text-[#000] text-[16px]/[20px]'>Qalıq ay</label>
                      <input
                        type="number"
                        id="remainingMonths"
                        value={formik.values.remainingMonths || ''}
                        onChange={(e) => handleInputChange('remainingMonths', e.target.value)}
                        onBlur={() => handleBlur("remainingMonths")}
                        className={`w-[200px] h-10 px-[10px] py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 remove-arrow ${hasError('remainingMonths') ? 'error-field' : 'border-black'}`}
                        placeholder="Məs: 6"
                      />
                      {hasError('remainingMonths') && <p className="error-text">{getErrorMessage('remainingMonths')}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className='w-full flex flex-row flex-wrap items-center justify-start gap-x-[38px] gap-y-[38px] mt-[40px]'>
                {shouldShowField('area') && (
                  <div className="flex flex-col items-start justify-center gap-2">
                    <label htmlFor="area" className="text-[#000] text-[20px]/[24px]">Sahə</label>
                    <div className="relative w-[350px]">
                      <input
                        type="number"
                        id="area"
                        value={formik.values.area || ''}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        onBlur={() => handleBlur("area")}
                        className={`w-full h-10 pr-12 pl-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 remove-arrow ${hasError('area') ? 'error-field' : 'border-black'}`}
                        placeholder="Sahə"
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">m²</span>
                    </div>
                    {hasError('area') && <p className="error-text">{getErrorMessage('area')}</p>}
                  </div>
                )}

                {shouldShowField('landArea') && (
                  <div className="flex flex-col items-start justify-center gap-2">
                    <label htmlFor="landArea" className="text-[#000] text-[20px]/[24px]">Torpağın sahəsi</label>
                    <div className="relative w-[350px]">
                      <input
                        type="number"
                        id="landArea"
                        value={formik.values.landArea || ''}
                        onChange={(e) => handleInputChange('landArea', e.target.value)}
                        onBlur={() => handleBlur("landArea")}
                        className={`w-full h-10 pr-12 pl-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 remove-arrow ${hasError('landArea') ? 'error-field' : 'border-black'}`}
                        placeholder="Sahə"
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">m²</span>
                    </div>
                    {hasError('landArea') && <p className="error-text">{getErrorMessage('landArea')}</p>}
                  </div>
                )}

                {shouldShowField('floor') && (
                  <div className='flex flex-col items-start justify-center gap-2'>
                    <label htmlFor="floor" className='text-[#000] text-[20px]/[24px]'>Mərtəbə</label>
                    <input
                      type="number"
                      id="floor"
                      value={formik.values.floor || ''}
                      onChange={(e) => handleInputChange('floor', e.target.value)}
                      onBlur={() => handleBlur("floor")}
                      className={`w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 remove-arrow ${
                        hasError('floor') ? 'error-field' : 'border-black'}`}
                      placeholder="Mərtəbə"
                    />
                    {hasError('floor') && <p className="error-text">{getErrorMessage('floor')}</p>}
                  </div>
                )}

                                 {shouldShowField('totalFloors') && (
                  <div className='flex flex-col items-start justify-center gap-2'>
                    <label htmlFor="totalFloors" className='text-[#000] text-[20px]/[24px]'>Ümumi mərtəbələr</label>
                    <input
                      type="number"
                      id="totalFloors"
                      value={formik.values.totalFloors || ''}
                      onChange={(e) => handleInputChange('totalFloors', e.target.value)}
                      onBlur={() => handleBlur("totalFloors")}
                      className={`w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 remove-arrow ${hasError('totalFloors') ? 'error-field' : 'border-black'}`}
                      placeholder="Sayı"
                    />
                    {hasError('totalFloors') && <p className="error-text">{getErrorMessage('totalFloors')}</p>}
                  </div>
                )}

                {shouldShowField('rooms') && (
                  <div className='flex flex-col items-start justify-center gap-2'>
                    <label htmlFor="rooms" className='text-[#000] text-[20px]/[24px]'>Otaq</label>
                    <input
                      type="number"
                      id="rooms"
                      value={formik.values.rooms || ''}
                      onChange={(e) => handleInputChange('rooms', e.target.value)}
                      onBlur={() => handleBlur("rooms")}
                      className={`w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 remove-arrow ${hasError('rooms') ? 'error-field' : 'border-black'}`}
                      placeholder="Sayı"
                    />
                    {hasError('rooms') && <p className="error-text">{getErrorMessage('rooms')}</p>}
                  </div>
                )}

                {shouldShowField('bathrooms') && (
                  <div className='flex flex-col items-start justify-center gap-2'>
                    <label htmlFor="bathrooms" className='text-[#000] text-[20px]/[24px]'>Sanitar qovşağı</label>
                    <input
                      type="number"
                      id="bathrooms"
                      value={formik.values.bathrooms || ''}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      onBlur={() => handleBlur("bathrooms")}
                      className={`w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 remove-arrow ${
                     hasError('bathrooms') ? 'error-field' : 'border-black'}`}
                      placeholder="Sayı"
                    />
                   {hasError('bathrooms') && <p className="error-text">{getErrorMessage('bathrooms')}</p>}
                  </div>
                  )}

                {shouldShowField('price') && (
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="price" className='text-[#000] text-[20px]/[24px]'>Qiyməti</label>
                  <div className="relative w-[350px]">
                    <input
                      type="number"
                      id="price"
                      value={formik.values.price || ''}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      onBlur={() => handleBlur("price")}
                      className={`w-full h-10 pr-16 pl-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 remove-arrow ${hasError('price') ? 'error-field' : 'border-black'}`}
                      placeholder="Qiymət"
                    />
                  </div>
                  {hasError('price') && <p className="error-text">{getErrorMessage('price')}</p>}
                </div>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default ForRent;

