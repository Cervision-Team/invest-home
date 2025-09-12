'use client';

import React, { Suspense, use } from 'react';
import AgentCard from '../../../components/ui/AgentsCard';
import AgentCardSkeleton from '@/components/ui/skeleton/AgentsCardSkeleton';
import agentsData from '@/components/core/AgentsData';

// async function fetchAgents() {
//   const res = await fetch('https://your-backend.com/api/agents', {
//     cache: 'no-store',
//   });
//   if (!res.ok) throw new Error('Failed to fetch agents from backend');
//   return res.json();
// }

export default function Agents() {
  // const agents = use(fetchAgents());

  return (
    <section
      id="group"
      className="mt-[100px] max-w-[1600px] mx-auto w-auto flex flex-col gap-[70px] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]"
    >
      <div className="text-center flex flex-col gap-[15px]">
        <h5 className="text-primary text-[20px] font-medium">ÖZÜNÜZÜ TƏQDİM EDİN</h5>
        <h2 className="text-black text-[49px] max-[431px]:text-[20px] font-semibold">
          Mütəxəssislər Qrupumuz
        </h2>
      </div>

      <Suspense fallback={<AgentCardSkeleton />}>
        <div className="mb-[120px] grid grid-cols-4 grid-rows-1 max-[1025px]:grid-cols-2 max-[1025px]:grid-rows-2 max-[431px]:grid-cols-1 max-[431px]:grid-rows-1 gap-[20px]">
          {agentsData.slice(0, 4).map((agent) => (
            <AgentCard
              key={agent.id}
              id={agent.id}
              name={agent.name}
              role={agent.role}
              image={agent.image}
              description={agent.description}
            />
          ))}
        </div>
      </Suspense>
    </section>
  );
}
