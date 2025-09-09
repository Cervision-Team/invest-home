import React, { useState } from 'react';

const AnncDetails = ({ activePropertyType }) => {
  const [description, setDescription] = useState('');

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
        `}
      </style>
      
      <div className="h-full pb-[16px] border-b border-[rgba(0,0,0,0.2)]">
        <div className="flex items-start justify-start gap-[95px] max-h-[444px] overflow-y-auto hide-scrollbar">
          <form action="" className="w-full"> 
            <div className='flex flex-col items-start justify-center'>
            <h5 className='text-[#000] text-[24px]/[28px] font-medium'>
              Detallar
            </h5>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[20px]/[24px]'>Çıxarış?</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="theres" name="exit" value="yes" className='w-[20px] h-[20px] accent-primary'/>
               <label htmlFor="theres" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Var</label>
                <input type="radio" id="theresNot" name="exit" value="no" className='ml-[60px] w-[20px] h-[20px] accent-primary'/>
                <label htmlFor="theresNot" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Yoxdur</label>
              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[20px]/[24px]'>İpotekaya yararlıdır?</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="yes" name="mortgage" value="yes" className='w-[20px] h-[20px] accent-primary'/>
               <label htmlFor="yes" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Bəli</label>
                <input type="radio" id="no" name="mortgage" value="no" className='ml-[60px] w-[20px] h-[20px] accent-primary'/>
                <label htmlFor="no" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Xeyr</label>
              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[20px]/[24px]'>Əlavə xüsusiyyətlər</p>
              <div className={`grid gap-x-[62px] gap-y-[13px] mt-[9px] w-full ${
                activePropertyType === 'garage' ? 'grid-cols-2' : 'grid-cols-3'
              }`}>


                {activePropertyType !== 'land' && activePropertyType !== 'garage' && (
                  <>
                    <div className='flex items-center'>
                      <input type="checkbox" id="parking" name="features" value="parking" className='svg-checkbox'/>
                      <label htmlFor="parking" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Parking</label>
                    </div>
                    <div className='flex items-center'>
                      <input type="checkbox" id="furniture" name="features" value="furniture" className='svg-checkbox'/>
                      <label htmlFor="furniture" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Mebel</label>
                    </div>
                    <div className='flex items-center'>
                      <input type="checkbox" id="bigAppliances" name="features" value="bigAppliances" className='svg-checkbox'/>
                      <label htmlFor="bigAppliances" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Böyük məişət texnikası</label>
                    </div>
                    <div className='flex items-center'>
                      <input type="checkbox" id="balcony" name="features" value="balcony" className='svg-checkbox'/>
                      <label htmlFor="balcony" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Çardaq</label>
                    </div>
                    <div className='flex items-center'>
                      <input type="checkbox" id="lift" name="features" value="lift" className='svg-checkbox'/>
                      <label htmlFor="lift" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Lift</label>
                    </div>
                  </>
                )}
                
                {(activePropertyType !== 'land') && (
                  <>
                    <div className='flex items-center'>
                      <input type="checkbox" id="smallAppliances" name="features" value="smallAppliances" className='svg-checkbox'/>
                      <label htmlFor="smallAppliances" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Kiçik məişət texnikası</label>
                    </div>
                    <div className='flex items-center'>
                      <input type="checkbox" id="heatingSystem" name="features" value="heatingSystem" className='svg-checkbox'/>
                      <label htmlFor="heatingSystem" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>İstilik sistemi</label>
                    </div>
                    <div className='flex items-center'>
                      <input type="checkbox" id="coolingSystem" name="features" value="coolingSystem" className='svg-checkbox'/>
                      <label htmlFor="coolingSystem" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Soyutma sistemi</label>
                    </div>
                    <div className='flex items-center'>
                      <input type="checkbox" id="security" name="features" value="security" className='svg-checkbox'/>
                      <label htmlFor="security" className='ml-[6px] text-[#000] text-[16px]/[22px] whitespace-nowrap'>Təhlükəsizlik sistemi</label>
                    </div>
                  </>
                )}

              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[20px]/[24px]'>Təsviri</p>
              <div className='mt-[9px] w-full'>
                <textarea
                  className="w-[647px] min-h-[120px] border border-[#E9E9E9] rounded-[8px] p-[12px] text-[16px] resize-y focus:outline-none focus:border-primary transition-colors duration-200"
                  placeholder="Əlavə məlumat daxil edin"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={5000}></textarea>
                  <p className='text-[#6C707A] text-[14px] mt-[8px] text-right'>
                    {description.length}/5000
                  </p>              
               </div>
            </div>

          </div>
        </form>
      </div>
      </div>
    </>
  )
}

export default AnncDetails