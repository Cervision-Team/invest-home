"use client"

import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";

function BeAgentNew() {
  const router = useRouter();
  const isTablet = useMediaQuery('(max-width: 768px)');

  const handleClick = () => {
    if (isTablet) {
      router.push("/become-agent/agent-form");
    }
  }

  return (
    <section
      onClick={handleClick}
      id="agent"
      className="max-[768px]:cursor-pointer w-full max-w-[1600px] mx-auto overflow-hidden
        rounded-3xl sm:rounded-[35px] lg:rounded-[45px]
        bg-[url('/images/businessmen.png')] bg-cover bg-center bg-no-repeat
        h-[220px] sm:h-[260px]"
    >
      <div className="w-full h-full flex items-center justify-between gap-6 px-4 sm:px-8 lg:px-12">
        <div
          className="w-full max-w-[520px] rounded-[20px] sm:rounded-[35px] lg:rounded-[45px]
            border-2 border-white/20 bg-white/10 backdrop-blur-sm
            p-4 sm:p-5"
        >
          <div className="max-w-[420px] flex flex-col gap-2">
            <h5 className="text-white font-medium leading-tight text-[24px] sm:text-[32px] lg:text-[40px]">
              Agent ol
            </h5>
            <p className="text-white/90 leading-relaxed text-[12px] sm:text-[14px] lg:text-[16px]">
              İnvest Home komandasının arasında olmaq üçün indi müraciət edin
            </p>
          </div>
        </div>

        <Link
          href="/become-agent/agent-form"
          className="hidden md:inline-flex items-center justify-center whitespace-nowrap
              text-[14px] lg:text-[16px] font-medium text-primary bg-white
              rounded-[30px] border border-[#096338]
              hover:bg-[#ff9d14] hover:text-white transition-colors duration-300
              px-8 lg:px-12 py-2.5"
        >
          Forma Keçid et
        </Link>
      </div>
    </section>
  )
}
export default BeAgentNew;