import { Suspense } from "react";
import FilterResults from "./FilterResults";

export default function Page() {
  return (
    <section className="mx-auto w-full max-[1025px]:px-[20px] max-[431px]:px-[16px] pt-[20px] pb-[36px]">
      <Suspense fallback={<div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02836F]"></div>
      </div>}>
        <FilterResults />
      </Suspense>
    </section>
  );
}