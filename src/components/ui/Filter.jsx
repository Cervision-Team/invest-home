'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/navigation';
import CustomSelect from './CustomSelect.jsx'
import Image from 'next/image.js';
import { createPortal } from "react-dom";



const LOCATIONS = [
  { id: 'baku-center', name: 'Bakı Mərkəzi', },
  { id: 'baku-sabail', name: 'Sabail rayonu', },
  { id: 'baku-nasimi', name: 'Nəsimi rayonu', },
  { id: 'baku-yasamal', name: 'Yasamal rayonu', },
  { id: 'baku-nizami', name: 'Nizami rayonu', },
  { id: 'ganja', name: 'Gəncə', },
  { id: 'sumgayit', name: 'Sumqayıt', },
  { id: 'mingachevir', name: 'Mingəçevir', }
];

const ALL_PROPERTY_TYPES = [
  { id: 'apartment', name: 'Mənzil (satılıq/kirayə)' },
  { id: 'apartmentDaily', name: 'Mənzil (günlük)' },
  { id: 'object', name: 'Obyekt' },
  { id: 'land', name: 'Torpaq sahəsi' },
  { id: 'house', name: 'Həyət evi/Bağ evi' },
  { id: 'office', name: 'Ofis' },
  { id: 'garage', name: 'Qaraj' },
  { id: 'gardenHouse', name: 'Bağ evi' },
  { id: 'aframe', name: 'A-frame' },
  { id: 'kotej', name: 'Kotej' },
  { id: 'room', name: 'Otaq' }
];

const PROPERTY_TYPES = {
  sell: [
    { id: 'apartment', name: 'Mənzil (satılıq)' },
    { id: 'object', name: 'Obyekt' },
    { id: 'land', name: 'Torpaq sahəsi' },
    { id: 'house', name: 'Həyət evi/Bağ evi' },
    { id: 'office', name: 'Ofis' },
    { id: 'garage', name: 'Qaraj' }
  ],
  rent: [
    { id: 'apartment', name: 'Mənzil (kirayə)' },
    { id: 'object', name: 'Obyekt' },
    { id: 'land', name: 'Torpaq sahəsi' },
    { id: 'house', name: 'Həyət evi/Bağ evi' },
    { id: 'office', name: 'Ofis' },
    { id: 'garage', name: 'Qaraj' }
  ],
  daily: [
    { id: 'apartmentDaily', name: 'Mənzil (günlük)' },
    { id: 'gardenHouse', name: 'Bağ evi' },
    { id: 'aframe', name: 'A-frame' },
    { id: 'kotej', name: 'Kotej' },
    { id: 'room', name: 'Otaq' }
  ],
  all: ALL_PROPERTY_TYPES
};


const ROOM_OPTIONS = [
  { id: 1, label: '1 otaq', value: 1 },
  { id: 2, label: '2 otaq', value: 2 },
  { id: 3, label: '3 otaq', value: 3 },
  { id: 4, label: '4 otaq', value: 4 },
  { id: 5, label: '5 otaq', value: 5 },
  { id: 6, label: '6+ otaq', value: '6+' }
];

const OFFICE_TYPES = [
  { id: 'businessCenter', name: 'Biznes mərkəz' },
  { id: 'apartmentOffice', name: 'Mənzil ofisi' },
  { id: 'gardenHouse', name: 'Bağ evi' }
];

const BUILDING_TYPES = [
  { id: 'newBuilding', name: 'Yeni tikili' },
  { id: 'oldBuilding', name: 'Köhnə tikili' }
];

const REPAIR_STATUS = [
  { id: 'renewed', name: 'Təmirli' },
  { id: 'notRenewed', name: 'Təmirsiz' }
];



const ADDITIONAL_FILTERS = [
  {
    id: 'area',
    label: 'Sahə (m²)',
    type: 'range',
    applicable: ['apartment', 'object', 'house', 'office', 'apartmentDaily', 'gardenHouse', 'aframe', 'kotej', 'room', 'apartmentRoommate']
  },
  {
    id: 'landArea',
    label: 'Torpaq sahəsi (m²)',
    type: 'range',
    applicable: ['house', 'land', 'gardenHouse', 'aframe', 'kotej']
  },
  {
    id: 'floor',
    label: 'Mərtəbə',
    type: 'range',
    applicable: ['apartment', 'object', 'office', 'apartmentDaily', 'apartmentRoommate']
  },
  {
    id: 'totalFloors',
    label: 'Ümumi mərtəbələr',
    type: 'range',
    applicable: ['apartment', 'house', 'office', 'object', 'apartmentDaily', 'aframe', 'apartmentRoommate']
  },
  {
    id: 'buildingType',
    label: 'Bina növü',
    type: 'select',
    options: BUILDING_TYPES,
    applicable: ['apartment', 'object', 'office', 'apartmentDaily', 'apartmentRoommate']
  },
  {
    id: 'repairStatus',
    label: 'Təmir vəziyyəti',
    type: 'select',
    options: REPAIR_STATUS,
    applicable: ['apartment', 'object', 'house', 'office', 'apartmentDaily', 'gardenHouse', 'aframe', 'kotej', 'room', 'apartmentRoommate']
  },
  {
    id: 'officeType',
    label: 'Ofis tipi',
    type: 'select',
    options: OFFICE_TYPES,
    applicable: ['office']
  },
  {
    id: 'isMortgaged',
    label: 'İpoteka',
    type: 'boolean',
    applicable: ['apartment', 'object', 'house', 'office', 'garage', 'land']
  }
];

const getAvailablePropertyTypes = (announcementType) => {
  return PROPERTY_TYPES[announcementType] || [];
};


const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path
      d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"
      fill="currentColor"
    />
  </svg>
);

export const Button = ({ onSelect, selectedValue = "all" }) => {
  const arr = [
    { id: 1, name: "Bütün", value: "all" },
    { id: 2, name: "Satılıq", value: "sell" },
    { id: 3, name: "Kirayə", value: "rent" },
    { id: 4, name: "Günlük", value: "daily" }
  ];

  const getActiveId = (value) => {
    const item = arr.find(elem => elem.value === value);
    return item ? item.id : 1;
  };

  const activeId = getActiveId(selectedValue);

  return (
    <div className="bg-white w-fit flex gap-2" style={{ borderRadius: "12px 12px 0px 0px" }}>
      {arr.map((elem) => {
        const isActive = activeId === elem.id;

        return (
          <button
            key={elem.id}
            onClick={() => {
              onSelect(elem.value);
            }}
            style={{ borderRadius: "12px 12px 0px 0px" }}
            className={`py-[10px] w-[102px] h-[44px] px-[28px] leading-[24px] tracking-wide text-sm font-medium transition-all duration-300 cursor-pointer
              ${isActive
                ? "bg-[#02836F] text-white border-transparent"
                : "bg-white text-[#02836F]"
              }`}
          >
            {elem.name}
          </button>
        );
      })}
    </div>
  );
};


const Dropdown = ({ children, isOpen, onClose, className = "", triggerRef }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(event.target);
      const isOutsideTrigger =
        triggerRef?.current && !triggerRef.current.contains(event.target);

      if (isOutsideDropdown && isOutsideTrigger) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      className={`absolute bg-white border border-[#E9E9E9] rounded-b-[12px] shadow-lg z-[9999] mt-1 ${className}`}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top:
          triggerRef?.current?.getBoundingClientRect().bottom +
          window.scrollY +
          "px",
        left: (triggerRef?.current?.getBoundingClientRect().left - 50) + "px",
        width: (triggerRef?.current?.offsetWidth + 100) + "px",
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const PropertyTypeSelector = ({ announcementType, selectedTypes, onTypeChange }) => {
  const availableTypes = getAvailablePropertyTypes(announcementType);
  const containerRef = React.useRef(null);
  const [isScrollable, setIsScrollable] = React.useState(false);

  React.useEffect(() => {
    if (containerRef.current) {
      setIsScrollable(containerRef.current.scrollHeight > 300);
    }
  }, [availableTypes]);

  return (
    <>
      <style>
        {`
          .svg-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            border: 2px solid #d1d5db;
            border-radius: 6px;
            background-color: white;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
          }

          .svg-checkbox:checked {
            background-color: #1B8F7D;
            border-color: #1B8F7D;
          }

          .svg-checkbox:checked::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
            background-size: contain;
            background-repeat: no-repeat;
          }

          .svg-checkbox:hover {
            border-color: #1B8F7D;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
          }

          .svg-checkbox:focus {
            outline: none;
            border-color: #1B8F7D;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.2);
          }

          .property-type-container {
            padding: 1rem;
          }

          .property-type-container.scrollable {
            max-height: 300px;
            overflow-y: auto;
          }
        `}
      </style>

      <div
        ref={containerRef}
        className={`property-type-container ${isScrollable ? 'scrollable' : ''}`}
      >
        <div className="text-sm font-medium text-gray-700 mb-3">Əmlak növü</div>
        <div className="space-y-2">
          {availableTypes.map((type) => (
            <label key={type.id} className="flex items-center cursor-pointer"
              onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                className="mr-3 w-4 h-4 text-[#02836F] border-gray-300 rounded focus:ring-[#02836F] svg-checkbox"
                checked={selectedTypes.includes(type.id)}
                onChange={() => onTypeChange(type.id)}
              />
              <span className="text-sm">{type.name}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
};

const FilterModal = ({ isOpen, onClose, filters, onApply, selectedPropertyTypes, announcementType }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => setLocalFilters(prev => ({ ...prev, [key]: value }));
  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };
  const handleReset = () => setLocalFilters(Object.fromEntries(Object.keys(localFilters).map(k => [k, ''])));

  const applicableFilters = selectedPropertyTypes.length === 0
    ? ADDITIONAL_FILTERS
    : ADDITIONAL_FILTERS.filter(f => selectedPropertyTypes.some(t => f.applicable.includes(t)));

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <style>
        {`
          .svg-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            border: 2px solid #d1d5db;
            border-radius: 6px;
            background-color: white;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
          }

          .svg-checkbox:checked {
            background-color: #1B8F7D;
            border-color: #1B8F7D;
          }

          .svg-checkbox:checked::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
            background-size: contain;
            background-repeat: no-repeat;
          }

          .svg-checkbox:hover {
            border-color: #1B8F7D;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
          }

          .svg-checkbox:focus {
            outline: none;
            border-color: #1B8F7D;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.2);
          }

           .remove-arrow::-webkit-outer-spin-button,
          .remove-arrow::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .remove-arrow {
            -moz-appearance: textfield;
          }
        `}
      </style>

      <div
        onClick={onClose}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md transition-all duration-300 ease-out p-4"
      >
        <div
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out scale-100"
        >
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-[#02836F] to-[#026b5a] rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Ətraflı Filter</h2>
                <span className="px-2 py-1 bg-[#02836F]/10 text-[#02836F] text-xs font-medium rounded-full">
                  {applicableFilters.length} filter
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {applicableFilters.map((f, index) => (
                <div
                  key={f.id}
                  className="group p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 hover:border-[#02836F]/20 transition-all duration-200 hover:shadow-sm"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <label className="block text-sm font-semibold text-gray-800 mb-3 group-hover:text-[#02836F] transition-colors duration-200">
                    {f.label}
                  </label>

                  {f.type === 'range' && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            placeholder="Min"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#02836F]/20 focus:border-[#02836F] transition-all duration-200 text-sm font-medium placeholder-gray-400 remove-arrow"
                            value={localFilters[`${f.id}_min`] || ''}
                            onChange={e => handleChange(`${f.id}_min`, e.target.value)}
                          />
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-0.5 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            placeholder="Max"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#02836F]/20 focus:border-[#02836F] transition-all duration-200 text-sm font-medium placeholder-gray-400 remove-arrow"
                            value={localFilters[`${f.id}_max`] || ''}
                            onChange={e => handleChange(`${f.id}_max`, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {f.type === 'select' && (
                    <CustomSelect
                      value={localFilters[f.id] || ''}
                      onChange={(value) => handleChange(f.id, value)}
                      options={f.options}
                      placeholder="Seçin"
                    />
                  )}
                  {f.type === 'boolean' && (
                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/50 transition-all duration-200">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="svg-checkbox transition-all duration-200"
                          checked={localFilters[f.id] || false}
                          onChange={e => handleChange(f.id, e.target.checked)}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Bəli</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-6 py-4">
            <div className="flex justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                {Object.keys(localFilters).filter(k => localFilters[k] !== '' && localFilters[k] !== false).length} aktiv filter
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Sıfırla
                </button>
                <button
                  onClick={handleApply}
                  className="px-8 py-2.5 bg-gradient-to-r from-[#02836F] to-[#026b5a] text-white rounded-xl hover:shadow-lg hover:shadow-[#02836F]/25 transition-all duration-200 font-semibold text-sm flex items-center gap-2 transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Tətbiq et
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default function AdvancedFilter({ onSearch, initialFilters = {} }) {

  const [announcementType, setAnnouncementType] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [additionalFilters, setAdditionalFilters] = useState({});

  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);
  const [previousAnnouncementType, setPreviousAnnouncementType] = useState("all");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const locationTriggerRef = useRef(null);
  const propertyTypeTriggerRef = useRef(null);
  const priceTriggerRef = useRef(null);
  const roomsTriggerRef = useRef(null);

  useEffect(() => {
    const savedFilters = sessionStorage.getItem('searchFilters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);

        setAnnouncementType(parsed.announcementType || 'all');
        setSelectedLocation(parsed.selectedLocation || '');
        setLocationSearch(parsed.locationSearch || '');
        setPriceRange(parsed.priceRange || { min: '', max: '' });
        setSelectedRooms(parsed.selectedRooms || []);
        setSelectedPropertyTypes(parsed.selectedPropertyTypes || []);
        setAdditionalFilters(parsed.additionalFilters || {});
        setPreviousAnnouncementType(parsed.announcementType || 'all');

        sessionStorage.removeItem('searchFilters');
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    } else if (initialFilters && Object.keys(initialFilters).length > 0) {
      setAnnouncementType(initialFilters.announcementType ?? "all");
      setSelectedPropertyTypes(initialFilters.propertyTypes ?? []);
      setSelectedLocation(initialFilters.location ?? "");
      setPriceRange(initialFilters.priceRange ?? { min: "", max: "" });
      setSelectedRooms(initialFilters.rooms ?? []);
      setAdditionalFilters(initialFilters.additionalFilters ?? {});
    }

    setIsInitialLoad(false);
  }, [initialFilters]);

  useEffect(() => {
    const filtered = LOCATIONS.filter(location =>
      location.name.toLowerCase().includes(locationSearch.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [locationSearch]);

  useEffect(() => {
    if (!isInitialLoad && announcementType !== previousAnnouncementType) {
      // Only reset property types
      setSelectedPropertyTypes([]);
      // Don't reset: selectedRooms, priceRange, selectedLocation, locationSearch, additional filters
      setPreviousAnnouncementType(announcementType);
    }
  }, [announcementType, previousAnnouncementType, isInitialLoad]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.id);
    setLocationSearch(location.name);
    setActiveDropdown(null);
  };

  const handleRoomToggle = (room) => {
    setSelectedRooms(prev =>
      prev.includes(room.value)
        ? prev.filter(r => r !== room.value)
        : [...prev, room.value]
    );
  };

  const handlePropertyTypeChange = (typeId) => {
    setSelectedPropertyTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const router = useRouter();

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling

      const searchFilters = {
        announcementType,
        propertyTypes: selectedPropertyTypes,
        location: selectedLocation,
        priceMin: priceRange.min || null,
        priceMax: priceRange.max || null,
        rooms: (announcementType !== 'all' && selectedRooms.length > 0) ? selectedRooms : null,
        ...Object.fromEntries(
          Object.entries(additionalFilters).filter(
            ([, value]) => value !== '' && value !== null && value !== undefined
          )
        )
      };

      const filtersToSave = {
        announcementType,
        selectedLocation,
        locationSearch,
        priceRange,
        selectedRooms,
        selectedPropertyTypes,
        additionalFilters
      };

      sessionStorage.setItem('searchFilters', JSON.stringify(filtersToSave));

      const query = new URLSearchParams();

      Object.entries(searchFilters).forEach(([key, value]) => {
        if (!value || value === 'all') return;
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(v => v && query.append(key, v.toString()));
        } else {
          query.append(key, value.toString());
        }
      });

      const queryString = query.toString();

      router.push(`/all-houses/filter-lists${queryString ? `?${queryString}` : ''}`);

      onSearch?.(searchFilters);
    },
    [announcementType, selectedPropertyTypes, selectedLocation, locationSearch, priceRange, selectedRooms, additionalFilters, router, onSearch]
  );

  const getDisplayText = (field) => {
    switch (field) {
      case 'location':
        if (selectedLocation) {
          const location = LOCATIONS.find(l => l.id === selectedLocation);
          return location ? location.name : 'Şəhər, Metro, Qəsəbə, Ünvan';
        }
        return 'Şəhər, Metro, Qəsəbə, Ünvan';
      case 'price':
        if (priceRange.min || priceRange.max) {
          const min = priceRange.min || '0';
          const max = priceRange.max || '∞';
          return `${min} - ${max} AZN`;
        }
        return 'Əlavə et';
      case 'rooms':
        if (selectedRooms.length === 0) return 'Əlavə et';
        if (selectedRooms.length === 1) return `${selectedRooms[0]} otaq`;
        return `${selectedRooms.length} seçim`;
      case 'propertyType':
        if (selectedPropertyTypes.length === 0) return 'Əmlak növü';
        if (selectedPropertyTypes.length === 1) {
          const types = getAvailablePropertyTypes(announcementType);
          const type = types.find(t => t.id === selectedPropertyTypes[0]);
          return type ? type.name : 'Əmlak növü';
        }
        return `${selectedPropertyTypes.length} seçim`;
      default:
        return 'Əlavə et';

    }
  };

  return (
    <>

      <style>
        {`
          .svg-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            border: 2px solid #d1d5db;
            border-radius: 6px;
            background-color: white;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
          }

          .svg-checkbox:checked {
            background-color: #1B8F7D;
            border-color: #1B8F7D;
          }

          .svg-checkbox:checked::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
            background-size: contain;
            background-repeat: no-repeat;
          }

          .svg-checkbox:hover {
            border-color: #1B8F7D;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
          }

          .svg-checkbox:focus {
            outline: none;
            border-color: #1B8F7D;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.2);
          }

           .remove-arrow::-webkit-outer-spin-button,
          .remove-arrow::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .remove-arrow {
            -moz-appearance: textfield;
          }
        `}
      </style>

      <div className="w-full mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] flex flex-col items-center relative">
        <div>
          <Button
            onSelect={(val) => setAnnouncementType(val)}
            selectedValue={announcementType}
          />
        </div>

        <div className="max-w-[1000px] flex bg-white rounded-t-[12px] w-full py-[8.5px] px-[24px] gap-[32px] relative">
          <div className="flex items-center gap-[16px] justify-between min-w-0 basis-[70%]">

            <div className="cursor-pointer w-full flex flex-col min-w-0 relative">
              <span className="inline-block text-[13px] text-[#969696] whitespace-nowrap overflow-hidden text-ellipsis">
                Ünvan
              </span>
              <div
                ref={locationTriggerRef}
                className="flex items-center justify-between"
                onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
              >
                <span className="inline-block add-text text-[16px] whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
                  {getDisplayText('location')}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  fill="none"
                  viewBox="0 0 24 25"
                  className={`shrink-0 transition-transform ${activeDropdown === 'location' ? 'rotate-180' : 'rotate-0'}`}
                >
                  <path
                    d="M12 15a1 1 0 01-.53-.15 1 1 0 01-.47-.57l-3.5-3.5a1 1 0 011.41-1.41L12 12.59l3.09-3.22a1 1 0 111.41 1.41l-3.5 3.5a1 1 0 01-.47.57A1 1 0 0112 15Z"
                    fill="#111111"
                  />
                </svg>
              </div>

              <Dropdown
                isOpen={activeDropdown === 'location'}
                onClose={() => setActiveDropdown(null)}
                triggerRef={locationTriggerRef}
              >
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Axtarış..."
                    className="w-full px-3 py-2 border border-[#E9E9E9] rounded-[8px] focus:outline-none focus:border-[#02836F] mb-3"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                  <div className="max-h-60 overflow-y-auto">
                    {filteredLocations.map((location) => (
                      <div
                        key={location.id}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-[4px] flex items-center justify-between"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <span>{location.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Dropdown>
            </div>

            <div className="w-[1px] h-[32px] bg-[#D9D9D9]" />

            <>
              <div className="cursor-pointer w-full flex flex-col min-w-0 relative">
                <span className="inline-block text-[13px] text-[#969696] whitespace-nowrap overflow-hidden text-ellipsis">
                  Əmlak növü
                </span>
                <div
                  ref={propertyTypeTriggerRef}
                  className="flex items-center justify-between"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveDropdown(activeDropdown === 'propertyType' ? null : 'propertyType')
                  }}
                >
                  <span className="inline-block add-text text-[16px] whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
                    {getDisplayText('propertyType')}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    fill="none"
                    viewBox="0 0 24 25"
                    className={`shrink-0 transition-transform ${activeDropdown === 'propertyType' ? 'rotate-180' : 'rotate-0'}`}
                  >
                    <path
                      d="M12 15a1 1 0 01-.53-.15 1 1 0 01-.47-.57l-3.5-3.5a1 1 0 011.41-1.41L12 12.59l3.09-3.22a1 1 0 111.41 1.41l-3.5 3.5a1 1 0 01-.47.57A1 1 0 0112 15Z"
                      fill="#111111"
                    />
                  </svg>
                </div>

                <Dropdown
                  triggerRef={propertyTypeTriggerRef}
                  isOpen={activeDropdown === 'propertyType'}
                  onClose={() => setActiveDropdown(null)}
                >
                  <PropertyTypeSelector
                    announcementType={announcementType}
                    selectedTypes={selectedPropertyTypes}
                    onTypeChange={handlePropertyTypeChange}
                  />
                </Dropdown>

              </div>

              <div className="w-[1px] h-[32px] bg-[#D9D9D9]" />
            </>


            <div className="cursor-pointer w-full flex flex-col min-w-0 relative">
              <span className="inline-block text-[13px] text-[#969696] whitespace-nowrap overflow-hidden text-ellipsis">
                Qiymət
              </span>
              <div
                ref={priceTriggerRef}
                className="flex items-center justify-between"
                onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
              >
                <span className="inline-block add-text text-[16px] whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
                  {getDisplayText('price')}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  fill="none"
                  viewBox="0 0 24 25"
                  className={`shrink-0 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : 'rotate-0'}`}
                >
                  <path
                    d="M12 15a1 1 0 01-.53-.15 1 1 0 01-.47-.57l-3.5-3.5a1 1 0 011.41-1.41L12 12.59l3.09-3.22a1 1 0 111.41 1.41l-3.5 3.5a1 1 0 01-.47.57A1 1 0 0112 15Z"
                    fill="#111111"
                  />
                </svg>
              </div>

              <Dropdown
                isOpen={activeDropdown === 'price'}
                onClose={() => setActiveDropdown(null)}
                triggerRef={priceTriggerRef}
              >
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Minimum qiymət</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-[#E9E9E9] rounded-[8px] focus:outline-none focus:border-[#02836F] remove-arrow"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Maksimum qiymət</label>
                    <input
                      type="number"
                      placeholder="∞"
                      className="w-full px-3 py-2 border border-[#E9E9E9] rounded-[8px] focus:outline-none focus:border-[#02836F] remove-arrow"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      className="flex-1 px-3 py-2 border border-[#E9E9E9] text-gray-600 rounded-[8px] hover:bg-gray-50"
                      onClick={() => setPriceRange({ min: '', max: '' })}
                    >
                      Təmizlə
                    </button>
                    <button
                      className="flex-1 px-3 py-2 bg-[#02836F] text-white rounded-[8px] hover:bg-[#026b5a]"
                      onClick={() => setActiveDropdown(null)}
                    >
                      Tətbiq et
                    </button>
                  </div>
                </div>
              </Dropdown>
            </div>

            <div className="w-[1px] h-[32px] bg-[#D9D9D9]" />

            {announcementType !== 'all' && (
              <div className="cursor-pointer w-full flex flex-col min-w-0 relative">
                <span className="inline-block text-[13px] text-[#969696] whitespace-nowrap overflow-hidden text-ellipsis">
                  Otaq
                </span>
                <div
                  ref={roomsTriggerRef}
                  className="flex items-center justify-between"
                  onClick={() => setActiveDropdown(activeDropdown === 'rooms' ? null : 'rooms')}
                >
                  <span className="inline-block add-text text-[16px] whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
                    {getDisplayText('rooms')}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    fill="none"
                    viewBox="0 0 24 25"
                    className={`transition-transform ${activeDropdown === 'rooms' ? 'rotate-180' : 'rotate-0'}`}
                  >
                    <path
                      d="M12 15a1 1 0 01-.53-.15 1 1 0 01-.47-.57l-3.5-3.5a1 1 0 011.41-1.41L12 12.59l3.09-3.22a1 1 0 111.41 1.41l-3.5 3.5a1 1 0 01-.47.57A1 1 0 0112 15Z"
                      fill="#111111"
                    />
                  </svg>
                </div>

                <Dropdown
                  triggerRef={roomsTriggerRef}
                  isOpen={activeDropdown === 'rooms'}
                  onClose={() => setActiveDropdown(null)}
                >
                  <div className="p-4 space-y-2">
                    {ROOM_OPTIONS.map((room) => (
                      <label key={room.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 text-[#02836F] border-gray-300 rounded focus:ring-[#02836F] svg-checkbox"
                          checked={selectedRooms.includes(room.value)}
                          onChange={() => handleRoomToggle(room)}
                        />
                        <span className="text-sm">{room.label}</span>
                      </label>
                    ))}
                    <div className="flex gap-2 pt-3 mt-3 border-t border-[#E9E9E9]">
                      <button
                        className="flex-1 px-3 py-2 border border-[#E9E9E9] text-gray-600 rounded-[8px] hover:bg-gray-50"
                        onClick={() => setSelectedRooms([])}
                      >
                        Təmizlə
                      </button>
                      <button
                        className="flex-1 px-3 py-2 bg-[#02836F] text-white rounded-[8px] hover:bg-[#026b5a]"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Tətbiq et
                      </button>
                    </div>
                  </div>
                </Dropdown>
              </div>
            )}
          </div>

          <div className="flex min-w-0 items-center justify-end gap-[14px] basis-[30%]">
            <div
              className="cursor-pointer min-w-0 flex text-[#02836F] px-[16px] py-[12px] gap-[8px] rounded-[8px] border border-[#E9E9E9] hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilterModal(true)}
            >
              <div>
                <FilterIcon />
              </div>
              <span className="inline-block max-[769px]:hidden whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">
                Filter
              </span>
            </div>

            <div
              className="cursor-pointer min-w-0 flex bg-[#02836F] text-white px-[16px] py-[12px] gap-[8px] rounded-[8px] hover:bg-[#026b5a] transition-colors"
              onClick={handleSearch}
            >
              <Image src="/icons/search.svg" alt="search" width={24} height={24} />
              <span className="inline-block max-[769px]:hidden whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">
                Axtar
              </span>
            </div>
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={additionalFilters}
        onApply={(filters) => setAdditionalFilters(filters)}
        selectedPropertyTypes={selectedPropertyTypes}
        announcementType={announcementType}
      />
    </>
  );
}
