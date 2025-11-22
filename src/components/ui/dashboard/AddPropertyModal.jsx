import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, MapPin, ChevronDown, Plus  } from 'lucide-react';
import PropertyTypeButton from '../PropertyTypeButton';
import Image from 'next/image';
import { azeCity, azeDistrict, azeSettlement } from '@/components/core/RealEstateData';



const AddPropertyModal = ({ onClose, onSave }) => {

  const [activePropertyType, setActivePropertyType] = useState('apartment');
  const [activeOfficeType, setActiveOfficeType] = useState( null);
  const [activeBuilding, setActiveBuilding] = useState( null);
  const [activeRepaired, setActiveRepaired] = useState( null);
  const [isMortgaged, setIsMortgaged] = useState( false);
  
  // Location state
  const [selectedAddress, setSelectedAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Dropdown states
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [images, setImages] = useState([]);
const [previewImage, setPreviewImage] = useState(null);
const [selectedIndex, setSelectedIndex] = useState(0);
const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
const fileInputRef = useRef(null);
  
  // Map refs
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const googleMapsLoadedRef = useRef(false);
  const scriptLoadingRef = useRef(false);
  const loadingPromiseRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    announcementId: '',
    propertyType: 'apartment',
    officeType:  null,
    buildingType: null,
    repairStatus: null,
    isMortgaged: false,
    area: '',
    landArea:'',
    floor: '',
    totalFloors: '',
    rooms: '',
    bathrooms: '',
    price: '',
    initialPayment: '',
    monthlyPayment: '',
    remainingMonths: '',
    exit: 'theres',
    mortgage: 'yes',
    features: [],
    description: '',
    selectedCity: '',
    selectedDistrict: '',
    selectedSettlement: '',
    selectedAddress: '',
    searchQuery: '',
    latitude: null,
    longitude: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const updatePropertyType = (type) => {
    setActivePropertyType(type);
    handleInputChange('propertyType', type);
  };

  const updateOfficeType = (type) => {
    setActiveOfficeType(type);
    handleInputChange('officeType', type);
  };

  const updateBuildingType = (type) => {
    setActiveBuilding(type);
    handleInputChange('buildingType', type);
  };

  const updateRepairStatus = (status) => {
    setActiveRepaired(status);
    handleInputChange('repairStatus', status);
  };

  const updateMortgageStatus = (status) => {
    setIsMortgaged(status);
    handleInputChange('isMortgaged', status);
  };

  const handleFeatureChange = (feature) => {
    const currentFeatures = formData.features || [];
    let newFeatures;

    if (currentFeatures.includes(feature)) {
      newFeatures = currentFeatures.filter(f => f !== feature);
    } else {
      newFeatures = [...currentFeatures, feature];
    }

    handleInputChange('features', newFeatures);
  };

  // Location functions
  const closeAllDropdowns = () => {
    setIsCityOpen(false);
    setIsDistrictOpen(false);
    setIsSettlementOpen(false);
    setShowSearchResults(false);
  };

  const clearAllSelections = () => {
    setSelectedAddress('');
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    
    handleInputChange('selectedAddress', '');
    handleInputChange('searchQuery', '');
    handleInputChange('latitude', null);
    handleInputChange('longitude', null);
    
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null);
      currentMarkerRef.current = null;
    }
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: 40.1431, lng: 47.5769 });
      mapInstanceRef.current.setZoom(7);
    }
  };

  const searchAddress = async (query) => {
    const mockResults = [
      {
        id: 'mock-1',
        label: `${query}, Bakı, Azərbaycan`,
        lat: 40.4093 + (Math.random() - 0.5) * 0.1,
        lng: 49.8671 + (Math.random() - 0.5) * 0.1
      },
      {
        id: 'mock-2', 
        label: `${query} küçəsi, Bakı, Azərbaycan`,
        lat: 40.4093 + (Math.random() - 0.5) * 0.1,
        lng: 49.8671 + (Math.random() - 0.5) * 0.1
      }
    ];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const directResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=az&limit=5&addressdetails=1`,
        { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'LocationSearch/1.0'
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        return data.map((item, index) => ({
          id: `search-${index}`,
          label: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }));
      }
      
      return mockResults.filter(result => 
        result.label.toLowerCase().includes(query.toLowerCase())
      );
      
    } catch (error) {
      console.error('Address search failed:', error);
      return mockResults;
    }
  };

  const getAddressFromCoords = async (lat, lng) => {
    const generateMockAddress = (lat, lng) => {
      const streets = ['Nizami', 'Həsən bəy Zərdabi', 'Təbriz', 'Azadlıq', 'Füzuli', 'Nəsimi', 'Atatürk'];
      const districts = ['Nəsimi rayonu', 'Yasamal rayonu', 'Nizami rayonu', 'Səbail rayonu'];
      
      const street = streets[Math.floor(Math.random() * streets.length)];
      const number = Math.floor(Math.random() * 100) + 1;
      const district = districts[Math.floor(Math.random() * districts.length)];
      
      return `${street} küçəsi ${number}, ${district}, Bakı, Azərbaycan`;
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const directResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1&countrycodes=az`,
        { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'LocationSearch/1.0'
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        return data.display_name || generateMockAddress(lat, lng);
      }
      
      return generateMockAddress(lat, lng);
      
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return generateMockAddress(lat, lng);
    }
  };

  const addMarkerToMap = (lat, lng, address = null) => {
    if (!mapInstanceRef.current || !window.google) return;
    
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null);
    }
    
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      draggable: true,
      animation: window.google.maps.Animation.DROP
    });
    
    marker.addListener('dragend', async (event) => {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      
      handleInputChange('latitude', newLat);
      handleInputChange('longitude', newLng);
      
      try {
        const newAddress = await getAddressFromCoords(newLat, newLng);
        setSelectedAddress(newAddress);
        setSearchQuery(newAddress);
        handleInputChange('selectedAddress', newAddress);
        handleInputChange('searchQuery', newAddress);
      } catch (error) {
        console.error('Failed to get address:', error);
      }
    });
    
    currentMarkerRef.current = marker;
    
    mapInstanceRef.current.panTo({ lat, lng });
    mapInstanceRef.current.setZoom(15);
    
    if (address) {
      setSelectedAddress(address);
      setSearchQuery(address);
      handleInputChange('latitude', lat);
      handleInputChange('longitude', lng);
      handleInputChange('selectedAddress', address);
      handleInputChange('searchQuery', address);
    }
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleInputChange('searchQuery', value);
    
    setIsCityOpen(false);
    setIsDistrictOpen(false);
    setIsSettlementOpen(false);
    
    if (value === '') {
      clearAllSelections();
      return;
    }
    
    if (selectedAddress && !value.includes(selectedAddress)) {
      setSelectedAddress('');
      handleInputChange('selectedAddress', '');
    }
    
    setShowSearchResults(true);
    
    if (value.length >= 3) {
      setIsSearching(true);
      try {
        const results = await searchAddress(value);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultSelect = (result) => {
    setSelectedAddress(result.label);
    setSearchQuery(result.label);
    setSearchResults([]);
    setShowSearchResults(false);
    
    handleInputChange('latitude', result.lat);
    handleInputChange('longitude', result.lng);
    handleInputChange('selectedAddress', result.label);
    handleInputChange('searchQuery', result.label);
    
    addMarkerToMap(result.lat, result.lng, result.label);
  };

  const handleSelectCity = (value, label) => {
    setIsCityOpen(false);
    handleInputChange('selectedCity', value);
    closeAllDropdowns();
  };

  const handleSelectDistrict = (value, label) => {
    setIsDistrictOpen(false);
    handleInputChange('selectedDistrict', value);
    closeAllDropdowns();
  };

  const handleSelectSettlement = (value, label) => {
    setIsSettlementOpen(false);
    handleInputChange('selectedSettlement', value);
    closeAllDropdowns();
  };

  // Initialize Google Maps
  useEffect(() => {
    let isMounted = true;
    let checkInterval;

    const waitForGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 100;
        
        checkInterval = setInterval(() => {
          attempts++;
          
          if (window.google?.maps?.Map) {
            clearInterval(checkInterval);
            resolve();
          } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            reject(new Error("Google Maps failed to load"));
          }
        }, 100);
      });
    };

    const loadGoogleMapsScript = () => {
      if (scriptLoadingRef.current && loadingPromiseRef.current) {
        return loadingPromiseRef.current;
      }

      if (window.google?.maps?.Map) {
        return Promise.resolve();
      }

      scriptLoadingRef.current = true;

      loadingPromiseRef.current = new Promise((resolve, reject) => {
        const existingScript = document.querySelector('script[src*="maps.googleapis"]');
        if (existingScript) {
          waitForGoogleMaps()
            .then(() => {
              scriptLoadingRef.current = false;
              resolve();
            })
            .catch((err) => {
              scriptLoadingRef.current = false;
              reject(err);
            });
          return;
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        
        script.onload = () => {
          waitForGoogleMaps()
            .then(() => {
              scriptLoadingRef.current = false;
              resolve();
            })
            .catch((err) => {
              scriptLoadingRef.current = false;
              reject(err);
            });
        };
        
        script.onerror = () => {
          scriptLoadingRef.current = false;
          reject(new Error("Failed to load Google Maps script"));
        };
        
        document.head.appendChild(script);
      });

      return loadingPromiseRef.current;
    };

    const initMap = async () => {
      try {
        if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

        if (!googleMapsLoadedRef.current) {
          await loadGoogleMapsScript();
          googleMapsLoadedRef.current = true;
        }
        
        if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

        if (!window.google?.maps?.Map) {
          throw new Error("Google Maps API not available");
        }

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 40.1431, lng: 47.5769 },
          zoom: 7,
        });

        map.addListener('click', async (event) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          
          try {
            const address = await getAddressFromCoords(lat, lng);
            addMarkerToMap(lat, lng, address);
          } catch (error) {
            console.error('Failed to get address:', error);
            const coordsAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            addMarkerToMap(lat, lng, coordsAddress);
          }
        });

        mapInstanceRef.current = map;
        if (isMounted) {
          setMapLoaded(true);
        }
        
        
      } catch (error) {
        console.error('Failed to initialize map:', error);
        googleMapsLoadedRef.current = false;
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (currentMarkerRef.current) {
        currentMarkerRef.current.setMap(null);
        currentMarkerRef.current = null;
      }
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, []);

  const shouldShowField = (fieldName) => {
    switch (fieldName) {
      case 'area':
        return activePropertyType && activePropertyType !== 'land';
      case 'landArea':
        return activePropertyType === 'house' ||
          activePropertyType === 'land' ||
          (activePropertyType === 'office' && activeOfficeType === 'gardenHouse');
      case 'floor':
        return activePropertyType === 'apartment' ||
          activePropertyType === 'object' ||
          (activePropertyType === 'office' && activeOfficeType !== 'gardenHouse');
      case 'totalFloors':
        return activePropertyType === 'apartment' ||
          activePropertyType === 'house' ||
          activePropertyType === 'office' ||
          activePropertyType === 'object';
      case 'rooms':
      case 'bathrooms':
        return activePropertyType === 'apartment' ||
          activePropertyType === 'house' ||
          activePropertyType === 'object' ||
          (activePropertyType === 'office' && activeOfficeType !== 'businessCenter');
      case 'price':
        return activePropertyType === "house" ||
          activePropertyType === "object" ||
          (activePropertyType === "office" && activeOfficeType === "apartmentOffice") ||
          activePropertyType === "garage" ||
          activePropertyType === "land";
      case 'buildingType':
        return (activePropertyType === 'apartment' ||
          activePropertyType === 'object' ||
          (activePropertyType === 'office' && activeOfficeType !== 'gardenHouse'));
      case 'repairStatus':
        return activePropertyType && activePropertyType !== 'land';
      default:
        return true;
    }
  };

const selectedCityLabel = azeCity.find(loc => 
  loc.value === formData.selectedCity || loc.label === formData.selectedCity
)?.label || 'Şəhər seçin';

const selectedDistrictLabel = azeDistrict.find(loc => 
  loc.value === formData.selectedDistrict || loc.label === formData.selectedDistrict
)?.label || 'Rayon seçin';

const selectedSettlementLabel = azeSettlement.find(loc => 
  loc.value === formData.selectedSettlement || loc.label === formData.selectedSettlement
)?.label || 'Qəsəbə seçin';

const handleDeleteImage = (indexToDelete) => {
  const newImages = images.filter((_, idx) => idx !== indexToDelete);
  setImages(newImages);
  handleInputChange('images', newImages);
  if (selectedIndex >= newImages.length && newImages.length > 0) {
    setSelectedIndex(newImages.length - 1);
  }
};

const handleAddImages = (e) => {
  const files = Array.from(e.target.files);
  const newImageUrls = files.map(file => URL.createObjectURL(file));
  const updatedImages = [...images, ...newImageUrls];
  setImages(updatedImages);
  handleInputChange('images', updatedImages);
};

const openPreview = (image) => {
  setPreviewImage(image);
  setDimensions({ width: 0, height: 0 });
};

const closePreview = () => {
  setPreviewImage(null);
  setDimensions({ width: 0, height: 0 });
};

return (
    <div className="fixed inset-0 z-8000 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col scrollbar-custom-wrapper">
        <style>
          {`
            .input-field {
              background-color: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              border: 1.5px solid rgba(0, 0, 0, 0.12);
              border-radius: 12px;
              box-shadow:
                0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06),
                inset 0 1px 0 rgba(255, 255, 255, 0.6);
              transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
              appearance: none;
              color: #1f2937;
            }

            .input-field:hover {
              border-color: #26B5A0;
            }

            .input-field:focus {
              outline: none;
              border-color: #1B8F7D;
              background-color: rgba(255, 255, 255, 0.98);
            }

            .remove-arrow::-webkit-outer-spin-button,
            .remove-arrow::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            .remove-arrow {
              -moz-appearance: textfield;
            }

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
          `}
        </style>

        {/* Header */}
        <div className="flex items-center justify-between py-4.5 px-8 border-b border-gray-200">
          <h2 className="text-[24px]/[20px] font-medium text-[#0A0D14]">Əlavə et</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Image src="/icons/cancel.svg" alt="Close" width={20} height={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-custom">
          {/* Photo/Video Management Section */}
  <div className="mb-6">
    {/* <div className='flex flex-row items-center justify-start gap-4 mb-4'>
    <h3 className="text-[20px]/[20px] font-medium text-primary">{editRow.announcementId}</h3>
    <h4 className='text-[#9CA3AF] text-[18px]/[20px] font-medium'>Elan ID</h4>
    </div> */}
    
    <div className="flex flex-col gap-3">
      {/* Main Preview Image */}
      {images.length > 0 && (
        <div
          className="relative w-full h-[280px] rounded-[8px] overflow-hidden cursor-pointer bg-gray-100"
          onClick={() => openPreview(images[selectedIndex])}
        >
          <Image
            alt="property_image"
            src={images[selectedIndex]}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Thumbnails Row */}
      <div className="w-auto flex gap-[12px] flex-wrap flex-row justify-start items-center rounded-2xl bg-white shadow-[0_4px_10px_0_rgba(0,0,0,0.10)] px-5 py-4"
      style={{ display: images.length === 0 ? 'none' : 'flex' }}>
{images.map((image, idx) => (
  <div
    key={idx}
    className={`thumb-bg relative min-w-[105px] w-[105px] h-[75px] rounded-[18px] overflow-hidden cursor-pointer transition-all group ${
      selectedIndex === idx 
        ? 'ring-2 ring-[#1B8F7D] opacity-100' 
        : 'opacity-70 hover:opacity-100'
    }`}
    onMouseEnter={() => setSelectedIndex(idx)}
    onClick={() => openPreview(image)}
  >
    <Image
      alt={`thumbnail_${idx}`}
      src={image}
      fill
      className="object-cover"
    />
    {/* Gradient Overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(250,250,250,0.30) 100%)"      }}
    />
    {/* Delete Button */}
    <button
      className="absolute top-2 right-2 w-[20px] h-[20px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteImage(idx);
      }}
    >
      <Image
        src="/icons/delete-button.svg"
        alt="Delete"
        width={20}
        height={20}
      />
    </button>
  </div>
))}
        {/* Add Button */}
        {images.length !== 0 && (
        <button
          className="min-w-[50px] w-[50px] h-[50px] rounded-full bg-[#FAFAFA] flex items-center justify-center cursor-pointer shadow-[0_4px_10px_0_rgba(0,0,0,0.15)] ml-4"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus size={20} className="text-black" />
        </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleAddImages}
        />
      </div>


      {images.length === 0 && (
        <div 
          className="w-full h-[200px] rounded-[8px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#1B8F7D] transition-colors bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus size={32} className="text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">Şəkil və ya video əlavə edin</p>
        </div>
      )}
    </div>
  </div>
          {/* FOR SALE SECTION */}
          <div className="space-y-6">
            <div>
              <h5 className="text-xl font-medium text-black mb-4">Xüsusiyyətlər</h5>
              <h6 className="text-lg text-black mb-4">Əmlak növü</h6>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <PropertyTypeButton
                src="/icons/apartment-black.svg"
                srcOnHover="/icons/apartment-white.svg"
                text="Mənzil"
                isActive={activePropertyType === 'apartment'}
                onClick={() => updatePropertyType('apartment')}
              />
              <PropertyTypeButton
                src="/icons/home-sale-black.svg"
                srcOnHover="/icons/home-sale-white.svg"
                text="Obyekt"
                isActive={activePropertyType === 'object'}
                onClick={() => updatePropertyType('object')}
              />
              <PropertyTypeButton
                src="/icons/land-black.svg"
                srcOnHover="/icons/land-white.svg"
                text="Torpaq"
                isActive={activePropertyType === 'land'}
                onClick={() => updatePropertyType('land')}
              />
              <PropertyTypeButton
                src="/icons/house-black.svg"
                srcOnHover="/icons/house-white.svg"
                text="Həyət/Bağ/Villa"
                isActive={activePropertyType === 'house'}
                onClick={() => updatePropertyType('house')}
              />
              <PropertyTypeButton
                src="/icons/office-black.svg"
                srcOnHover="/icons/office-white.svg"
                text="Ofis"
                isActive={activePropertyType === 'office'}
                onClick={() => updatePropertyType('office')}
              />
              <PropertyTypeButton
                src="/icons/garage-black.svg"
                srcOnHover="/icons/garage-white.svg"
                text="Qaraj"
                isActive={activePropertyType === 'garage'}
                onClick={() => updatePropertyType('garage')}
              />
            </div>

            {activePropertyType === 'office' && (
              <div className="space-y-3">
                <h6 className="text-lg text-black">Ofisin tipi</h6>
                <div className="grid grid-cols-3 gap-0">
                  <button
                    type="button"
                    className={`h-11 flex justify-center items-center rounded-l-lg border text-sm transition-colors ${
                      activeOfficeType === 'businessCenter'
                        ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white'
                        : 'border-[#E9E9E9] bg-[#FAFAFA] text-black'
                    }`}
                    onClick={() => updateOfficeType('businessCenter')}
                  >
                    Biznes mərkəzi
                  </button>
                  <button
                    type="button"
                    className={`h-11 flex justify-center items-center border-t border-b text-sm transition-colors ${
                      activeOfficeType === 'apartmentOffice'
                        ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white'
                        : 'border-[#E9E9E9] bg-[#FAFAFA] text-black'
                    }`}
                    onClick={() => updateOfficeType('apartmentOffice')}
                  >
                    Mənzil
                  </button>
                  <button
                    type="button"
                    className={`h-11 flex justify-center items-center rounded-r-lg border text-sm transition-colors ${
                      activeOfficeType === 'gardenHouse'
                        ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white'
                        : 'border-[#E9E9E9] bg-[#FAFAFA] text-black'
                    }`}
                    onClick={() => updateOfficeType('gardenHouse')}
                  >
                    Bağ evi
                  </button>
                </div>
              </div>
            )}

            {((activePropertyType && activePropertyType !== 'office') ||
              (activePropertyType === 'office' && activeOfficeType)) && (
              <>
                {shouldShowField('repairStatus') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {shouldShowField('buildingType') && (
                      <div className="space-y-3">
                        <h6 className="text-lg text-black">Bina</h6>
                        <div className="grid grid-cols-2 gap-0">
                          <button
                            type="button"
                            className={`h-11 flex justify-center items-center rounded-l-lg border text-sm transition-colors ${
                              activeBuilding === 'newBuilding'
                                ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white'
                                : 'border-[#E9E9E9] bg-[#FAFAFA] text-black'
                            }`}
                            onClick={() => updateBuildingType('newBuilding')}
                          >
                            Yeni tikili
                          </button>
                          <button
                            type="button"
                            className={`h-11 flex justify-center items-center rounded-r-lg border text-sm transition-colors ${
                              activeBuilding === 'oldBuilding'
                                ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white'
                                : 'border-[#E9E9E9] bg-[#FAFAFA] text-black'
                            }`}
                            onClick={() => updateBuildingType('oldBuilding')}
                          >
                            Köhnə tikili
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h6 className="text-lg text-black">Təmiri</h6>
                      <div className="grid grid-cols-2 gap-0">
                        <button
                          type="button"
                          className={`h-11 flex justify-center items-center rounded-l-lg border text-sm transition-colors ${
                            activeRepaired === 'renewed'
                              ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white'
                              : 'border-[#E9E9E9] bg-[#FAFAFA] text-black'
                          }`}
                          onClick={() => updateRepairStatus('renewed')}
                        >
                          Təmirli
                        </button>
                        <button
                          type="button"
                          className={`h-11 flex justify-center items-center rounded-r-lg border text-sm transition-colors ${
                            activeRepaired === 'notRenewed'
                              ? 'border-[#1B8F7D] bg-[#1B8F7D] text-white'
                              : 'border-[#E9E9E9] bg-[#FAFAFA] text-black'
                          }`}
                          onClick={() => updateRepairStatus('notRenewed')}
                        >
                          Təmirsiz
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-base font-medium text-black">
                    {activePropertyType === 'garage' ? 'Hazırda kreditdədir?' : 'Hazırda ipoteka və ya kreditdədir?'}
                  </p>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mortgageYes"
                        name="isMortgaged"
                        className="w-5 h-5 accent-[#1B8F7D]"
                        checked={isMortgaged === true}
                        onChange={() => updateMortgageStatus(true)}
                      />
                      <label htmlFor="mortgageYes" className="ml-2 text-base text-black">
                        Bəli
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mortgageNo"
                        name="isMortgaged"
                        className="w-5 h-5 accent-[#1B8F7D]"
                        checked={isMortgaged === false}
                        onChange={() => updateMortgageStatus(false)}
                      />
                      <label htmlFor="mortgageNo" className="ml-2 text-base text-black">
                        Xeyr
                      </label>
                    </div>
                  </div>
                </div>

                {isMortgaged && (
                  <div className="space-y-4">
                    <p className="text-base font-medium text-black">
                      {activePropertyType === 'garage' ? 'Kredit məlumatları' : 'İpoteka/Kredit məlumatları'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="initialPayment" className="text-base text-black">
                          İlkin ödəniş
                        </label>
                        <input
                          type="number"
                          id="initialPayment"
                          value={formData.initialPayment}
                          onChange={(e) => handleInputChange('initialPayment', e.target.value)}
                          className="w-full h-10 px-3 py-2 input-field remove-arrow"
                          placeholder="Məs: 10000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="monthlyPayment" className="text-base text-black">
                          Aylıq ödəniş
                        </label>
                        <input
                          type="number"
                          id="monthlyPayment"
                          value={formData.monthlyPayment}
                          onChange={(e) => handleInputChange('monthlyPayment', e.target.value)}
                          className="w-full h-10 px-3 py-2 input-field remove-arrow"
                          placeholder="Məs: 500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="remainingMonths" className="text-base text-black">
                          Qalıq ay
                        </label>
                        <input
                          type="number"
                          id="remainingMonths"
                          value={formData.remainingMonths}
                          onChange={(e) => handleInputChange('remainingMonths', e.target.value)}
                          className="w-full h-10 px-3 py-2 input-field remove-arrow"
                          placeholder="Məs: 6"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {shouldShowField('area') && (
                    <div className="space-y-2">
                      <label htmlFor="area" className="text-lg text-black">
                        {activePropertyType === 'house' ? 'Evin tikili sahəsi' : 'Sahə'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="area"
                          value={formData.area}
                          onChange={(e) => handleInputChange('area', e.target.value)}
                          className="w-full h-10 pr-12 pl-3 py-2 input-field remove-arrow"
                          placeholder="Sahə"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                          {activePropertyType === 'house' ||
                          (activePropertyType === 'office' && activeOfficeType === 'gardenHouse')
                            ? 'sot'
                            : 'm²'}
                        </span>
                      </div>
                    </div>
                  )}

                  {shouldShowField('landArea') && (
                    <div className="space-y-2">
                      <label htmlFor="landArea" className="text-lg text-black">
                        Torpağın sahəsi
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="landArea"
                          value={formData.landArea}
                          onChange={(e) => handleInputChange('landArea', e.target.value)}
                          className="w-full h-10 pr-12 pl-3 py-2 input-field remove-arrow"
                          placeholder="Sahə"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                          sot
                        </span>
                      </div>
                    </div>
                  )}

                  {shouldShowField('floor') && (
                    <div className="space-y-2">
                      <label htmlFor="floor" className="text-lg text-black">
                        Mərtəbə
                      </label>
                      <input
                        type="number"
                        id="floor"
                        value={formData.floor}
                        onChange={(e) => handleInputChange('floor', e.target.value)}
                        className="w-full h-10 px-3 py-2 input-field remove-arrow"
                        placeholder="Mərtəbə"
                      />
                    </div>
                  )}

                  {shouldShowField('totalFloors') && (
                    <div className="space-y-2">
                      <label htmlFor="totalFloors" className="text-lg text-black">
                        Ümumi mərtəbələr
                      </label>
                      <input
                        type="number"
                        id="totalFloors"
                        value={formData.totalFloors}
                        onChange={(e) => handleInputChange('totalFloors', e.target.value)}
                        className="w-full h-10 px-3 py-2 input-field remove-arrow"
                        placeholder="Sayı"
                      />
                    </div>
                  )}

                  {shouldShowField('rooms') && (
                    <div className="space-y-2">
                      <label htmlFor="rooms" className="text-lg text-black">
                        Otaq
                      </label>
                      <input
                        type="number"
                        id="rooms"
                        value={formData.rooms}
                        onChange={(e) => handleInputChange('rooms', e.target.value)}
                        className="w-full h-10 px-3 py-2 input-field remove-arrow"
                        placeholder="Sayı"
                      />
                    </div>
                  )}

                  {shouldShowField('bathrooms') && (
                    <div className="space-y-2">
                      <label htmlFor="bathrooms" className="text-lg text-black">
                        Sanitar qovşağı
                      </label>
                      <input
                        type="number"
                        id="bathrooms"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                        className="w-full h-10 px-3 py-2 input-field remove-arrow"
                        placeholder="Sayı"
                      />
                    </div>
                  )}

                  {shouldShowField('price') && (
                    <div className="space-y-2">
                      <label htmlFor="price" className="text-lg text-black">
                        Qiyməti
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full h-10 px-3 py-2 input-field remove-arrow"
                        placeholder="Qiymət"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* DETAILS SECTION */}
          <div className="mt-10 pt-8 border-t border-gray-200 space-y-6">
            <h5 className="text-xl font-medium text-black">Detallar</h5>

            <div className="space-y-2">
              <p className="text-base font-medium text-black">Çıxarış?</p>
              <div className="flex items-center gap-8">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="exitTheres"
                    name="exit"
                    value="theres"
                    className="w-5 h-5 accent-[#1B8F7D]"
                    checked={formData.exit === 'theres'}
                    onChange={(e) => handleInputChange('exit', e.target.value)}
                  />
                  <label htmlFor="exitTheres" className="ml-2 text-base text-black">
                    Var
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="exitTheresNot"
                    name="exit"
                    value="theresNot"
                    className="w-5 h-5 accent-[#1B8F7D]"
                    checked={formData.exit === 'theresNot'}
                    onChange={(e) => handleInputChange('exit', e.target.value)}
                  />
                  <label htmlFor="exitTheresNot" className="ml-2 text-base text-black">
                    Yoxdur
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-lg text-black">İpotekaya yararlıdır?</p>
              <div className="flex items-center gap-8">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mortgageYesDetail"
                    name="mortgage"
                    value="yes"
                    className="w-5 h-5 accent-[#1B8F7D]"
                    checked={formData.mortgage === 'yes'}
                    onChange={(e) => handleInputChange('mortgage', e.target.value)}
                  />
                  <label htmlFor="mortgageYesDetail" className="ml-2 text-base text-black">
                    Bəli
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mortgageNoDetail"
                    name="mortgage"
                    value="no"
                    className="w-5 h-5 accent-[#1B8F7D]"
                    checked={formData.mortgage === 'no'}
                    onChange={(e) => handleInputChange('mortgage', e.target.value)}
                  />
                  <label htmlFor="mortgageNoDetail" className="ml-2 text-base text-black">
                    Xeyr
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-lg text-black">Əlavə xüsusiyyətlər</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePropertyType !== 'house' && (
                  <>
                    {activePropertyType !== 'land' && activePropertyType !== 'garage' && (
                      <>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="parking"
                            className="svg-checkbox"
                            checked={formData.features.includes('parking')}
                            onChange={() => handleFeatureChange('parking')}
                          />
                          <label htmlFor="parking" className="ml-2 text-base text-black">
                            Parking
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="furniture"
                            className="svg-checkbox"
                            checked={formData.features.includes('furniture')}
                            onChange={() => handleFeatureChange('furniture')}
                          />
                          <label htmlFor="furniture" className="ml-2 text-base text-black">
                            Mebel
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="bigAppliances"
                            className="svg-checkbox"
                            checked={formData.features.includes('bigAppliances')}
                            onChange={() => handleFeatureChange('bigAppliances')}
                          />
                          <label htmlFor="bigAppliances" className="ml-2 text-base text-black">
                            Böyük məişət texnikası
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="balcony"
                            className="svg-checkbox"
                            checked={formData.features.includes('balcony')}
                            onChange={() => handleFeatureChange('balcony')}
                          />
                          <label htmlFor="balcony" className="ml-2 text-base text-black">
                            Çardaq
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="lift"
                            className="svg-checkbox"
                            checked={formData.features.includes('lift')}
                            onChange={() => handleFeatureChange('lift')}
                          />
                          <label htmlFor="lift" className="ml-2 text-base text-black">
                            Lift
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="smallAppliances"
                            className="svg-checkbox"
                            checked={formData.features.includes('smallAppliances')}
                            onChange={() => handleFeatureChange('smallAppliances')}
                          />
                          <label htmlFor="smallAppliances" className="ml-2 text-base text-black">
                            Kiçik məişət texnikası
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="heatingSystem"
                            className="svg-checkbox"
                            checked={formData.features.includes('heatingSystem')}
                            onChange={() => handleFeatureChange('heatingSystem')}
                          />
                          <label htmlFor="heatingSystem" className="ml-2 text-base text-black">
                            İstilik sistemi
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="coolingSystem"
                            className="svg-checkbox"
                            checked={formData.features.includes('coolingSystem')}
                            onChange={() => handleFeatureChange('coolingSystem')}
                          />
                          <label htmlFor="coolingSystem" className="ml-2 text-base text-black">
                            Soyutma sistemi
                          </label>
                        </div>
                      </>
                    )}

                    {activePropertyType !== 'land' && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="security"
                          className="svg-checkbox"
                          checked={formData.features.includes('security')}
                          onChange={() => handleFeatureChange('security')}
                        />
                        <label htmlFor="security" className="ml-2 text-base text-black">
                          Təhlükəsizlik sistemi
                        </label>
                      </div>
                    )}
                  </>
                )}

                {activePropertyType === 'garage' && (
                  <>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="separateBuilding"
                        className="svg-checkbox"
                        checked={formData.features.includes('separateBuilding')}
                        onChange={() => handleFeatureChange('separateBuilding')}
                      />
                      <label htmlFor="separateBuilding" className="ml-2 text-base text-black">
                        Ayrı tikili
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="underground"
                        className="svg-checkbox"
                        checked={formData.features.includes('underground')}
                        onChange={() => handleFeatureChange('underground')}
                      />
                      <label htmlFor="underground" className="ml-2 text-base text-black">
                        Bina altı
                      </label>
                    </div>
                  </>
                )}

                {activePropertyType === 'house' && (
                  <>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="doubleStone"
                        className="svg-checkbox"
                        checked={formData.features.includes('doubleStone')}
                        onChange={() => handleFeatureChange('doubleStone')}
                      />
                      <label htmlFor="doubleStone" className="ml-2 text-base text-black">
                        Qoşa daşla
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="combi"
                        className="svg-checkbox"
                        checked={formData.features.includes('combi')}
                        onChange={() => handleFeatureChange('combi')}
                      />
                      <label htmlFor="combi" className="ml-2 text-base text-black">
                        Kombi
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="interfloorMonolith"
                        className="svg-checkbox"
                        checked={formData.features.includes('interfloorMonolith')}
                        onChange={() => handleFeatureChange('interfloorMonolith')}
                      />
                      <label htmlFor="interfloorMonolith" className="ml-2 text-base text-black">
                        Mərtəbə arası monolit
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="gas"
                        className="svg-checkbox"
                        checked={formData.features.includes('gas')}
                        onChange={() => handleFeatureChange('gas')}
                      />
                      <label htmlFor="gas" className="ml-2 text-base text-black">
                        Qaz
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="waterTank"
                        className="svg-checkbox"
                        checked={formData.features.includes('waterTank')}
                        onChange={() => handleFeatureChange('waterTank')}
                      />
                      <label htmlFor="waterTank" className="ml-2 text-base text-black">
                        Su çəni
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="chair"
                        className="svg-checkbox"
                        checked={formData.features.includes('chair')}
                        onChange={() => handleFeatureChange('chair')}
                      />
                      <label htmlFor="chair" className="ml-2 text-base text-black">
                        Kürsü
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sewage"
                        className="svg-checkbox"
                        checked={formData.features.includes('sewage')}
                        onChange={() => handleFeatureChange('sewage')}
                      />
                      <label htmlFor="sewage" className="ml-2 text-base text-black">
                        Mərkəzi kanalizasiya
                      </label>
                    </div>
                  </>
                )}

                {(activePropertyType === 'garage' || activePropertyType === 'house') && (
                  <>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="light"
                        className="svg-checkbox"
                        checked={formData.features.includes('light')}
                        onChange={() => handleFeatureChange('light')}
                      />
                      <label htmlFor="light" className="ml-2 text-base text-black">
                        İşıq
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="water"
                        className="svg-checkbox"
                        checked={formData.features.includes('water')}
                        onChange={() => handleFeatureChange('water')}
                      />
                      <label htmlFor="water" className="ml-2 text-base text-black">
                        Su
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

             {/* LOCATION SECTION */}
          <div className="mt-10 pt-8 border-t border-gray-200 space-y-6">
            <h5 className="text-xl font-medium text-black">Məkan</h5>

            {/* City, District, Settlement Row */}
            <div className='grid grid-cols-3 max-[1150px]:grid-cols-1 gap-6 w-full'>
              {/* City Selection */}
              <div className='flex flex-col items-start justify-center gap-2 relative'>
                <h6 className='text-black text-lg font-medium'>
                  Şəhər
                </h6>

                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => {
                      closeAllDropdowns();
                      setIsCityOpen(!isCityOpen);
                    }}
                    className={`w-full px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] ${
                      isCityOpen ? 'border-[#26B5A0] ring-2 ring-[#26B5A0]' : 'border-gray-300'
                    } ${formData.selectedCity ? 'text-gray-900' : 'text-black'}`}
                  >
                    <span className="truncate">
                      {selectedCityLabel}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                        isCityOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {isCityOpen && (
                    <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto scrollbar-custom">
                      {azeCity.map((location) => (
                        <button
                          key={location.value}
                          type="button"
                          onClick={() => handleSelectCity(location.value, location.label)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-gray-900 font-medium">{location.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* District Selection */}
              <div className='flex flex-col items-start justify-center gap-2 relative'>
                <h6 className='text-black text-lg font-medium'>
                  Rayon
                </h6>

                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => {
                      closeAllDropdowns();
                      setIsDistrictOpen(!isDistrictOpen);
                    }}
                    className={`w-full px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] ${
                      isDistrictOpen ? 'border-[#26B5A0] ring-2 ring-[#26B5A0]' : 'border-gray-300'
                    } ${formData.selectedDistrict ? 'text-gray-900' : 'text-black'}`}
                  >
                    <span className="truncate">
                      {selectedDistrictLabel}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                        isDistrictOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {isDistrictOpen && (
                    <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto scrollbar-custom">
                      {azeDistrict.map((location) => (
                        <button
                          key={location.value}
                          type="button"
                          onClick={() => handleSelectDistrict(location.value, location.label)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-gray-900 font-medium">{location.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Settlement Selection */}
              <div className='flex flex-col items-start justify-center gap-2 relative'>
                <h6 className='text-black text-lg font-medium'>
                  Qəsəbə
                </h6>

                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => {
                      closeAllDropdowns();
                      setIsSettlementOpen(!isSettlementOpen);
                    }}
                    className={`w-full px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] ${
                      isSettlementOpen ? 'border-[#26B5A0] ring-2 ring-[#26B5A0]' : 'border-gray-300'
                    } ${formData.selectedSettlement ? 'text-gray-900' : 'text-black'}`}
                  >
                    <span className="truncate">
                      {selectedSettlementLabel}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                        isSettlementOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {isSettlementOpen && (
                    <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto scrollbar-custom">
                      {azeSettlement.map((location) => (
                        <button
                          key={location.value}
                          type="button"
                          onClick={() => handleSelectSettlement(location.value, location.label)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-gray-900 font-medium">{location.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Search Section */}
            <div className='flex flex-col items-start justify-center gap-3 w-full relative'>
              <h6 className='text-black text-lg font-medium'>
                Əmlakın yeri
              </h6>

              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => {
                    closeAllDropdowns();
                    if (searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  onBlur={(e) => {
                    setTimeout(() => {
                      if (e.currentTarget && !e.currentTarget.contains(document.activeElement)) {
                        setShowSearchResults(false);
                      }
                    }, 150);
                  }}
                  placeholder="Ünvan axtarın və ya xəritədən seçin..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] pr-10"
                />
                
                {(searchQuery || selectedAddress) && (
                  <button
                    type="button"
                    onClick={clearAllSelections}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                {showSearchResults && (
                  <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto scrollbar-custom">
                    {isSearching && (
                      <div className="px-4 py-3 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                        Axtarılır...
                      </div>
                    )}
                    
                    {searchResults.length > 0 && !isSearching && (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                          Axtarış nəticələri:
                        </div>
                        {searchResults.map((result) => (
                          <button
                            key={result.id}
                            type="button"
                            onClick={() => handleSearchResultSelect(result)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                          >
                            <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-900 font-medium text-sm">{result.label}</span>
                          </button>
                        ))}
                      </>
                    )}
                    
                    {searchQuery && searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
                      <div className="px-4 py-3 text-center text-gray-500">
                        "{searchQuery}" üçün heç bir nəticə tapılmadı
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div className="flex flex-col items-start justify-center gap-3 w-full">
              <h6 className="text-black text-lg font-medium">Xəritədə seçin</h6>
              <p className="text-gray-600 text-sm">
                Dəqiq ünvan üçün xəritədə istədiyiniz yeri klikləyin. Markeri sürükləyərək yerini dəyişə bilərsiniz.
              </p>

              <div className="relative w-full" style={{ height: '400px' }}>
                {!mapLoaded && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg border z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Xəritə yüklənir...</p>
                    </div>
                  </div>
                )}

                <div
                  ref={mapRef}
                  className="w-full h-full rounded-lg border border-gray-300"
                  style={{ background: '#e5e7eb' }}
                />
              </div>
            </div>
          </div>

            <div className="space-y-2">
              <p className="text-lg text-black">Təsviri</p>
              <textarea
                className="w-full min-h-[120px] border border-[#E9E9E9] rounded-lg p-3 text-base resize-y transition-all duration-200 focus:outline-none focus:border-[#1B8F7D]"
                placeholder="Əlavə məlumat daxil edin"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={5000}
                minLength={50}
              />
              <p className="text-sm text-gray-500 text-right">
                {formData.description.length}/5000
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Ləğv et
          </button>
          <button
            onClick={handleSaveClick}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#1B8F7D] hover:bg-[#157066] rounded-lg transition-colors"
          >
            Əlavə et
          </button>
        </div>
        {previewImage && (
  <div
    className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center"
    onClick={closePreview}
  >
    {/* Navigation Buttons */}
    <button
      className="absolute left-4 z-[10001] text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 hover:bg-black/70"
      onClick={(e) => {
        e.stopPropagation();
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : images.length - 1;
        setSelectedIndex(newIndex);
        setPreviewImage(images[newIndex]);
        setDimensions({ width: 0, height: 0 });
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>

    {/* Close Button */}
    <button
      className="absolute top-4 right-4 z-[10001] text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 hover:bg-black/70"
      onClick={(e) => {
        e.stopPropagation();
        closePreview();
      }}
    >
      <X size={24} />
    </button>

    {/* Preview Image */}
    <div 
      className="relative max-w-[85vw] max-h-[85vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {dimensions.width > 0 && dimensions.height > 0 ? (
        <div
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
          }}
          className="relative"
        >
          <Image
            alt="Preview"
            src={previewImage}
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <Image
          alt="Preview"
          src={previewImage}
          width={1}
          height={1}
          className="opacity-0"
          onLoadingComplete={(img) => {
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            const maxWidth = window.innerWidth * 0.85;
            const maxHeight = window.innerHeight * 0.85;
            const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);
            setDimensions({
              width: naturalWidth * scale,
              height: naturalHeight * scale,
            });
          }}
        />
      )}
    </div>

    <button
      className="absolute right-4 z-[10001] text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 hover:bg-black/70"
      onClick={(e) => {
        e.stopPropagation();
        const newIndex = selectedIndex < images.length - 1 ? selectedIndex + 1 : 0;
        setSelectedIndex(newIndex);
        setPreviewImage(images[newIndex]);
        setDimensions({ width: 0, height: 0 });
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>

    {/* Thumbnail Strip in Preview */}
    <div 
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[85vw] overflow-x-auto px-4 py-2 bg-black/50 rounded-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {images.map((image, idx) => (
        <div
          key={idx}
          className={`relative shrink-0 w-[50px] h-[35px] rounded overflow-hidden cursor-pointer transition-all ${
            selectedIndex === idx 
              ? 'ring-2 ring-white opacity-100' 
              : 'opacity-50 hover:opacity-100'
          }`}
          onClick={() => {
            setSelectedIndex(idx);
            setPreviewImage(image);
            setDimensions({ width: 0, height: 0 });
          }}
        >
          <Image
            alt={`preview_thumb_${idx}`}
            src={image}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default AddPropertyModal;