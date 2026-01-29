"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Pencil } from "lucide-react";

import whatsappIcon from "../../../../public/icons/profile/whatsapp-icon.svg";
import instagramIcon from "../../../../public/icons/profile/instagram-icon.svg";
import linkedinIcon from "../../../../public/icons/profile/linkedin-icon.svg";

import Search from "@/components/ui/dashboard/Search";
import EmployeesActions from "@/components/ui/dashboard/EmployeesActions";
import { Button as ChatNotificationButtons } from "@/components/ui/dashboard/Buttons/ProfileButtons";
import AddAgentModal from "@/components/ui/dashboard/AddAgentModal";
import EditAgentModal from "@/components/ui/dashboard/EditAgentModal";
import { getEmployee, saveEmployee } from "@/services/api/endpoints/userService";
import Loader from "@/components/ui/Loader";
import MessageModal from "@/components/ui/MessageModal";

const defaultProfileIcon = "/icons/profile.svg";

const Employees = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [confirmAddOpen, setConfirmAddOpen] = useState(false);
  const [pendingAddValues, setPendingAddValues] = useState(null);
  const [isSavingAdd, setIsSavingAdd] = useState(false);
  const [messageModal, setMessageModal] = useState({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });

  const refreshEmployees = async () => {
    const res = await getEmployee();
    setEmployees(res?.data || []);
  };



  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await getEmployee();
        if (!alive) return;
        setEmployees(res?.data || []);
      } catch (error) {
        if (!alive) return;
        setLoadError(error?.message || "Əməkdaşlar yüklənmədi");
        console.log("Error fetching employees:", error);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filteredEmployees = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return employees;

    return employees.filter((agent) =>
      String(agent?.fullName || agent?.name || "").toLowerCase().includes(q)
    );
  }, [employees, search]);

  const groupedEmployees = useMemo(() => {
    const groups = new Map();

    for (const agent of filteredEmployees || []) {
      const key = String(agent?.role || agent?.roleName || "Digər").trim() || "Digər";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(agent);
    }

    return Array.from(groups.entries()).sort(([a], [b]) =>
      String(a).localeCompare(String(b), "az")
    );
  }, [filteredEmployees]);

  const onAdd = () => setIsAddOpen(true);

  const handleAddAgent = async (values) => {
    setPendingAddValues(values);
    setConfirmAddOpen(true);
    return false;
  };

  const confirmAdd = async () => {
    if (!pendingAddValues || isSavingAdd) return;

    const payload = {
      fullName: pendingAddValues?.fullName,
      email: pendingAddValues?.email,
      phoneNumber: pendingAddValues?.phone,
      position: pendingAddValues?.role,
      role: pendingAddValues?.roleName,
      birthDate: pendingAddValues?.birthDate,
      location: pendingAddValues?.address,
      aboutMe: pendingAddValues?.note,
    };

    console.log("[Employees] saveEmployee payload (add):", payload);

    setIsSavingAdd(true);
    try {
      await saveEmployee(payload);
      await refreshEmployees();
      setConfirmAddOpen(false);
      setPendingAddValues(null);
      setIsAddOpen(false);
      setMessageModal({
        open: true,
        variant: "success",
        title: "Uğurlu",
        message: "Əməkdaş uğurla yaradıldı",
      });
    } catch (err) {
      console.log("Error saving employee:", err);
      setConfirmAddOpen(false);
      setMessageModal({
        open: true,
        variant: "error",
        title: "Xəta",
        message: err?.response?.data?.message || "Əməkdaşı əlavə etmək alınmadı",
      });
    } finally {
      setIsSavingAdd(false);
    }
  };

  const editAgentSource = useMemo(() => {
    if (!editingEmployee) return null;
    return { ...editingEmployee };
  }, [editingEmployee]);

  const handleEditAgent = async (values) => {
    const payload = {
      fullName: values?.fullName,
      email: values?.email,
      phoneNumber: values?.phone,
      position: values?.role,
      role: values?.roleName,
      birthDate: values?.birthDate,
      location: values?.address,
      aboutMe: values?.note,
    };

    console.log("[Employees] saveEmployee payload (edit):", {
      id: editAgentSource?.id,
      payload,
    });

    try {
      await saveEmployee(payload);
      await refreshEmployees();
      setMessageModal({
        open: true,
        variant: "success",
        title: "Uğurlu",
        message: "Əməkdaş uğurla yeniləndi",
      });
    } catch (err) {
      console.log("Error saving employee:", err);
      setMessageModal({
        open: true,
        variant: "error",
        title: "Xəta",
        message: err?.response?.data?.message || "Əməkdaşı yeniləmək alınmadı",
      });
      throw err;
    }
  };

  if (loading) {
    return (
      <main className="w-full flex items-center justify-center py-16">
        <Loader />
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="w-full flex items-center justify-center py-16">
        <div className="w-full max-w-xl py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl bg-white">
          {loadError}
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-full">
      <MessageModal
        isOpen={messageModal.open}
        variant={messageModal.variant}
        title={messageModal.title}
        message={messageModal.message}
        primaryText="Bağla"
        onClose={() => setMessageModal((p) => ({ ...p, open: false }))}
        onPrimary={() => setMessageModal((p) => ({ ...p, open: false }))}
      />

      <MessageModal
        isOpen={confirmAddOpen}
        variant="success"
        title="Təsdiq"
        message="Əməkdaş yaradılsın?"
        primaryText={isSavingAdd ? "Yaradılır..." : "Təsdiqlə"}
        secondaryText="Ləğv et"
        onClose={() => !isSavingAdd && setConfirmAddOpen(false)}
        onSecondary={() => !isSavingAdd && setConfirmAddOpen(false)}
        onPrimary={confirmAdd}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
        <div className="w-full md:max-w-md">
          <Search search={search} setSearch={setSearch} />
        </div>

        <div className="flex items-center gap-3 md:gap-6 md:justify-end">
          <EmployeesActions
            onAdd={onAdd}
            showDelete={false}
            showEdit={false}
          />

          <ChatNotificationButtons />
        </div>
      </div>

      <h1 className="text-[#1B1F27] text-[20px] font-semibold mb-8">
        Bütün əməkdaşlar
      </h1>

      {groupedEmployees.map(([roleLabel, list]) => (
        <div key={roleLabel} className="mb-10">
          <h2 className="text-[#1B1F27] text-[16px] font-semibold mb-4">
            {roleLabel}
          </h2>

          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4 pr-2 hide-scrollbar">
            {list.map((agent) => {
              const avatarSrc = agent?.imageUrl || agent?.image?.url;
              const hasAvatar = Boolean(avatarSrc);

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
                  className="group relative flex flex-col items-center justify-between rounded-2xl cursor-pointer transition-colors border bg-white hover:bg-[#FAFAFA] border-black/10"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingEmployee(agent);
                      setIsEditOpen(true);
                    }}
                    aria-label="Update"
                    title="Update"
                    className="absolute right-3 top-3 w-9 h-9 rounded-xl flex items-center justify-center border border-black/10 bg-white text-[#0B3B34] hover:bg-[#F5FFFC]"
                  >
                    <Pencil size={18} />
                  </button>

                  <div className="w-full px-4 pt-6 pb-4 flex flex-col items-center">
                    <div className="w-[120px] h-[120px]">
                      {hasAvatar ? (
                        <Image
                          src={avatarSrc}
                          alt={agent?.fullName || "Employee"}
                          className="w-full h-full object-cover rounded-full"
                          width={120}
                          height={120}
                        />
                      ) : (
                        <div
                          className="w-full h-full rounded-full bg-(--primary-color) flex items-center justify-center"
                        >
                          <Image src={defaultProfileIcon} alt="Default avatar" width={28} height={28} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2.5 items-center mt-5 text-center">
                      <p className="text-[16px] text-[#1B1F27] font-medium">
                        {agent.fullName}
                      </p>
                      <strong className="text-[14px] text-[#02836F] font-semibold">
                        {agent.position}
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
        </div>
      ))}

      <AddAgentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddAgent}
      />
      <EditAgentModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleEditAgent}
        agent={editAgentSource}
      />
    </main>
  );
};

export default Employees;
