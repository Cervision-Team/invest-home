"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { houseData } from "@/components/core/house";
import HouseCard from "@/components/ui/HouseCard";

const FilterResults = () => {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState(houseData);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    setListings(houseData);
    applyFiltersFromURL();
  }, [searchParams]);

  const applyFiltersFromURL = () => {
    setLoading(true);
    
    const filters = {};
    
    for (const [key, value] of searchParams.entries()) {
      if (key === 'propertyTypes' || key === 'rooms') {
        if (!filters[key]) filters[key] = [];
        filters[key].push(value);
      } else {
        filters[key] = value;
      }
    }

    setAppliedFilters(filters);

    setTimeout(() => {
      let filtered = [...houseData];

      if (filters.announcementType && filters.announcementType !== 'all') {
        filtered = filtered.filter(listing => {
          const typeMapping = {
            'sell': ['sell', 'satılıq'],
            'rent': ['rent', 'kirayə', 'kiraye'],
            'daily': ['daily', 'günlük'],
            'roommate': ['roommate', 'otaqYoldaşı']
          };
          
          return (
            listing.announcementType === filters.announcementType ||
            listing.type === filters.announcementType ||
            typeMapping[filters.announcementType]?.includes(listing.type?.toLowerCase()) ||
            typeMapping[filters.announcementType]?.includes(listing.announcementType?.toLowerCase())
          );
        });
      }

      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        filtered = filtered.filter(listing => {
          return filters.propertyTypes.includes(listing.propertyType) ||
                 filters.propertyTypes.includes(listing.type) ||
                 filters.propertyTypes.some(type => 
                   listing.propertyType?.toLowerCase().includes(type.toLowerCase()) ||
                   listing.type?.toLowerCase().includes(type.toLowerCase())
                 );
        });
      }

      if (filters.location) {
        filtered = filtered.filter(listing => {
          return listing.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
                 listing.address?.toLowerCase().includes(filters.location.toLowerCase()) ||
                 listing.district?.toLowerCase().includes(filters.location.toLowerCase()) ||
                 listing.city?.toLowerCase().includes(filters.location.toLowerCase());
        });
      }

      if (filters.priceMin || filters.priceMax) {
        filtered = filtered.filter(listing => {
          const price = parseFloat(listing.price) || 0;
          const min = parseFloat(filters.priceMin) || 0;
          const max = parseFloat(filters.priceMax) || Infinity;
          return price >= min && price <= max;
        });
      }

      if (filters.rooms && filters.rooms.length > 0) {
        filtered = filtered.filter(listing => {
          const listingRooms = listing.rooms || listing.roomCount || 0;
          return filters.rooms.includes(listingRooms) ||
                 filters.rooms.includes(listingRooms.toString()) ||
                 (filters.rooms.includes('6+') && listingRooms >= 6);
        });
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) return;

        switch (key) {
          case 'area_min':
          case 'area_max':
            if (filters.area_min || filters.area_max) {
              filtered = filtered.filter(listing => {
                const area = parseFloat(listing.area) || 0;
                const min = parseFloat(filters.area_min) || 0;
                const max = parseFloat(filters.area_max) || Infinity;
                return area >= min && area <= max;
              });
            }
            break;

          case 'landArea_min':
          case 'landArea_max':
            if (filters.landArea_min || filters.landArea_max) {
              filtered = filtered.filter(listing => {
                const landArea = parseFloat(listing.landArea) || 0;
                const min = parseFloat(filters.landArea_min) || 0;
                const max = parseFloat(filters.landArea_max) || Infinity;
                return landArea >= min && landArea <= max;
              });
            }
            break;

          case 'floor_min':
          case 'floor_max':
            if (filters.floor_min || filters.floor_max) {
              filtered = filtered.filter(listing => {
                const floor = parseFloat(listing.floor) || 0;
                const min = parseFloat(filters.floor_min) || 0;
                const max = parseFloat(filters.floor_max) || Infinity;
                return floor >= min && floor <= max;
              });
            }
            break;

          case 'totalFloors_min':
          case 'totalFloors_max':
            if (filters.totalFloors_min || filters.totalFloors_max) {
              filtered = filtered.filter(listing => {
                const totalFloors = parseFloat(listing.totalFloors) || 0;
                const min = parseFloat(filters.totalFloors_min) || 0;
                const max = parseFloat(filters.totalFloors_max) || Infinity;
                return totalFloors >= min && totalFloors <= max;
              });
            }
            break;

          case 'bathrooms_min':
          case 'bathrooms_max':
            if (filters.bathrooms_min || filters.bathrooms_max) {
              filtered = filtered.filter(listing => {
                const bathrooms = parseFloat(listing.bathrooms) || 0;
                const min = parseFloat(filters.bathrooms_min) || 0;
                const max = parseFloat(filters.bathrooms_max) || Infinity;
                return bathrooms >= min && bathrooms <= max;
              });
            }
            break;

          case 'buildingType':
            if (value) {
              filtered = filtered.filter(listing => 
                listing.buildingType === value || listing.buildingType?.toLowerCase().includes(value.toLowerCase())
              );
            }
            break;

          case 'repairStatus':
            if (value) {
              filtered = filtered.filter(listing => 
                listing.repairStatus === value || listing.condition === value ||
                listing.repairStatus?.toLowerCase().includes(value.toLowerCase())
              );
            }
            break;

          case 'officeType':
            if (value) {
              filtered = filtered.filter(listing => 
                listing.officeType === value || listing.officeType?.toLowerCase().includes(value.toLowerCase())
              );
            }
            break;

          case 'isMortgaged':
            if (value === 'true') {
              filtered = filtered.filter(listing => 
                listing.isMortgaged === true || listing.mortgage === true
              );
            }
            break;
        }
      });

      setFilteredListings(filtered);
      setLoading(false);
    }, 300);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    
    if (appliedFilters.announcementType && appliedFilters.announcementType !== 'all') count++;
    if (appliedFilters.propertyTypes && appliedFilters.propertyTypes.length > 0) count++;
    if (appliedFilters.location) count++;
    if (appliedFilters.priceMin || appliedFilters.priceMax) count++;
    if (appliedFilters.rooms && appliedFilters.rooms.length > 0) count++;
    
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined && 
          !['announcementType', 'propertyTypes', 'location', 'priceMin', 'priceMax', 'rooms'].includes(key)) {
        count++;
      }
    });
    
    return count;
  };

  const handleClearFilters = () => {
    window.location.href = '/';
  };

  return (
    <section className="max-w-[1600px] mx-auto">
      <div className="px-[80px] max-w-[1600px] mx-auto max-[1025px]:px-[20px] max-[431px]:px-[16px] max-[431px]:mt-[32px] mt-[62px]">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Axtarış Nəticələri
          </h1>
          <p className="text-gray-600">
            Seçdiyiniz meyarlara uyğun əmlak elanları
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{loading ? '...' : filteredListings.length}</span> nəticə tapıldı
              {listings.length > 0 && (
                <span className="ml-1">
                  (ümumi {listings.length} əmlakdan)
                </span>
              )}
            </div>
            
            {getActiveFilterCount() > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full hidden sm:block"></span>
                <span className="text-sm text-[#02836F] font-medium">
                  {getActiveFilterCount()} aktiv filter
                </span>
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-[#02836F] underline transition-colors"
                >
                  Təmizlə
                </button>
              </div>
            )}
          </div>

          {/* Sort Options */}
          {/* <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Çeşidlə:</span>
            <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-[#02836F]">
              <option value="newest">Ən yeni</option>
              <option value="oldest">Ən köhnə</option>
              <option value="price_low">Qiymət (aşağı)</option>
              <option value="price_high">Qiymət (yüksək)</option>
              <option value="area_large">Sahə (böyük)</option>
              <option value="area_small">Sahə (kiçik)</option>
            </select>
          </div> */}
        </div>

        {getActiveFilterCount() > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {appliedFilters.announcementType && appliedFilters.announcementType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#02836F]/10 text-[#02836F] text-sm rounded-full">
                {appliedFilters.announcementType === 'sell' ? 'Satılıq' : 
                 appliedFilters.announcementType === 'rent' ? 'Kirayə' :
                 appliedFilters.announcementType === 'daily' ? 'Günlük' : appliedFilters.announcementType}
              </span>
            )}
            
            {appliedFilters.propertyTypes && appliedFilters.propertyTypes.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                {appliedFilters.propertyTypes.length} əmlak növü
              </span>
            )}

            {(appliedFilters.priceMin || appliedFilters.priceMax) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                {appliedFilters.priceMin || '0'} - {appliedFilters.priceMax || '∞'} AZN
              </span>
            )}

            {appliedFilters.rooms && appliedFilters.rooms.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                {appliedFilters.rooms.length} otaq seçimi
              </span>
            )}

            {appliedFilters.location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full">
                 {appliedFilters.location}
              </span>
            )}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02836F]"></div>
          </div>
        )}
        
        {!loading && filteredListings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Heç bir nəticə tapılmadı
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Axtarış meyarlarınıza uyğun əmlak mövcud deyil. Filterlərizi dəyişərək yenidən cəhd edin.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleClearFilters}
                className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ana səhifəyə qayıt
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#02836F] text-white rounded-lg hover:bg-[#026b5a] transition-colors"
              >
                Yenidən yüklə
              </button>
            </div>
          </div>
        )}

        {!loading && filteredListings.length > 0 && (
          <div className="w-full grid grid-cols-4 max-[940px]:grid-cols-3 max-[769px]:grid-cols-2 max-[431px]:gap-x-[8px] gap-[24px]">
            {filteredListings.map((house) => (
              <HouseCard key={house.id} house={house} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FilterResults;