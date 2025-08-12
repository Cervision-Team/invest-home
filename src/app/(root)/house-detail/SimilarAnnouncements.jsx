import { houseData } from '@/components/core/house';
import HouseCard from '@/components/ui/HouseCard';

const SimilarAnnouncements = () => {


  return (
    <>
      <section className='max-w-[1600px] mx-[auto]'>
        <div className='px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]'>
          <h1 className="text-[#111] text-[24px] sm:text-[28px] font-medium">
            Oxşar elanlar
          </h1>

          <div className='w-full grid grid-cols-4 max-[1025px]:grid-cols-3 max-[769px]:grid-cols-2 max-[431px]:gap-x-[8px] gap-[24px]'>
            {houseData.map((house) => (
              <HouseCard
                key={house.id}
                house={house}
              />
            ))}
          </div>
        </div>
      </section>

    </>
  )
}

export default SimilarAnnouncements
