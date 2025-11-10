'use client'

import React from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const TotalStatistic = ({ icon, text, count }) => {

    const [display, setDisplay] = useState(0);
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, (latest) => Math.floor(latest));

    useEffect(() => {
        const controls = animate(motionValue, count, { duration: 1 });
        const unsubscribe = rounded.on("change", (v) => setDisplay(v));
        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [count]);

    return (
        <div className='bg-white p-[20px] flex gap-[24px] w-full shadow-[0px_4px_10px_0px_#0000001A] rounded-xl'>
            <div>
                <Image src={icon} alt='license' />
            </div>
            <div className='w-full flex flex-col justify-center'>
                <div className='flex justify-between items-center'>
                    <span className='text-xl font-medium'>{text}</span>
                    <span className='font-medium text-[28px]'><motion.span>{display}</motion.span></span>
                </div>

            </div>
        </div>
    )
}

export default TotalStatistic