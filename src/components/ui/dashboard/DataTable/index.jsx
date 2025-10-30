"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import addHome from "../../../../../public/images/profile/add-row.svg";
import deleteHome from "../../../../../public/images/profile/delete-row.svg";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function DataTable() {
  const initialData = [
    {
      id: "H-001",
      image: "https://placehold.co/100x70?text=House+1",
      location: "Bakı, Yasamal",
      price: 120000,
      area: 75,
      rooms: 3,
      floor: 5,
      buildingType: "Yeni tikili",
      owner: "Elvin Q.",
      phone: "+994 50 555 11 22",
      date: "2025-10-01",
      status: "Satışda",
    },
    {
      id: "H-002",
      image: "https://placehold.co/100x70?text=House+2",
      location: "Sumqayıt, 9-cu mikrorayon",
      price: 95000,
      area: 68,
      rooms: 2,
      floor: 2,
      buildingType: "Köhnə tikili",
      owner: "Aysel A.",
      phone: "+994 70 777 33 44",
      date: "2025-09-25",
      status: "Satılıb",
    },
  ];

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({});
  const [editRow, setEditRow] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [newRow, setNewRow] = useState({
    id: "",
    image: "",
    location: "",
    price: 0,
    area: 0,
    rooms: 0,
    floor: 0,
    buildingType: "",
    owner: "",
    phone: "",
    date: "",
    status: "",
  });
  const [openMenu, setOpenMenu] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu) {
        const ref = menuRefs.current[openMenu];
        if (ref && !ref.contains(event.target)) {
          setOpenMenu(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((d) =>
      Object.values(d).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={
              filteredData.length > 0 &&
              filteredData.every((d) => selected[d.id])
            }
            onChange={(e) => {
              if (e.target.checked) {
                const all = {};
                filteredData.forEach((d) => (all[d.id] = true));
                setSelected(all);
              } else setSelected({});
            }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={!!selected[row.original.id]}
            onChange={(e) =>
              setSelected((prev) => ({
                ...prev,
                [row.original.id]: e.target.checked,
              }))
            }
          />
        ),
      },
      {
        accessorKey: "image",
        header: "Şəkil",
        cell: ({ getValue }) => (
          <img
            src={getValue()}
            alt="thumb"
            className="w-20 h-14 object-cover rounded"
          />
        ),
      },
      { accessorKey: "id", header: "ID" },
      { accessorKey: "location", header: "Ünvan" },
      {
        accessorKey: "price",
        header: "Qiymət",
        cell: ({ getValue }) => `${getValue().toLocaleString()} AZN`,
      },
      { accessorKey: "area", header: "Sahə (m²)" },
      { accessorKey: "rooms", header: "Otaq sayı" },
      { accessorKey: "floor", header: "Mərtəbə" },
      { accessorKey: "buildingType", header: "Tikili növü" },
      { accessorKey: "owner", header: "Ev sahibi" },
      { accessorKey: "phone", header: "Telefon" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "date", header: "Tarix" },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div
            className="relative"
            ref={(el) => (menuRefs.current[row.id] = el)}
          >
            <button
              onClick={() =>
                setOpenMenu((prev) => (prev === row.id ? null : row.id))
              }
              className="p-1 hover:bg-gray-100 rounded text-xl cursor-pointer"
            >
              ⋮
            </button>

            {openMenu === row.id && (
              <div className="absolute right-0 top-[-10px] mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-[1000] overflow-hidden">
                <button
                  onClick={() => {
                    setEditRow(row.original);
                    setOpenMenu(null);
                  }}
                  className="flex items-center cursor-pointer gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 012-2z"
                    />
                  </svg>
                  Redaktə et
                </button>

                <button
                  onClick={() => {
                    setDeleteModal(true);
                    setSelected({ [row.original.id]: true });
                    setOpenMenu(null);
                  }}
                  className="flex items-center gap-2 cursor-pointer w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Sil
                </button>
              </div>
            )}
          </div>
        ),
      },
    ],
    [selected, filteredData, openMenu]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEditSave = () => {
    setData((prev) => prev.map((d) => (d.id === editRow.id ? editRow : d)));
    setEditRow(null);
  };

  const handleDeleteSelected = () => {
    setData((prev) => prev.filter((d) => !selected[d.id]));
    setSelected({});
    setDeleteModal(false);
  };

  const handleAddRow = () => {
    const allFilled = Object.values(newRow).every(
      (v) => v !== "" && v !== null && v !== undefined
    );
    if (!allFilled) return;
    setData((prev) => [...prev, newRow]);
    setNewRow({
      id: "",
      image: "",
      location: "",
      price: 0,
      area: 0,
      rooms: 0,
      floor: 0,
      buildingType: "",
      owner: "",
      phone: "",
      date: "",
      status: "",
    });
    setAddModal(false);
  };

  return (
    <div className="p-6">
      {/* Axtarış + Buttonlar */}
      <div className="flex mb-4 flex-wrap justify-between">
        <input
          placeholder="🔍 Axtarış..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded flex-1 max-w-[500px]"
        />
        <div className="flex gap-4">
          <button
            onClick={() => setDeleteModal(true)}
            disabled={Object.keys(selected).length === 0}
            className="px-[14px] py-[12px] bg-primary text-white rounded disabled:opacity-50 cursor-pointer"
          >
            <Image className="object-cover" src={deleteHome} alt="delete" />
          </button>
          <button
            onClick={() => setAddModal(true)}
            className="px-[14px] py-[12px] bg-primary text-white rounded cursor-pointer"
          >
            <Image className="object-cover" src={addHome} alt="add" />
          </button>
        </div>
      </div>

      {/* Cədvəl */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-[1200px] w-full">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header, idx) => (
                  <th
                    key={header.id}
                    className={`
                px-3 py-2 text-left whitespace-nowrap sticky top-0 bg-gray-100 z-10
                ${idx === 0 ? "left-0 z-20" : ""}
                ${idx === hg.headers.length - 1 ? "right-0 z-20" : ""}
              `}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, idx) => (
                  <td
                    key={cell.id}
                    className={`
                px-3 py-2 border-b whitespace-nowrap
                ${idx === 0 ? "sticky left-0 bg-white z-20" : ""}
                ${
                  idx === row.getVisibleCells().length - 1
                    ? "sticky right-0 bg-white z-10"
                    : ""
                }
              `}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-6 py-1 border text-white bg-primary rounded cursor-pointer disabled:opacity-50"
        >
          Əvvəlki
        </button>
        <span>
          Səhifə {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-6 py-1 border bg-primary text-white cursor-pointer rounded disabled:opacity-50"
        >
          Növbəti
        </button>
      </div>

      {/* Redaktə Modal */}
      {editRow && (
        <ModalLayout onClose={() => setEditRow(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Object.keys(editRow)
              .filter((key) => !["id", "image", "date"].includes(key))
              .map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {key[0].toUpperCase() + key.slice(1)}:
                  </label>
                  <input
                    value={editRow[key]}
                    onChange={(e) =>
                      setEditRow({
                        ...editRow,
                        [key]: ["price", "area", "rooms", "floor"].includes(key)
                          ? +e.target.value
                          : e.target.value,
                      })
                    }
                    className="border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 outline-none text-sm transition"
                  />
                </div>
              ))}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setEditRow(null)}
              className="px-4 py-2 text-sm border border-gray-300 cursor-pointer rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Ləğv et
            </button>
            <button
              onClick={handleEditSave}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition"
            >
              Saxla
            </button>
          </div>
        </ModalLayout>
      )}

      {/* Silmə Modal */}
      {deleteModal && (
        <ModalLayout title="Təsdiqlə" onClose={() => setDeleteModal(false)}>
          <p className="text-gray-700 mb-6">Seçilmiş məlumat(lar) silinsin?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModal(false)}
              className="px-4 py-2 text-sm border border-gray-300 cursor-pointer rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Ləğv et
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 text-sm bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700 transition"
            >
              Sil
            </button>
          </div>
        </ModalLayout>
      )}

      {/* Yeni əlavə et Modal */}
      {addModal && (
        <ModalLayout onClose={() => setAddModal(false)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(newRow).map((key) => (
              <label
                key={key}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {key[0].toUpperCase() + key.slice(1)}:
                <input
                  value={newRow[key]}
                  onChange={(e) =>
                    setNewRow({
                      ...newRow,
                      [key]: ["price", "area", "rooms", "floor"].includes(key)
                        ? +e.target.value
                        : e.target.value,
                    })
                  }
                  required
                  className="border w-full mt-1 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 outline-none text-sm transition"
                />
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setAddModal(false)}
              className="px-4 py-2 text-sm border border-gray-300 cursor-pointer rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Ləğv et
            </button>
            <button
              onClick={handleAddRow}
              disabled={
                !Object.values(newRow).every(
                  (v) => v !== "" && v !== null && v !== undefined
                )
              }
              className={`px-4 py-2 text-sm text-white rounded-lg ${
                Object.values(newRow).every(
                  (v) => v !== "" && v !== null && v !== undefined
                )
                  ? "bg-primary hover:bg-primary/90 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              } transition`}
            >
              Əlavə et
            </button>
          </div>
        </ModalLayout>
      )}
    </div>
  );
}

/* 🧩 Reusable Modal Layout Component */
function ModalLayout({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-xl rounded-2xl w-full max-w-[600px] max-h-[85vh] overflow-y-auto px-6 py-4 sm:px-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={onClose}
            className="text-gray-600 text-xl hover:text-gray-700 transition cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
