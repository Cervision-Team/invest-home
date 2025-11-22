"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import addHome from "../../../../../public/images/profile/add-row.svg";
import deleteHome from "../../../../../public/images/profile/delete-row.svg";
import editIcon from "../../../../../public/icons/profile/edit-icon.svg";
import approved from "../../../../../public/icons/profile/approved.svg";
import editing from "../../../../../public/icons/profile/editing.svg";
import rejected from "../../../../../public/icons/profile/rejected.svg";
import remove from "../../../../../public/icons/profile/remove.svg";
import share from "../../../../../public/icons/profile/share-outline.svg";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  columnHeaders,
  RealEstateData,
  azeCity,
  azeSettlement,
  azeDistrict,
  azeMetro,
} from "@/components/core/RealEstateData";
import { Button } from "../Buttons/ProfileButtons";
import Search from "../Search";
import EditPropertyModal from "../EditPropertyModal";
import AddPropertyModal from "../AddPropertyModal";

export default function DataTable() {
  const [data, setData] = useState(RealEstateData);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({});
  const [editRow, setEditRow] = useState(null);
  const [filterColumn, setFilterColumn] = useState(null);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [newRow, setNewRow] = useState(
    Object.fromEntries(columnHeaders.map((col) => [col.key, ""]))
  );
  const [openMenu, setOpenMenu] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRefs = useRef({});

  // Click outside menu & filter close
  const filterRefs = useRef({});

  const filterIconRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      // --- Row ACTION MENU Outside Click ---
      if (openMenu) {
        const ref = menuRefs.current[openMenu];
        if (ref && !ref.contains(event.target)) {
          setOpenMenu(null);
        }
      }

      // --- FILTER DROPDOWN Outside Click ---
      if (filterColumn) {
        const dropdownRef = filterRefs.current[filterColumn];
        const iconRef = filterIconRefs.current[filterColumn];

        const clickedInsideDropdown = dropdownRef?.contains(event.target);
        const clickedOnIcon = iconRef?.contains(event.target);

        if (!clickedInsideDropdown && !clickedOnIcon) {
          setFilterColumn(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu, filterColumn]);

  // Filtering
  const filteredData = useMemo(() => {
    let result = data;

    // Search filter
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );
    }
    const numericColumns = [
      "price",
      "area",
      "floor",
      "totalFloors",
      "land_area",
    ];

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      result = result.filter((row) => {
        const cellValue = row[key];

        if (value.min !== undefined || value.max !== undefined) {
          if (!numericColumns.includes(key)) return true;

          let num = Number(String(cellValue).replace(/[^0-9.]/g, ""));

          const min = value.min ?? -Infinity;
          const max = value.max ?? Infinity;

          return num >= min && num <= max;
        }

        // ✅ FLOOR SPECIAL FILTER
        if (key === "floor") {
          const floorVal = row[key];

          // ✅ CHECKBOX FILTER (birdən çox seçim ola bilər)
          if (Array.isArray(value.radio) && value.radio.length > 0) {
            // 1-ci mərtəbə olmasın
            if (
              value.radio.includes("1-ci mərtəbə olmasın") &&
              floorVal === 1
            ) {
              return false;
            }

            // Sonuncu mərtəbə olmasın
            if (
              value.radio.includes("Sonuncu mərtəbə olmasın") &&
              floorVal === row.totalFloors
            ) {
              return false;
            }
          }

          // ✅ RANGE FILTER
          const min = value.min ?? -Infinity;
          const max = value.max ?? Infinity;

          if (floorVal < min || floorVal > max) {
            return false;
          }

          return true;
        }

        // RADIO və DROPDOWN FILTER
        if (typeof value === "string") {
          if (numericColumns.includes(key)) return true;
          return String(cellValue).toLowerCase().includes(value.toLowerCase());
        }

        return true;
      });
    });

    return result;
  }, [data, filters, search]);

  // Columns
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
            className="object-cover rounded-[8px] mx-auto"
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
                      data.map((d) => [d.announcementId, true])
                    );
                    setSelected(all);
                  } else {
                    setSelected({});
                  }
                }}
                className="hidden peer"
              />
              <div
                className="p-[5px] border border-gray-400 rounded-[4px] flex items-center justify-center
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
              checked={!!selected[row.original.announcementId]}
              onChange={(e) =>
                setSelected((prev) => {
                  const updated = {
                    ...prev,
                    [row.original.announcementId]: e.target.checked,
                  };
                  if (!e.target.checked) delete updated[row.original.announcementId];
                  return updated;
                })
              }
              className="hidden peer"
            />
            <div
              className="p-[5px] border border-gray-400 rounded-[4px] flex items-center justify-center
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
              className={`p-1 rounded text-xl cursor-pointer ${
                openMenu === row.id ? "bg-gray-300" : "hover:bg-gray-200"
              }`}
            >
              ⋮
            </button>
            {openMenu === row.id && (
              <div className="absolute right-8 top-[-10px] pb-6 pt-8 p w-42 bg-white border border-gray-200 rounded-[12px] shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] z-[1000] overflow-hidden">
                <button
                  onClick={() => setOpenMenu(null)}
                  className="absolute right-3 top-3 text-gray-500 font-[600] text-[18px] hover:text-red-600 cursor-pointer"
                >
                  ✕
                </button>
                <button
                  onClick={() => {
                    setEditRow(row.original);
                    setOpenMenu(null);
                  }}
                  className="flex items-center cursor-pointer gap-3 w-full px-5 py-2 text-sm hover:bg-blue-50 text-[#1B1F27] transition-colors duration-150"
                >
                  <Image
                    src={editing}
                    className="py-[2px] px-[1.999px]"
                    alt="edit"
                  />
                  <p>Redaktə et</p>
                </button>
                <button className="flex items-center gap-3 cursor-pointer w-full px-5 py-2 text-sm hover:bg-blue-50 text-[#1B1F27] transition-colors duration-150">
                  <Image
                    src={approved}
                    className="py-[2px] px-[2.5px]"
                    alt="approve"
                  />
                  <p>Təsdiqlə</p>
                </button>
                <button className="flex items-center gap-3 cursor-pointer w-full px-5 py-2 text-sm hover:bg-blue-50 text-[#1B1F27] transition-colors duration-150">
                  <Image src={rejected} className="p-[3px]" alt="reject" />
                  <p>Rədd et</p>
                </button>
                <button
                  onClick={() => {
                    setDeleteModal(true);
                    setSelected({ [row.original.announcementId]: true });
                    setOpenMenu(null);
                  }}
                  className="flex items-center gap-3 cursor-pointer w-full px-5 py-2 text-sm text-[#E9222C] hover:bg-red-50 transition-colors duration-150"
                >
                  <Image src={remove} className="p-[2px]" alt="remove" />
                  <p>Elanı sil</p>
                </button>
                <button className="flex items-center gap-3 cursor-pointer w-full px-5 py-2 text-sm hover:bg-blue-50 text-[#1B1F27] transition-colors duration-150">
                  <Image src={share} alt="share" />
                  <p>Paylaş</p>
                </button>
              </div>
            )}
          </div>
        ),
      },
    ];
  }, [data, selected, openMenu]);

  //Announcement Type Filter Dropdown
  const AnnouncementTypeFilterDropdown = ({
    options,
    onSelect,
    onClose,
    title,
  }) => {
    const [hovered, setHovered] = useState(null);

    return (
      <div className="relative flex flex-col w-[400px]">
        <div className="flex justify-between items-center mx-5 mt-5">
          {title && <p>{title}</p>}
          <button
            className="text-gray-500 hover:text-red-600 font-[600] text-[18px] cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <p className="w-full h-[1px] mt-2 bg-[rgba(200,199,199,0.32)]"></p>
        <div className="p-5 grid grid-cols-2 gap-4">
          {options.map((opt) => (
            <div
              key={opt.label}
              onClick={() => onSelect(opt.value)}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              className="py-[19px] px-[20px] flex flex-row items-center justify-center gap-2 overflow-hidden border border-[#E9E9E9] rounded-[8px] bg-[#FAFAFA] hover:bg-primary hover:text-white cursor-pointer transition"
            >
              <img
                src={hovered === opt.value ? opt.hoverIcon : opt.icon}
                alt={opt.label}
                className="w-[24px] h-[24px] transition-all duration-200"
              />
              <p>{opt.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  //Mx and min dropdown
  const MaxAndMinDropdown = ({ columnKey, onSelect, onClose, selectedValue }) => {
    const [range, setRange] = useState({ min: "", max: "" });
    useEffect(() => {
      setRange({
        min: selectedValue?.min ?? "",
        max: selectedValue?.max ?? "",
      });
    }, [selectedValue]); 

    const getLabel = (type) => {
      if (columnKey === "price")
        return type === "min" ? "Minimum qiymət" : "Maksimum qiymət";

      if (columnKey === "area")
        return type === "min" ? "Minimum sahə" : "Maksimum sahə";

      if (columnKey === "land_area")
        return type === "min"
          ? "Minimum torpaq sahəsi"
          : "Maksimum torpaq sahəsi";

      if (columnKey === "totalFloors")
        return type === "min"
          ? "Minimum ümumi mərtəbə"
          : "Maksimum ümumi mərtəbə";
    };

    const getUnit = () => {
      if (columnKey === "price") return "azn";
      if (columnKey === "area") return "m²";
      if (columnKey === "land_area") return "ha";
      return null;
    };

    const unit = getUnit();

    // ✅ TƏTBİQ ET → filteri ötür, dropdown bağlanır, input sıfırlanır
    const handleApply = () => {
      onSelect({
        min: range.min !== "" ? Number(range.min) : undefined,
        max: range.max !== "" ? Number(range.max) : undefined,
      });

      // ✅ UI RESET
      setRange({ min: "", max: "" });
      onClose();
    };

    // ✅ TƏMİZLƏ → UI + FILTER sıfırlanır
    const handleClear = () => {
      setRange({ min: "", max: "" });
    };

    return (
      <div
        className="relative flex flex-col gap-3 px-5 pb-5 pt-10 w-[238px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-5 top-5 text-gray-500 hover:text-red-600 font-[600] text-[18px] cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        {/* MIN INPUT */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            {getLabel("min")}
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              value={range.min}
              onChange={(e) =>
                setRange((prev) => ({ ...prev, min: e.target.value }))
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-[8px] focus:outline-none focus:border-primary input-no-arrows"
            />
            {unit && (
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                {unit}
              </span>
            )}
          </div>
        </div>

        {/* MAX INPUT */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            {getLabel("max")}
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="∞"
              value={range.max}
              onChange={(e) =>
                setRange((prev) => ({ ...prev, max: e.target.value }))
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-[8px] focus:outline-none focus:border-primary input-no-arrows"
            />
            {unit && (
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-[8px] hover:bg-gray-50 cursor-pointer"
            onClick={handleClear}
          >
            Təmizlə
          </button>

          <button
            className="flex-1 px-3 py-2 bg-primary text-white rounded-[8px] hover:bg-primary/90 cursor-pointer"
            onClick={handleApply}
          >
            Tətbiq et
          </button>
        </div>
      </div>
    );
  };

  //Prototype Filter Dropdown
  const PropertypeFilterDropdown = ({
    groups,
    columnKey,
    filters,
    setFilters,
    onClose,
    title,
  }) => {
    const selectedValue = filters[columnKey] || "";

    const handleSelect = (value) => {
      setFilters((prev) => ({
        ...prev,
        [columnKey]: value,
      }));
      onClose();
    };

    return (
      <div className="flex flex-col w-[238px] pb-5">
        {/* Header */}
        <div className="flex justify-between items-center mx-5 mt-5">
          {title && <p className="font-medium">{title}</p>}
          <button
            className="text-gray-500 hover:text-red-600 font-[600] text-[18px] cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="w-full h-[1px] my-2 bg-[rgba(200,199,199,0.32)]"></div>

        {(groups || []).map((group, i) => (
          <div key={group.label || i} className="mx-3">
            {/* Group Label */}
            {group.label && (
              <p className="text-sm mb-1 ml-3 font-medium">{group.label}</p>
            )}

            {/* Options */}
            <ul className={group.label ? "pl-8 list-disc" : "pl-0"}>
              {group.options.map((opt) => (
                <li key={opt.value}>
                  <label className="flex items-center justify-between cursor-pointer h-[36px] px-3 group rounded-[10px] hover:bg-[#E0F5F1]">
                    <span>{opt.label}</span>
                    <input
                      type="radio"
                      name={title}
                      value={opt.value}
                      checked={selectedValue === opt.value}
                      onChange={() => handleSelect(opt.value)}
                      className="hidden peer"
                    />
                    <span className="w-5 h-5 flex items-center justify-center rounded-full border-[0.6px] border-[#E1E6EF] group-hover:border-primary transition-all">
                      <span
                        className={`w-3 h-3 rounded-full transition-all ${
                          selectedValue === opt.value
                            ? "bg-primary"
                            : "bg-transparent group-hover:bg-primary"
                        }`}
                      ></span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  // Common Filter Dropdown
  const CommonFilterDropdown = ({ options, onSelect, onClose, title }) => (
    <div className="flex flex-col py-5 w-[360px]">
      <div className="flex justify-between items-center mx-5">
        {title && <p>{title}</p>}
        <button
          className=" text-gray-500 hover:text-red-600 font-[600] text-[18px] cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <p className="w-full h-[1px] mt-2 bg-[rgba(200,199,199,0.32)]"></p>
      <div className="pt-3 flex flex-col gap-3 mx-4">
        {options.map((opt) => (
          <div
            key={opt}
            className="py-[10px] flex justify-center items-center border border-[#E9E9E9] rounded-[10px] hover:bg-primary hover:text-white cursor-pointer"
            onClick={() => onSelect(opt)}
          >
            {opt}
          </div>
        ))}
      </div>
    </div>
  );

  // Radio filter dropdown
  const RadioFilterDropdown = ({
    options,
    selectedValue,
    onSelect,
    onClose,
    title,
    showSearch = false,
  }) => {
    const [localSearch, setLocalSearch] = useState("");

    const filteredOptions = options.filter((opt) =>
      opt.value.toLowerCase().includes(localSearch.toLowerCase())
    );

    return (
      <div
        className="relative flex flex-col w-[238px] py-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-between items-center mx-5">
          {title && <p className="text-center font-medium">{title}</p>}
          <button
            className="text-gray-500 hover:text-red-600 font-[600] text-[18px] cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="w-full h-[1px] bg-gray-200 my-2"></div>

        {/* Local Search Input (yalnız showSearch=true olduqda) */}
        {showSearch && (
          <div className="mx-4 mb-3">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Axtar"
              className="w-[204px] px-5 h-[38px] shadow-[0_4px_100px_0_rgba(0,0,0,0.10)] bg-[FAFAFA] border border-[#9CA3AF] border-[0.2px] rounded-[28px] focus:outline-none focus:border-primary text-sm"
            />
          </div>
        )}

        {/* Filtered Options */}
        <div className="flex flex-col max-h-[170px] overflow-y-auto scrollbar-custom">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center justify-between cursor-pointer mx-3 px-3 py-2 rounded-[10px] group hover:bg-[#E0F5F1]"
              >
                <span>{opt.label}</span>
                <input
                  type="radio"
                  name={title}
                  value={opt.value}
                  checked={selectedValue === opt.value}
                  onChange={() => onSelect(opt)}
                  className="hidden peer"
                />
                <span className="w-5 h-5 flex items-center justify-center rounded-full border border-[#E1E6EF] group-hover:border-primary">
                  <span
                    className={`w-3 h-3 rounded-full transition-all ${
                      selectedValue === opt
                        ? "bg-primary"
                        : "bg-transparent group-hover:bg-primary"
                    }`}
                  />
                </span>
              </label>
            ))
          ) : (
            <p className="text-center text-gray-400 py-2">Seçim tapılmadı</p>
          )}
        </div>
      </div>
    );
  };

  // Floor Mx and min dropdown
  const FloorDropdown = ({ onSelect, onClose, title, selectedValue }) => {
    const [range, setRange] = useState({ min: "", max: "" });
    const [selectedRadios, setSelectedRadios] = useState([]);

    const radioOptions = ["1-ci mərtəbə olmasın", "Sonuncu mərtəbə olmasın"];

    useEffect(() => {
      setRange({
        min: "",
        max: "",
      });
      setSelectedRadios([]);
    }, [selectedValue]);

    const toggleRadio = (opt) => {
      setSelectedRadios((prev) =>
        prev.includes(opt) ? prev.filter((r) => r !== opt) : [...prev, opt]
      );
    };

    // ✅ TƏTBİQ ET
    const handleApply = () => {
      onSelect({
        radio: selectedRadios,
        min: range.min !== "" ? Number(range.min) : undefined,
        max: range.max !== "" ? Number(range.max) : undefined,
      });

      // ✅ UI reset
      setRange({ min: "", max: "" });
      setSelectedRadios([]);

      onClose();
    };

    // ✅ TƏMİZLƏ
    const handleClear = () => {
      setRange({ min: "", max: "" });
      setSelectedRadios([]);
    };

    return (
      <div
        className="flex flex-col py-5 w-[400px] bg-white rounded-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mx-5">
          {title && <p className="text-center font-medium">{title}</p>}
          <button
            className="text-gray-500 hover:text-red-600 font-[600] text-[18px] cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="w-full h-[1px] bg-gray-200 my-2"></div>

        {/* ✅ RADIO OPTIONS */}
        {radioOptions.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-4 group cursor-pointer mx-5 px-3 py-2 rounded-[10px]

            ${
              selectedRadios.includes(opt)
                ? "bg-[#E0F5F1]"
                : "hover:bg-[#E0F5F1]"
            }
          `}
          >
            <input
              type="checkbox"
              name={title}
              value={opt}
              checked={selectedRadios.includes(opt)}
              onChange={() => toggleRadio(opt)}
              className="hidden"
            />

            <span className="w-5 h-5 flex items-center justify-center rounded-full border group-hover:border-primary border-[#E1E6EF]">
              <span
                className={`w-3 h-3 rounded-full transition-all ${
                  selectedRadios.includes(opt)
                    ? "bg-primary"
                    : "group-hover:bg-primary"
                }`}
              />
            </span>
            <span>{opt}</span>
          </label>
        ))}

        {/* ✅ RANGE INPUTS */}
        <div className="flex gap-[37px] mx-5 px-5 my-3 py-[11px] rounded-[20px] border-[0.5px] border-[rgba(2,131,111,0.2)] shadow-[0_4px_100px_0_rgba(0,0,0,0.10)]">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min."
              value={range.min}
              onChange={(e) => setRange((p) => ({ ...p, min: e.target.value }))}
              className="w-full px-3 py-2 bg-[rgba(156,163,175,0.10)] rounded-[20px] focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex-1">
            <input
              type="number"
              placeholder="Maks."
              value={range.max}
              onChange={(e) => setRange((p) => ({ ...p, max: e.target.value }))}
              className="w-full px-3 py-2 rounded-[20px] bg-[rgba(156,163,175,0.10)] focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2 mx-5">
          <button
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={handleClear}
          >
            Təmizlə
          </button>

          <button
            className="flex-1 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer"
            onClick={handleApply}
          >
            Tətbiq et
          </button>
        </div>
      </div>
    );
  };

  const filterDropdowns = {
    city: ({ onSelect, onClose }) => (
      <RadioFilterDropdown
        options={azeCity}
        onSelect={onSelect}
        onClose={onClose}
        title="Şəhər"
        showSearch={true}
      />
    ),
    room: ({ onSelect, onClose }) => (
      <CommonFilterDropdown
        options={[1, 2, 3, 4, 5, "6+"]}
        onSelect={onSelect}
        onClose={onClose}
        title="Otaq sayı"
      />
    ),
    settlement: ({ onSelect, onClose }) => (
      <RadioFilterDropdown
        options={azeSettlement}
        onSelect={onSelect}
        onClose={onClose}
        title="Qəsəbə"
        showSearch={true}
      />
    ),
    district: ({ onSelect, onClose }) => (
      <RadioFilterDropdown
        options={azeDistrict}
        onSelect={onSelect}
        onClose={onClose}
        title="Rayon"
        showSearch={true}
      />
    ),
    metro: ({ onSelect, onClose }) => (
      <RadioFilterDropdown
        options={azeMetro}
        onSelect={onSelect}
        onClose={onClose}
        title="Metro"
        showSearch={true}
      />
    ),
    mortgage: ({ onSelect, onClose }) => (
      <RadioFilterDropdown
        options={[
          { value: "Var", label: "Var" },
          { value: "Yoxdur", label: "Yoxdur" }
        ]}        selectedValue={filters["mortgage"]}
        onSelect={(value) => {
          onSelect(value);
          onClose();
        }}
        onClose={onClose}
        title="İpoteka"
      />
    ),
    exit: ({ onSelect, onClose }) => (
      <RadioFilterDropdown
        options={[
          { value: "Var", label: "Var" },
          { value: "Yoxdur", label: "Yoxdur" }
        ]}
        selectedValue={filters["exit"]}
        onSelect={(value) => {
          onSelect(value);
          onClose();
        }}
        onClose={onClose}
        title="Çıxarış"
      />
    ),
    repair_type: ({ onSelect, onClose }) => (
      <RadioFilterDropdown
      options={[
  { value: "Əla", label: "Əla" },
  { value: "Orta", label: "Orta" },
  { value: "Zəif", label: "Zəif" }
]}
        selectedValue={filters["repair_type"]}
        onSelect={(value) => {
          onSelect(value);
          onClose();
        }}
        onClose={onClose}
        title="Təmir növü"
      />
    ),
    announcement_type: ({ onSelect, onClose }) => (
      <AnnouncementTypeFilterDropdown
        title="Elan növü"
        onSelect={(value) => {
          setFilters((prev) => ({ ...prev, announcement_type: value }));
          onClose();
        }}
        onClose={onClose}
        options={[
          {
            label: "Satıram",
            value: "Satıram",
            icon: "/icons/selling-black.svg",
            hoverIcon: "/icons/selling-white.svg",
          },
          {
            label: "Kirayə axtarıram",
            value: "Kirayə axtarıram",
            icon: "/icons/searching-for-rent-black.svg",
            hoverIcon: "/icons/searching-for-rent-white.svg",
          },
          {
            label: "Alıram",
            value: "Alıram",
            icon: "/icons/buying-black.svg",
            hoverIcon: "/icons/buying-white.svg",
          },
          {
            label: "Kirayə verirəm",
            value: "Kirayə verirəm",
            icon: "/icons/renting-black.svg",
            hoverIcon: "/icons/renting-white.svg",
          },
        ]}
      />
    ),

    price: ({ onSelect, onClose }) => (
      <MaxAndMinDropdown
        columnKey="price"
        onClose={onClose}
        onSelect={onSelect}
      />
    ),
    area: ({ onSelect, onClose }) => (
      <MaxAndMinDropdown
        columnKey="area"
        onClose={onClose}
        onSelect={onSelect}
      />
    ),
    floor: ({ onSelect, onClose }) => (
      <FloorDropdown
        columnKey="floor"
        onClose={onClose}
        onSelect={onSelect}
        title="Mərtəbə"
        selectedValue={filters["floor"]}
      />
    ),
    totalFloors: ({ onSelect, onClose }) => (
      <MaxAndMinDropdown
        columnKey="totalFloors"
        onClose={onClose}
        onSelect={onSelect}
        title="Ümumi mərtəbə"
      />
    ),
    land_area: ({ onSelect, onClose }) => (
      <MaxAndMinDropdown
        columnKey="land_area"
        onClose={onClose}
        onSelect={onSelect}
      />
    ),
    property_type: ({onClose }) => (
      <PropertypeFilterDropdown
        columnKey="propertyType"
        groups={[
          {
            label: "Mənzil",
            options: [
              { label: "Yeni tikili", value: "Yeni tikili" },
              { label: "Köhnə tikili", value: "Köhnə tikili" },
            ],
          },
          {
            options: [
              { label: "Həyət evi / Bağ evi", value: "Həyət evi / Bağ evi" },
              { label: "Ofis", value: "Ofis" },
              { label: "Torpaq", value: "Torpaq" },
              { label: "Obyekt", value: "Obyekt" },
              { label: "Qaraj", value: "Qaraj" },
            ],
          },
        ]}
        filters={filters}
        setFilters={setFilters}
        onClose={onClose}
        title="Əmlak növü"
      />
    ),
  };

  const handleHeaderFilterClick = (columnId) => {
    setFilterColumn((prev) => (prev === columnId ? null : columnId));
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Edit / Add / Delete Handlers
  const handleEditSave = () => {
    setData((prev) =>
      prev.map((d) => (d.announcementId === editRow.announcementId ? editRow : d))
    );
    setEditRow(null);
    setSuccessMessage("Dəyişikliklər uğurla yadda saxlanıldı.");
    setShowSuccess(true);
  };

// const handleEditSave = async (updatedData) => {
//   try {
//     // Make API call to update database
//     const response = await fetch(`/api/properties/update/${editRow.announcementId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updatedData),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to update property');
//     }

//     const result = await response.json();
    
//     // Update local state with new data
//     setData((prev) =>
//       prev.map((d) => (d.announcementId === editRow.announcementId ? { ...d, ...updatedData } : d))
//     );
    
//     setEditRow(null);
//     setSuccessMessage("Dəyişikliklər uğurla yadda saxlanıldı.");
//     setShowSuccess(true);
    
//   } catch (error) {
//     console.error('Error updating property:', error);
//     alert('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
//   }
// };

const handleAddProperty = async (newData) => {
  try {
    // 1. Send new property to your backend
    const response = await fetch(`/api/properties/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      throw new Error("Failed to create property");
    }

    const result = await response.json();

    // 2. Add new property to local table state
    setData((prev) => [...prev, result]);

    // 3. Close modal
    setAddModal(false);

    // 4. Show success message
    setSuccessMessage("Əmlak uğurla əlavə olundu.");
    setShowSuccess(true);

  } catch (error) {
    console.error("Error creating property:", error);
    alert("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
  }
};

  const handleDeleteSelected = () => {
    setData((prev) => prev.filter((d) => !selected[d.announcementId]));
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
      <p className="text-[20px] font-[600] mb-[40px]">Bütün elanlar</p>
      {/* Table */}
      <div
        className="h-[520px] overflow-y-auto overflow-x-auto scrollbar-custom"
      >
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`
                      text-left whitespace-nowrap sticky overflow-visible top-0 z-40 text-[14px] font-[500] align-middle leading-none bg-white
                      ${
                        header.id === "select"
                          ? "left-0 z-50 bg-white px-4"
                          : "p-4"
                      }
                      ${
                        header.id === "actions"
                          ? "bg-white right-0 bg-white p-4 z-50"
                          : "p-4"
                      }
                    `}
                  >
                    <div className="flex gap-2 items-center justify-center">
                      <p>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </p>
                      <svg
                        ref={(el) =>
                          (filterIconRefs.current[header.column.id] = el)
                        }
                        onClick={() =>
                          handleHeaderFilterClick(header.column.id)
                        }
                        xmlns="http://www.w3.org/2000/svg"
                        max-width="20"
                        className={`
                      ${header.id === "select" ? "hidden" : ""}
                      ${header.id === "actions" ? "hidden" : ""}
                     ${
                       filterDropdowns[header.column.id] &&
                       filterColumn === header.column.id
                         ? "bg-gray-300 rounded-full cursor-pointer"
                         : "rounded-full hover:bg-gray-200 cursor-pointer"
                     }
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
                          <div
                            ref={(el) =>
                              (filterRefs.current[header.column.id] = el)
                            }
                            className="absolute top-10 right-0 bg-white border border-gray-200 rounded-md z-40 rounded-[20px] border border-primary shadow-[0_4px_4px_rgba(0,0,0,0.25),_0_4px_10px_rgba(0,0,0,0.25)]
                            scrollbar-thumb-primary scrollbar-track-gray-100 hover:scrollbar-thumb-primary"
                          >
                            {filterDropdowns[header.column.id]({
                              onSelect: (value) => {
                                setFilters((prev) => ({
                                  ...prev,
                                  [header.column.id]: value,
                                }));
                              },
                              onClose: () => setFilterColumn(null),
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
                      ${
                        cell.column.id === "select"
                          ? "left-0 bg-white z-40"
                          : ""
                      }
                      ${
                        cell.column.id === "actions"
                          ? "right-0 bg-white z-10"
                          : ""
                      }
                      ${cell.column.id === "photo" ? "p-0" : "py-8 px-4"}
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

      {/* Edit Modal */}
{editRow && (
  <EditPropertyModal
    editRow={editRow}
    onClose={() => setEditRow(null)}
    onSave={handleEditSave}
  />
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
              className="px-6 py-3 text-sm border border-gray-300 cursor-pointer rounded-[8px] text-gray-700 hover:text-red-700 hover:border-red-500 transition"
            >
              Ləğv et
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-10 py-3 text-sm border bg-red-600 cursor-pointer text-white rounded-[8px] hover:bg-red-700 transition"
            >
              Sil
            </button>
          </div>
        </ModalLayout>
      )}

      {/* Add Modal */}
      {addModal && (
  <AddPropertyModal
    onClose={() => setAddModal(false)}
    onSave={handleAddProperty}
  />
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
