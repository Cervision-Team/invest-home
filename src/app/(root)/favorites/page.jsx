import { Suspense } from "react";
import Favorites from "./Favorites";
import Loader from "@/components/ui/Loader";

const page = () => {
  return (
    <>
      <section className='max-w-[1600px] w-auto mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] pt-[20px] pb-[36px]'>
        <Suspense fallback={<div className="w-full py-10 flex items-center justify-center"><Loader /></div>}>
          <Favorites />
        </Suspense>
      </section>
    </>
  )
}

export default page