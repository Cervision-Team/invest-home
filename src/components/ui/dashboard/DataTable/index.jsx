"use client";
import React, { useMemo, useState } from "react";
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
          <div className="relative">
            <button
              onClick={() =>
                setOpenMenu((prev) => (prev === row.id ? null : row.id))
              }
              className="p-1 hover:bg-gray-100 rounded text-xl"
            >
              ⋮
            </button>

            {openMenu === row.id && (
              <div className="absolute right-[-10px] top-[-5px] w-20 bg-white border rounded shadow-md z-[1000]">
                <button
                  onClick={() => {
                    setEditRow(row.original);
                    setOpenMenu(null);
                  }}
                  className="block w-full px-2 text-left hover:bg-gray-100 cursor-pointer"
                >
                  Redaktə
                </button>
                <button
                  onClick={() => {
                    setDeleteModal(true);
                    setSelected({ [row.original.id]: true });
                    setOpenMenu(null);
                  }}
                  className="block w-full px-2 text-left hover:bg-gray-100 text-red-600 cursor-pointer"
                >
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
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left border-b whitespace-nowrap"
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
              <tr key={row.id} className="hover:bg-gray-50 cursor-pointer">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-3 py-2 border-b whitespace-nowrap"
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
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]"
          onClick={() => setEditRow(null)}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-[600px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              Redaktə et: {editRow.id}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(editRow)
                .filter((key) => !["id", "image", "date"].includes(key))
                .map((key) => (
                  <label key={key} className="block text-sm">
                    {key[0].toUpperCase() + key.slice(1)}:
                    <input
                      value={editRow[key]}
                      onChange={(e) =>
                        setEditRow({
                          ...editRow,
                          [key]: ["price", "area", "rooms", "floor"].includes(
                            key
                          )
                            ? +e.target.value
                            : e.target.value,
                        })
                      }
                      className="border w-full px-2 py-1 rounded mt-1"
                    />
                  </label>
                ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditRow(null)}
                className="px-3 py-1 border rounded cursor-pointer"
              >
                Ləğv et
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1 bg-primary text-white rounded cursor-pointer"
              >
                Saxla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Silmə Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div className="bg-white p-4 rounded-lg w-[400px]">
            <p>Silmək istədiyinizə əminsiniz?</p>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-3 py-1 border rounded cursor-pointer"
              >
                Ləğv et
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 bg-primary text-white rounded cursor-pointer"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yeni əlavə et Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000]">
          <div className="bg-white p-6 rounded-lg w-full max-w-[600px] max-h-[80vh] overflow-y-auto relative ">
            <h3 className="text-lg font-semibold mb-4">Yeni ev əlavə et</h3>
            <button
              onClick={() => setAddModal(false)}
              className="px-3 py-1 absolute top-4 right-4 cursor-pointer"
            >
              x
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(newRow).map((key) => (
                <label key={key} className="block text-sm">
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
                    className="border w-full px-2 py-1 rounded mt-1"
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4 cursor-pointer">
              <button
                onClick={handleAddRow}
                disabled={
                  !Object.values(newRow).every(
                    (v) => v !== "" && v !== null && v !== undefined
                  )
                }
                className={`px-3 py-1 text-white rounded ${
                  Object.values(newRow).every(
                    (v) => v !== "" && v !== null && v !== undefined
                  )
                    ? "bg-primary"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Əlavə et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
