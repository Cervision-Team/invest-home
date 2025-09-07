"use client"

import Image from "next/image";
import Agent from "../../../../public/images/beagent.png"
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";

function BeAgent() {

    const router = useRouter();

    const isTablet = useMediaQuery('(max-width: 768px)');

    const handleClick = () => {
        if (isTablet) {
            router.push("/become-agent/information");
        }
    }

    return (
        <>
            <section onClick={handleClick} id="agent" className="max-[768px]:cursor-pointer max-w-[1600px] mx-[auto] w-auto flex justify-center relative mt-[144px] max-[1025px]:mt-[60px] max-[431px]:mt-[20px] max-[431px]:mb-[5px] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] max-[1400px]:mt-[100px] max-[1400px]:mb-[100px]">
                <div className="gap-[20px] w-full flex max-[431px]:flex-row-reverse bg-primary pr-[100px] max-[769px]:pr-[20px] min-[768px]:pl-[17px] max-[431px]:pl-[20px] rounded-[40px] max-[769px]:rounded-[12px] max-[431px]:rounded-[8px]">
                    <div className="mt-[-5%] max-[768px]:w-[40%] max-[430px]:w-[100%] w-[30%] flex items-end">
                        <Image
                            src={Agent}
                            alt="Be Agent"
                            width={736}
                            height={736}
                            className=""
                        />
                    </div>
                    <div className="min-w-0 flex gap-[10px] items-center justify-between w-full h-full">
                        <div className="max-w-[412px] flex flex-col gap-[10px]">
                            <h5 className="text-[48px] font-[500] text-white max-[1480px]:text-[36px] max-[431px]:text-[16px] max-[1000px]:text-[20px] whitespace-nowrap">Agent ol</h5>
                            <p className="text-[20px]/[24px] text-white max-[1480px]:text-[16px]/[20px] max-[431px]:text-[8px] max-[1000px]:text-[12px] max-[431px]:leading-[1.2]">Fusce venenatis tellus a felis scelerisque. venenatis tellus a felis scelerisque. </p>
                        </div>
                        <Link href="/become-agent/information" className="max-[769px]:hidden min-w-0 px-[54px] py-[10px] text-[16px] font-[500] text-primary bg-white rounded-[30px] border border-[#096338] hover:bg-[var(--yellow)] hover:text-white transition-colors duration-300 cursor-pointer">
                            <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                                İndi Qeydiyyatdan Keçin
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
export default BeAgent;