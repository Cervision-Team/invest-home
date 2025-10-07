"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import arrowRightWhite from "../../../../public/icons/arrow-right-white-small.svg";
import arrowLeftWhite from "../../../../public/icons/arrow-left-white.svg";

const Terms = () => {
  const accordionRefs = useRef([React.createRef(), React.createRef()]);
  const [height, setHeights] = useState(["0px", "0px"]);
  const [formIndex, setFormIndex] = useState(0);
  const [visitedSections, setVisitedSections] = useState([true, false]);
  const [isValidatingStep, setIsValidatingStep] = useState(false);

  useEffect(() => {
    openAccordion(0);
  }, []);

  const handleNextClick = () => {
    changeForm("increment");
  };

  const changeForm = (action) => {
    let index = formIndex;

    if (action === "increment" && index < 4) {
      index++;
    } else if (action === "decrement" && index > 0) {
      index--;
    } else {
      return;
    }

    setVisitedSections((prev) => {
      const updated = [...prev];
      if (index < updated.length) {
        updated[index] = true;
      }
      return updated;
    });

    setFormIndex(index);
    openAccordion(index);
  };

  const openAccordion = (currentFormIndex) => {
    const newHeights = accordionRefs.current.map((ref, i) => {
      if (!ref.current) return "0px";

      // 1-ci accordion (0–2 arası açıq)
      if (i === 0 && currentFormIndex < 3) {
        return `${ref.current.scrollHeight}px`;
      }

      // 2-ci accordion (yalnız 3-də açıq)
      if (i === 1 && currentFormIndex === 3) {
        return `${ref.current.scrollHeight}px`;
      }

      // 4 və yuxarısı → hamısı bağlı
      return "0px";
    });

    setHeights(newHeights);
  };

  return (
    <section className="h-auto pb-[40px] bg-white px-[32px] pt-[40px] rounded-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
      <div className="flex gap-[36px]">
        {/* Sidebar */}
        <div className="basis-[340px] min-h-[512px] px-[19px] pt-[34.5px] rounded-[12px] border-[0.5px] border-[var(--primary-color)] shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
          <div className="logo-container my-[15.5px]">
            <div className="image-container flex items-center justify-center">
              <Image
                src="/images/logo_Invest_Home.png"
                alt="logo"
                width={57}
                height={57}
              />
            </div>
            <div className="mt-[7px]">
              <h1 className="text-center text-[20px] font-[600] main-logo-style">
                INVEST <span className="text-[var(--primary-color)]">HOME</span>
              </h1>
            </div>
          </div>

          <ul className="mt-[38px] flex flex-col gap-[16px]">
            {/* 1-ci Accordion */}
            <div className="accordion">
              <div className="accordion-head flex gap-[6px]">
                <div
                  className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${
                    formIndex >= 0
                      ? "bg-[var(--primary-color)]"
                      : "bg-[#9CA3AF]"
                  }`}
                />
                <li
                  className={`transition-colors duration-300 ease-in-out w-[100%] font-[500] text-[14px] px-[20px] py-[16px] rounded-[8px] ${
                    formIndex >= 0
                      ? "bg-[#02836F1A] text-[var(--primary-color)]"
                      : "bg-[#fff] text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]"
                  }`}
                >
                  Məxfilik və istifadə şərtləri
                </li>
              </div>
              <div
                ref={accordionRefs.current[0]}
                style={{ maxHeight: height[0] }}
                className="transition-[max-height] overflow-hidden duration-300 ease-in-out accordion-body ml-[9px]"
              >
                <div className="mt-[16px] flex flex-col gap-[28px]">
                  <div className="flex items-center gap-[10px] relative">
                    <div className="radio-container">
                      <div
                        className={`radio-outline rounded-[100%] flex items-center justify-center border-[2px] w-[20px] h-[20px] ${
                          formIndex >= 0 ? "border-primary" : "border-[#6C707A]"
                        }`}
                      >
                        <div
                          className={`radio-base rounded-[100%] w-[10px] h-[10px] ${
                            formIndex >= 0 ? "bg-primary" : "bg-[#6C707A]"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-[#737373] text-[16px]">
                      Biz Kimik ?
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px] relative">
                    <div className="radio-container">
                      <div
                        className={`radio-outline rounded-[100%] flex items-center justify-center border-[2px] w-[20px] h-[20px] ${
                          formIndex >= 2 ? "border-primary" : "border-[#6C707A]"
                        }`}
                      >
                        <div
                          className={`radio-base rounded-[100%] w-[10px] h-[10px] ${
                            formIndex >= 2 ? "bg-primary" : "bg-[#6C707A]"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-[#737373] text-[16px]">
                      Məxfilik öhdəliyimiz
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-ci Accordion */}
            <div className="accordion">
              <div className="accordion-head flex gap-[6px]">
                <div
                  className={`transition-colors duration-300 ease-in-out line rounded-[3px] w-[3px] ${
                    formIndex >= 3
                      ? "bg-[var(--primary-color)]"
                      : "bg-[#9CA3AF]"
                  }`}
                />
                <li
                  className={`transition-colors duration-300 ease-in-out w-[100%] font-[500] text-[14px] px-[20px] py-[16px] rounded-[8px] ${
                    formIndex >= 3
                      ? "bg-[#02836F1A] text-[var(--primary-color)]"
                      : "bg-[#fff] text-[#9CA3AF] shadow-[0px_4px_10px_rgba(217,217,217,0.32)]"
                  }`}
                >
                  Şərtlər və qaydalar
                </li>
              </div>
              <div
                ref={accordionRefs.current[1]}
                style={{ maxHeight: height[1] }}
                className="transition-[max-height] overflow-hidden duration-300 ease-in-out accordion-body ml-[9px]"
              >
                <div className="mt-[16px] flex flex-col gap-[28px]">
                  <div className="flex items-center gap-[10px] relative">
                    <div className="radio-container">
                      <div
                        className={`radio-outline rounded-[100%] flex items-center justify-center border-[2px] w-[20px] h-[20px] ${
                          formIndex === 3
                            ? "border-primary"
                            : "border-[#6C707A]"
                        }`}
                      >
                        <div
                          className={`radio-base rounded-[100%] w-[10px] h-[10px] ${
                            formIndex === 3 ? "bg-primary" : "bg-[#6C707A]"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-[#737373] text-[16px]">
                      İstifadə qaydaları
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ul>
        </div>

        {/* Main Content */}
        <div className="basis-[calc(100%-376px)]">
          <div className="step-content">
            {formIndex === 0 && (
              <div className="flex items-center gap-8 h-[392px]">
                <div className="mx-autop-2 p-4 space-y-3 overflow-x-auto h-[392px]">
                  <h1 className="text-[18px] font-semibold text-primary">
                    Biz kimik?
                  </h1>
                  <p>
                    <span className="text-primary">Investhome.az</span> daşınmaz
                    əmlak vasitəçiliyi xidmətlərinin aparıcı milli
                    təminatçılarındandır.
                  </p>

                  <h2 className="text-[18px] font-semibold text-primary">
                    Məxfilik öhdəliyimiz
                  </h2>
                  <p>
                    Bizə təqdim olunan şəxsi məlumatların qorunmasına olan
                    məsuliyyətimizi ciddi şəkildə qəbul edirik. Bu bəyanat, bu
                    məlumatların necə toplandığını, necə istifadə olunduğunu,
                    necə qorunduğunu və sizin məxfilik hüquqlarınızı (əgər
                    tətbiq olunursa) izah edir.
                  </p>

                  <h2 className="text-[18px] font-semibold text-primary">
                    Bu Məxfilik Bəyanatı dəyişərsə
                  </h2>
                  <p>
                    <span className="text-primary">Investhome.az</span> bu
                    Məxfilik Bəyanatını zaman-zaman yeniləyə bilər. Belə
                    hallarda, yenilənmiş bəyanat bu səhifədə dərc olunacaq və
                    lazım gəldikdə ana səhifəmizdə bildiriş yerləşdiriləcək.
                    Dəyişiklikləri nəzərdən keçirmək üçün bu səhifəyə qayıda
                    bilərsiniz. Bundan əlavə, bizdə olan şəxsi məlumatlarınızın{" "}
                    <span className="text-primary">
                      dəqiq, aktual və müvafiq
                    </span>{" "}
                    olması vacibdir. Bizimlə münasibətiniz dövründə
                    məlumatlarınızda dəyişiklik olarsa, zəhmət olmasa bizi
                    məlumatlandırın.
                  </p>

                  <h2 className="text-[18px] font-semibold text-primary">
                    Topladığımız şəxsi məlumatlar
                  </h2>
                  <p>
                    Aşağıdakı şəxsi məlumat kateqoriyaları{" "}
                    <span className="text-primary">
                      nəyin toplanıldığını, haradan və niyə toplandığını və
                      kimlərlə paylaşa biləcəyimizi
                    </span>{" "}
                    göstərir.Əlaqədar başlıqların üzərinə klikləyərək məlumatı
                    aça bilərsiniz. (click ilə açılıb bağlanan başlıqlar qoyulur
                    daha yığcam görünməsi üçün)  <br />İstifadə etdiyiniz məhsul/mobil
                    tətbiqlər və ya xidmətlərə və İnvesthome.az ilə
                    münasibətinizin xarakterinə görə, aşağıda sadalanan bütün
                    şəxsi məlumatlar toplanmaya bilər.
                  </p>

                  <h3 className="font-semibold text-primary">
                    1. Kommersiya Məlumatları
                  </h3>
                  <p>
                    <strong className="text-primary font-medium">
                      Daxil ola bilər:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Şəxsi əmlakın qeydləri</li>
                    <li>
                      Alınmış və ya nəzərdən keçirilmiş məhsul və xidmətlər
                    </li>
                    <li>Daşınmaz əmlakla bağlı maraqlar və üstünlüklər</li>
                  </ul>

                  <p>
                    <strong className="text-primary font-medium">
                      Məlumatın mənbələri:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Birbaşa olaraq sizdən</li>
                    <li>Açıq ictimai məlumat bazaları</li>
                    <li>
                      Rəqəmsal marketinq və analitika xidmətləri göstərən üçüncü
                      şəxslər (məsələn: reklam ID-ləri olan kukilər vasitəsilə)
                    </li>
                    <li>Hüquqi nümayəndələr</li>
                    <li>Ödəniş prosessorları və maliyyə qurumları</li>
                    <li>Fırıldaqçılığın qarşısını alan xidmət təminatçıları</li>
                    <li>Məlumat yoxlayan digər şəxslər</li>
                    <li>
                      Sosial media platformaları (ictimai paylaşımlar əsasında)
                    </li>
                    <li>
                      Sizin kompüter və mobil cihazlarınız (saytlara və
                      tətbiqlərə daxil olduqda)
                    </li>
                    <li>Kukilər və bənzər texnologiyalar</li>
                    <li>
                      Zəng mərkəzimizə zəng etdikdə və ya bizi ziyarət etdikdə
                      (məsələn, qapalı dövrə müşahidə sistemi çəkilişləri)
                    </li>
                    <li>Cihazlarınız və tətbiqləriniz (avtomatik)</li>
                  </ul>

                  <p>
                    <strong className="text-primary font-medium">
                      Toplanma məqsədləri:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Məhsul və xidmət uyğunluğunu müəyyənləşdirmək</li>
                    <li>Xidmət göstərmək və idarə etmək</li>
                    <li>Ödəniş və hesablamaların aparılması</li>
                    <li>Marketinq, reklam və məhsul təşviqatı</li>
                    <li>Rəqəmsal analiz və ehtiyacların müəyyən edilməsi</li>
                    <li>Hüquqi və tənzimləyici tələblərə uyğunluq</li>
                    <li>
                      Fırıldaqçılığın qarşısını alma və riskin azaldılması
                    </li>
                  </ul>

                  <p>
                    <strong className="text-primary font-medium">
                      Məlumatın paylaşılacağı tərəflər:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Investhome.az əməkdaşları</li>
                    <li>Hüquqi nümayəndələr</li>
                    <li>Marketinq partnyorları</li>
                    <li>Məhsul/tətbiq təminatçıları</li>
                    <li>Maliyyə qurumları və ödəniş sistemləri</li>
                    <li>Poçt və kuryer xidmətləri</li>
                    <li>Analitika və reklam təminatçıları</li>
                    <li>İT və təhlükəsizlik xidmətləri</li>
                    <li>Mühasiblər və hüquqşünaslar</li>
                    <li>Tənzimləyici orqanlar</li>
                  </ul>

                  <h3 className="font-semibold text-primary">
                    2. Əlaqə məlumatları
                  </h3>
                  <p>
                    <strong className="font-medium text-primary">
                      Daxil ola bilər:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Ad,soyad</li>
                    <li>Ünvan</li>
                    <li>Elektron poçt ünvanı</li>
                    <li>Telefon nömrəsi</li>
                  </ul>
                  <p>
                    <strong className="text-primary font-medium">
                      Məlumatın mənbələri:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Siz (birbaşa)</li>
                    <li>Hüquqi nümayəndələr</li>
                    <li>Ödəniş sistemləri</li>
                    <li>İT avadanlıqları və tətbiqlər</li>
                    <li>Məlumat yoxlayan üçüncü tərəflər</li>
                  </ul>

                  <p>
                    <strong className="text-primary font-medium">
                      Toplanma məqsədləri:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Uyğunluğun müəyyənləşdirilməsi</li>
                    <li>Xidmət göstərilməsi və idarə olunması</li>
                    <li>Sizinlə ünsiyyətin qurulması</li>
                    <li>Hesabların hazırlanması və ödənişlərin toplanması</li>
                    <li>
                      Marketinq, yeniliklər və tətbiqlərlə bağlı məlumat
                      verilməsi
                    </li>
                    <li>Hüquqi öhdəliklərə əməl olunması</li>
                    <li>Sistem və məlumat təhlükəsizliyinin təmin edilməsi</li>
                    <li>Müqavilə öhdəliklərinin yerinə yetirilməsi</li>
                  </ul>

                  <p>
                    <strong className="text-primary font-medium">
                      Məlumatın paylaşılacağı tərəflər:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Investhome.az əməkdaşları</li>
                    <li>Marketinq və reklam təminatçıları</li>
                    <li>Hüquqşünaslar, tənzimləyici orqanlar</li>
                    <li>Fırıldaqçılığa qarşı xidmətlər</li>
                    <li>İT təhlükəsizliyi və proqram təminatçıları</li>
                  </ul>
                </div>
                <img src="/images/terms-1.png" alt="terms" />
              </div>
            )}

            {formIndex === 1 && (
              <div className="flex items-center gap-8 h-[392px]">
                <div className="mx-auto p-4 space-y-3 overflow-x-auto h-[392px]">
                  <h3 className="text-[18px] font-semibold text-primary">
                    3. Maliyyə Məlumatları
                  </h3>
                  <p>
                    Bank hesab nömrəsi, kredit və ya debet kartı nömrəsi, ödəniş
                    məbləğləri, maliyyə imkanları və digər maliyyə məlumatları
                    daxil olmaqla.
                  </p>

                  <p>
                    <strong className="font-medium text-primary">
                      Bu kateqoriyaya aid şəxsi məlumatların mənbələri:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Sizin tərəfinizdən birbaşa təqdim edilən məlumatlar</li>
                    <li>Açıq mənbələr</li>
                    <li>Səlahiyyətli/hüquqi nümayəndələr</li>
                    <li>
                      Ödəniş əməliyyatlarını həyata keçirən maliyyə institutları
                    </li>
                    <li>
                      Dələduzluğun qarşısının alınması, aşkarlanması və
                      azaldılması ilə məşğul olan üçüncü tərəflər
                    </li>
                    <li>
                      Təqdim etdiyiniz məlumatı yoxlayan digər üçüncü şəxslər
                    </li>
                  </ul>

                  <p>
                    <strong className="font-medium text-primary">
                      Toplanma məqsədləri:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>
                      Fakturaların tərtib edilməsi və ödənişlərin yığılması
                    </li>
                    <li>Ödəniş öhdəliklərinin yerinə yetirilməsi</li>
                    <li>Sifariş etdiyiniz xidmətlərin yerinə yetirilməsi</li>
                    <li>Müəyyən xidmətlərə uyğunluğun qiymətləndirilməsi</li>
                    <li>
                      Tələblərinizin, üstünlüklərinizin və maraqlarınızın daha
                      yaxşı anlaşılması
                    </li>
                    <li>
                      Daxili biznes təhlillərinin və bazar araşdırmalarının
                      aparılması
                    </li>
                    <li>Qanuni və normativ öhdəliklərə əməl edilməsi</li>
                    <li>
                      Yuxarıda qeyd olunan məqsədlər üzrə sizi və
                      cihaz(lar)ınızı identifikasiya etmək
                    </li>
                  </ul>

                  <p>
                    <strong className="font-medium text-primary">
                      Bu kateqoriyaya aid şəxsi məlumatları paylaşa biləcəyimiz
                      üçüncü tərəflər:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>
                      Yalnız işini yerinə yetirmək üçün məlumatlara ehtiyac
                      duyan İnvesthome.az əməkdaşları
                    </li>
                    <li>Səlahiyyətli/hüquqi nümayəndələr</li>
                    <li>
                      Məhsullarımız/mobil tətbiqlərimiz və xidmətlərimizlə bağlı
                      sifariş icrası xidmətləri göstərən üçüncü tərəflər
                    </li>
                    <li>
                      Ödəniş əməliyyatlarını həyata keçirən və təhlükəsizlik,
                      autentifikasiya və dələduzluğun qarşısını almaq məqsədi
                      ilə lazımi olan maliyyə institutları və digər tərəflər
                    </li>
                    <li>
                      Digər lazımi tərəflər (müqavilə və xidmətlərin icrası
                      məqsədilə)
                    </li>
                    <li>
                      Dələduzluğun qarşısının alınması və araşdırılması ilə
                      məşğul olan tərəflər
                    </li>
                    <li>
                      Hüquqşünaslarımız, auditorlarımız və məsləhətçilərimiz
                    </li>
                    <li>
                      Qanunla tələb olunan hallarda hüquqi və tənzimləyici
                      orqanlar
                    </li>
                  </ul>

                  <h3 className="font-semibold text-[18px] text-primary">
                    4. Şəxsiyyəti Təsdiqləyən Məlumatlar
                  </h3>
                  <p>
                    Doğum tarixi, yaşayış yerini təsdiq edən sənədlər, dövlət
                    tərəfindən verilmiş şəxsiyyət vəsiqəsi, sürücülük vəsiqəsi
                    nömrəsi, pasport nömrəsi və ya digər oxşar identifikasiya
                    vasitələri.
                  </p>

                  <p>
                    <strong className="font-medium text-primary">
                      Mənbələr:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Sizin tərəfinizdən təqdim edilən məlumat</li>
                    <li>Səlahiyyətli/hüquqi nümayəndələr</li>
                    <li>
                      Dələduzluğun qarşısının alınması, aşkarlanması və
                      azaldılması ilə məşğul olan üçüncü tərəflər
                    </li>
                    <li>Məlumatlarınızı yoxlayan digər üçüncü şəxslər</li>
                    <li>
                      Bizimlə əlaqə saxladığınız və ya bizi ziyarət etdiyiniz
                      zaman
                    </li>
                  </ul>

                  <p>
                    <strong className="font-medium text-primary">
                      Toplanma məqsədləri:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>Ödəniş öhdəliklərinin yerinə yetirilməsi</li>
                    <li>
                      İnformasiya texnologiyaları sistemlərimizə,
                      vebsaytlarımıza, tətbiqlərimizə və məlumat bazalarımıza
                      girişin təmin edilməsi və təhlükəsizliyinin qorunması
                    </li>
                    <li>
                      Qanuni və tənzimləyici öhdəliklərin yerinə yetirilməsi
                    </li>
                  </ul>

                  <p>
                    <strong className="font-medium text-primary">
                      Paylaşılan tərəflər:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>İnvesthome.az əməkdaşları</li>
                    <li>Hüquqi nümayəndələr</li>
                    <li>
                      Ödəniş sistemlərinin və təhlükəsizlik tədbirlərinin
                      icrasında iştirak edən tərəflər
                    </li>
                    <li>Hüquqşünaslar, auditorlar, məsləhətçilər</li>
                    <li>
                      Qanunvericiliyə əsasən müvafiq orqanlar (zəruri hallarda)
                    </li>
                  </ul>

                  <h3 className="font-semibold text-[18px] text-primary">
                    5. Məkan Məlumatları
                  </h3>
                  <p>
                    GPS koordinatları və ya cihazın yerləşdiyi yerə dair bənzər
                    məlumatlar.
                  </p>

                  <p>
                    <strong className="font-medium text-primary">
                      Mənbələr:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>
                      İstifadəçi tərəfindən birbaşa təqdim olunan məlumatlar
                    </li>
                    <li>
                      Kompüter və mobil cihazlar (veb saytlarımızla qarşılıqlı
                      əlaqə zamanı avtomatik)
                    </li>
                    <li>
                      Mobil və digər internetə qoşulmuş cihazlar və tətbiqlər
                      (avtomatik)
                    </li>
                  </ul>

                  <p>
                    <strong className="font-medium text-primary">
                      Toplanma məqsədləri:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>
                      Məhsul/mobil tətbiq və xidmətlərə uyğunluğun
                      müəyyənləşdirilməsi
                    </li>
                    <li>
                      Təhlükəsizlik insidentlərinin və dələduzluq hallarının
                      aşkar edilməsi
                    </li>
                    <li>
                      Siyasətlərimizə və qanuni tələblərə əməl olunmasının
                      monitorinqi və təmin edilməsi
                    </li>
                    <li>
                      İdentifikasiya məqsədləri (yuxarıda göstərilən bütün
                      məqsədlər üzrə)
                    </li>
                  </ul>

                  <p>
                    <strong className="font-medium text-primary">
                      Paylaşılan tərəflər:
                    </strong>
                  </p>
                  <ul className="list-disc ml-5">
                    <li>İnvesthome.az əməkdaşları</li>
                    <li>Hüquqi nümayəndələr</li>
                    <li>Məhsul və xidmətlərin icrası üçün tərəfdaşlar</li>
                    <li>İT və təhlükəsizlik üzrə texniki tərəfdaşlar</li>
                    <li>Dələduzluğa qarşı mübarizə aparan tərəflər</li>
                    <li>Hüquqşünaslar, auditorlar və məsləhətçilər</li>
                    <li>Qanunvericiliyə əsasən müvafiq orqanlar</li>
                  </ul>
                </div>
                <img src="/images/terms-1.png" alt="terms" />
              </div>
            )}

            {formIndex === 2 && (
              <div className="flex items-center gap-8 center h-[392px]">
                <div className="mx-auto p-4 space-y-3 overflow-x-auto h-[392px]">
                  <h2 className="text-[18px] font-semibold text-primary">
                    6. Peşəkar Məlumatlar
                  </h2>
                  <p>
                    Şəxsin peşəkar məlumatları, məsələn, iş vəzifəsi, tutduğu
                    mövqe, çalışdığı təşkilat, tabelilik strukturu və s.
                  </p>
                  <h3 className="font-medium text-primary">Mənbələr:</h3>
                  <ul className="list-disc ml-6">
                    <li>Birbaşa istehlakçının özü</li>
                    <li>Açıq mənbələr (ictimai qeydiyyatlar)</li>
                    <li>Müvafiq səlahiyyətə malik nümayəndələr</li>
                    <li>
                      İstehlakçı haqqında məlumatı yoxlayan digər üçüncü şəxslər
                      və hesabat agentlikləri
                    </li>
                  </ul>

                  <h3 className="font-medium text-primary">
                    Toplanma məqsədləri:
                  </h3>
                  <ul className="list-disc ml-6">
                    <li>Məhsul və xidmətlərə uyğunluğun müəyyən edilməsi</li>
                    <li>Məhsul və xidmətlərin təqdim edilməsi</li>
                    <li>Ehtiyac və maraqların daha yaxşı anlaşılması</li>
                    <li>Daxili biznes təhlili və bazar araşdırması aparmaq</li>
                    <li>
                      Reklam və marketinq məqsədləri, o cümlədən maraqlı ola
                      biləcək məhsul və xidmətlər barədə əlaqə saxlamaq
                    </li>
                    <li>Birgə marketinq təşəbbüsləri həyata keçirmək</li>
                    <li>Hüquqi və tənzimləyici öhdəliklərə əməl etmək</li>
                  </ul>

                  <h3 className="font-medium text-primary">
                    Məlumatların paylaşılması:
                  </h3>
                  <ul className="list-disc ml-6">
                    <li>
                      İş funksiyası üzrə bu məlumatlara ehtiyac duyan
                      Investhome.az əməkdaşları
                    </li>
                    <li>Hüquqi nümayəndələr</li>
                    <li>
                      Marketinq və analitik xidmət təminatçıları (məs. sosial
                      media platformaları, e-poçt marketinq şirkətləri, analitik
                      firmalar)
                    </li>
                    <li>
                      İT və təhlükəsizlik xidmətlərini təmin edən tərəflər
                    </li>
                    <li>
                      Fırıldaqçılığın qarşısının alınmasında iştirak edən
                      tərəflər
                    </li>
                    <li>Hüquqşünaslar, auditorlar və məsləhətçilər</li>
                    <li>Hüquqi və tənzimləyici orqanlar</li>
                  </ul>
                  <h2 className="text-[18px] font-semibold text-primary">
                    7. İcarəçi Məlumatları (Tenant data)
                  </h2>
                  <p>
                    Məsələn, istehlak göstəriciləri, ailə üzvləri haqqında
                    məlumatlar.
                  </p>

                  <h3 className="font-medium text-primary">Mənbələr:</h3>
                  <ul className="list-disc ml-6">
                    <li>Birbaşa istehlakçı</li>
                    <li>Açıq mənbələr</li>
                    <li>Hüquqi nümayəndələr</li>
                    <li>
                      Fırıldaqçılığın qarşısının alınması üzrə tərəfdaşlar
                    </li>
                    <li>
                      Toplanan məlumatdan çıxarılan nəticələr və ehtimallar
                    </li>
                  </ul>

                  <h3 className="font-medium text-primary">
                    Toplanma məqsədləri:
                  </h3>
                  <ul className="list-disc ml-6">
                    <li>
                      Məhsul və xidmətlər üzrə uyğunluğun müəyyən edilməsi və
                      təqdim olunması
                    </li>
                    <li>İdarəetmə, təhlil və xidmətlərin təkmilləşdirilməsi</li>
                    <li>
                      Hesab fakturalarının göndərilməsi və ödənişlərin yığılması
                    </li>
                    <li>Müştəri ilə ünsiyyətin qurulması</li>
                    <li>
                      Marketinq və məhsul tanıtımı, o cümlədən maraqlı ola
                      biləcək mövzularda əlaqə qurmaq
                    </li>
                    <li>
                      İT sistemlərinin, obyektlərin, avadanlıqların və digər
                      əmlakın mühafizəsi və nəzarəti
                    </li>
                    <li>
                      Təhlükəsizlik insidentləri və fırıldaqçılıq hallarının
                      aşkar edilməsi
                    </li>
                    <li>Hüquqi və tənzimləyici tələblərə uyğunluq</li>
                  </ul>

                  <h3 className="font-medium text-primary">
                    Məlumatların paylaşılması
                  </h3>
                  <p>
                    Yuxarıda “Peşəkar Məlumatlar” bölməsində göstərilənlərlə
                    eynidir, əlavə olaraq:
                  </p>
                  <ul className="list-disc ml-6">
                    <li>Ödəniş prosessorları və maliyyə qurumları</li>
                  </ul>
                  <h2 className="text-[18px] text-primary font-semibold">
                    8. Vizual və Səs Yazıları
                  </h2>
                  <p>
                    Məsələn, müəssisə və onun əməkdaşlarına gələn zənglərin
                    yazıları, səsli əmrlər, fotoşəkillər, təhlükəsizlik
                    kameraları vasitəsilə qeydə alınan görüntülər.
                  </p>

                  <h3 className="font-medium text-primary">Mənbələr</h3>
                  <p>
                    Sizin bizimlə əlaqə saxlamanız və ya bizi ziyarət etməniz
                    zamanı (qeydə alındığı halda).
                  </p>

                  <h3 className="font-medium text-primary">
                    Toplanma məqsədləri:
                  </h3>
                  <ul className="list-disc ml-6">
                    <li>
                      Məhsul və xidmətlərin idarə olunması və təkmilləşdirilməsi
                    </li>
                    <li>Müştəri ehtiyaclarının və davranışlarının təhlili</li>
                    <li>
                      İT sistemləri, tətbiqlər, məlumat bazaları və cihazların
                      təhlükəsizliyi və istifadəsinə nəzarət
                    </li>
                    <li>
                      Obyektlərə və əmlaka çıxışın təmin edilməsi və mühafizəsi
                    </li>
                    <li>
                      Təhlükəsizlik və fırıldaqçılığın qarşısının alınması
                    </li>
                    <li>Hüquqi və tənzimləyici tələblərə uyğunluq</li>
                  </ul>

                  <h3 className="font-medium text-primary">
                    Məlumatların paylaşılması
                  </h3>
                  <p>Əvvəlki bölmələrdə sadalanan eyni tərəflərlə.</p>
                  <h2 className="text-[19px] font-semibold text-primary">
                    9. Yazılı İmza
                  </h2>
                  <p>
                    Məsələn, müqavilələrdə və ya icarə sənədlərindəki yazılı
                    imza.
                  </p>

                  <h3 className="font-medium text-primary">Mənbələr:</h3>
                  <ul className="list-disc ml-6">
                    <li>Birbaşa istehlakçı</li>
                    <li>Hüquqi nümayəndələr</li>
                    <li>Ödəniş prosessorları və banklar</li>
                    <li>
                      Fırıldaqçılığın qarşısının alınmasında iştirak edən
                      tərəflər
                    </li>
                    <li>
                      İstehlakçı məlumatlarını təsdiqləyən üçüncü tərəflər
                    </li>
                  </ul>

                  <h3 className="font-medium text-primary">
                    Toplanma məqsədləri:
                  </h3>
                  <ul className="list-disc ml-6">
                    <li>Hesablaşmalar və ödənişlərin toplanması</li>
                    <li>Öhdəliklərin yerinə yetirilməsi</li>
                    <li>Fırıldaqçılığın aşkar olunması və hüquqi uyğunluq</li>
                  </ul>

                  <h3 className="font-medium text-primary">
                    Məlumatların paylaşılması
                  </h3>
                  <p>Əvvəlki bölmələrdə sadalanan eyni tərəflərlə.</p>
                  <h2 className="text-primary font-medium">
                    Məlumatların Emalı üçün Hüquqi Əsaslar:
                  </h2>
                  <p>
                    Şəxsi məlumatların və xüsusi kateqoriyalı məlumatların emalı
                    müvafiq məxfilik qanunvericiliyinə uyğun aşağıdakı hüquqi
                    əsaslarla həyata keçirilir:
                  </p>
                  <ul className="list-disc ml-6">
                    <li>Müqavilənin icrası üçün zərurət</li>
                    <li>Hüquqi öhdəliklərin yerinə yetirilməsi</li>
                    <li>İcazəniz əsasında</li>
                    <li>Bizim qanuni maraqlarımız əsasında</li>
                  </ul>
                  <p>
                    Qanuni maraqlara əsaslanaraq, şəxsi məlumatlardan biznesin
                    idarə olunması və xidmətlərin göstərilməsi məqsədi ilə
                    istifadə edilir. Əgər siz bu məlumatları təqdim etməsəniz,
                    bəzi məhsul və xidmətləri təqdim edə bilmərik.
                  </p>

                  <h3 className="font-medium text-primary">
                    Hər hansı bir sual vermək istəyirsinizsə,
                  </h3>
                  <p>
                    Əgər{" "}
                    <span className="text-primary">
                      şəxsi məlumatlarınızın işlənməsi ilə bağlı narahatlığınız
                    </span>{" "}
                    varsa və ya hər hansı sualınız yaranıbsa, zəhmət olmasa{" "}
                    <span className="text-primary">
                      məxfiliklə bağlı müraciətlər üçün onlayn formanı (Bura
                      form əlavə edilir)
                    </span>{" "}
                    doldurun və ya bizə aşağıdakı email ünvanı vasitəsilə yazın:
                  </p>
                  <p className="text-primary">Email: (private)</p>

                  <h3>Yazılı formada əlaqə</h3>
                  <p>
                    Məxfilik və şəxsi məlumatların qorunması ilə bağlı məsələlər
                    üçün aşağıdakı ünvana yaza bilərsiniz:
                  </p>
                  <p>
                    Investhome.az, (Poçt indeksi)
                    <br />
                    ……..
                    <br />
                    <span className="text-primary font-medium">
                      Qəbul edən şəxs:
                    </span>
                  </p>
                  <p>
                    Şəxsi məlumatlarla bağlı olmayan suallar üçün Zəhmət olmasa,
                    ümumi əlaqə vasitələrimizdən istifadə edin: …
                  </p>
                </div>
                <img src="/images/terms-1.png" alt="terms" />
              </div>
            )}

            {formIndex >= 3 && (
              <div className="flex items-center gap-8 h-[392px]">
                <div className="mx-auto p-4 space-y-3 overflow-x-auto h-[392px]">
                  <h1 className="text-[18px] font-semibold text-primary">
                    İSTİFADƏ QAYDALARI VƏ HÜQUQİ QEYD
                  </h1>
                  <p>
                    ZƏHMƏT OLMASA, BU VEBSAYTDAN İSTİFADƏDƏN ƏVVƏL AŞAĞIDAKI
                    QAYDALARI DİQQƏTLƏ OXUYUN.
                  </p>

                  <h2 className="text-primary font-medium">
                    Qaydaların qəbul edilməsi
                  </h2>
                  <p>
                    “İnvesthome.az” MMC bu vebsaytı, əlaqəli mobil tətbiqləri və
                    onların vasitəsilə təqdim edilən bütün xidmət və məzmunu
                    (“Sayt”) sizin şəxsi istifadəniz üçün təqdim edir. Sayta
                    daxil olmaqla və ya ondan istifadə etməklə, bu İstifadə
                    Qaydalarını qeyd-şərtsiz qəbul etmiş sayılırsınız.
                  </p>
                  <p>
                    Əgər bu İstifadə Qaydaları ilə razı deyilsinizsə, zəhmət
                    olmasa Saytdan istifadə etməyin.
                  </p>
                  <p>
                    Əgər siz bu qaydaları hüquqi şəxs adından qəbul edirsinizsə,
                    təsdiq edirsiniz ki, həmin hüquqi şəxsi bu şərtlərlə hüquqi
                    cəhətdən bağlamaq səlahiyyətiniz var.
                  </p>

                  <h2 className="text-primary font-medium">Qeydiyyat</h2>
                  <p>
                    Saytın müəyyən funksiyalarından istifadə etmək üçün siz
                    qeydiyyatdan keçməli və hesab yaratmalısınız. Bəzi
                    məlumatlara baxış yalnız sizin onlayn məxfilik razılaşmasını
                    <span className="text-primary">
                      {" "}
                      (“Məxfilik Siyasəti” - Privacy policy)(link insert edilir)
                    </span>{" "}
                    qəbul etməniz şərti ilə mümkün ola bilər.
                  </p>
                  <p>
                    Qeydiyyat zamanı özünüz və/və ya təmsil etdiyiniz təşkilat
                    barəsində{" "}
                    <span className="text-primary">
                      doğru, dəqiq və aktual məlumatlar təqdim etməli,{" "}
                    </span>
                    bu məlumatları zərurət olduqda yeniləməlisiniz. Şəxsi
                    şifrənizi heç kimlə paylaşmamalı və onun məxfiliyini
                    qorumalısınız.
                  </p>
                  <p>
                    Əməkdaşınız sayta giriş səlahiyyətini itirdikdə, dərhal
                    Investhome.az-a bu barədə məlumat verməlisiniz.
                  </p>

                  <h2 className="text-primary font-medium">
                    Xidmətlərin təsviri
                  </h2>
                  <p className="text-primary">
                    Sayt üzərindən Investhome.az tərəfindən təqdim edilən
                    müxtəlif xidmətlər (“Xidmətlər”) (Link artırılır) mövcuddur.
                    Saytın bəzi hissələri daşınmaz əmlak sahəsində investisiya
                    imkanları haqqında məlumat təqdim edir.(Əgər təqdim edirsə)
                  </p>

                  <h2 className="text-primary font-medium">
                    Məlumatların düzgünlüyü
                  </h2>
                  <p>
                    İnvesthome.az saytda təqdim olunan məlumatların dəqiq və
                    etibarlı olmasına çalışır. Bununla belə, bəzi məzmun süni
                    intellekt və digər avtomatlaşdırılmış texnologiyalar
                    vasitəsilə yaradıldığı üçün <span className="text-primary">onların tam dəqiqliyinə zəmanət
                    verilmir.</span>
                  </p>

                  <h2 className="text-primary font-medium">
                    Saytda dəyişikliklər
                  </h2>
                  <p>
                    İnvesthome.az bu Saytda və ya onun vasitəsilə təqdim olunan
                    xidmətlərdə istənilən vaxt dəyişiklik etmək hüququnu özündə
                    saxlayır. Belə dəyişikliklər barədə əvvəlcədən xəbərdarlıq
                    edilməyə bilər.
                  </p>

                  <h2 className="text-primary font-medium">
                    Saytdan istifadə şərtləri
                  </h2>
                  <p>
                    Saytdan şəxsi və qeyri-kommersiya məqsədilə istifadə etməyə
                    icazə verilir. Saytda yerləşdirilən bütün məzmunlar – o
                    cümlədən mətnlər, şəkillər, loqolar və proqram təminatı –
                    İnvesthome.az və ya onun tərəfdaşlarına məxsusdur və müvafiq
                    qanunlarla qorunur. Saytda yerləşdirilən hər hansı material
                    üzərində sizə hər hansı müəlliflik hüququ keçmir.
                  </p>
                  <p>Aşağıdakılar qəti qadağandır:</p>
                  <ul className="list-disc list-inside">
                    <li>
                      Saytdakı məlumatları sistematik olaraq toplayaraq baza
                      yaratmaq.
                    </li>
                    <li>
                      Saytı və ya onun hissələrini “ayna etmək” (təkrarlamaq),
                      və s.
                    </li>
                    <li>
                      Saytın qorunmasını təmin edən texnoloji tədbirləri pozmaq
                      və ya əngəlləmək.
                    </li>
                    <li>
                      Saytın koduna, sisteminə və ya onun texniki təminatına
                      icazəsiz müdaxilə etmək.
                    </li>
                  </ul>

                  <h2 className="text-primary font-medium">
                    İstifadəçi Məzmunu
                  </h2>
                  <p>
                    Əgər siz Sayt üzərindən hər hansı məzmun təqdim edirsinizsə
                    (şəkil, elan, rəy və s.), bu zaman <span className="text-primary">İnvesthome.az</span> həmin
                    məzmundan limitsiz istifadə etmək, onu paylaşmaq, redaktə
                    etmək və təqdim etmək hüququ əldə edir.
                  </p>
                  <p>
                    Siz təqdim etdiyiniz məzmunun hüquqlarına malik olduğunuzu
                    və üçüncü şəxslərin hüquqlarını pozmadığını təsdiq
                    edirsiniz.
                  </p>

                  <h2 className="text-primary font-medium">
                    Məsuliyyətin Məhdudlaşdırılması
                  </h2>
                  <p>
                    İnvesthome.az heç bir halda aşağıdakılara görə məsuliyyət
                    daşımır:
                  </p>
                  <ul className="list-disc list-inside">
                    <li>Saytın fəaliyyətində yaranmış texniki nasazlıqlar;</li>
                    <li>
                      Sayt vasitəsilə əldə edilmiş məlumatlara əsaslanan
                      qərarlardan irəli gələn nəticələr;
                    </li>
                    <li>
                      Üçüncü tərəf vebsaytlarına keçidlərdən qaynaqlanan
                      zərərlər;
                    </li>
                    <li>Gözlənilən faydanın əldə olunmaması və ya itkilər.</li>
                  </ul>

                  <h2 className="text-primary font-medium">
                    Üçüncü Tərəflərə Aid Keçidlər
                  </h2>
                  <p>
                    Saytımızda istifadəçilərin rahatlığı üçün üçüncü tərəflərə
                    məxsus digər vebsaytlara keçidlər təqdim edilə bilər. Lakin
                    həmin saytlar <span className="text-primary">İnvesthome.az</span> tərəfindən idarə olunmur və
                    onların məxfilik siyasəti, hüquqi şərtləri və məzmunlarına
                    görə məsuliyyət daşımırıq. Belə keçidlərdən istifadə
                    tamamilə sizin riskiniz altındadır.
                  </p>

                  <h2 className="text-primary font-medium">Yurisdiksiya</h2>
                  <p>
                    <span className="text-primary">İnvesthome.az</span>saytına daxil olmaqla, siz bu İstifadə
                    Şərtləri ilə bağlı yaranan hər hansı mübahisənin Azərbaycan
                    Respublikasının qanunvericiliyinə uyğun şəkildə
                    tənzimlənəcəyini və müvafiq məhkəmələrdə baxılacağını qəbul
                    edirsiniz. Əgər bu Şərtlərin hər hansı bir bəndi qanunsuz və
                    ya icra olunmaz hesab edilərsə, həmin bənd ayrılacaq və
                    qalan bəndlər öz qüvvəsində qalacaq.
                  </p>

                  <h2 className="text-primary font-medium">Əlaqə</h2>
                  <p>
                    Məxfilik və ya bu qaydalarla bağlı hər hansı sualınız və ya
                    narahatlığınız olduqda aşağıdakı vasitələrlə bizimlə əlaqə
                    saxlaya bilərsiniz:
                  </p>
                  <ul className="list-none">
                    <li>E-mail: —</li>
                    <li>
                      Ünvan: Xətai rayonu, Babək prospekti 19e (Rusel plaza)
                    </li>
                    <li>Əlaqə nömrəsi: +994552224120; +994552223887</li>
                  </ul>
                </div>
                <img src="/images/terms-2.svg" alt="terms" />
              </div>
            )}
          </div>

          <div
            className={`buttons-container ${
              formIndex === 0 ? "justify-end" : "justify-between"
            } flex mt-[16px]`}
          >
            {formIndex === 0 ? (
              <button
                onClick={handleNextClick}
                disabled={isValidatingStep}
                className="cursor-pointer flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] bg-[var(--primary-color)] text-white hover:opacity-90 transition-all duration-200"
              >
                <span className="font-[500] text-[16px]">Növbəti</span>
                <Image src={arrowRightWhite} alt="Arrow Right White" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => changeForm("decrement")}
                  disabled={isValidatingStep}
                  className="cursor-pointer flex ml-4 items-center gap-[12px] text-white bg-[var(--primary-color)] rounded-[8px] py-[12px] px-[34px] hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Image src={arrowLeftWhite} alt="Arrow Left White" />
                  <span className="font-[500] text-[16px]">Geriyə Qayıt</span>
                </button>
                <button
                  onClick={handleNextClick}
                  disabled={isValidatingStep}
                  className="cursor-pointer flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] bg-[var(--primary-color)] text-white hover:opacity-90 transition-all duration-200"
                >
                  <span className="font-[500] text-[16px]">Növbəti</span>
                  <Image src={arrowRightWhite} alt="Arrow Right White" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
