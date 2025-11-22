'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import ReturnBack from '@/components/ui/ReturnBack';

export default function LoanAgreementForm() {
  const [formData, setFormData] = useState({});
  const [activeInput, setActiveInput] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [tooltipInfo, setTooltipInfo] = useState({ show: false, text: '', target: null });

  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setTooltipInfo({ show: false, text: '', target: null });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Şərtləri və qaydaları qəbul etməlisiniz');
      return;
    }
    console.log('Form submitted:', formData);
    alert('Sənəd hazırlandı!');
  };

  const handleMouseEnter = (tooltipText, target) => {
    setTooltipInfo({ show: true, text: tooltipText, target });
  };

  const handleMouseLeave = () => {
    setTooltipInfo({ show: false, text: '', target: null });
  };

  const InputField = ({ name, placeholder, tooltip, required = true }) => {
    const isActive = activeInput === name;
    const hasValue = formData[name] && formData[name].trim() !== '';

    return (
      <span className="inline-flex items-center gap-1 relative select-none">
        <span className="inline-block relative">
          {!isActive && !hasValue ? (
            <span
              onClick={() => setActiveInput(name)}
              className="bg-yellow-300 px-2 py-1 cursor-pointer hover:bg-yellow-400 transition-colors inline-block"
            >
              <span className="text-sm">{placeholder}</span>
            </span>
          ) : isActive ? (
            <span className="inline-block px-2 py-1 bg-white">
              <input
                type="text"
                value={formData[name] || ''}
                onChange={(e) => handleInputChange(name, e.target.value)}
                onBlur={() => setActiveInput(null)}
                autoFocus={isActive}
                required={required}
                className="outline-none bg-transparent border-none min-w-[200px] text-sm"
              />
            </span>
          ) : (
            <span
              onClick={() => setActiveInput(name)}
              className="bg-yellow-300 px-2 py-1 cursor-pointer hover:bg-yellow-400 transition-colors inline-block"
            >
              <span className="text-sm">{formData[name]}</span>
            </span>
          )}
        </span>

        {tooltip && (
          <span
            className="relative inline-flex items-center cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter(tooltip, e.currentTarget)}
            onMouseLeave={handleMouseLeave}
          >
            <Info size={14} className="text-gray-600 flex-shrink-0 hover:text-primary" />

            {tooltipInfo.show && tooltipInfo.text === tooltip && (
              <div
                ref={tooltipRef}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 opacity-90 z-50 pointer-events-none"
              >
                <div className="relative bg-black text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                  {tooltipInfo.text}
                  <div className="absolute left-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black transform -translate-x-1/2" />
                </div>
              </div>
            )}
          </span>
        )}
      </span>
    );
  };

  return (
    <>
    <div className="min-h-screen bg-gray-100 py-15 px-4 select-none">
      <div className='absolute top-[140px] left-[40px]'>

       <ReturnBack />
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold mb-4">
              FAİZSİZ BORC (KREDİT) MÜQAVİLƏSİ №{' '}
              <InputField
                name="contract_number"
                placeholder="Müqavilənin nömrəsini daxil edin"
                tooltip="Məsələn, 001"
              />
            </h1>
          </div>

          <div className="space-y-4 text-sm leading-8">
            <p>
              <InputField
                name="contract_date"
                placeholder="müqavilənin bağlanma tarixini daxil edin"
                tooltip="Məsələn, 05.05.2023"
              />
            </p>

            <p>
              VÖEN-i{' '}
              <InputField
                name="lender_voen"
                placeholder="Kredit verənin VÖEN-ini daxil edin"
                tooltip="Məsələn, 1234567891. Yoxdursa, boşluq işarəsi qoyun"
              />{' '}
              olan{' '}
              <InputField
                name="lender_name"
                placeholder="Kredit verənin və ya rəhbər şəxsinin vəzifəsini, adını və soyadını daxil edin"
                tooltip="Kredit verən fiziki şəxsdirsə, məsələn, Azərov Azər Azər oğlu"
              />
              ,{' '}
              <InputField
                name="lender_org"
                placeholder="Kredit verən hüquqi şəxsdirsə, adını və təşkilati-hüquqi formasını daxil edin"
                tooltip="Kredit verən fiziki şəxsdirsə, boşluq işarəsi qoyun"
              />
              {' '}<span className="blur-sm  transition-all ">bundan sonra "Kredit Verən" adlandırılır, bir tərəfdən və</span>
            </p>

            <p>
              VÖEN-i{' '}
              <InputField
                name="borrower_voen"
                placeholder="Kredit alanın VÖEN-ini daxil edin"
                tooltip="Məsələn, 1234567891. Yoxdursa, boşluq işarəsi qoyun."
              />{' '}
              olan{' '}
              <InputField
                name="borrower_name"
                placeholder="Kredit alanın və ya rəhbər şəxsinin vəzifəsini, adını və soyadını daxil edin"
                tooltip="Kredit alan fiziki şəxsdirsə, məsələn, Azərov Azər Azər oğlu"
              />
              ,{' '}
              <InputField
                name="borrower_org"
                placeholder="Kredit alan hüquqi şəxsdirsə, adını və təşkilati-hüquqi formasını daxil edin"
                tooltip="Kredit alan fiziki şəxsdirsə, boşluq işarəsi qoyun"
              />
              {' '}<span className="blur-sm  transition-all ">bundan sonra "Kredit Alan" adlandırılır, digər tərəfdən, bundan sonra birlikdə "Tərəflər" adlandırılaraq aşağıdakılar barədə bu Müqaviləni bağladılar:</span>
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">1. MÜQAVİLƏNİN PREDMETİ</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>
                1.1. <span className="blur-sm  transition-all ">Kredit Verən Kredit Alana faizsiz olaraq</span>{' '}
                <InputField
                  name="loan_amount"
                  placeholder="kredit məbləğini daxil edin"
                  tooltip="Məsələn, 3000 AZN, 5000 ABŞ dolları"
                />{' '}
                <span className="blur-sm transition-all ">məbləğində kredit verirlər və Kredit Alan həmin məbləği qaytarmağı öhdəsinə götürür.</span>
              </p>
              <p>
                1.2. <span className="blur-sm  transition-all ">Kredit</span>{' '}
                <InputField
                  name="loan_purpose"
                  placeholder="kreditin verilmə məqsədini qeyd edin"
                  tooltip="Məsələn, şəxsi istehlak, avtomobil alışı"
                />{' '}
                <span className="blur-sm  transition-all ">məqsədi ilə verilir.</span>
              </p>
              <p>
                1.3. <span className="blur-sm  transition-all ">Kredit məbləği Kredit Alana</span>{' '}
                <InputField
                  name="loan_term"
                  placeholder="kredit məbləğinin Kredit alana verilmə müddətini qeyd edin"
                  tooltip="Məsələn, müqavilənin imzalandığı tarixdən 5 gün ərzində"
                />{' '}
                <span className="blur-sm  transition-all ">verilməlidir.</span>
              </p>
              <p>1.4. <span className="blur-sm  transition-all ">Kredit faizsiz verilir və heç bir əlavə ödəniş tələb olunmur.</span></p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">2. KREDİTİN VERİLMƏ VƏ QAYTARILMASI QAYDASI</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>
                2.1. <span className="blur-sm  transition-all ">Kredit məbləği Kredit Alana</span>{' '}
                <InputField
                  name="loan_form"
                  placeholder="kredit məbləğinin Kredit alana verilmə formasını qeyd edin"
                  tooltip="Məsələn, bank hesabına köçürmə yolu ilə"
                />{' '}
                <span className="blur-sm  transition-all ">verilir.</span>
              </p>
              <p>
                2.2. <span className="blur-sm  transition-all ">Kredit Alan kredit məbləğini</span>{' '}
                <InputField
                  name="return_date"
                  placeholder="kreditin qaytarılma tarixini qeyd edin"
                  tooltip="Məsələn, 31.12.2023-cü il"
                />{' '}
                <span className="blur-sm  transition-all ">tarixinə qədər</span>{' '}
                <InputField
                  name="payment_schedule"
                  placeholder="kreditin ödəniş qaydasını qeyd edin"
                  tooltip="Məsələn, bir dəfəyə, tam həcmdə"
                />{' '}
                <span className="blur-sm  transition-all ">qaytarmalıdır.</span>
              </p>
              <p>2.3. <span className="blur-sm  transition-all ">Kredit Alanın öhdəliyini vaxtında yerinə yetirməməsi halında, Kredit Verən qanunvericiliklə müəyyən edilmiş qaydada öz hüquqlarını müdafiə edə bilər.</span></p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">3. TƏRƏFLƏRİN ÖHDƏLİKLƏRİ VƏ HÜQUQLARI</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p className="font-bold">3.1. Kredit Alanın hüquq və öhdəlikləri:</p>
              <p>a. <span className="blur-sm  transition-all ">Kredit məbləğini müqavilədə göstərilən müddətdə və məqsəd üçün istifadə etmək.</span></p>
              <p>b. <span className="blur-sm  transition-all ">Kredit məbləğini müqavilədə göstərilən qaydada və müddətdə tam həcmdə qaytarmaq.</span></p>
              <p>
                c. <span className="blur-sm  transition-all ">Kredit Verənin yazılı ödəniş sənədini aldıqdan sonra</span>{' '}
                <InputField
                  name="payment_deadline"
                  placeholder="ödəniş sənədinin təqdim edilməsindən sonra ödənişin edilmə müddətini qeyd edin"
                  tooltip="Məsələn, 5 gün, 10 gün"
                />{' '}
                <span className="blur-sm  transition-all ">ərzində</span>{' '}
                <InputField
                  name="payment_form"
                  placeholder="ödənişin edilmə formasını qeyd edin"
                  tooltip="Məsələn, nağd, bank köçürməsi"
                />{' '}
                <span className="blur-sm  transition-all ">formasında ödəniş etmək.</span>
              </p>
              <p>d. <span className="blur-sm  transition-all ">Kredit Verənin tələbi ilə kredit məbləğinin istifadəsi barədə məlumat vermək.</span></p>
              <p>e. <span className="blur-sm  transition-all ">Kredit məbləğinin qaytarılması ilə bağlı müqavilədə nəzərdə tutulmuş bütün öhdəlikləri yerinə yetirmək.</span></p>
              <p>f. <span className="blur-sm  transition-all ">Müqavilənin şərtlərinin pozulması halında Kredit Verənə dəymiş zərəri ödəmək.</span></p>
              <p>g. <span className="blur-sm  transition-all ">Kredit məbləğinin vaxtında qaytarılmasını təmin etmək məqsədilə lazımi tədbirlər görmək.</span></p>

              <p className="font-bold mt-4">3.2. Kredit Verənin hüquq və öhdəlikləri:</p>
              <p>
                a. <span className="blur-sm  transition-all ">Kredit Alandan</span>{' '}
                <InputField
                  name="advance_payment"
                  placeholder="avans tətbiq edilərsə, məbləğini və ya hissəsini, tətbiq edilmirsə 0 (sıfır) AZN qeyd edin"
                  tooltip="Məsələn, 500 AZN, 0 AZN"
                />{' '}
                <span className="blur-sm  transition-all ">məbləğində avans ödənişi tələb etmək hüququna malikdir.</span>
              </p>
              <p>b. <span className="blur-sm  transition-all ">Kredit məbləğini müqavilədə göstərilən qaydada və müddətdə Kredit Alana təqdim etmək.</span></p>
              <p>c. <span className="blur-sm  transition-all ">Kredit Alanın müqavilə öhdəliklərini yerinə yetirməməsi halında qanuni yolla öz hüquqlarını müdafiə etmək.</span></p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">4. TƏRƏFLƏRİN MƏSULİYYƏTİ</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>4.1. <span className="blur-sm  transition-all ">Tərəflərdən hər hansı birinin müqavilə öhdəliklərini yerinə yetirməməsi və ya lazımi qaydada yerinə yetirməməsi halında, digər tərəf Azərbaycan Respublikasının qanunvericiliyi ilə müəyyən edilmiş qaydada zərərin ödənilməsini tələb etmək hüququna malikdir.</span></p>
              <p>
                4.2. <span className="blur-sm  transition-all ">Kredit Alanın kreditin qaytarılması üzrə öhdəliklərini müəyyən edilmiş müddətdə yerinə yetirməməsi halında, o, hər gecikdirilmiş gün üçün qaytarılmamış kredit məbləğinin</span>{' '}
                <InputField
                  name="penalty_rate"
                  placeholder="kreditin ödənişi gecikdirildikdə ödənilməli cərimə faizini qeyd edin"
                  tooltip="Məsələn, 0%, 0.5%, 1%"
                />{' '}
                <span className="blur-sm  transition-all ">məbləğində cərimə ödəməlidir.</span>
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">5. FORS-MAJOR HALLARİ</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>5.1. <span className="blur-sm  transition-all ">Tərəflər fors-major halları (təbii fəlakətlər, müharibə, hərbi toqquşmalar, dövlət orqanlarının aktları və s.) nəticəsində müqavilə üzrə öhdəliklərin yerinə yetirilməməsinə və ya lazımi qaydada yerinə yetirilməməsinə görə məsuliyyət daşımırlar.</span></p>
              <p>5.2. <span className="blur-sm  transition-all ">Fors-major hallarının baş verməsi barədə tərəflər bir-birini 5 gün müddətində məlumatlandırmağa borcludurlar.</span></p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">6. MÜQAVİLƏNİN QÜVVƏDƏ OLMA MÜDDƏTİ</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>6.1. <span className="blur-sm  transition-all ">Bu Müqavilə imzalandığı gündən qüvvəyə minir və tərəflərin öz öhdəliklərini tam yerinə yetirməsinə qədər qüvvədə qalır.</span></p>
              <p>6.2. <span className="blur-sm  transition-all ">Müqavilənin müddətindən əvvəl ləğv edilməsi yalnız tərəflərin qarşılıqlı razılığı ilə və ya Azərbaycan Respublikasının qanunvericiliyində nəzərdə tutulmuş hallarda mümkündür.</span></p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">7. MÜBAHİSƏLƏRİN HƏLLİ QAYDASI</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>7.1. <span className="blur-sm  transition-all ">Bu Müqavilənin icrasından və ya şərhindən irəli gələn bütün mübahisələr və fikir ayrılıqları danışıqlar yolu ilə həll edilir.</span></p>
              <p>7.2. <span className="blur-sm  transition-all ">Razılığa gəlinmədiyi təqdirdə, mübahisələr Azərbaycan Respublikasının qanunvericiliyi ilə müəyyən edilmiş qaydada məhkəmə yolu ilə həll olunur.</span></p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">8. MÜQAVİLƏYƏ DƏYİŞİKLİKLƏR VƏ ƏLAVƏLƏR</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>8.1. <span className="blur-sm  transition-all ">Bu Müqaviləyə dəyişikliklər və əlavələr yalnız tərəflərin qarşılıqlı razılığı ilə yazılı formada həyata keçirilir və Müqavilənin ayrılmaz hissəsini təşkil edir.</span></p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">9. DİGƏR ŞƏRTLƏR</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>9.1. <span className="blur-sm  transition-all ">Bu Müqavilə ilə tənzimlənməyən məsələlər Azərbaycan Respublikasının qanunvericiliyi ilə tənzimlənir.</span></p>
              <p>9.2. <span className="blur-sm  transition-all ">Müqavilə 2 (iki) eyni məzmunlu nüsxədə tərtib edilmişdir və hər bir nüsxə eyni hüquqi qüvvəyə malikdir. Hər bir tərəfə 1 (bir) nüsxə verilir.</span></p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">10. TƏRƏFLƏRİN ÜNVANLARİ VƏ REKVİZİTLƏRİ</h2>
            <div className="grid grid-cols-2 gap-8 text-sm mt-6">
              <div>
                <p className="font-bold mb-3">Kredit Verən:</p>
                <div className="space-y-2">
                  <p><span className="blur-sm  transition-all ">Ad, Soyad, Ata adı və ya Təşkilatın adı:</span></p>
                  <p className="ml-4">_______________________</p>
                  <p><span className="blur-sm  transition-all ">Ünvan:</span></p>
                  <p className="ml-4">_______________________</p>
                  <p><span className="blur-sm  transition-all ">VÖEN:</span></p>
                  <p className="ml-4">_______________________</p>
                  <p><span className="blur-sm  transition-all ">Telefon:</span></p>
                  <p className="ml-4">_______________________</p>
                  <p><span className="blur-sm  transition-all ">Bank rekvizitləri:</span></p>
                  <p className="ml-4">_______________________</p>
                  <p className="mt-4"><span className="blur-sm  transition-all ">İmza:</span> _____________</p>
                </div>
              </div>
              <div>
                <p className="font-bold mb-3">Kredit Alan:</p>
                <div className="space-y-2">
                  <p><span className="blur-sm  transition-all ">Ad, Soyad, Ata adı və ya Təşkilatın adı:</span></p>
                  <p className="ml-4">_______________________</p>
                  <p><span className="blur-sm  transition-all ">Ünvan:</span></p>
                  <p className="ml-4">_______________________</p>
                  <p><span className="blur-sm  transition-all ">VÖEN:</span></p>
                  <p className="ml-4">_______________________</p>
                  <p><span className="blur-sm  transition-all ">Telefon:</span></p>
                  <p className="ml-4">_______________________</p>
                  <p><span className="blur-sm  transition-all ">Bank rekvizitləri:</span></p>
                  <p className="ml-4">_______________________</p>
                  <p className="mt-4"><span className="blur-sm  transition-all ">İmza:</span> _____________</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="terms" className="text-sm">
                <a
                  href="https://e-legal.az/az/sertler-ve-qaydalar/11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Şərtləri və qaydaları qəbul edirəm
                </a>
              </label>
            </div>

            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Sənədi hazırla
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
        </>
  );
}