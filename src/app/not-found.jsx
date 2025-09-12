import Image from 'next/image'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='w-full h-[1024px] flex items-center justify-center flex-col px-[174px]'>
      <Image src="/images/not-found.png" alt="Not Found" width={1440} height={1024} />
    </div>
  )
}