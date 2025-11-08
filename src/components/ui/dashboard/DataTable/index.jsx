"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import addHome from "../../../../../public/images/profile/add-row.svg";
import deleteHome from "../../../../../public/images/profile/delete-row.svg";
import editIcon from "../../../../../public/icons/profile/edit-icon.svg";
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
import Search from "../Search";

export default function DataTable() {
  const [data, setData] = useState(RealEstateData);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({});
  const [editRow, setEditRow] = useState(null);
  const [filterColumn, setFilterColumn] = useState(null);
  const [filters, setFilters] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
    let result = data;

    // Axtarış filtri
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    // Sütun əsaslı filtr
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((d) => {
          const cellValue = String(d[key]).toLowerCase();

          // Əgər qiymət aralığı seçilibsə (məsələn: "< 100000")
          if (key === "price") {
            const price = Number(d[key]);
            if (value.includes("<")) return price < 100000;
            if (value.includes(">")) return price > 200000;
            if (value.includes("-")) {
              const [min, max] = value.split("-").map((v) => Number(v.trim()));
              return price >= min && price <= max;
            }
          }

          return cellValue.includes(String(value).toLowerCase());
        });
      }
    });

    return result;
  }, [data, filters, search]);

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
        header: () => {
          const allSelected =
            data.length > 0 && Object.keys(selected).length === data.length;

          return (
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    const all = Object.fromEntries(
                      data.map((d) => [d.elan_id, true])
                    );
                    setSelected(all);
                  } else {
                    setSelected({});
                  }
                }}
                className="hidden peer"
              />
              <div
                className="p-[5px] border-1 border-gray-400 rounded-[4px] flex items-center justify-center
             peer-checked:bg-primary peer-checked:border-primary transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="11"
                  viewBox="0 0 14 11"
                  fill="none"
                  className="peer-checked:opacity-100 transition-opacity"
                >
                  <path
                    d="M4.31002 8.46835L1.41835 5.57668C1.26254 5.42087 1.05121 5.33333 0.83085 5.33333C0.610495 5.33333 0.399165 5.42087 0.24335 5.57668C0.0875358 5.7325 0 5.94383 0 6.16418C0 6.27329 0.0214908 6.38133 0.0632449 6.48214C0.104999 6.58294 0.166199 6.67453 0.24335 6.75168L3.72668 10.235C4.05168 10.56 4.57668 10.56 4.90168 10.235L13.7183 1.41835C13.8742 1.26254 13.9617 1.05121 13.9617 0.830851C13.9617 0.610495 13.8742 0.399165 13.7183 0.243351C13.5625 0.087536 13.3512 0 13.1308 0C12.9105 0 12.6992 0.087536 12.5433 0.243351L4.31002 8.46835Z"
                    fill="#FAFAFA"
                  />
                </svg>
              </div>
            </label>
          );
        },
        cell: ({ row }) => (
          <label className="flex items-center cursor-pointer">
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
              className="hidden peer"
            />
            <div
              className="p-[5px] border-1 border-gray-400 rounded-[4px] flex items-center justify-center
           peer-checked:bg-primary peer-checked:border-primary transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="11"
                viewBox="0 0 14 11"
                fill="none"
                className="peer-checked:opacity-100 transition-opacity"
              >
                <path
                  d="M4.31002 8.46835L1.41835 5.57668C1.26254 5.42087 1.05121 5.33333 0.83085 5.33333C0.610495 5.33333 0.399165 5.42087 0.24335 5.57668C0.0875358 5.7325 0 5.94383 0 6.16418C0 6.27329 0.0214908 6.38133 0.0632449 6.48214C0.104999 6.58294 0.166199 6.67453 0.24335 6.75168L3.72668 10.235C4.05168 10.56 4.57668 10.56 4.90168 10.235L13.7183 1.41835C13.8742 1.26254 13.9617 1.05121 13.9617 0.830851C13.9617 0.610495 13.8742 0.399165 13.7183 0.243351C13.5625 0.087536 13.3512 0 13.1308 0C12.9105 0 12.6992 0.087536 12.5433 0.243351L4.31002 8.46835Z"
                  fill="#FAFAFA"
                />
              </svg>
            </div>
          </label>
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
  const filterDropdowns = {
    price: ({ onSelect }) => (
      <div className="flex flex-col gap-2">
        {["< 100000", "100000 - 200000", "> 200000"].map((label) => (
          <div
            key={label}
            className="h-[40px] flex justify-center items-center border border-[#E9E9E9] rounded-[8px] hover:bg-primary hover:text-white cursor-pointer"
            onClick={() => onSelect(label)}
          >
            {label}
          </div>
        ))}
      </div>
    ),
    room: ({ onSelect }) => (
      <div className="flex flex-col gap-3">
        <p className="text-center">Otaq sayı</p>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <div
              key={r}
              className="h-[40px] flex justify-center items-center border border-[#E9E9E9] rounded-[8px] hover:bg-primary hover:text-white cursor-pointer"
              onClick={() => onSelect(r)}
            >
              {r}
            </div>
          ))}
        </div>
      </div>
    ),
    city: ({ onSelect }) => (
      <div className="flex flex-col gap-2">
        {["Bakı", "Gəncə", "Sumqayıt"].map((c) => (
          <div
            key={c}
            className="h-[40px] flex justify-center items-center border border-[#E9E9E9] rounded-[8px] hover:bg-primary hover:text-white cursor-pointer"
            onClick={() => onSelect(c)}
          >
            {c}
          </div>
        ))}
      </div>
    ),
  };
  const handleHeaderFilterClick = (colKey) => {
    setFilterColumn((prev) => (prev === colKey ? null : colKey));
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
        <div className="min-w-[410px]">

          <Search search={search} setSearch={setSearch} />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setDeleteModal(true)}
            disabled={Object.keys(selected).length === 0}
            className={`px-[14px] py-[12px] bg-primary text-white rounded-[8px] ${Object.keys(selected).length === 0
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
      <p className="text-[20px] font-[600] mb-[40px]">Bütün elanlar</p>
      {/* Table */}
      <div className="overflow-x-auto">
        <div
          className="h-[450px] overflow-y-auto
    scrollbar-thin
    scrollbar-thumb-primary
    scrollbar-track-gray-100
    hover:scrollbar-thumb-primary"
        >
          <table className="w-full border-separate border-spacing-y-[20px] border-spacing-x-[12px]">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`
                      text-left whitespace-nowrap sticky overflow-visible top-0 z-20 text-[14px] font-[500] align-middle leading-none bg-white
                      ${header.id === "select"
                          ? "left-0 z-20 bg-white p-0"
                          : "p-4"
                        }
                      ${header.id === "actions"
                          ? "bg-white right-0 bg-white p-0 z-20"
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
                          onClick={() =>
                            handleHeaderFilterClick(header.column.id)
                          }
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
                        {filterColumn === header.column.id &&
                          filterDropdowns[header.column.id] && (
                            <div className="absolute top-6 right-0 bg-white shadow-lg border border-gray-200 rounded-md p-3 z-50 w-48">
                              {filterDropdowns[header.column.id]({
                                onSelect: (value) => {
                                  setFilters((prev) => ({
                                    ...prev,
                                    [header.column.id]: value,
                                  }));
                                  setFilterColumn(null);
                                },
                              })}
                            </div>
                          )}
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
                      ${cell.column.id === "select"
                          ? "left-0 bg-white z-10"
                          : ""
                        }
                      ${cell.column.id === "actions"
                          ? "right-0 bg-white z-10"
                          : ""
                        }
                      ${cell.column.id === "photo" ? "p-0" : "p-4"}
                    `}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              className={`px-6 py-3 text-sm text-white rounded-[8px] ${Object.values(newRow).every((v) => v !== "" && v !== null)
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
