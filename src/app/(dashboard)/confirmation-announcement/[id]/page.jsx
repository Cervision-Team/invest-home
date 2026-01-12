"use client"
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { assignAgent, getAnnouncementById } from "@/services/api/endpoints/announcementService";
import { getAgent } from "@/services/api/endpoints/userService";
import { AgentCard } from "./AgentCard";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Loader from "@/components/ui/Loader";


export default function ConfirmationAnnouncement() {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [announcement, setAnnouncement] = useState(null)
    const [agent, setAgent] = useState(null)
    const [isOpenConfirm,setIsOpenConfirm] = useState(false)
    const [announcementLoading, setAnnouncementLoading] = useState(true)
    const [agentsLoading, setAgentsLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const router = useRouter();
    const { id } = useParams();
    useEffect(() => {
        (async () => {
            setAnnouncementLoading(true)
            setLoadError(null)
            try {
                const houseDetail = await getAnnouncementById(id)
                setAnnouncement(houseDetail)
            } catch (err) {
                setAnnouncement(null)
                setLoadError(err?.message || "Elan yüklənmədi")
            } finally {
                setAnnouncementLoading(false)
            }
        })()
    }, [])
    useEffect(() => {
        (async () => {
            setAgentsLoading(true)
            setLoadError(null)
            try {
                const agents = await getAgent()
                setAgent(agents)
            } catch (err) {
                setAgent([])
                setLoadError(err?.message || "Agentlər yüklənmədi")
            } finally {
                setAgentsLoading(false)
            }
        })()
    }, [])


    console.log(id);

    async function handleConfirm() {
        if (!selectedAgent) return;
        try {
            setConfirming(true);
            await assignAgent(id, selectedAgent)
            setIsOpenConfirm(true)
            // router.push(`/house-detail/${id}`)
        } catch (err) {
            console.log(err);
        } finally {
            setConfirming(false);
        }
    }

    if (announcementLoading || agentsLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="w-full max-w-xl py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl bg-white">
                    {loadError}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full">
            <div className="w-full mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-disabled/20 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold">Elan: {announcement?.rooms} otaqlı</h1>
                            <p className="text-3 mt-1">{announcement?.description}</p>
                            <div className="mt-3 text-lg font-medium">Qiymət: {announcement?.price} AZN</div>
                        </div>

                        <div className="flex items-center gap-3">

                            <button
                                onClick={() => router.push(`/house-detail/${id}`)}
                                className="px-4 py-2 rounded-lg bg-white border border-neutral-disabled/25 text-sm hover:bg-neutral hover:border-(--primary-color) focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                Elana qayıt
                            </button>
                        </div>
                    </div>
                </div>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-disabled/20">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold">Agent seçin</h2>
                            <p className="text-sm text-3 mt-1">Elanı aktiv etmək üçün aşağıdakı agentlərdən birini seçin.</p>
                        </div>

                        <div className="text-sm text-3">Seçilən agent: {selectedAgent ?? "—"}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.isArray(agent) ? agent.map((agent) => (
                            <AgentCard
                                key={agent.id}
                                agent={agent}
                                selected={selectedAgent === agent.id}
                                onSelect={setSelectedAgent}
                            />
                        )) : null}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-end">
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 rounded-lg border border-neutral-disabled/25 bg-white text-sm hover:bg-neutral hover:border-(--primary-color) focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Geri
                        </button>

                        <button
                            onClick={handleConfirm}
                            disabled={!selectedAgent || confirming}
                            className="px-5 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed bg-(--primary-color) text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            {confirming ? "Təsdiqlənir..." : "Təsdiq et və aktiv et"}
                        </button>
                    </div>
                    <ConfirmationModal isOpen={isOpenConfirm} buttonText="Elana qayit" url={`/house-detail/${id}`} text="Agent secildi" />
                </section>
            </div>
        </div>
    );
}
