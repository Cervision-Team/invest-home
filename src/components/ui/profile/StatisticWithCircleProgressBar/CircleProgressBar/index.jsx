"use client"
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const CircleProgressBar = ({ percentage, color }) => {

    return (
        <div className='w-[90px] h-[90px]'>
            <CircularProgressbarWithChildren value={percentage} styles={{
                path: {
                    stroke: color
                },
                trail: {
                    stroke: "#F1F3F9"
                }
            }}>

                <div className='w-[60px] h-[60px] flex items-center justify-center bg-[#F1F3F9] rounded-full'>
                    <strong style={{ color: color }}>{percentage}%</strong>
                </div>
            </CircularProgressbarWithChildren>
        </div>
    )
}

export default CircleProgressBar