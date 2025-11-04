"use client"

import Image from "next/image";
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
        <>
<section
  onClick={handleClick}
  id="agent"
  className="max-[768px]:cursor-pointer w-full max-w-[1600px] mx-auto flex justify-center items-center relative 
             bg-cover bg-no-repeat bg-center rounded-[45px] max-[768px]:rounded-[35px] max-[431px]:rounded-[25px] overflow-hidden"
  style={{
    height: "260px",
    marginTop: "144px",
    backgroundImage: `url('/images/businessmen.png')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="w-full h-full flex items-center justify-between"
       style={{ 
         padding: "0 46px"
       }}>
    <div 
      className="w-[500px] max-[1200px]:w-[450px] max-[1025px]:w-[400px] max-[768px]:w-[350px] max-[431px]:w-full
                 h-auto rounded-[45px] max-[768px]:rounded-[35px] max-[431px]:rounded-[20px]
                 flex items-center justify-center"
      style={{ 
        padding: '20px',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        border: '2px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="max-w-[412px] flex flex-col"
           style={{ gap: '10px' }}>
        <h5 className="text-[48px] font-[500] text-white max-[1480px]:text-[36px] max-[1000px]:text-[20px] max-[431px]:text-[16px] leading-tight">
          Agent ol
        </h5>
        <p className="text-[20px] text-white max-[1480px]:text-[16px] max-[1000px]:text-[12px] max-[431px]:text-[8px] leading-[1.2]">
          İnvest Home komandasının arasında olmaq üçün indi müraciət edin
        </p>
      </div>
    </div>
    
    <Link
      href="/become-agent/agent-form"
      className="max-[769px]:hidden 
                 text-[16px] max-[1200px]:text-[14px]
                 font-[500] text-primary bg-white 
                 rounded-[30px] border border-[#096338] 
                 hover:bg-[var(--yellow)] hover:text-white 
                 transition-colors duration-300
                 whitespace-nowrap"
      style={{
        padding: '10px 120px'
      }}
    >
     Forma Keçid et
    </Link>
  </div>
</section>
        </>
    )
}
export default BeAgentNew;