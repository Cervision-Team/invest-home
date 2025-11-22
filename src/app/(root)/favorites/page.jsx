import { Suspense } from "react";
import Favorites from "./Favorites";

const page = () => {
  return (
    <>
      <section className='max-w-[1600px] w-auto mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] pt-[20px] pb-[36px]'>
        <Suspense fallback={<div>Loading...</div>}>
          <Favorites />
        </Suspense>
      </section>
    </>
  )
}

export default page