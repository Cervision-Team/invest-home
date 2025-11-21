'use client';


import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react'
import { azeCity, azeDistrict, azeSettlement } from '@/components/core/RealEstateData';

const Location = ({ formik = { values: {}, setFieldValue: () => {} }, stepErrors = {}, setStepErrors = () => {}, isValidating = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const googleMapsLoadedRef = useRef(false);
  const scriptLoadingRef = useRef(false);
  const loadingPromiseRef = useRef(null);
  
  const [selectedLocation, setSelectedLocation] = useState(formik.values.selectedLocation || '')
  const [selectedCity, setSelectedCity] = useState(formik.values.selectedCity || '')
  const [selectedDistrict, setSelectedDistrict] = useState(formik.values.selectedDistrict || '')
  const [selectedSettlement, setSelectedSettlement] = useState(formik.values.selectedSettlement || '')
  const [isOpen, setIsOpen] = useState(false)
  const [isCityOpen, setIsCityOpen] = useState(false)
  const [isDistrictOpen, setIsDistrictOpen] = useState(false)
  const [isSettlementOpen, setIsSettlementOpen] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(formik.values.selectedAddress || '')
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState(formik.values.searchQuery || '')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [touched, setTouched] = useState({});
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Validation state
  const [validationErrors, setValidationErrors] = useState({})
  const [isValidatingLocal, setIsValidatingLocal] = useState(false)


  // Mock validation function
  const validateLocationStep = async (data) => {
    const errors = {};
    
    if (!data.selectedCity) {
      errors.selectedCity = 'Şəhər seçilməlidir';
    }
    
    if (!data.selectedAddress && !data.searchQuery) {
      errors.selectedAddress = 'Ünvan daxil edilməlidir';
    }
    
    return { errors };
  };

  // Validate location data whenever form values change
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!isValidating && Object.keys(touched).length === 0) return;
      if (!formik.values) return;
      try {
        setIsValidatingLocal(true);
        const validationResult = await validateLocationStep({
          selectedCity: formik.values.selectedCity,
          selectedDistrict: formik.values.selectedDistrict,
          selectedSettlement: formik.values.selectedSettlement,
          selectedAddress: formik.values.selectedAddress,
          searchQuery: formik.values.searchQuery,
          latitude: formik.values.latitude,
          longitude: formik.values.longitude,
          selectedLocation: formik.values.selectedLocation
        });
        if (timeoutId) {
          setValidationErrors(validationResult.errors || {});
          setStepErrors?.(validationResult.errors || {});
        }
      } catch (err) { console.error(err); }
      finally { setIsValidatingLocal(false); }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    formik.values.selectedCity,
    formik.values.selectedDistrict,
    formik.values.selectedSettlement,
    formik.values.selectedAddress,
    formik.values.searchQuery,
    formik.values.selectedLocation,
    setStepErrors,
    touched, isValidating
  ]);

  // Update formik when local state changes
  useEffect(() => {
    if (formik.values.selectedCity !== selectedCity) {
      formik.setFieldValue('selectedCity', selectedCity);
    }
  }, [selectedCity, formik.values.selectedCity, formik]);

  useEffect(() => {
    if (formik.values.selectedDistrict !== selectedDistrict) {
      formik.setFieldValue('selectedDistrict', selectedDistrict);
    }
  }, [selectedDistrict, formik.values.selectedDistrict, formik]);

  useEffect(() => {
    if (formik.values.selectedSettlement !== selectedSettlement) {
      formik.setFieldValue('selectedSettlement', selectedSettlement);
    }
  }, [selectedSettlement, formik.values.selectedSettlement, formik]);

  useEffect(() => {
    if (formik.values.selectedAddress !== selectedAddress) {
      formik.setFieldValue('selectedAddress', selectedAddress);
    }
  }, [selectedAddress, formik.values.selectedAddress, formik]);

  useEffect(() => {
    if (formik.values.searchQuery !== searchQuery) {
      formik.setFieldValue('searchQuery', searchQuery);
    }
  }, [searchQuery, formik.values.searchQuery, formik]);

  useEffect(() => {
    if (formik.values.selectedLocation !== selectedLocation) {
      formik.setFieldValue('selectedLocation', selectedLocation);
    }
    setTouched(prev => ({ ...prev, selectedLocation: true }));
  }, [selectedLocation, formik.values.selectedLocation, formik]);

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedLocation('')
    setSelectedAddress('')
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
    
    formik.setFieldValue('selectedLocation', '');
    formik.setFieldValue('selectedAddress', '');
    formik.setFieldValue('searchQuery', '');
    formik.setFieldValue('latitude', null);
    formik.setFieldValue('longitude', null);
    
    setTouched({});
    
    // Remove marker from map
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null);
      currentMarkerRef.current = null;
    }
    
    // Reset map to default Azerbaijan view
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: 40.1431, lng: 47.5769 });
      mapInstanceRef.current.setZoom(7);
    }
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setIsOpen(false)
    setIsCityOpen(false)
    setIsDistrictOpen(false)
    setIsSettlementOpen(false)
    setShowSearchResults(false)
  }

  // Handle search input changes
  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setTouched(prev => ({ ...prev, searchQuery: true, selectedAddress: true }));
    setSearchQuery(value);
    
    setIsCityOpen(false)
    setIsDistrictOpen(false)
    setIsSettlementOpen(false)
    
    if (value === '') {
      clearAllSelections();
      return;
    }
    
    if (selectedLocation && selectedLocation !== 'custom-address') {
      setSelectedLocation('');
    }
    if (selectedAddress && !value.includes(selectedAddress)) {
      setSelectedAddress('');
    }
    
    setIsOpen(true);
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
      } catch (directError) {
        console.log('Direct search failed:', directError.message);
      }
      
      const proxies = [
        `https://cors-anywhere.herokuapp.com/`,
        `https://api.codetabs.com/v1/proxy?quest=`,
        `https://thingproxy.freeboard.io/fetch/`
      ];
      
      for (const proxy of proxies) {
        try {
          const targetUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=az&limit=5&addressdetails=1`;
          const response = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            return data.map((item, index) => ({
              id: `search-${index}`,
              label: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }));
          }
        } catch (proxyError) {
          console.log(`Proxy ${proxy} failed:`, proxyError.message);
          continue;
        }
      }
      
      console.log('All search methods failed, returning mock data');
      return mockResults.filter(result => 
        result.label.toLowerCase().includes(query.toLowerCase())
      );
      
    } catch (error) {
      console.error('Address search failed:', error);
      return mockResults;
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
    
    formik.setFieldValue('latitude', result.lat);
    formik.setFieldValue('longitude', result.lng);
    
    addMarkerToMap(result.lat, result.lng, result.label);
  };

  // Handle predefined location selection
  const handleSelect = (value, label) => {
    if (value === 'custom-address') return;
    
    setSearchQuery(label);
    setSelectedLocation(value);
    setSelectedAddress('');
    setSearchResults([]);
    setShowSearchResults(false);
    setIsOpen(false);
    
    formik.setFieldValue('latitude', null);
    formik.setFieldValue('longitude', null);
    
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null);
      currentMarkerRef.current = null;
    }
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: 40.1431, lng: 47.5769 });
      mapInstanceRef.current.setZoom(7);
    }
  }

  // Add marker to map helper function
  const addMarkerToMap = (lat, lng, address = null) => {
    if (!mapInstanceRef.current || !window.google) return;
    
    // Remove existing marker
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null);
    }
    
    // Create new draggable marker
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      draggable: true,
      animation: window.google.maps.Animation.DROP
    });
    
    // Add drag end listener
    marker.addListener('dragend', async (event) => {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      
      // Update coordinates in formik
      formik.setFieldValue('latitude', newLat);
      formik.setFieldValue('longitude', newLng);
      
      // Get new address
      try {
        const newAddress = await getAddressFromCoords(newLat, newLng);
        setSelectedAddress(newAddress);
        setSearchQuery(newAddress);
        setSelectedLocation('custom-address');
      } catch (error) {
        console.error('Failed to get address:', error);
      }
    });
    
    currentMarkerRef.current = marker;
    
    // Pan to location
    mapInstanceRef.current.panTo({ lat, lng });
    mapInstanceRef.current.setZoom(15);
    
    // Update address and coordinates if provided
    if (address) {
      setSelectedAddress(address);
      setSelectedLocation('custom-address');
      setSearchQuery(address);
      formik.setFieldValue('latitude', lat);
      formik.setFieldValue('longitude', lng);
    }
  };

  // Pan map function
  const panMap = useCallback((direction) => {
    if (!mapInstanceRef.current) return;

    const currentCenter = mapInstanceRef.current.getCenter();
    const currentZoom = mapInstanceRef.current.getZoom();
    
    // Calculate pan distance based on zoom level
    const panAmount = 0.05 / Math.pow(2, currentZoom - 7);
    
    let newLat = currentCenter.lat();
    let newLng = currentCenter.lng();

    switch (direction) {
      case "north":
        newLat += panAmount;
        break;
      case "south":
        newLat -= panAmount;
        break;
      case "east":
        newLng += panAmount;
        break;
      case "west":
        newLng -= panAmount;
        break;
    }

    mapInstanceRef.current.panTo({ lat: newLat, lng: newLng });
  }, []);

  // Get address from coordinates
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
      } catch (directError) {
        console.log('Direct reverse geocoding failed:', directError.message);
      }
      
      const proxies = [
        `https://cors-anywhere.herokuapp.com/`,
        `https://api.codetabs.com/v1/proxy?quest=`,
        `https://thingproxy.freeboard.io/fetch/`
      ];
      
      for (const proxy of proxies) {
        try {
          const targetUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1&countrycodes=az`;
          const response = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            return data.display_name || generateMockAddress(lat, lng);
          }
        } catch (proxyError) {
          console.log(`Reverse geocoding proxy ${proxy} failed:`, proxyError.message);
          continue;
        }
      }
      
      console.log('All reverse geocoding methods failed, generating mock address');
      return generateMockAddress(lat, lng);
      
    } catch (error) {
      console.error('All reverse geocoding methods failed:', error);
      return generateMockAddress(lat, lng);
    }
  };
// Initialize Google Maps
  useEffect(() => {
    let isMounted = true;
    let checkInterval;

    const waitForGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds total (100 * 100ms)
        
        checkInterval = setInterval(() => {
          attempts++;
          
          if (window.google?.maps?.Map) {
            clearInterval(checkInterval);
            console.log("Google Maps fully initialized!");
            resolve();
          } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            reject(new Error("Google Maps failed to load after 10 seconds"));
          }
        }, 100);
      });
    };

    const loadGoogleMapsScript = () => {
      // If already loading, return existing promise
      if (scriptLoadingRef.current && loadingPromiseRef.current) {
        console.log("Script already loading, returning existing promise...");
        return loadingPromiseRef.current;
      }

      // If already loaded, return resolved promise
      if (window.google?.maps?.Map) {
        console.log("Google Maps already loaded!");
        return Promise.resolve();
      }

      scriptLoadingRef.current = true;

      loadingPromiseRef.current = new Promise((resolve, reject) => {
        // Check if script already exists (check more broadly)
        const existingScript = document.querySelector('script[src*="maps.googleapis"]');
        if (existingScript) {
          // Script exists, wait for it to load
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

        // Validate API key exists
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          scriptLoadingRef.current = false;
          reject(new Error("Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"));
          return;
        }

        
        // Create new script with loading=async
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

        // Load script (returns existing promise if already loading)
        if (!googleMapsLoadedRef.current) {
          await loadGoogleMapsScript();
          googleMapsLoadedRef.current = true;
        }
        
        if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

        // Final check
        if (!window.google?.maps?.Map) {
          throw new Error("Google Maps API not available");
        }


        // Create map
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
      mapInstanceRef.current = null;
    };
  }, []);

  const handleSelectCity = (value, label) => {
    setSelectedCity(value)
    setIsCityOpen(false)
    setTouched(prev => ({ ...prev, selectedCity: true }));
    setIsDistrictOpen(false)
    setIsSettlementOpen(false)
    setIsOpen(false)
  }

  const handleSelectDistrict = (value, label) => {
    setSelectedDistrict(value)
    setIsDistrictOpen(false)
    setTouched(prev => ({ ...prev, selectedDistrict: true }));
    setIsCityOpen(false)
    setIsSettlementOpen(false)
    setIsOpen(false)
  }

  const handleSelectSettlement = (value, label) => {
    setSelectedSettlement(value)
    setIsSettlementOpen(false)
    setTouched(prev => ({ ...prev, selectedSettlement: true }));
    setIsCityOpen(false)
    setIsDistrictOpen(false)
    setIsOpen(false)
  }

  const getInputDisplayValue = () => {
    if (selectedLocation === 'custom-address' && selectedAddress) {
      return selectedAddress;
    }
    return searchQuery;
  };


  const ErrorMessage = ({ error, fieldName }) => {
    const displayError = validationErrors[fieldName] || stepErrors?.[fieldName] || error;
    if (!touched[fieldName]) return null;
    if (!displayError) return null;
    
    return (
      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
        <span>{displayError}</span>
      </div>
    );
  };

  const selectedCityLabel = azeCity.find(loc => loc.value === selectedCity)?.label || 'Şəhər seçin'
  const selectedDistrictLabel = azeDistrict.find(loc => loc.value === selectedDistrict)?.label || 'Rayon seçin'
  const selectedSettlementLabel = azeSettlement.find(loc => loc.value === selectedSettlement)?.label || 'Qəsəbə seçin'

  return (
    <div className="w-full h-full pb-4 border-b border-gray-300 flex items-start justify-start max-h-[500px] overflow-y-auto">
      <div className="w-full">
        <div className='flex flex-col items-start justify-center space-y-8'>
          <h5 className='text-black text-2xl font-medium'>
            Detallar
          </h5>

          {/* City, District, Settlement Row */}
          <div className='grid grid-cols-3 max-[1150px]:grid-cols-1 gap-6 w-full max-w-4xl'>
            {/* City Selection */}
            <div className='flex flex-col items-start justify-center gap-2 relative'>
              <h6 className='text-black text-xl font-medium'>
                Şəhər
              </h6>

              <div className="relative w-full ">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns()
                    setIsCityOpen(!isCityOpen)
                  }}
                  className={`w-full px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] ${
                    isCityOpen ? 'border-[#26B5A0] ring-2 ring-[#26B5A0]' : 
                    (validationErrors.selectedCity || stepErrors?.selectedCity) && touched.selectedCity ? 'border-red-500' : 'border-black'
                  } ${selectedCity ? 'text-gray-900' : 'text-black'}`}
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
                
                <ErrorMessage fieldName="selectedCity" />
                
                {isCityOpen && (
                  <div className="absolute z-9999 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto scrollbar-custom ">
                    {azeCity.map((location) => (
                      <button
                        key={location.value}
                        type="button"
                        onClick={() => handleSelectCity(location.value, location.label)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0 "
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
              <h6 className='text-black text-xl font-medium'>
                Rayon
              </h6>

              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns()
                    setIsDistrictOpen(!isDistrictOpen)
                  }}
                  className={`w-full px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] ${
                    isDistrictOpen ? 'border-[#26B5A0] ring-2 ring-[#26B5A0]' : 
                    (validationErrors.selectedDistrict || stepErrors?.selectedDistrict) && touched.selectedDistrict ? 'border-red-500' : 'border-black'
                  } ${selectedDistrict ? 'text-gray-900' : 'text-black'}`}
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
                
                <ErrorMessage fieldName="selectedDistrict" />
                
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
              <h6 className='text-black text-xl font-medium'>
                Qəsəbə
              </h6>

              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => {
                    closeAllDropdowns()
                    setIsSettlementOpen(!isSettlementOpen)
                  }}
                  className={`w-full px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] ${
                    isSettlementOpen ? 'border-[#26B5A0] ring-2 ring-[#26B5A0]' : 
                    (validationErrors.selectedSettlement || stepErrors?.selectedSettlement) && touched.selectedSettlement ? 'border-red-500' : 'border-black'
                  } ${selectedSettlement ? 'text-gray-900' : 'text-black'}`}
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
                
                <ErrorMessage fieldName="selectedSettlement" />
                
                {isSettlementOpen && (
                  <div className="absolute z-9999 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto scrollbar-custom ">
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
          <div className='flex flex-col items-start justify-center gap-3 w-full max-w-2xl relative'>
            <h6 className='text-black text-xl font-medium'>
              Əmlakın yeri
            </h6>

            <div className="relative w-full">
              <input
                type="text"
                value={getInputDisplayValue()}
                onChange={handleSearchInputChange}
                onFocus={() => {
                  closeAllDropdowns()
                  setIsOpen(true);
                  if (searchResults.length > 0) {
                    setShowSearchResults(true);
                  }
                }}
                onBlur={(e) => {
                  setTimeout(() => {
                    if (e.currentTarget && !e.currentTarget.contains(document.activeElement)) {
                      setIsOpen(false);
                      setShowSearchResults(false);
                    }
                  }, 150);
                }}
                placeholder={"Ünvan axtarın və ya xəritədən seçin..."}
                className={`w-full px-3 py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] pr-10 ${
                  (validationErrors.selectedAddress || stepErrors?.selectedAddress) && touched.selectedAddress
                    ? 'border-red-500'
                    : 'border-black'
                }`}
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
              
              <ErrorMessage fieldName="selectedAddress" />
              
              {isOpen && (
                <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto">
                  {isSearching && showSearchResults && (
                    <div className="px-4 py-3 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                      Axtarılır...
                    </div>
                  )}
                  
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
                  
                  {searchQuery && searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && showSearchResults && (
                    <div className="px-4 py-3 text-center text-gray-500">
                      "{searchQuery}" üçün heç bir nəticə tapılmadı
                    </div>
                  )}
                  
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
<div className="flex flex-col items-start justify-center gap-3 w-full">
  <h6 className="text-black text-xl font-medium">Xəritədə seçin</h6>
  <p className="text-gray-600 text-sm">
    Dəqiq ünvan üçün xəritədə istədiyiniz yeri klikləyin. Markeri sürükləyərək yerini dəyişə bilərsiniz.
  </p>

  <div className="relative w-full max-w-2xl" style={{ height: '400px' }}>
    {/* Loading Overlay */}
    {!mapLoaded && (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg border z-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Xəritə yüklənir...</p>
        </div>
      </div>
    )}

    {/* Map Container */}
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg border border-gray-300"
      style={{ background: '#e5e7eb' }}
    />
  </div>
</div>

          {(isValidatingLocal || isValidating) && (
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              <span>Məlumatlar yoxlanılır...</span>
            </div>
          )}
          
          {(validationErrors.general || stepErrors?.general) && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <span>{validationErrors.general || stepErrors.general}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Location
