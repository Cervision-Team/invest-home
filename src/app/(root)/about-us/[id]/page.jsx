import React from 'react'
import Image from "next/image";
import LawyerImage from "../../../../../public/images/Lawyer.png"
import ConnectionButton from '../../../../components/ui/ConnectionButton';
import RoundedBlackButton from '../../../../components/ui/RoundedBlackButton';
import InstagramIcon from "../../../../../public/icons/Instagram.svg"
import { houseData } from '@/components/core/house';
import HouseCard from '@/components/ui/HouseCard';
import { FaWhatsapp } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import agentsData from '@/components/core/AgentsData';

const Page = ({ params }) => {

const { id } = params;

 // TODO: Replace with API fetching in the future
  // async function fetchAgentData() {
  //   const resAgent = await fetch(`https://your-backend.com/api/agents/${id}`, {
  //     cache: 'no-store',
  //   });
  //   if (!resAgent.ok) throw new Error('Failed to fetch agent details');
  //   const agent = await resAgent.json();

  //   const resHouses = await fetch(`https://your-backend.com/api/agents/${id}/houses`, {
  //     cache: 'no-store',
  //   });
  //   if (!resHouses.ok) throw new Error('Failed to fetch agent houses');
  //   const houses = await resHouses.json();

  //   return { agent, houses };
  // }
  // const { agent, houses } = use(fetchAgentData());

  // Current implementation using local data
  const agent = agentsData.find((agent) => agent.id === parseInt(id));

  // If agent not found, show 404
  if (!agent) {
    notFound();
  }

  // Filter houses by agent (if you have agentId in houseData)
  // const agentHouses = houseData.filter(house => house.agentId === agent.id);
  // For now, showing all houses - update this logic based on your data structure
  const agentHouses = houseData;

  return (
    <>
      <section className='mt- max-w-[1600px] mx-auto'>
        <div className='py-6 px-6 bg-white rounded-2xl border-0.2 border-solid border-[rgba(2,131,111,0.5)]
          shadow-[4px_16px_50px_0px_rgba(2,131,111,0.05)] flex flex-row items-center justify-center gap-[34px] mx-[80px] max-[1100px]:flex-col max-[1100px]:mx-[20px]'>

          <Image
            src={agent.image}
            alt='LawyerImage'
          //   src={agent.image}
          // alt={agent.name}
            width={400}
            height={360}
            className='flex-shrink-0 max-[1100px]:w-[250px] max-[1100px]:h-[250px]'
          />

          <div className='flex flex-col'>
            <p className='text-[#000] text-[32px]/[32px] font-medium'>
              {agent.fullName}
            </p>
            <p className='text-[#000] text-xl/[28px] font-normal mt-2'>
              {agent.role}
            </p>
            <p className='text-azure text-base/[24px] italic font-medium tracking-[1.024px] mt-5'>
              {agent.email}
            </p>
            <p className='text-black text-[22px]/[28px] font-normal mt-8'>
              {/* "İnvestHome" şirkəti olaraq 2025-ci ildən bəri ölkəmizin daşınmaz əmlak bazarında həm fiziki
              həm də hüquqi şəxslər üçün yüksəkkeyfiyyətli xidmətlər təqdim edirik. Sözsüz ki, bu keyfiyyətin arxasında peşəkar
              mütəxəssislərimiz, böyük müştəri bazamız və çoxillik təcrübəmiz dayanır. Məqsədimiz alqı-satqıdan qiymətləndirməyə */}
               {agent.about1} {agent.about2}
            </p>

            <div className='w-full h-auto flex flex-row items-center justify-between mt-[85px]'>
              <div className='w-auto h-auto flex flex-row items-center justify-center gap-[38px]'>
                <ConnectionButton name='Zəng et' />
                <ConnectionButton name='Mesaj yaz' />
              </div>

              <div className='w-auto h-auto flex flex-row items-center justify-center gap-[20px]'>
                <RoundedBlackButton
                  icon={
                    <FaWhatsapp />
                  }
                  backgroundColor="#28E55F" />
                <RoundedBlackButton
                  icon={
                    <Image src={InstagramIcon} alt="Instagram" width={18} height={18} />
                  }
                  backgroundColor="linear-gradient(to right, #8a3ab9, #e95950, #fccc63)" />
                <RoundedBlackButton
                  icon={
                    <FaLinkedinIn />
                  }
                  backgroundColor="#0073AF" />
              </div>
            </div>
          </div>
        </div>

        <div className='px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] mt-6 flex flex-col items-start justify-start gap-5 mb-[85px]'>
          <p className='text-black text-center text-[32px]/[48px] font-medium'>
            Əmlaklarım
          </p>

          <div className='w-full grid grid-cols-4 max-[1025px]:grid-cols-3 max-[769px]:grid-cols-2 max-[431px]:grid-cols-1 gap-[24px]'>
            {houseData.map((house) => (
              <HouseCard
                key={house.id}
                house={house}
              />
            ))}
             {/* {houses.map((house) => (
            <HouseCard key={house.id} house={house} />
          ))} */}
          </div>
        </div>
      </section>
    </>
  )
}

export default Page
