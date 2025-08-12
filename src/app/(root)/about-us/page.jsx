import React from 'react'
import agentsData from "@/components/core/AgentsData";
import AgentCard from "@/components/ui/AgentsCard";
import Agents from "../home/Agents";
import BeAgent from '../home/BeAgent';
import AboutPageImage from "../../../../public/images/AboutPagePhoto.jpg";

const page = () => {
    return (
        <>
            <div className='min-h-[400px] bg-gray-100 pt-[62px] text-start'
                style={{
                    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.14) 9.13%, rgba(32, 32, 32, 0.70) 100%), url(${AboutPageImage.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
                <div className='max-w-[1600px] mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]'>
                    <h1 className='text-white text-[40px] max-[769px]:text-[24px] italic font-medium'>
                        Biz Kimik?
                    </h1>

                    <p className="max-w-[700px] mt-10 text-white text-[24px] max-[769px]:text-[16px] font-medium">
                        İnvesthome, daşınmaz əmlak sahəsində güvənli və şəffaf xidmət göstərməyi qarşısına məqsəd qoymuş peşəkar komandadır. İllərin təcrübəsi və bazar bilgiləri ilə biz müştərilərimizə ən uyğun əmlak seçimində dəstək olur, alqı-satqı və kirayə proseslərini asanlaşdırırıq.
                    </p>
                </div>
            </div>
            <Agents />
            <BeAgent />
        </>
    )
}

export default page
