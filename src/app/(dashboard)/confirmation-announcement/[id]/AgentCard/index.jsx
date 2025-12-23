import Image from "next/image";

const defaultProfileIcon = "/icons/profile.svg";

export const AgentCard = ({ agent, selected, onSelect}) => {
    const hasAvatar = Boolean(agent?.image?.url);
    const avatarSrc = agent?.image?.url;
    return (
        <div
            role="button"
            onClick={() => onSelect(agent.id)}
            className={`flex flex-col justify-between p-4 rounded-2xl shadow-sm border transition cursor-pointer hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${selected ? "border-(--primary-color) bg-neutral-text shadow" : "border-neutral-disabled/20 bg-white hover:border-(--primary-color)"
                }`}
            tabIndex={0}
        >
            <div>
                <div className="flex items-center  gap-5">
                    <div className="w-20 h-20">
                        {hasAvatar ? (
                            <Image
                                src={avatarSrc}
                                alt={agent?.fullName ? `${agent.fullName} foto` : "Agent foto"}
                                className="w-full h-full rounded-full object-cover object-top"
                                width={80}
                                height={80}
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-(--primary-color) flex items-center justify-center">
                                <Image
                                    src={defaultProfileIcon}
                                    alt="Default avatar"
                                    width={30}
                                    height={30}
                                />
                            </div>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold">{agent.fullName}</h3>
                    {/* <div className="text-sm font-medium">{agent.rating} ★</div> */}
                </div>
                <p className="text-sm text-gray-600 mt-2">Region: {agent?.serviceTerritory}</p>
                <p className="text-sm text-gray-600">Telefon: {agent.phoneNumber}</p>
                {/* <p className="text-sm text-gray-600">Nailiyyətlər: {agent.deals} razılaşma</p> */}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">ID: {agent.id}</div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(agent.id);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${selected
                        ? "bg-(--primary-color) text-white hover:opacity-90"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                >
                    {selected ? "Seçilmiş" : "Seç"}
                </button>
            </div>
        </div>
    );
}
