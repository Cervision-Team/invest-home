"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import arrowRightWhite from "../../../../../public/icons/arrow-right-white-small.svg";
import arrowLeftWhite from "../../../../../public/icons/arrow-left-white.svg";
import addHome from "../../../../../public/images/profile/add-row.svg";
import deleteHome from "../../../../../public/images/profile/delete-row.svg";
import editIcon from "../../../../../public/icons/profile/edit-icon.svg";
//importlar
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  columnHeaders,
  RealEstateData,
} from "@/components/core/RealEstateData";
import { Button } from "../Buttons/ProfileButtons";

export default function DataTable() {
  const [data, setData] = useState(RealEstateData);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({});
  const [editRow, setEditRow] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ yeni state
  const [successMessage, setSuccessMessage] = useState("");
  const [newRow, setNewRow] = useState(
    Object.fromEntries(columnHeaders.map((col) => [col.key, ""]))
  );
  const [openMenu, setOpenMenu] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu) {
        const ref = menuRefs.current[openMenu];
        if (ref && !ref.contains(event.target)) setOpenMenu(null);
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

  const columns = useMemo(() => {
    const baseCols = columnHeaders.map((col) => ({
      accessorKey: col.key,
      header: col.label,
      cell: ({ getValue }) =>
        col.key === "photo" ? (
          <Image
            src={getValue()}
            alt="photo"
            width={80}
            height={80}
            className="object-cover rounded-[8px]"
          />
        ) : col.key === "price" ? (
          `${getValue()} azn`
        ) : (
          getValue()
        ),
    }));

    return [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            checked={
              filteredData.length > 0 &&
              filteredData.every((d) => selected[d.elan_id])
            }
            onChange={(e) => {
              if (e.target.checked) {
                const all = {};
                filteredData.forEach((d) => (all[d.elan_id] = true));
                setSelected(all);
              } else setSelected({});
            }}
            className="cursor-pointer w-[20px] h-[20px] accent-primary"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={!!selected[row.original.elan_id]}
            onChange={(e) =>
              setSelected((prev) => {
                const updated = {
                  ...prev,
                  [row.original.elan_id]: e.target.checked,
                };
                if (!e.target.checked) delete updated[row.original.elan_id];
                return updated;
              })
            }
            className="cursor-pointer w-[20px] h-[20px] accent-primary"
          />
        ),
      },
      ...baseCols,
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
              <div className="absolute right-0 top-[-10px] mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
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
                    setSelected({ [row.original.elan_id]: true });
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
    ];
  }, [filteredData, selected, openMenu]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  const handleEditSave = () => {
    setData((prev) =>
      prev.map((d) => (d.elan_id === editRow.elan_id ? editRow : d))
    );
    setEditRow(null);
    setSuccessMessage("Dəyişikliklər uğurla yadda saxlanıldı.");
    setShowSuccess(true);
  };

  const handleDeleteSelected = () => {
    setData((prev) => prev.filter((d) => !selected[d.elan_id]));
    setSelected({});
    setDeleteModal(false);
    setSuccessMessage("Məlumat uğurla silindi.");
    setShowSuccess(true);
  };

  const handleAddRow = () => {
    setData((prev) => [...prev, newRow]);
    setNewRow(Object.fromEntries(columnHeaders.map((col) => [col.key, ""])));
    setAddModal(false);
    setSuccessMessage("Yeni məlumat uğurla əlavə olundu.");
    setShowSuccess(true);
  };

  const handleCloseOverlay = () => setShowSuccess(false);
  return (
    <div>
      {/* Search + Buttons */}
      <div className="flex mb-6 flex-wrap justify-between">
        <div className="relative">
          <input
            placeholder="Axtarış"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shadow-md px-5 rounded-[20px] flex-1 min-w-[410px] h-[44px] placeholder:text-black"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            className="absolute top-[30%] right-5"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M13.666 13.667L17.416 17.417"
              stroke="#141B34"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M15.75 8.25C15.75 4.10786 12.3921 0.75 8.25 0.75C4.10786 0.75 0.75 4.10786 0.75 8.25C0.75 12.3921 4.10786 15.75 8.25 15.75C12.3921 15.75 15.75 12.3921 15.75 8.25Z"
              stroke="#141B34"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setDeleteModal(true)}
            disabled={Object.keys(selected).length === 0}
            className={`px-[14px] py-[12px] bg-primary text-white rounded-[8px] ${
              Object.keys(selected).length === 0
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <Image
              src={deleteHome}
              className="w-[20px] h-[20px] p-[2px]"
              alt="delete"
            />
          </button>
          <button
            onClick={() => setAddModal(true)}
            className="px-[14px] py-[12px] bg-primary text-white rounded-[8px] cursor-pointer"
          >
            <Image
              src={addHome}
              alt="add"
              className="w-[18px] h-[20px] py-[2px] px-[3px]"
            />
          </button>
          <Button />
        </div>
      </div>
      <p className="text-[20px] font-[600] pb-[25px]">Bütün elanlar</p>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[1400px] w-full border-separate border-spacing-y-[20px] border-spacing-x-[12px]">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`
                      text-left whitespace-nowrap sticky overflow-visible top-0 z-10 text-[14px] font-[500] align-middle leading-none
                      ${
                        header.id === "select"
                          ? "left-0 z-20 bg-white p-0"
                          : "p-4"
                      }
                      ${
                        header.id === "actions"
                          ? "bg-white right-0 bg-white p-0"
                          : "p-4"
                      }
                    `}
                  >
                    <div className="flex gap-[8px] items-center">
                      <p>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        className={`
                      ${header.id === "select" ? "hidden" : ""}
                      ${header.id === "actions" ? "hidden" : ""}
                    `}
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M3.75 5.83301H16.25M5.83333 9.99967H14.1667M8.33333 14.1663H11.6667"
                          stroke="#1B1F27"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.75 5.83301H16.25M5.83333 9.99967H14.1667M8.33333 14.1663H11.6667"
                          stroke="black"
                          strokeOpacity="0.2"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.75 5.83301H16.25M5.83333 9.99967H14.1667M8.33333 14.1663H11.6667"
                          stroke="black"
                          strokeOpacity="0.2"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.75 5.83301H16.25M5.83333 9.99967H14.1667M8.33333 14.1663H11.6667"
                          stroke="black"
                          strokeOpacity="0.2"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.75 5.83301H16.25M5.83333 9.99967H14.1667M8.33333 14.1663H11.6667"
                          stroke="black"
                          strokeOpacity="0.2"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`
                      whitespace-nowrap sticky text-[14px] font-[500] align-middle leading-none
                      ${
                        cell.column.id === "select"
                          ? "left-0 bg-white z-10"
                          : ""
                      }
                      ${
                        cell.column.id === "actions"
                          ? "right-0 bg-white z-10"
                          : ""
                      }
                      ${cell.column.id === "photo" ? "p-0" : "p-4"}
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
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] bg-[var(--primary-color)] text-white hover:opacity-90 transition-all duration-200"
        >
          <Image src={arrowLeftWhite} alt="Arrow Left White" />
          <span className="font-[500] text-[16px]">Geriyə Qayıt</span>
        </button>
        <span>
          Səhifə {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] bg-[var(--primary-color)] text-white hover:opacity-90 transition-all duration-200"

        >
          <span className="font-[500] text-[16px]">Növbəti</span>
          <Image src={arrowRightWhite} alt="Arrow Right White" />
        </button>
      </div>

      {/* Edit Modal */}
      {editRow && (
        <ModalLayout onClose={() => setEditRow(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {columnHeaders.map((col) => (
              <div key={col.key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {col.label}:
                </label>
                <input
                  value={editRow[col.key]}
                  disabled={["photo", "elan_id", "application_date"].includes(
                    col.key
                  )}
                  onChange={(e) =>
                    setEditRow({
                      ...editRow,
                      [col.key]: ["price", "area", "room", "floor"].includes(
                        col.key
                      )
                        ? +e.target.value
                        : e.target.value,
                    })
                  }
                  className="border border-gray-300 focus:border-primary rounded-[8px] focus:ring-1 focus:ring-primary px-3 py-2 outline-none text-sm transition"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setEditRow(null)}
              className="px-6 py-3 text-sm border border-gray-300 cursor-pointer rounded-[8px] text-gray-700 hover:bg-gray-50 hover:text-red-700 hover:border-red-500 transition"
            >
              Ləğv et
            </button>
            <button
              onClick={handleEditSave}
              className="px-6 py-3 text-sm bg-primary text-white rounded-[8px] cursor-pointer hover:bg-primary/90 transition"
            >
              Yadda saxla
            </button>
          </div>
        </ModalLayout>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <ModalLayout title="Təsdiqlə" onClose={() => setDeleteModal(false)}>
          <p className="text-gray-700 text-center mb-6">
            Seçilmiş məlumat(lar)ı silmək istədiyinizə əminsiniz?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModal(false)}
              className="px-6 py-3 text-sm border border-gray-300 cursor-pointer rounded-[8px] text-gray-700 hover:bg-gray-50 hover:text-red-700 hover:border-red-500 transition"
            >
              Ləğv et
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-6 py-3 text-sm bg-red-600 cursor-pointer text-white rounded-[8px] hover:bg-red-700 transition"
            >
              Sil
            </button>
          </div>
        </ModalLayout>
      )}

      {/* Add Modal */}
      {addModal && (
        <ModalLayout onClose={() => setAddModal(false)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {columnHeaders.map((col) => (
              <label
                key={col.key}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {col.label}:
                <input
                  value={newRow[col.key]}
                  onChange={(e) =>
                    setNewRow({
                      ...newRow,
                      [col.key]: ["price", "area", "room", "floor"].includes(
                        col.key
                      )
                        ? +e.target.value
                        : e.target.value,
                    })
                  }
                  required
                  className="border rounded-[8px] w-full mt-1 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-2 outline-none text-sm transition"
                />
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setAddModal(false)}
              className="px-6 py-3 text-sm border border-gray-300 cursor-pointer rounded-[8px] text-gray-700 hover:bg-gray-50 hover:text-red-700 hover:border-red-500 transition"
            >
              Ləğv et
            </button>
            <button
              onClick={handleAddRow}
              disabled={
                !Object.values(newRow).every((v) => v !== "" && v !== null)
              }
              className={`px-6 py-3 text-sm text-white rounded-[8px] ${
                Object.values(newRow).every((v) => v !== "" && v !== null)
                  ? "bg-primary hover:bg-primary/90 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              } transition`}
            >
              Əlavə et
            </button>
          </div>
        </ModalLayout>
      )}
      {showSuccess && (
        <div
          id="overlay"
          onClick={handleCloseOverlay}
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-999 "
        >
          <div className="bg-white rounded-2xl shadow-xl px-[51px] pt-10 pb-8 h-[332px] w-[414px] flex flex-col items-center gap-5">
            <Image src={editIcon} alt="edit" />
            <p className="text-center font-medium text-2xl">{successMessage}</p>
            <button
              className="py-[18px] px-[59px] text-white bg-[#02836F] rounded-lg cursor-pointer"
              onClick={handleCloseOverlay}
            >
              Geri qayıt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Layout
function ModalLayout({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-xl rounded-2xl w-full max-w-[600px] max-h-[85vh] overflow-y-auto px-6 py-5 sm:px-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-700 transition cursor-pointer"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hover:text-red-700"
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
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
