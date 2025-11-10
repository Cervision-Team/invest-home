'use client'

import buildingIcon from "../../../../../public/icons/profile/building-icon.svg"
import Image from 'next/image'
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const TotalStatisticWithProgressbar = ({ text, count, percentage }) => {

    // ---- COUNT ANIMATION ----
    const [display, setDisplay] = useState(0);
    const countValue = useMotionValue(0);
    const rounded = useTransform(countValue, (latest) => Math.floor(latest));

    useEffect(() => {
        const countAnim = animate(countValue, count, { duration: 1, ease: "easeOut" });
        const unsubscribe = rounded.on("change", (v) => setDisplay(v));

        return () => {
            countAnim.stop();
            unsubscribe();
        };
    }, [count]);

    // ---- LINE ANIMATION ----
    const [lineWidth, setLineWidth] = useState(0);
    const widthValue = useMotionValue(0);

    useEffect(() => {
        const widthAnim = animate(widthValue, percentage, { duration: 1, ease: "easeOut" });
        const unsubscribe = widthValue.on("change", (v) => setLineWidth(v));

        return () => {
            widthAnim.stop();
            unsubscribe();
        };
    }, [percentage]);


    return (
        <div className='bg-white p-[20px] flex gap-[24px] w-full shadow-[0px_4px_10px_0px_#0000001A] rounded-xl'>
            <div>
                <Image src={buildingIcon} alt='building' />
            </div>
            <div className='w-full flex flex-col justify-between'>
                <div className='flex justify-between '>
                    <span className='text-xl font-medium'>{text}</span>
                    <span className='font-medium text-[28px]'><motion.span>{display}</motion.span></span>
                </div>
                <div className="h-[8px] bg-[#E0F5F1] rounded-xl overflow-hidden">
                    <motion.div
                        className="bg-[#02836F] h-full rounded-xl"
                        style={{ width: `${lineWidth}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

export default TotalStatisticWithProgressbar