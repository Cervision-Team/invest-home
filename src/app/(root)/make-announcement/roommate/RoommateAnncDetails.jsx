import React, { useState } from 'react';

const RoommateAnncDetails = ({ activePropertyType }) => {
  const [description, setDescription] = useState('');
  const [houseComposition, setHouseComposition] = useState(null);
  const [residentsCount, setResidentsCount] = useState(''); // Add this state

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
        `}
      </style>
      
      <div className="h-full pb-[16px] border-b border-[rgba(0,0,0,0.2)]">
        <div className="flex items-start justify-start gap-[95px] max-h-[444px] overflow-y-auto hide-scrollbar pl-[2px]">
          <div className="w-full"> 
            <div className='flex flex-col items-start justify-center'>
            <h5 className='text-[#000] text-[24px]/[28px] font-medium'>
              Detallar
            </h5>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[16px]/[20px] font-medium'>Kommunal qiymətə daxildir?</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="utilitiesYes" name="utilities" value="yes" className='w-[20px] h-[20px] accent-[#1B8F7D]'/>
               <label htmlFor="utilitiesYes" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Bəli</label>
                <input type="radio" id="utilitiesNo" name="utilities" value="no" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="utilitiesNo" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Xeyr</label>
              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[16px]/[20px] font-medium'>Otaq tipi</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="separate" name="roomType" value="separate" className='w-[20px] h-[20px] accent-[#1B8F7D]'/>
               <label htmlFor="separate" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Ayrı</label>
                <input type="radio" id="shared" name="roomType" value="shared" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="shared" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Ortaq</label>
              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[16px]/[20px] font-medium'>Yataq otağının tipi</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="bedTypeSofa" name="bedType" value="sofa" className='w-[20px] h-[20px] accent-[#1B8F7D]'/>
               <label htmlFor="bedTypeSofa" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Divan</label>
                <input type="radio" id="bedTypeBed" name="bedType" value="bed" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="bedTypeBed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Çarpayı</label>
                <input type="radio" id="bedTypeWoodenBed" name="bedType" value="woodenBed" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="bedTypeWoodenBed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Taxt</label>
                <input type="radio" id="bedTypeOneSideWoodenBed" name="bedType" value="oneSideWoodenBed" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="bedTypeOneSideWoodenBed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Taxtın bir tərəfi</label>
                <input type="radio" id="bedTypeFoldingBed" name="bedType" value="foldingBed" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="bedTypeFoldingBed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Raskladuşka</label>
              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[16px]/[20px] font-medium'>Ev sahibi evdə yaşayacaq?</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="ownerLivesYes" name="ownerLives" value="yes" className='w-[20px] h-[20px] accent-[#1B8F7D]'/>
               <label htmlFor="ownerLivesYes" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Bəli</label>
                <input type="radio" id="ownerLivesNo" name="ownerLives" value="no" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="ownerLivesNo" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Xeyr</label>
              </div>
            </div>

            <div className='flex flex-row items-end justify-center gap-5 mt-[28px]'>
                <div className='flex flex-col items-start justify-center gap-2'>
                  <label htmlFor="residentsCount" className='text-[#000] text-[20px]/[24px]'>Evdə yaşayanların sayı</label>
                  <input
                    type="number"
                    id="residentsCount"
                    value={residentsCount}
                    onChange={(e) => setResidentsCount(e.target.value)}
                    className="w-[350px] h-[46px] px-[10px] py-2 bg-white border rounded-[10px] shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#1B8F7D] focus:border-[#1B8F7D] border-black remove-arrow"
                    placeholder="Evdə yaşayanların sayı"
                    />
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
                        onClick={() => setHouseComposition('male')}
                        >
                        Bəy
                    </button>
                    <button
                      type="button"
                      className={`w-[110px] h-[46px] flex justify-center items-center border border-solid text-[14px] transition-colors duration-200
                        ${houseComposition === 'female' ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => setHouseComposition('female')}
                        >
                      Xanım
                    </button>
                    <button
                      type="button"
                      className={`w-[110px] h-[46px] flex justify-center items-center rounded-r-[8px] border border-solid text-[14px] transition-colors duration-200
                        ${houseComposition === 'mixed' ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white' : 'border-[#E9E9E9] bg-[#FAFAFA] text-[#000]'}`}
                        onClick={() => setHouseComposition('mixed')}
                        >
                      Qarışıq
                    </button>
                  </div>
                </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[20px]/[24px]'>Xüsusiyyətlər</p>
              <div className='grid gap-x-[62px] gap-y-[13px] mt-[9px] w-full grid-cols-3'>

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

              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[20px]/[24px] font-medium'>Otaq yoldaşında axtarılan xüsusiyyətlər</p>

            <div className='flex flex-col items-start justify-center gap-2 mt-[12px]'> 
              <p className='text-[#000] text-[16px]/[20px] font-medium'>Cinsi</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="genderFemale" name="gender" value="female" className='w-[20px] h-[20px] accent-[#1B8F7D]'/>
               <label htmlFor="genderFemale" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Qadın</label>
                <input type="radio" id="genderMale" name="gender" value="male" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="genderMale" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Kişi</label>
                <input type="radio" id="genderAny" name="gender" value="any" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="genderAny" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Fərqi yoxdur</label>
              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[30px]'> 
              <p className='text-[#000] text-[16px]/[20px] font-medium'>İş statusu</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="workStatusWorking" name="workStatus" value="working" className='w-[20px] h-[20px] accent-[#1B8F7D]'/>
               <label htmlFor="workStatusWorking" className='ml-[6px] text-[#000] text-[16px]/[22px]'>İşləyir</label>
                <input type="radio" id="workStatusStudent" name="workStatus" value="student" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="workStatusStudent" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Tələbə</label>
                <input type="radio" id="workStatusAny" name="workStatus" value="any" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="workStatusAny" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Fərqi yoxdur</label>
              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[30px]'> 
              <p className='text-[#000] text-[16px]/[20px] font-medium'>Siqaret çəkməsi</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="smokingAllowed" name="smoking" value="allowed" className='w-[20px] h-[20px] accent-[#1B8F7D]'/>
               <label htmlFor="smokingAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olar</label>
                <input type="radio" id="smokingNotAllowed" name="smoking" value="notAllowed" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="smokingNotAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olmaz</label>
                <input type="radio" id="smokingAny" name="smoking" value="any" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="smokingAny" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Fərqi yoxdur</label>
              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[30px]'> 
              <p className='text-[#000] text-[16px]/[20px] font-medium'>Ev heyvanı</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="petsAllowed" name="pets" value="allowed" className='w-[20px] h-[20px] accent-[#1B8F7D]'/>
               <label htmlFor="petsAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olar</label>
                <input type="radio" id="petsNotAllowed" name="pets" value="notAllowed" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="petsNotAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olmaz</label>
                <input type="radio" id="petsAny" name="pets" value="any" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="petsAny" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Fərqi yoxdur</label>
              </div>
            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[30px]'> 
              <p className='text-[#000] text-[16px]/[20px] font-medium'>Əks cinsin gəlməsi</p>
              <div className='flex flex-row items-center justify-center mt-[9px]'>
               <input type="radio" id="visitorsAllowed" name="visitors" value="allowed" className='w-[20px] h-[20px] accent-[#1B8F7D]'/>
               <label htmlFor="visitorsAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olar</label>
                <input type="radio" id="visitorsNotAllowed" name="visitors" value="notAllowed" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="visitorsNotAllowed" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Olmaz</label>
                <input type="radio" id="visitorsAny" name="visitors" value="any" className='ml-[60px] w-[20px] h-[20px] accent-[#1B8F7D]'/>
                <label htmlFor="visitorsAny" className='ml-[6px] text-[#000] text-[16px]/[22px]'>Fərqi yoxdur</label>
              </div>
            </div>

            </div>

            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <p className='text-[#000] text-[20px]/[24px]'>Təsviri</p>
              <div className='mt-[9px] w-full'>
                <textarea
                  className="w-[647px] min-h-[120px] border border-[#E9E9E9] rounded-[8px] p-[12px] text-[16px] resize-y focus:outline-none focus:border-[#1B8F7D] transition-colors duration-200"
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
        </div>
      </div>
      </div>

    </>
  )
}

export default RoommateAnncDetails