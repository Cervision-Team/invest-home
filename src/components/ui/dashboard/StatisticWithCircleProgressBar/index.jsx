'use client'

import React from 'react'
import CircleProgressBar from './CircleProgressBar'
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const StatisticWithCircleProgressBar = ({ count, text, target, color, percentage }) => {

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
        <div className='flex bg-white justify-between p-[20px] w-full shadow-[0px_4px_10px_0px_#0000001A] rounded-xl'>
            <div className='flex flex-col justify-between'>
                <span className='font-medium text-xl'><motion.span>{display}</motion.span></span>
                <div className='flex items-center gap-[20px]'>
                    <span className='text-lg font-medium '>{text}</span>
                    <span className='text-sm text-[#3F444D]'>Hədəf {target}</span>
                </div>
            </div>
            <div>
                <CircleProgressBar color={color} percentage={percentage} />
            </div>
        </div>
    )
}

export default StatisticWithCircleProgressBar

