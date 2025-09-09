import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react'

const Location = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentMarkerRef = useRef(null);
  
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedSettlement, setSelectedSettlement] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isCityOpen, setIsCityOpen] = useState(false)
  const [isDistrictOpen, setIsDistrictOpen] = useState(false)
  const [isSettlementOpen, setIsSettlementOpen] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState('')
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  const locations = [
    { value: 'baku-center', label: 'Bakı - Mərkəz' },
    { value: 'baku-sabail', label: 'Bakı - Sabail rayonu' },
    { value: 'baku-nasimi', label: 'Bakı - Nəsimi rayonu' },
    { value: 'baku-yasamal', label: 'Bakı - Yasamal rayonu' },
    { value: 'baku-nizami', label: 'Bakı - Nizami rayonu' },
    { value: 'ganja', label: 'Gəncə' },
    { value: 'sumgayit', label: 'Sumqayıt' },
    { value: 'mingachevir', label: 'Mingəçevir' },
    { value: 'other', label: 'Digər' }
  ]

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedLocation('')
    setSelectedAddress('')
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
    
    // Remove marker from map
    if (currentMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(currentMarkerRef.current);
      currentMarkerRef.current = null;
      // Reset map to default Azerbaijan view
      mapInstanceRef.current.setView([40.1431, 47.5769], 7);
    }
  };

  // Handle search input changes
  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If user clears the input, clear everything
    if (value === '') {
      clearAllSelections();
      return;
    }
    
    // Clear previous selections when user starts typing
    if (selectedLocation && selectedLocation !== 'custom-address') {
      setSelectedLocation('');
    }
    if (selectedAddress && !value.includes(selectedAddress)) {
      setSelectedAddress('');
    }
    
    // Show dropdown when typing
    setIsOpen(true);
    setShowSearchResults(true);
    
    // Perform search if query is long enough
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

  const searchAddress = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=az&limit=5&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.map((item, index) => ({
          id: `search-${index}`,
          label: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }));
      }
      return [];
    } catch (error) {
      console.error('Address search failed:', error);
      return [];
    }
  };

  // Handle search result selection
  const handleSearchResultSelect = (result) => {
    setSelectedAddress(result.label);
    setSelectedLocation('custom-address');
    setSearchQuery(result.label);
    setSearchResults([]);
    setShowSearchResults(false);
    setIsOpen(false);
    
    // Add marker to map
    addMarkerToMap(result.lat, result.lng, result.label);
  };

  // Handle predefined location selection
  const handleSelect = (value, label) => {
    if (value === 'custom-address') return;
    
    // Clear search-related state
    setSearchQuery(label);
    setSelectedLocation(value);
    setSelectedAddress('');
    setSearchResults([]);
    setShowSearchResults(false);
    setIsOpen(false);
    
    // Remove marker and reset map view
    if (currentMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(currentMarkerRef.current);
      currentMarkerRef.current = null;
      mapInstanceRef.current.setView([40.1431, 47.5769], 7);
    }
  }

  // Add marker to map helper function
  const addMarkerToMap = (lat, lng, address = null) => {
    if (!mapInstanceRef.current) return;
    
    // Remove existing marker
    if (currentMarkerRef.current) {
      mapInstanceRef.current.removeLayer(currentMarkerRef.current);
    }
    
    // Add new marker
    const marker = window.L.marker([lat, lng]).addTo(mapInstanceRef.current);
    currentMarkerRef.current = marker;
    
    // Pan to location
    mapInstanceRef.current.setView([lat, lng], 13);
    
    // Update address if provided
    if (address) {
      setSelectedAddress(address);
      setSelectedLocation('custom-address');
      setSearchQuery(address);
    }
  };

  // Pan map function
const panMap = useCallback((direction) => {
  if (!mapInstanceRef.current) return;

  const panPixels = 100; // how many pixels to pan per click
  let offset = [0, 0];

  switch (direction) {
    case "north":
      offset = [0, -panPixels];
      break;
    case "south":
      offset = [0, panPixels];
      break;
    case "east":
      offset = [panPixels, 0];
      break;
    case "west":
      offset = [-panPixels, 0];
      break;
  }

  mapInstanceRef.current.panBy(offset, { animate: true });
}, []);
  // Initialize map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        // Load Leaflet CSS if not already loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }

        // Load Leaflet script dynamically
        let L;
        if (!window.L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        L = window.L;
        
        if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

        // Create map with specific dimensions
        const map = L.map(mapRef.current, {
          center: [40.1431, 47.5769], // Baku, Azerbaijan
          zoom: 7,
          zoomControl: true,
          minZoom: 6,
          maxZoom: 18,
          preferCanvas: true
        });
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 18,
          minZoom: 6
        }).addTo(map);

        // Set bounds to Azerbaijan
        const azerbaijanBounds = L.latLngBounds(
          L.latLng(38.3929, 44.7939), // Southwest
          L.latLng(41.9555, 50.3928)  // Northeast
        );
        map.setMaxBounds(azerbaijanBounds);

        // Add click handler to get address
        map.on('click', async (e) => {
          const { lat, lng } = e.latlng;
          
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
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      currentMarkerRef.current = null;
    };
  }, []);

  // Get address from coordinates
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1&countrycodes=az`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
    
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const handleSelectCity = (value, label) => {
    setSelectedCity(value)
    setIsCityOpen(false)
  }

  const handleSelectDistrict = (value, label) => {
    setSelectedDistrict(value)
    setIsDistrictOpen(false)
  }

  const handleSelectSettlement = (value, label) => {
    setSelectedSettlement(value)
    setIsSettlementOpen(false)
  }

  // Get the display value for the input
  const getInputDisplayValue = () => {
    if (selectedLocation === 'custom-address' && selectedAddress) {
      return selectedAddress;
    }
    return searchQuery;
  };

  // Get placeholder text
  const getPlaceholderText = () => {
    if (selectedLocation && selectedLocation !== 'custom-address') {
      const found = locations.find(loc => loc.value === selectedLocation);
      return found?.label || 'Ünvan axtarın və ya xəritədən seçin...';
    }
    return 'Ünvan axtarın və ya xəritədən seçin...';
  };

  const selectedCityLabel = locations.find(loc => loc.value === selectedCity)?.label || 'Şəhər seçin'
  const selectedDistrictLabel = locations.find(loc => loc.value === selectedDistrict)?.label || 'Rayon seçin'
  const selectedSettlementLabel = locations.find(loc => loc.value === selectedSettlement)?.label || 'Qəsəbə seçin'

  return (
    <div className="w-full h-full pb-[16px] border-b border-[rgba(0,0,0,0.2)] flex items-start justify-start max-h-[444px] overflow-y-auto hide-scrollbar pl-[2px]">
      <div>
        <div className='flex flex-col items-start justify-center'>
          <h5 className='text-[#000] text-[24px]/[28px] font-medium'>
            Detallar
          </h5>

          <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
            <h6 className='text-[#000] text-[20px]/[24px] font-medium'>
              Əmlakın yeri
            </h6>

            <div className="relative w-[647px] h-10">
              <input
                type="text"
                value={getInputDisplayValue()}
                onChange={handleSearchInputChange}
                onFocus={() => {
                  setIsOpen(true);
                  if (searchResults.length > 0) {
                    setShowSearchResults(true);
                  }
                }}
                onBlur={(e) => {
                  // Delay closing to allow clicks on dropdown items
                  setTimeout(() => {
                    if (!e.currentTarget.contains(document.activeElement)) {
                      setIsOpen(false);
                      setShowSearchResults(false);
                    }
                  }, 150);
                }}
                placeholder={getPlaceholderText()}
                className="w-full px-[10px] py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary border-black pr-10"
              />
              
              {/* Clear button */}
              {(searchQuery || selectedAddress) && (
                <button
                  type="button"
                  onClick={clearAllSelections}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {/* Dropdown Content */}
              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {/* Show loading state */}
                  {isSearching && showSearchResults && (
                    <div className="px-4 py-3 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                      Axtarılır...
                    </div>
                  )}
                  
                  {/* Show search results */}
                  {searchResults.length > 0 && showSearchResults && !isSearching && (
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
                  
                  {/* Show no results message */}
                  {searchQuery && searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && showSearchResults && (
                    <div className="px-4 py-3 text-center text-gray-500">
                      "{searchQuery}" üçün heç bir nəticə tapılmadı
                    </div>
                  )}
                  
                  {/* Show hint when dropdown is open but no search query */}
                  {isOpen && !searchQuery && searchResults.length === 0 && !showSearchResults && (
                    <div className="px-4 py-3 text-center text-gray-500 text-sm">
                      Ünvan axtarmaq üçün yazmağa başlayın...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
            <h6 className='text-[#000] text-[20px]/[24px] font-medium'>
              Xəritədə seçin
            </h6>
            <p className='text-[#666] text-[14px]/[16px]'>
              Dəqiq ünvan üçün xəritədə istədiyiniz yeri klikləyin və ya sağ tərəfdəki idarəetmə düymələrindən istifadə edin
            </p>
            
            <div className="relative" style={{ width: '626px', height: '190px' }}>
              {!mapLoaded && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg border">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">Xəritə yüklənir...</p>
                  </div>
                </div>
              )}
              
              {/* Navigation Controls */}
              {mapLoaded && (
                <div 
                  className="absolute top-2 right-2 bg-white rounded-lg shadow-md border border-gray-200"
                  style={{ zIndex: 1000 }}
                >
                  <button
                    onClick={() => panMap('north')}
                    className="block p-2 hover:bg-gray-100 transition-colors border-b border-gray-200 rounded-t-lg"
                    title="North"
                    type="button"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-700" />
                  </button>
                  
                  <div className="flex">
                    <button
                      onClick={() => panMap('west')}
                      className="p-2 hover:bg-gray-100 transition-colors border-r border-gray-200"
                      title="West"
                      type="button"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => panMap('east')}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      title="East"
                      type="button"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => panMap('south')}
                    className="block p-2 hover:bg-gray-100 transition-colors border-t border-gray-200 rounded-b-lg"
                    title="South"
                    type="button"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              )}
              
              <div 
                ref={mapRef} 
                className="w-full h-full rounded-lg border border-gray-300"
                style={{ 
                  width: '626px', 
                  height: '190px',
                  background: '#e5e7eb'
                }}
              />
            </div>
          </div>

          <div className='flex flex-row items-center justify-start gap-6 mt-[28px]'>
            {/* City Selection */}
            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <h6 className='text-[#000] text-[20px]/[24px] font-medium'>
                Şəhər
              </h6>

              <div className="relative min-w-[200px] h-10">
                <button
                  type="button"
                  onClick={() => setIsCityOpen(!isCityOpen)}
                  className={`w-full px-[10px] py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    isCityOpen ? 'border-primary ring-2 ring-primary' : 'border-black'
                  } ${selectedCity ? 'text-gray-900' : 'text-black'}`}
                >
                  <span className="flex items-center">
                    {selectedCityLabel}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isCityOpen ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {isCityOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {locations.map((location) => (
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
            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <h6 className='text-[#000] text-[20px]/[24px] font-medium'>
                Rayon
              </h6>

              <div className="relative min-w-[200px] h-10">
                <button
                  type="button"
                  onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                  className={`w-full px-[10px] py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    isDistrictOpen ? 'border-primary ring-2 ring-primary' : 'border-black'
                  } ${selectedDistrict ? 'text-gray-900' : 'text-black'}`}
                >
                  <span className="flex items-center">
                    {selectedDistrictLabel}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isDistrictOpen ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {isDistrictOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {locations.map((location) => (
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
            <div className='flex flex-col items-start justify-center gap-2 mt-[28px]'>
              <h6 className='text-[#000] text-[20px]/[24px] font-medium'>
                Qəsəbə
              </h6>

              <div className="relative min-w-[200px] h-10">
                <button
                  type="button"
                  onClick={() => setIsSettlementOpen(!isSettlementOpen)}
                  className={`w-full px-[10px] py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    isSettlementOpen ? 'border-primary ring-2 ring-primary' : 'border-black'
                  } ${selectedSettlement ? 'text-gray-900' : 'text-black'}`}
                >
                  <span className="flex items-center">
                    {selectedSettlementLabel}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isSettlementOpen ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {isSettlementOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {locations.map((location) => (
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
        </div>
      </div>
    </div>
  )
}

export default Location