import Image from 'next/image'
import pendingIcon from "../../../../../../public/icons/profile/pending-icon.svg"
import doneIcon from "../../../../../../public/icons/profile/done-icon.svg"
import dromenuIcon from "../../../../../../public/icons/profile/dropmenu-icon.svg"

const Transaction = ({ txData }) => {
  return (
    <div className='border border-[#02836F] w-full h-[164px] rounded-2xl px-5 pt-8 pb-5'>
      <div className="border-b flex flex-col gap-4 pb-2">
        <div className='flex justify-between items-center'>
          <div className='flex gap-[26px] items-center'>
            <div className='flex gap-3'>Ödəniş <span>#4</span></div>
            {
              txData.status === "pending" && <span className='flex items-center justify-center text-[#FAFAFA] bg-[#FF9D14] rounded-[20px] w-[140px] h-8 gap-2.5'><Image src={pendingIcon} alt='pending' /> Gözlənilir</span>
            }
            {
              txData.status === "done" && <span className='flex items-center justify-center text-[#FAFAFA] bg-[#02836F] rounded-[20px] w-[140px] h-8 gap-2.5'><Image src={doneIcon} alt='done' /> Ödənilib</span>

            }
          </div>

          <span className='font-medium text-2xl'>{txData.price} azn</span>
        </div>
        <div className='flex justify-between items-center'>
          <span>{txData.transactionId}</span>
          <div className='flex gap-2.5'>
            <span>{txData.date}</span>
            <span>{txData.time}</span>
          </div>
        </div>
      </div>
      <div className='flex justify-end pt-4'>
        <button className='cursor-pointer'>
          <Image src={dromenuIcon} alt='dropmenu' />
        </button>
      </div>
    </div>
  )
}

export default Transaction