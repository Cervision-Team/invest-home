"use client"

import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircleProgressBar = ({ percentage, color = "#02836F", duration = 1 }) => {

    const [value, setValue] = useState(0);
    const motionValue = useMotionValue(0);

    useEffect(() => {
        const controls = animate(motionValue, percentage, { duration, ease: "easeOut" });
        const unsubscribe = motionValue.on("change", (v) => setValue(v));

        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [percentage, duration]);


    return (
        <div className='w-[90px] h-[90px]'>
            <CircularProgressbarWithChildren
                value={value}
                circleRatio={1}
                styles={{
                    path: { stroke: color, transition: "none" },
                    trail: { stroke: "#F1F3F9" },
                }}
            >

                <div className="text-sm font-semibold">{Math.round(value)}%</div>
            </CircularProgressbarWithChildren>
        </div>
    )
}

export default CircleProgressBar