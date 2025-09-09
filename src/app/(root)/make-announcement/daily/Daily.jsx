import PropertyTypeButton from '@/components/ui/PropertyTypeButton';
import React, { useState } from 'react'
import "../../../globals.css"

const Daily = ({ activePropertyType, setActivePropertyType }) => {
    const [activeBuilding, setActiveBuilding] = useState(null);
  
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
        `}
    </style>
      <div className=' h-full flex items-start justify-start gap-[95px] pb-[16px] border-b-[1px] border-[rgba(0,0,0,0.2)] max-h-[444px] overflow-y-auto hide-scrollbar pl-[2px]'>
          <form action="">
            <div className='flex flex-col items-start justify-center gap-[30px]'>
              <h5 className='text-[#000] text-[24px]/[28px] font-medium'>
                Xüsusiyyətlər
              </h5>
              <h6 className='text-[#000] text-[20px]/[24px]'>
                Əmlak növü
              </h6>

              <div className=' w-[647px] flex flex-row flex-wrap gap-x-[23px] gap-y-[32px]'>
              <PropertyTypeButton
              src={"/icons/apartment-black.svg"}
              srcOnHover={"/icons/apartment-white.svg"}
              text={"Mənzil"}
              isActive={activePropertyType === 'apartmentDaily'}
              onClick={() => setActivePropertyType('apartmentDaily')}
              />
              <PropertyTypeButton
              src={"/icons/house-black.svg"}
              srcOnHover={"/icons/house-white.svg"}
              text={"Bağ Evi"}
              isActive={activePropertyType === 'gardenHouse'}
              onClick={() => setActivePropertyType('gardenHouse')}
              />
              <PropertyTypeButton
              src={"/icons/aframe-black.svg"}
              srcOnHover={"/icons/aframe-white.svg"}
              text={"A frame"}
              isActive={activePropertyType === 'aframe'}
              onClick={() => setActivePropertyType('aframe')}
              />
              <PropertyTypeButton
              src={"/icons/kotej-black.svg"}
              srcOnHover={"/icons/kotej-white.svg"}
              text={"Kotej"}
              isActive={activePropertyType === 'kotej'}
              onClick={() => setActivePropertyType('kotej')}
              />
              <PropertyTypeButton
              src={"/icons/room-black.svg"}
              srcOnHover={"/icons/room-white.svg"}
              text={"Otaq"}
              isActive={activePropertyType === 'room'}
              onClick={() => setActivePropertyType('room')}
              />
              
              </div>

            </div>
            {activePropertyType && (
              <>
              {activePropertyType === 'apartmentDaily' && (
              <div className='w-full flex flex-row items-center justify-start gap-[35px] mt-[28px]'>
                  <div className='flex flex-col items-start justify-center gap-[12px]'>
                  <h6 className='text-[#000] text-[20px]/[24px]'>
                    Bina
                  </h6>

                  <div className='flex flex-row items-center justify-center'>
                    <button
                      type="button"
                      className={`w-[181px] h-[46px] flex justify-center items-center rounded-l-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${activeBuilding === 'newBuilding' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => setActiveBuilding('newBuilding')}
                        >
                      Yeni tikili
                    </button>
                    <button
                      type="button"
                      className={`w-[181px] h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${activeBuilding === 'oldBuilding' ? 'border-primary bg-primary text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => setActiveBuilding('oldBuilding')}
                        >
                      Köhnə tikili
                    </button>
                  </div>
                </div>
              </div>
              )}


              <div className='w-full flex flex-row flex-wrap items-center justify-start gap-x-[38px] gap-y-[38px] mt-[40px]'>
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="guestCount" className='text-[#000] text-[20px]/[24px]'>Qonaq sayı</label>
                  <input
                    type="number"
                    id="guestCount"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Sayı"
                  />
                </div>
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="nightCount" className='text-[#000] text-[20px]/[24px]'>Gecə sayı</label>
                  <input
                    type="number"
                    id="nightCount"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Sayı"
                  />
                </div>
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="checkInTime" className='text-[#000] text-[20px]/[24px]'>Giriş vaxtı</label>
                  <input
                    type="number"
                    id="checkInTime"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="01.01.2025, 00:00"
                  />
                </div>
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="checkOutTime" className='text-[#000] text-[20px]/[24px]'>Çıxış vaxtı</label>
                  <input
                    type="number"
                    id="checkOutTime"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="01.01.2025, 00:00"
                  />
                </div>

                  <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="price" className='text-[#000] text-[20px]/[24px]'>Qiymət</label>
                  <input
                    type="number"
                    id="price"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Qiymət"
                    />
                </div>


                  <div className="flex flex-col items-start justify-center gap-2">
                   <label htmlFor="area" className="text-[#000] text-[20px]/[24px]">
                     Sahə
                   </label>
                   <div className="relative w-[350px]">
                     <input
                       type="number"
                       id="area"
                       className="w-full h-10 pr-12 pl-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                       placeholder="Sahə"
                     />
                     <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                       m²
                     </span>
                   </div>
                 </div>

                 {activePropertyType !== 'apartmentDaily' && (
                   <div className="flex flex-col items-start justify-center gap-2">
                   <label htmlFor="landArea" className="text-[#000] text-[20px]/[24px]">
                     Torpağın sahəsi
                   </label>
                   <div className="relative w-[350px]">
                     <input
                       type="number"
                       id="landArea"
                       className="w-full h-10 pr-12 pl-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                       placeholder="Sahə"
                     />
                     <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                       m²
                     </span>
                   </div>
                 </div>
                )}
                 
                 {activePropertyType === 'apartmentDaily' && (
                   <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="floor" className='text-[#000] text-[20px]/[24px]'>Mərtəbə</label>
                  <input
                    type="number"
                    id="floor"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Mərtəbə"
                    />
                </div>
                  )}
                    
                    {activePropertyType === 'apartmentDaily' || activePropertyType === 'aframe' && (
                      <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="totalFloors" className='text-[#000] text-[20px]/[24px]'>Ümumi mərtəbələr</label>
                  <input
                    type="number"
                    id="totalFloors"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Sayı"
                    />
                </div>
                  )}
                 
                 {activePropertyType !== 'apartmentDaily' && (
                   <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="rooms" className='text-[#000] text-[20px]/[24px]'>Otaq</label>
                  <input
                    type="number"
                    id="rooms"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Sayı"
                  />
                </div>
                )}

                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="bathrooms" className='text-[#000] text-[20px]/[24px]'>Sanitar qovşağı</label>
                  <input
                    type="number"
                    id="bathrooms"
                    className="w-[350px] h-10 px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black remove-arrow"
                    placeholder="Sayı"
                  />
                </div>



              </div>
            </>

            )}

          </form>
      </div>
    
    </>)
}

export default Daily
