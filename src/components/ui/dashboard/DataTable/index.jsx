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
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { columnHeaders, RealEstateData, azeCity, azeSettlement, azeDistrict, azeMetro } from "@/components/core/RealEstateData";
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

  // Click outside menu close
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
              className={`p-1 rounded text-xl cursor-pointer ${openMenu === row.id ? "bg-gray-300" : "hover:bg-gray-200"}`}
            >
              ⋮
            </button>
            {openMenu === row.id && (
              <div className="absolute right-8 top-[-10px] py-6 w-42 bg-white border border-gray-200 rounded-[12px] shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] z-[1000] overflow-hidden">
                <button
                  onClick={() => setOpenMenu(null)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-red-600 cursor-pointer"
                >
                  ✕
                </button>
                <button
                  onClick={() => {
                    setEditRow(row.original);
                    setOpenMenu(null);
                  }}
                  className="flex items-center cursor-pointer gap-3 w-full px-5 py-2 text-sm text-[#1B1F27] transition-colors duration-150"
                >
                  <Image
                    src={editing}
                    className="py-[2px] px-[1.999px]"
                    alt="edit"
                  />
                  <p>Redaktə et</p>
                </button>
                <button className="flex items-center gap-3 cursor-pointer w-full px-5 py-2 text-sm  text-[#1B1F27] transition-colors duration-150">
                  <Image
                    src={approved}
                    className="py-[2px] px-[2.5px]"
                    alt="approve"
                  />
                  <p>Təsdiqlə</p>
                </button>
                <button className="flex items-center gap-3 cursor-pointer w-full px-5 py-2 text-sm text-[#1B1F27] transition-colors duration-150">
                  <Image src={rejected} className="p-[3px]" alt="reject" />
                  <p>Rədd et</p>
                </button>
                <button
                  onClick={() => {
                    setDeleteModal(true);
                    setSelected({ [row.original.elan_id]: true });
                    setOpenMenu(null);
                  }}
                  className="flex items-center gap-3 cursor-pointer w-full px-5 py-2 text-sm text-[#E9222C] transition-colors duration-150"
                >
                  <Image src={remove} className="p-[2px]" alt="remove" />
                  <p>Elanı sil</p>
                </button>
                <button className="flex items-center gap-3 cursor-pointer w-full px-5 py-2 text-sm  text-[#1B1F27] transition-colors duration-150">
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
  const AnnouncementTypeFilterDropdown = ({ options, onSelect, onClose, title }) => {
    const [hovered, setHovered] = useState(null);

    return (
      <div className="relative flex flex-col w-[400px]">
        <div className="flex justify-end mr-2 mb-1">
          <button
            className="text-gray-500 hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {title && (
          <div className="px-2">
            <p>{title}</p>
            <p className="w-full h-[1px] mt-2 bg-[rgba(200,199,199,0.32)]"></p>
          </div>
        )}

        <div className="pt-3 px-2 grid grid-cols-2 gap-3">
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
  const MaxAndMinDropdown = ({ columnKey, onSelect, onClose }) => {
    const [range, setRange] = useState({ min: "", max: "" });

    const getLabel = (type) => {
      if (columnKey === "price")
        return type === "min" ? "Minimum qiymət" : "Maksimum qiymət";

      if (columnKey === "floor")
        return type === "min" ? "Minimum mərtəbə" : "Maksimum mərtəbə";

      if (columnKey === "area")
        return type === "min" ? "Minimum sahə" : "Maksimum sahə";

      if (columnKey === "totalFloors")
        return type === "min" ? "Minimum mərtəbə" : "Maksimum mətəbə";

      if (columnKey === "land_area")
        return type === "min"
          ? "Minimum torpaq sahəsi"
          : "Maksimum torpaq sahəsi";

      return type === "min" ? "Minimum" : "Maksimum";
    };

    const getUnit = () => {
      if (columnKey === "price") return "azn";
      if (columnKey === "area" || columnKey === "land_area") return "m²";
      return null;
    };

    const unit = getUnit();

    const handleApply = () => {
      onSelect({
        min: range.min !== "" ? Number(range.min) : undefined,
        max: range.max !== "" ? Number(range.max) : undefined,
      });
      onClose();
    };

    return (
      <div className="relative flex flex-col gap-3 p-4">
        <button
          className="absolute right-2 top-1 text-gray-500 hover:text-red-600 cursor-pointer"
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
            onClick={() => setRange({ min: "", max: "" })}
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
  const PropertypeFilterDropdown = ({ groups, columnKey, filters, setFilters, onClose, title }) => {
    const selectedValue = filters[columnKey] || "";

    const handleSelect = (value) => {
      setFilters((prev) => ({
        ...prev,
        [columnKey]: value,
      }));
      onClose();
    };

    return (
      <div className="relative flex flex-col gap-2 p-4">
        <button
          className="absolute right-2 top-1 text-gray-500 hover:text-red-600 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
        {title && <p className="font-medium">{title}</p>}
        <p className="a w-full h-[1px] mb-2 bg-[rgba(200,199,199,0.32)]"></p>
        {(groups || []).map((group, i) => (
          <div key={group.label || i}>
            {group.label && <p className="text-sm  mb-1">{group.label}</p>}
            {group.options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center justify-between gap-3 cursor-pointer px-3 py-2 group rounded hover:bg-primary/10"
              >
                <span>{opt.label}</span>
                <input
                  type="radio"
                  name={title}
                  value={opt.value}
                  checked={selectedValue === opt.value}
                  onChange={() => handleSelect(opt.value)}
                  className="hidden peer"
                />
                <span className="w-5 h-5 flex items-center justify-center rounded-full border-[0.6px] border-gray-300 transition-all">
                  <span
                    className={`w-3 h-3 rounded-full transition-all ${
                      selectedValue === opt.value
                        ? "bg-primary"
                        : "bg-transparent group-hover:bg-primary"
                    }`}
                  ></span>
                </span>
              </label>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Common Filter Dropdown
  const CommonFilterDropdown = ({ options, onSelect, onClose, title }) => (
    <div className="relative flex flex-col">
      <div className="flex justify-end mb-1 mr-2">
        <button
          className=" text-gray-500 hover:text-red-600 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      {title && (
        <div>
          <p className="text-center">{title}</p>
          <p className="w-full h-[1px] mt-2 bg-[rgba(200,199,199,0.32)]"></p>
        </div>
      )}
      <div className="pt-3 flex flex-col gap-3">
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
  const RadioFilterDropdown = ({ options, selectedValue, onSelect, onClose, title }) => (
    <div className="relative flex flex-col">
      <button
        className="absolute right-2 top-1 text-gray-500 hover:text-red-600 cursor-pointer"
        onClick={onClose}
      >
        ✕
      </button>
      {title && <p className="text-center pt-6">{title}</p>}
      <p className="w-full h-[1px] mt-2 bg-[rgba(200,199,199,0.32)]"></p>
      <div className="pt-3 flex flex-col">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-3 cursor-pointer px-3 py-2 group hover:bg-primary/10"
          >
            <input
              type="radio"
              name={title}
              value={opt}
              checked={selectedValue === opt}
              onChange={() => onSelect(opt)}
              className="hidden peer"
            />

            <span
              className={`
      w-5 h-5 flex items-center justify-center rounded-full border-[0.6px] transition-all border-[#E1E6EF]
    `}
            >
              <span
                className={`
        w-3 h-3 rounded-full transition-all
        ${
          selectedValue === opt
            ? "bg-primary"
            : "bg-transparent group-hover:bg-primary"
        }
      `}
              ></span>
            </span>

            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const filterDropdowns = {
    city: ({ onSelect, onClose }) => (
      <CommonFilterDropdown
        options={azeCity}
        onSelect={onSelect}
        onClose={onClose}
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
      <CommonFilterDropdown
        options={azeSettlement}
        onSelect={onSelect}
        onClose={onClose}
      />
    ),
    district: ({ onSelect, onClose }) => (
      <CommonFilterDropdown
        options={azeDistrict}
        onSelect={onSelect}
        onClose={onClose}
      />
    ),
    metro: ({ onSelect, onClose }) => (
      <CommonFilterDropdown
        options={azeMetro}
        onSelect={onSelect}
        onClose={onClose}
      />
    ),
    mortgage: ({ onSelect, onClose }) => (
      <RadioFilterDropdown
        options={["Var", "Yoxdur"]}
        selectedValue={filters["mortgage"]}
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
        options={["Var", "Yoxdur"]}
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
        options={["Əla", "Orta", "Zəif"]}
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
      <MaxAndMinDropdown
        columnKey="floor"
        onClose={onClose}
        onSelect={onSelect}
      />
    ),
    totalFloors: ({ onSelect, onClose }) => (
      <MaxAndMinDropdown
        columnKey="totalFloors"
        onClose={onClose}
        onSelect={onSelect}
      />
    ),
    land_area: ({ onSelect, onClose }) => (
      <MaxAndMinDropdown
        columnKey="land_area"
        onClose={onClose}
        onSelect={onSelect}
      />
    ),
    property_type: ({ onSelect, onClose }) => (
      <PropertypeFilterDropdown
        columnKey="property_type"
        groups={[
          {
            label: "Mənzil",
            options: [
              { label: "•  Yeni tikili", value: "Yeni tikili" },
              { label: "•  Köhnə tikili", value: "Köhnə tikili" },
            ],
          },
          {
            options: [
              { label: "Həyət evi / Bağ evi", value: "Həyət evi / Bağ evi" },
              { label: "Ofis", value: "Ofis" },
              { label: "Torpaq", value: "Torpaq" },
              { label: "Obyekt", value: "Obyekt" },
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

  const handleHeaderFilterClick = (colKey) => {
    setFilterColumn((prev) => (prev === colKey ? null : colKey));
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Edit / Add / Delete Handlers
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
        className="h-[520px] overflow-y-auto overflow-x-auto
    scrollbar-thin
    scrollbar-thumb-primary
    scrollbar-track-gray-100
    hover:scrollbar-thumb-primary"
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
                    <div className="flex gap-2 items-center">
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
                     ${
                       filterDropdowns[header.column.id] &&
                       filterColumn === header.column.id
                         ? "bg-gray-300 rounded-full p-2"
                         : ""
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
                        filterDropdowns[header.column.id] &&(
                          <div
                            className="absolute top-6 right-0 bg-white shadow-lg border border-gray-200 rounded-md px-2 py-4 z-40 min-w-48 max-h-[300px] overflow-y-auto rounded-[20px] border border-primary shadow-[0_4px_4px_rgba(0,0,0,0.25),_0_4px_10px_rgba(0,0,0,0.25)]
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
              className="px-6 py-3 text-sm border border-gray-300 cursor-pointer rounded-[8px] text-gray-700 hover:text-red-700 hover:border-red-500 transition"
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
              className="px-6 py-3 text-sm border border-gray-300 cursor-pointer rounded-[8px] text-gray-700 hover:text-red-700 hover:border-red-500 transition"
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