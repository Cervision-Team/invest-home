"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import whatsappIcon from "../../../../public/icons/profile/whatsapp-icon.svg";
import instagramIcon from "../../../../public/icons/profile/instagram-icon.svg";
import linkedinIcon from "../../../../public/icons/profile/linkedin-icon.svg";

import agentsData from "@/components/core/AgentsData";
import Search from "@/components/ui/dashboard/Search";
import EmployeesActions from "@/components/ui/dashboard/EmployeesActions";
import { Button as ChatNotificationButtons } from "@/components/ui/dashboard/Buttons/ProfileButtons";
import AddAgentModal from "@/components/ui/dashboard/AddAgentModal";
import EditAgentModal from "@/components/ui/dashboard/EditAgentModal";
import { agentMock } from "@/lib/mock/agentMock";

const Employees = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState(agentsData);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredEmployees = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return employees;

    return employees.filter((agent) =>
      String(agent?.fullName || agent?.name || "").toLowerCase().includes(q)
    );
  }, [employees, search]);

  const selectedCount = selectedIds.size;
  const selectedEmployee = useMemo(() => {
    if (selectedIds.size !== 1) return null;
    const onlyId = Array.from(selectedIds)[0];
    return employees.find((e) => String(e?.id) === String(onlyId)) || null;
  }, [employees, selectedIds]);

  const toggleSelected = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const key = String(id);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const onDelete = () => {
    if (selectedIds.size === 0) return;

    const ok = window.confirm(`${selectedIds.size} əməkdaş silinsin?`);
    if (!ok) return;

    setEmployees((prev) =>
      prev.filter((e) => !selectedIds.has(String(e?.id)))
    );
    setSelectedIds(new Set());
  };

  const onEdit = () => {
    if (!selectedEmployee) return;
    setIsEditOpen(true);
  };

  const onAdd = () => setIsAddOpen(true);

  const handleAddAgent = async (values) => {
    const nextId =
      typeof crypto !== "undefined" && crypto?.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());


    const newAgent = {
      id: nextId,
      // name: (values.fullName || "").split(" ")[0] || "Agent",
      fullName: values.fullName,
      role: values.role || "Agent",
      email: values.email,
      phone: values.phone,
      address: values.address || "",
      birthDate: values.birthDate || "",
      note: values.note || "",
    };

    setEmployees((prev) => [newAgent, ...prev]);
    setSelectedIds(new Set([String(nextId)]));
  };

  const editAgentSource = useMemo(() => {
    console.log("agentMock",agentMock);
    console.log("selectedemployee",selectedEmployee);
    
    if (selectedEmployee) return { ...agentMock, ...selectedEmployee };
    return agentMock;
  }, [selectedEmployee]);

  const handleEditAgent = async (values) => {
    const idToUpdate = String(editAgentSource?.id);

    setEmployees((prev) =>
      prev.map((e) => {
        if (String(e?.id) !== idToUpdate) return e;
        return {
          ...e,
          fullName: values.fullName,
          role: values.role || e.role,
          email: values.email,
          phone: values.phone,
          address: values.address || "",
          birthDate: values.birthDate || "",
          note: values.note || "",
        };
      })
    );
  };

  return (
    <main className="w-full h-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
        <div className="w-full md:max-w-md">
          <Search search={search} setSearch={setSearch} />
        </div>

        <div className="flex items-center gap-3 md:gap-6 md:justify-end">
          <EmployeesActions
            onDelete={onDelete}
            onEdit={onEdit}
            onAdd={onAdd}
            selectedCount={selectedCount}
            deleteDisabled={selectedCount === 0}
            editDisabled={selectedCount !== 1}
          />

          <ChatNotificationButtons />
        </div>
      </div>

      <h1 className="text-[#1B1F27] text-[20px] font-semibold mb-8">
        Bütün əməkdaşlar
      </h1>

      <section
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4 pr-2 hide-scrollbar"
      >
        {filteredEmployees.map((agent) => {
          const idKey = String(agent?.id);
          const isSelected = selectedIds.has(idKey);

          return (
            <div
              key={agent?.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/about-us/${agent.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/about-us/${agent.id}`);
                }
              }}
              className={`group relative flex flex-col items-center justify-between rounded-2xl cursor-pointer transition-colors border bg-white hover:bg-[#FAFAFA] ${isSelected
                  ? "border-(--primary-color) bg-[#F5FFFC]"
                  : "border-black/10"
                }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSelected(agent?.id);
                }}
                aria-label={isSelected ? "Seçimi ləğv et" : "Əməkdaşı seç"}
                title={isSelected ? "Seçimi ləğv et" : "Əməkdaşı seç"}
                className={`absolute left-3 top-3 w-5 h-5 rounded-sm flex items-center justify-center border transition-colors ${isSelected
                    ? "bg-(--primary-color) border-(--primary-color) text-white"
                    : "bg-white border-black/20 text-transparent hover:border-black/30"
                  }`}
              >
                <Check size={14} />
              </button>

              <div className="w-full px-4 pt-6 pb-4 flex flex-col items-center">
                <div className="w-[120px] h-[120px]">
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    className={`w-full h-full object-cover rounded-full ${isSelected
                        ? "ring-2 ring-(--primary-color) ring-offset-2"
                        : ""
                      }`}
                  />
                </div>

                <div className="flex flex-col gap-2.5 items-center mt-5 text-center">
                  <p className="text-[16px] text-[#1B1F27] font-medium">
                    {agent.fullName}
                  </p>
                  <strong className="text-[14px] text-[#02836F] font-semibold">
                    {agent.role}
                  </strong>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="w-6 h-6 bg-black rounded-full flex items-center justify-center"
                    aria-label="Whatsapp"
                    title="Whatsapp"
                  >
                    <Image src={whatsappIcon} alt="whatsapp" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="w-6 h-6 bg-black rounded-full flex items-center justify-center"
                    aria-label="Instagram"
                    title="Instagram"
                  >
                    <Image src={instagramIcon} alt="instagram" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="w-6 h-6 bg-black rounded-full flex items-center justify-center"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <Image src={linkedinIcon} alt="linkedin" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <AddAgentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddAgent}
      />
      <EditAgentModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditAgent}
        agent={editAgentSource}
      />
    </main>
  );
};

export default Employees;
