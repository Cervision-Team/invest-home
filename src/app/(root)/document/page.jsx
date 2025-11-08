'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

export default function LoanAgreementForm() {
  const [formData, setFormData] = useState({});
  const [activeInput, setActiveInput] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [tooltipInfo, setTooltipInfo] = useState({ show: false, text: '', target: null });

  const tooltipRef = useRef(null);

  // Hide tooltip when clicking anywhere outside
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
      <span className="inline-flex items-center gap-1 relative">
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
            <Info size={14} className="text-gray-600 flex-shrink-0 hover:text-blue-600" />

            {/* Tooltip */}
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
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

          {/* ================= CONTRACT DETAILS ================= */}
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
            </p>
          </div>

          {/* ================= SECTION 1 ================= */}
          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">1. MÜQAVİLƏNİN PREDMETİ</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>
                1.1{' '}
                <InputField
                  name="loan_amount"
                  placeholder="kredit məbləğini daxil edin"
                  tooltip="Məsələn, 3000 AZN, 5000 ABŞ dolları"
                />
              </p>
              <p>
                1.2.{' '}
                <InputField
                  name="loan_purpose"
                  placeholder="kreditin verilmə məqsədini qeyd edin"
                  tooltip="Məsələn, şəxsi istehlak, avtomobil alışı"
                />
              </p>
              <p>
                1.3.{' '}
                <InputField
                  name="loan_term"
                  placeholder="kredit məbləğinin Kredit alana verilmə müddətini qeyd edin"
                  tooltip="Məsələn, müqavilənin imzalandığı tarixdən 5 gün ərzində"
                />
              </p>
              <p>1.4.</p>
            </div>
          </div>

          {/* ================= SECTION 2 ================= */}
          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">2. KREDİTİN VERİLMƏ VƏ QAYTARILMASI QAYDASI</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>
                2.1.{' '}
                <InputField
                  name="loan_form"
                  placeholder="kredit məbləğinin Kredit alana verilmə formasını qeyd edin"
                  tooltip="Məsələn, bank hesabına köçürmə yolu ilə"
                />
              </p>
              <p>
                2.2.{' '}
                <InputField
                  name="return_date"
                  placeholder="kreditin qaytarılma tarixini qeyd edin"
                  tooltip="Məsələn, 31.12.2023-cü il"
                />{' '}
                <InputField
                  name="payment_schedule"
                  placeholder="kreditin ödəniş qaydasını qeyd edin"
                  tooltip="Məsələn, bir dəfəyə, tam həcmdə"
                />
              </p>
              <p>2.3.</p>
            </div>
          </div>

          {/* ================= SECTION 3 ================= */}
          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">3. TƏRƏFLƏRİN ÖHDƏLİKLƏRİ VƏ HÜQUQLARI</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p className="font-bold">3.1. Kredit Alanın hüquq və öhdəlikləri:</p>
              <p>a.</p>
              <p>b.</p>
              <p>
                c.{' '}
                <InputField
                  name="payment_deadline"
                  placeholder="ödəniş sənədinin təqdim edilməsindən sonra ödənişin edilmə müddətini qeyd edin"
                  tooltip="Məsələn, 5 gün, 10 gün"
                />{' '}
                <InputField
                  name="payment_form"
                  placeholder="ödənişin edilmə formasını qeyd edin"
                  tooltip="Məsələn, nağd, bank köçürməsi"
                />
              </p>
              <p>d.</p>
              <p>e.</p>
              <p>f.</p>
              <p>g.</p>

              <p className="font-bold mt-4">3.2. Kredit Verənin hüquq və öhdəlikləri:</p>
              <p>
                a.{' '}
                <InputField
                  name="advance_payment"
                  placeholder="avans tətbiq edilərsə, məbləğini və ya hissəsini, tətbiq edilmirsə 0 (sıfır) AZN qeyd edin"
                  tooltip="Məsələn, 500 AZN, 0 AZN"
                />
              </p>
              <p>b.</p>
              <p>c.</p>
            </div>
          </div>

          {/* ================= SECTION 4 ================= */}
          <div className="mt-8">
            <h2 className="text-center text-lg font-bold mb-4">4. TƏRƏFLƏRİN MƏSULİYYƏTİ</h2>
            <div className="space-y-3 text-sm ml-8 leading-7">
              <p>4.1.</p>
              <p>
                4.2.{' '}
                <InputField
                  name="penalty_rate"
                  placeholder="kreditin ödənişi gecikdirildikdə ödənilməli cərimə faizini qeyd edin"
                  tooltip="Məsələn, 0%, 0.5%, 1%"
                />
              </p>
            </div>
          </div>

          {/* ================= SECTION 11: FINAL ================= */}
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
                  className="text-blue-600 hover:underline"
                >
                  Şərtləri və qaydaları qəbul edirəm
                </a>
              </label>
            </div>

            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Sənədi hazırla
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
