"use client"

import React, { useEffect, useState } from 'react'
import HouseCard from '@/components/ui/HouseCard'
import { Button } from '@/components/ui/dashboard/Buttons/ProfileButtons'
import Search from '@/components/ui/dashboard/Search'
import Loader from '@/components/ui/Loader'
import {
	getAnnouncementCountsByStatus,
	getMyApprovedAnnouncements,
	getMyArchivedAnnouncements,
	getMyAssignedToAgentAnnouncements,
	getMyPendingAnnouncements,
	getMyRejectedAnnouncements,
	getMySoldAnnouncements,
} from '@/services/api/endpoints/announcementService'

const MyAnnouncementsPage = () => {
	const [search, setSearch] = useState();
	const [houses, setHouses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [counts, setCounts] = useState(null);
	const [countsLoading, setCountsLoading] = useState(true);
	const [countsError, setCountsError] = useState(null);

	const steps = [
		{ key: 'APPROVED', label: 'Təsdiqlənmiş', fetcher: getMyApprovedAnnouncements, countKey: 'approved' },
		{ key: 'PENDING', label: 'Gözləmədə', fetcher: getMyPendingAnnouncements, countKey: 'pending' },
		{ key: 'ASSIGNED_TO_AGENT', label: 'Agentə Təyin Edilmiş', fetcher: getMyAssignedToAgentAnnouncements, countKey: 'assignedToAgent' },
		{ key: 'REJECTED', label: 'Redd edilmiş', fetcher: getMyRejectedAnnouncements, countKey: 'rejected' },
		{ key: 'ARCHIVED', label: 'Arxivləşdirilmiş', fetcher: getMyArchivedAnnouncements, countKey: 'archived' },
		{ key: 'SOLD', label: 'Satılmış', fetcher: getMySoldAnnouncements, countKey: 'sold' },
	];
	const [activeStep, setActiveStep] = useState(steps[0].key);

	useEffect(() => {
		let cancelled = false;
		setCountsLoading(true);
		setCountsError(null);

		getAnnouncementCountsByStatus()
			.then((res) => {
				if (cancelled) return;
				setCounts(res ?? null);
			})
			.catch((err) => {
				if (cancelled) return;
				setCounts(null);
				setCountsError(err?.message || 'Xəta baş verdi');
			})
			.finally(() => {
				if (cancelled) return;
				setCountsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	const getCountForStep = (step) => {
		if (!counts || !step?.countKey) return null;
		const direct = counts?.[step.countKey];
		if (typeof direct === 'number') return direct;
		const fallback = counts?.[step.key];
		if (typeof fallback === 'number') return fallback;
		return null;
	};

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
				<div className='flex flex-wrap '>
					{steps.map((s) => {
						const isActive = s.key === activeStep;
						const count = getCountForStep(s);
						const showCountSkeleton = countsLoading;
						const showCount = !countsLoading && countsError == null && count != null;
						return (
							<button
								key={s.key}
								type='button'
								onClick={() => setActiveStep(s.key)}
								aria-pressed={isActive}
								className={`px-4 py-2 rounded-[12px] text-[14px] font-medium transition-all flex items-center gap-2 select-none ${isActive
									? 'bg-primary text-white shadow-[0px_6px_18px_rgba(59,130,246,0.25)]'
									: 'bg-transparent text-[#1B1F27] hover:bg-primary/10 hover:shadow-sm'
									}`}
							>
								<span className='whitespace-nowrap'>{s.label}</span>
								{showCountSkeleton ? (
									<span className={`inline-flex items-center justify-center min-w-[34px] h-[22px] px-2 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'} animate-pulse`}>
										<span className='w-4 h-2 rounded bg-black/10' />
									</span>
								) : showCount ? (
									<span className={`inline-flex items-center justify-center min-w-[34px] h-[22px] px-2 rounded-full text-[12px] font-semibold ${isActive
										? 'bg-white/20 text-white'
										: 'bg-gray-100 text-[#111827]'
										}`}>
										{count}
									</span>
								) : null}
							</button>
						);
					})}
				</div>
				{countsError ? (
					<div className='mt-2 px-2 text-[13px] text-gray-500'>
						Status sayları yüklənmədi
					</div>
				) : null}
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
