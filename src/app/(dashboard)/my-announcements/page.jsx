"use client"

import React, { useEffect, useState } from 'react'
import HouseCard from '@/components/ui/HouseCard'
import { Button } from '@/components/ui/dashboard/Buttons/ProfileButtons'
import Search from '@/components/ui/dashboard/Search'
import Loader from '@/components/ui/Loader'
import {
	getMyActiveAnnouncements,
	getMyArchivedAnnouncements,
	getMyAssignedToAgentAnnouncements,
	getMyPendingAnnouncements,
	getMyRejectedAnnouncements,
	getMyStoppedAnnouncements,
} from '@/services/api/endpoints/announcementService'

const MyAnnouncementsPage = () => {
	const [search, setSearch] = useState();
	const [houses, setHouses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const steps = [
		{ key: 'ACTIVE', label: 'Aktiv', fetcher: getMyActiveAnnouncements },
		{ key: 'PENDING', label: 'Gözləyir', fetcher: getMyPendingAnnouncements },
		{ key: 'ASSIGNED_TO_AGENT', label: 'Agent Seçilir', fetcher: getMyAssignedToAgentAnnouncements },
		{ key: 'REJECTED', label: 'Redd edilmiş', fetcher: getMyRejectedAnnouncements },
		{ key: 'ARCHIVED', label: 'Arxivlənmiş', fetcher: getMyArchivedAnnouncements },
	];
	const [activeStep, setActiveStep] = useState(steps[0].key);

	useEffect(() => {
		let cancelled = false;
		const step = steps.find((s) => s.key === activeStep) ?? steps[0];

		setLoading(true);
		setError(null);
		setHouses([]);

		step.fetcher()
			.then((res) => {
				if (cancelled) return;
				setHouses(res?.content || []);
			})
			.catch((err) => {
				if (cancelled) return;
				setError(err?.message || 'Xəta baş verdi');
			})
			.finally(() => {
				if (cancelled) return;
				setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [activeStep]);

	return (
		<main className="w-full h-full">
			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10'>
				<div className='w-full md:max-w-md'>
					<Search search={search} setSearch={setSearch} />
				</div>
				<div className='flex gap-3 md:gap-6 md:justify-end'>
					{/* <Button /> */}
				</div>
			</div>

			<h1 className='text-[#1B1F27] text-[20px] font-semibold mb-4'>Elanlarım</h1>

			<div className='w-full bg-white rounded-[14px] shadow-[0px_4px_10px_0px_#0000000D] p-2 mb-8'>
				<div className='flex flex-wrap gap-2'>
					{steps.map((s) => {
						const isActive = s.key === activeStep;
						return (
							<button
								key={s.key}
								type='button'
								onClick={() => setActiveStep(s.key)}
								className={`px-4 py-2 rounded-[10px] text-[14px] font-medium transition-colors ${isActive
									? 'bg-primary text-white'
									: 'bg-transparent text-[#1B1F27] hover:bg-primary/10'
									}`}
							>
								{s.label}
							</button>
						);
					})}
				</div>
			</div>

			{loading ? (
				<div className="w-full py-16 flex items-center justify-center border border-dashed rounded-xl">
					<Loader />
				</div>
			) : error ? (
				<div className="w-full py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl">
					{error}
				</div>
			) : houses?.length ? (
				<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
					{houses?.map((house, idx) => (
						<div key={house?.id ?? idx} className='w-full'>
							<HouseCard house={house} isActive={activeStep === 'ACTIVE'} />
						</div>
					))}
				</div>
			) : (
				<div className="w-full py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl">
					Hazırda elan yoxdur
				</div>
			)}
		</main>
	)
}

export default MyAnnouncementsPage
