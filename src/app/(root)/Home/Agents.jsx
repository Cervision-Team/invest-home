"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import AgentCardSkeleton from "@/components/ui/skeleton/AgentsCardSkeleton";
import { getEmployee } from "@/services/api/endpoints/userService";

import whatsappIcon from "../../../../public/icons/profile/whatsapp-icon.svg";
import instagramIcon from "../../../../public/icons/profile/instagram-icon.svg";
import linkedinIcon from "../../../../public/icons/profile/linkedin-icon.svg";

export default function Agents() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await getEmployee();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (!alive) return;
        setEmployees(list);
      } catch (err) {
        if (!alive) return;
        setEmployees([]);
        setLoadError(err?.response?.data?.message || err?.message || "Əməkdaşlar yüklənmədi");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const allEmployees = useMemo(() => {
    return Array.isArray(employees) ? employees.slice(0,22).filter(Boolean) : [];
  }, [employees]);

  const shouldMarquee = allEmployees.length > 4;

  const marqueeItems = useMemo(() => {
    if (!shouldMarquee) return [];
    if (!allEmployees.length) return [];
    return [...allEmployees, ...allEmployees];
  }, [allEmployees, shouldMarquee]);

  const getBadgeLabel = (employee) => {
    const position = String(employee?.position || "").trim();
    if (position) return position;
    return "Komanda üzvü";
  };

  const defaultProfileIcon = "/icons/profile.svg";

  const marqueeDurationSec = useMemo(() => {
    const base = 20;
    const perItem = 1.5;
    if(allEmployees.length<8) return 10;
    return Math.max(28, Math.min(60, base + allEmployees.length * perItem));
  }, [allEmployees.length]);

  const renderEmployeeCard = (employee, keySuffix) => {
    const avatarSrc = employee?.imageUrl || employee?.image?.url;
    const hasAvatar = Boolean(avatarSrc);
    const badgeLabel = getBadgeLabel(employee);
    const isFallbackBadge = !String(employee?.position || "").trim();

    return (
      <Link
        key={`${employee?.id ?? "emp"}-${keySuffix}`}
        href={`/about-us/${employee?.id}`}
        className="ih-marquee-card group relative min-h-80 rounded-2xl cursor-pointer  transition-colors bg-red-200! focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 overflow-hidden"
      >
        <div className="w-full h-full px-5 pt-7 pb-7 flex flex-col items-center bg-white rounded-lg">
          <div className="w-[120px] h-[120px] rounded-full ring-2 ring-[rgba(2,131,111,0.12)] ring-offset-4 ring-offset-white">
            {hasAvatar ? (
              <Image
                src={avatarSrc}
                alt={employee?.fullName || "Employee"}
                className="w-full h-full object-cover rounded-full"
                width={120}
                height={120}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-(--primary-color) flex items-center justify-center">
                <Image src={defaultProfileIcon} alt="Default avatar" width={28} height={28} />
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col items-center text-center w-full flex-1">
            <p className="text-[16px] text-[#1B1F27] font-semibold leading-snug line-clamp-2">
              {employee?.fullName || "-"}
            </p>

            <div className="mt-2 min-h-6">
              <span
                className={
                  "inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold " +
                  (isFallbackBadge ? "bg-black/5 text-black/60" : "bg-[rgba(2,131,111,0.10)] text-[#02836F]")
                }
              >
                {badgeLabel}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-4 w-full flex items-center justify-center gap-2 ">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-9 h-9 bg-black/90 hover:bg-black rounded-full flex items-center justify-center transition"
              aria-label="Whatsapp"
              title="Whatsapp"
            >
              <Image src={whatsappIcon} alt="whatsapp" className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-9 h-9 bg-black/90 hover:bg-black rounded-full flex items-center justify-center transition"
              aria-label="Instagram"
              title="Instagram"
            >
              <Image src={instagramIcon} alt="instagram" className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-9 h-9 bg-black/90 hover:bg-black rounded-full flex items-center justify-center transition"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Image src={linkedinIcon} alt="linkedin" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section
      id="group"
      className="mt-[54px] max-w-[1600px] mx-auto w-auto flex flex-col gap-20 px-20 max-[1025px]:px-5 max-[431px]:px-4"
    >
      <div className="text-center flex flex-col gap-2">
        <h5 className="text-primary text-[20px] font-medium">KOMANDAMIZLA TANIŞ OLUN</h5>
        <h2 className="text-black text-[34px] max-[431px]:text-[20px] font-medium">
          Mütəxəssislər Qrupumuz
        </h2>
      </div>

      <div className="mb-[164px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl border border-black/10 bg-white p-6">
                <AgentCardSkeleton />
              </div>
            ))}
          </div>
        ) : allEmployees.length ? (
          shouldMarquee ? (
            <div
              className="relative ih-marquee overflow-hidden"
              style={{ "--ih-marquee-duration": `${marqueeDurationSec}s` }}
            >
              <div className="ih-marquee-track flex items-stretch gap-4">
                {marqueeItems.map((employee, idx) => (
                  <div
                    key={`${employee?.id ?? "emp"}-${idx}`}
                    className="flex-none w-[280px] sm:w-[320px] lg:w-[340px] xl:w-[360px]"
                  >
                    {renderEmployeeCard(employee, idx)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
              {allEmployees.map((employee, idx) => (
                <div key={`${employee?.id ?? "emp"}-${idx}`} className="w-full">
                  {renderEmployeeCard(employee, `static-${idx}`)}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-black/20 bg-white px-6 py-10 text-center text-black/60">
            Hal-hazırda əməkdaş tapılmadı.
          </div>
        )}
      </div>

      {!loading && loadError ? (
        <div className="-mt-[140px] mb-[164px] text-center text-sm text-black/60">
          {loadError}
        </div>
      ) : null}

      <style jsx global>{`
        .ih-marquee {
          --ih-marquee-duration: 40s;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%);
        }
        .ih-marquee-card {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .ih-marquee-track {
          width: max-content;
          animation: ih-marquee-scroll var(--ih-marquee-duration) linear infinite;
          will-change: transform;
        }
        .ih-marquee:hover .ih-marquee-track {
          animation-play-state: paused;
        }
        @keyframes ih-marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ih-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
