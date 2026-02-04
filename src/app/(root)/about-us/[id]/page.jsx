"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import InstagramIcon from "../../../../../public/icons/Instagram.svg";

import ConnectionButton from "../../../../components/ui/ConnectionButton";
import RoundedBlackButton from "../../../../components/ui/RoundedBlackButton";
import Loader from "@/components/ui/Loader";
import { getEmployeeById } from "@/services/api/endpoints/userService";

import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { Mail, MapPin, Phone } from "lucide-react";

const defaultProfileIcon = "/icons/profile.svg";

const Page = ({ params }) => {
  const id = params?.id;

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getEmployeeById(id);
        if (!alive) return;
        setAgent(res?.data || null);
      } catch (err) {
        if (!alive) return;
        setAgent(null);
        setError(err?.response?.data?.message || err?.message || "Məlumat yüklənmədi");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);


  if (loading) {
    return (
      <section className="max-w-[1600px] mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] py-10">
        <div className="flex items-center gap-3">
          <Loader />
          <p className="text-black text-base font-medium">Yüklənir...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-[1600px] mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] py-10">
        <p className="text-black text-xl font-medium">Xəta: {error}</p>
      </section>
    );
  }

  if (!agent) {
    return (
      <section className="max-w-[1600px] mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] py-10">
        <p className="text-black text-xl font-medium">Məlumat tapılmadı</p>
      </section>
    );
  }

  return (
    <>
      <section className='max-w-[1600px] mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] py-8 sm:py-10'>
        <div className='bg-white rounded-2xl border border-black/10 shadow-[4px_16px_50px_0px_rgba(2,131,111,0.05)] overflow-hidden'>
          <div className='p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-10 items-start'>
            <div className='flex flex-col items-center lg:items-start gap-5'>
              {(() => {
                const avatarSrc = agent?.imageUrl || agent?.image?.url;
                const hasAvatar = Boolean(avatarSrc);

                if (hasAvatar) {
                  return (
                    <Image
                      src={avatarSrc}
                      alt={agent?.fullName || "Employee"}
                      width={360}
                      height={360}
                      className='w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] rounded-full object-cover'
                    />
                  );
                }

                return (
                  <div className='w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] rounded-full bg-(--primary-color) flex items-center justify-center'>
                    <Image src={defaultProfileIcon} alt="Default avatar" width={64} height={64} />
                  </div>
                );
              })()}

              <div className='flex flex-wrap items-center justify-center lg:justify-start gap-2'>
                {agent?.role ? (
                  <span className='px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide bg-[rgba(2,131,111,0.12)] text-primary'>
                    {agent.role}
                  </span>
                ) : null}
                {agent?.birthDate ? (
                  <span className='px-3 py-1 rounded-full text-[12px] font-medium bg-black/5 text-black/70'>
                    {agent.birthDate}
                  </span>
                ) : null}
              </div>
            </div>

            <div className='flex flex-col min-w-0'>
              <div className='flex flex-col gap-2'>
                <h1 className='text-black text-[28px]/[32px] sm:text-[32px]/[36px] font-semibold'>
                  {agent.fullName}
                </h1>

                <p className='text-black/70 text-[16px]/[24px] sm:text-[18px]/[28px] font-medium'>
                  {agent.position || ""}
                </p>
              </div>

              <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='flex items-center gap-3 rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 min-w-0'>
                  <Mail size={18} className='text-primary shrink-0' />
                  <p className='text-[14px]/[20px] text-black/80 truncate'>{agent.email || "-"}</p>
                </div>

                <div className='flex items-center gap-3 rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 min-w-0'>
                  <Phone size={18} className='text-primary shrink-0' />
                  <p className='text-[14px]/[20px] text-black/80 truncate'>{agent.phoneNumber || "-"}</p>
                </div>

                <div className='flex items-center gap-3 rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 min-w-0 sm:col-span-2'>
                  <MapPin size={18} className='text-primary shrink-0' />
                  <p className='text-[14px]/[20px] text-black/80 truncate'>{agent.location || "-"}</p>
                </div>
              </div>

              <div className='mt-6'>
                <h2 className='text-black text-[16px] font-semibold'>Haqqında</h2>
                <p className='mt-2 text-black/70 text-[16px]/[26px] font-normal'>
                  {/* {agent.aboutMe || "Məlumat əlavə edilməyib."} */}
                  Müasir yaşayış komplekslərinin layihələndirilməsi və inkişafı sahəsində 10 illik təcrübə. Davamlılıq və innovativ dizayn prinsiplərinə sadiqəm. Hər bir layihəni müştərilərin ehtiyaclarını və ətraf mühiti nəzərə alaraq hazırlayıram. Keyfiyyət və funksionallıq mənim əsas prioritetlərimdir.
                </p>
              </div>

              <div className='mt-8 pt-8 border-t border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
                <div className='w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4'>
                  <ConnectionButton name='Zəng et' className='w-full sm:w-[248px]' />
                  {/* <ConnectionButton name='Mesaj yaz' /> */}
                </div>

                <div className='flex items-center gap-3 justify-start sm:justify-end'>
                  <RoundedBlackButton icon={<FaWhatsapp />} backgroundColor="#28E55F" />
                  <RoundedBlackButton
                    icon={<Image src={InstagramIcon} alt="Instagram" width={18} height={18} />}
                    backgroundColor="linear-gradient(to right, #8a3ab9, #e95950, #fccc63)"
                  />
                  <RoundedBlackButton icon={<FaLinkedinIn />} backgroundColor="#0073AF" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 sm:mt-8 mb-[85px]'>
          <div className='flex items-end justify-between gap-4'>
            <h2 className='text-black text-[26px]/[36px] sm:text-[32px]/[48px] font-semibold'>Əmlaklarım</h2>
          </div>

          <div className='mt-4 rounded-2xl border border-dashed border-black/20 bg-white px-6 py-10 text-center text-black/60'>
            Bu əməkdaş üçün əmlak məlumatı hələlik göstərilmir.
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
