import { Suspense } from "react";
import ListingsPage from "./Listings"

const page = () => {
  return (
    <>
      <section className='mx-auto w-full max-[1025px]:px-[20px] max-[431px]:px-[16px] pt-[20px] pb-[36px]'>
        <Suspense fallback={<div>Loading...</div>}>
          <ListingsPage />
        </Suspense>
      </section>
    </>
  )
}

export default page