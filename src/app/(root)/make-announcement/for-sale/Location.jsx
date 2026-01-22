'use client';


import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { azeCity, azeDistrict, azeSettlement } from '@/components/core/RealEstateData';
import { getAnnouncementCity, getAnnouncementDistrict, getAnnouncementSettlement } from '@/services/api/endpoints/announcementService';

const Location = ({
  formik,
  stepErrors = {},
  setStepErrors = () => { },
  isValidating = false,
  showErrors = false,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const googleMapsLoadedRef = useRef(false);
  const scriptLoadingRef = useRef(false);
  const loadingPromiseRef = useRef(null);

  const [selectedCity, setSelectedCity] = useState(formik.values.selectedCity || '')
  const [selectedDistrict, setSelectedDistrict] = useState(formik.values.selectedDistrict || '')
  const [selectedSettlement, setSelectedSettlement] = useState(formik.values.selectedSettlement || '')
  const [isCityOpen, setIsCityOpen] = useState(false)
  const [isDistrictOpen, setIsDistrictOpen] = useState(false)
  const [isSettlementOpen, setIsSettlementOpen] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(formik.values.selectedAddress || '')

  const [cityOptions, setCityOptions] = useState(azeCity)
  const [isCityLoading, setIsCityLoading] = useState(false)
  const [cityLoadError, setCityLoadError] = useState('')

  const [selectedCityId, setSelectedCityId] = useState(null)
  const [districtOptions, setDistrictOptions] = useState(azeDistrict)
  const [isDistrictLoading, setIsDistrictLoading] = useState(false)
  const [districtLoadError, setDistrictLoadError] = useState('')

  const [selectedDistrictId, setSelectedDistrictId] = useState(null)
  const [settlementOptions, setSettlementOptions] = useState([])
  const [isSettlementLoading, setIsSettlementLoading] = useState(false)
  const [settlementLoadError, setSettlementLoadError] = useState('')

  const [isSettlementSearching, setIsSettlementSearching] = useState(false)
  const [settlementSearchError, setSettlementSearchError] = useState('')

  const [touched, setTouched] = useState({});

  // Validation state
  const [validationErrors, setValidationErrors] = useState({})
  const [isValidatingLocal, setIsValidatingLocal] = useState(false)

  const lastLocalErrorsKeyRef = useRef('');
  const lastParentErrorsKeyRef = useRef('');
  const getErrorsKey = useCallback((errorsObj) => {
    if (!errorsObj) return '';
    const keys = Object.keys(errorsObj).sort();
    if (keys.length === 0) return '';
    return keys.map((k) => `${k}:${String(errorsObj[k])}`).join('|');
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCities = async () => {
      setIsCityLoading(true);
      setCityLoadError('');
      try {
        const data = await getAnnouncementCity();
        if (!isMounted) return;

        const normalized = Array.isArray(data)
          ? data
            .filter((x) => x && (x.name || x.id))
            .map((x) => ({
              id: x.id,
              value: String(x.name ?? ''),
              label: String(x.name ?? ''),
            }))
            .filter((x) => x.value)
          : [];

        if (normalized.length) {
          setCityOptions(normalized);

          if (selectedCity) {
            const match = normalized.find((c) => c.value === selectedCity || c.label === selectedCity);
            if (match?.id != null) setSelectedCityId(match.id);
          }
        } else {
          setCityOptions(azeCity);
        }
      } catch (err) {
        if (!isMounted) return;
        setCityOptions(azeCity);
        setCityLoadError('Şəhər siyahısı yüklənmədi');
      } finally {
        if (isMounted) setIsCityLoading(false);
      }
    };

    loadCities();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadDistricts = async () => {
      setDistrictLoadError('');

      if (selectedCityId == null || selectedCityId === '') {
        setDistrictOptions([]);
        return;
      }

      setIsDistrictLoading(true);
      try {
        const data = await getAnnouncementDistrict(selectedCityId);
        if (!isMounted) return;

        const normalized = Array.isArray(data)
          ? data
            .filter((x) => x && (x.name || x.id))
            .map((x) => ({
              id: x.id,
              value: String(x.name ?? ''),
              label: String(x.name ?? ''),
            }))
            .filter((x) => x.value)
          : [];

        if (normalized.length) {
          setDistrictOptions(normalized);

          if (selectedDistrict) {
            const match = normalized.find((d) => d.value === selectedDistrict || d.label === selectedDistrict);
            if (match?.id != null) setSelectedDistrictId(match.id);
          }
        } else {
          // City might not have any districts
          setDistrictOptions([]);
          if (selectedDistrict) {
            setSelectedDistrict('');
            setSelectedDistrictId(null);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setDistrictOptions([]);
        setDistrictLoadError('Rayon siyahısı yüklənmədi');
      } finally {
        if (isMounted) setIsDistrictLoading(false);
      }
    };

    loadDistricts();
    return () => {
      isMounted = false;
    };
  }, [selectedCityId]);

  useEffect(() => {
    let isMounted = true;

    const loadSettlements = async () => {
      setSettlementLoadError('');

      if (selectedDistrictId == null || selectedDistrictId === '') {
        setSettlementOptions([]);
        return;
      }

      setIsSettlementLoading(true);
      try {
        const data = await getAnnouncementSettlement(selectedDistrictId);
        if (!isMounted) return;

        const normalized = Array.isArray(data)
          ? data
            .filter((x) => x && (x.name || x.id))
            .map((x) => ({
              id: x.id,
              value: String(x.name ?? ''),
              label: String(x.name ?? ''),
            }))
            .filter((x) => x.value)
          : [];

        if (normalized.length) {
          setSettlementOptions(normalized);
        } else {
          // District might not have any settlements
          setSettlementOptions([]);
          if (selectedSettlement) setSelectedSettlement('');
        }
      } catch (err) {
        if (!isMounted) return;
        setSettlementOptions([]);
        setSettlementLoadError('Qəsəbə siyahısı yüklənmədi');
      } finally {
        if (isMounted) setIsSettlementLoading(false);
      }
    };

    loadSettlements();
    return () => {
      isMounted = false;
    };
  }, [selectedDistrictId]);


  // Mock validation function
  const validateLocationStep = async (data) => {
    const errors = {};

    if (!data.selectedCity) {
      errors.selectedCity = 'Şəhər seçilməlidir';
    }

    // District/Settlement are optional (some cities may not have them)

    if (!data.selectedAddress) {
      errors.selectedAddress = 'Ünvan daxil edilməlidir';
    } else if (String(data.selectedAddress).length > 200) {
      errors.selectedAddress = 'Ünvan 200 simvoldan çox ola bilməz';
    }

    if (data.latitude == null || data.longitude == null) {
      errors.location = 'Xəritədən dəqiq yeri seçin';
    }

    return { errors };
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!showErrors) return;
      if (!formik.values) return;
      try {
        setIsValidatingLocal(true);
        const validationResult = await validateLocationStep({
          selectedCity: formik.values.selectedCity,
          selectedDistrict: formik.values.selectedDistrict,
          selectedSettlement: formik.values.selectedSettlement,
          selectedAddress: formik.values.selectedAddress,
          latitude: formik.values.latitude,
          longitude: formik.values.longitude,
        });
        if (timeoutId) {
          const nextErrors = validationResult.errors || {};
          const nextKey = getErrorsKey(nextErrors);

          if (nextKey !== lastLocalErrorsKeyRef.current) {
            lastLocalErrorsKeyRef.current = nextKey;
            setValidationErrors(nextErrors);
          }

          if (nextKey !== lastParentErrorsKeyRef.current) {
            lastParentErrorsKeyRef.current = nextKey;
            setStepErrors?.(nextErrors);
          }
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
    formik.values.latitude,
    formik.values.longitude,
    showErrors,
    getErrorsKey
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

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedAddress('')
    formik.setFieldValue('selectedAddress', '');
    formik.setFieldValue('latitude', null);
    formik.setFieldValue('longitude', null);

    setSelectedCity('');
    setSelectedCityId(null);
    setSelectedDistrict('');
    setSelectedDistrictId(null);
    setSelectedSettlement('');
    setSettlementOptions([]);

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
    setIsCityOpen(false)
    setIsDistrictOpen(false)
    setIsSettlementOpen(false)
  }

  // Add marker to map helper function
  const addMarkerToMap = (lat, lng) => {
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
    marker.addListener('dragend', (event) => {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();

      // Update coordinates in formik
      formik.setFieldValue('latitude', newLat);
      formik.setFieldValue('longitude', newLng);
      setTouched(prev => ({ ...prev, location: true }));
    });

    currentMarkerRef.current = marker;

    // Pan to location
    mapInstanceRef.current.panTo({ lat, lng });
    mapInstanceRef.current.setZoom(15);
    formik.setFieldValue('latitude', lat);
    formik.setFieldValue('longitude', lng);
    setTouched(prev => ({ ...prev, location: true }));
  };

  const getGeocodeQueryForSettlement = useCallback((settlementValue) => {
    const settlement = settlementOptions.find((loc) => loc.value === settlementValue || loc.label === settlementValue)
      || azeSettlement.find((loc) => loc.value === settlementValue || loc.label === settlementValue);

    const label = settlement?.label || settlementValue;
    if (!label) return '';

    // Intentionally keep this query settlement-only (no city/district)
    // to avoid geocoder biasing results toward the selected city.
    return `${label} qəsəbəsi, Azerbaijan`;
  }, [settlementOptions]);

  const focusMapToSettlement = useCallback(async (settlementValue = selectedSettlement) => {
    setSettlementSearchError('');

    if (!settlementValue) return;
    if (!mapInstanceRef.current) return;
    if (!window.google?.maps?.Geocoder) {
      setSettlementSearchError('Xəritə servisi yüklənməyib');
      return;
    }

    const query = getGeocodeQueryForSettlement(settlementValue);
    if (!query) return;

    setIsSettlementSearching(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const { results } = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: query, region: 'AZ' }, (results, status) => {
          if (status === 'OK' && results?.length) {
            resolve({ results, status });
            return;
          }
          if (status === 'ZERO_RESULTS') {
            reject(new Error('Bu qəsəbə üçün nəticə tapılmadı'));
            return;
          }
          reject(new Error('Xəritədə axtarış alınmadı'));
        });
      });

      const first = results[0];
      if (first?.geometry?.viewport) {
        mapInstanceRef.current.fitBounds(first.geometry.viewport);
      } else if (first?.geometry?.location) {
        mapInstanceRef.current.setCenter(first.geometry.location);
        mapInstanceRef.current.setZoom(13);
      }
    } catch (err) {
      setSettlementSearchError(err?.message || 'Xəritədə axtarış alınmadı');
    } finally {
      setIsSettlementSearching(false);
    }
  }, [getGeocodeQueryForSettlement, selectedSettlement]);

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
        map.addListener('click', (event) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();

          addMarkerToMap(lat, lng);
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

    const cityMatch = cityOptions.find((c) => c.value === value || c.label === label);
    setSelectedCityId(cityMatch?.id ?? null);

    // Reset downstream selects when city changes
    setSelectedDistrict('');
    setSelectedDistrictId(null);
    setSelectedSettlement('');
    setSettlementOptions([]);
    setIsCityOpen(false)
    setTouched(prev => ({ ...prev, selectedCity: true }));
    setIsDistrictOpen(false)
    setIsSettlementOpen(false)
  }

  const handleSelectDistrict = (value, label) => {
    setSelectedDistrict(value)

    const districtMatch = districtOptions.find((d) => d.value === value || d.label === label);
    setSelectedDistrictId(districtMatch?.id ?? null);

    setSelectedSettlement('');
    setSettlementOptions([]);
    setIsDistrictOpen(false)
    setTouched(prev => ({ ...prev, selectedDistrict: true }));
    setIsCityOpen(false)
    setIsSettlementOpen(false)
  }

  const handleSelectSettlement = (value, label) => {
    setSelectedSettlement(value)
    setIsSettlementOpen(false)
    setTouched(prev => ({ ...prev, selectedSettlement: true }));
    setIsCityOpen(false)
    setIsDistrictOpen(false)

    // Map focus (non-exact; user still clicks map for exact pin)
    // If map isn't ready yet, the effect below will run once it loads.
    if (mapLoaded) {
      focusMapToSettlement(value);
    }
  }

  useEffect(() => {
    if (!mapLoaded) return;
    if (!selectedSettlement) return;
    focusMapToSettlement(selectedSettlement);
  }, [mapLoaded, selectedSettlement, focusMapToSettlement]);


  const ErrorMessage = ({ error, fieldName }) => {
    const displayError = validationErrors[fieldName] || stepErrors?.[fieldName] || error;
    if (!showErrors) return null;
    if (!displayError) return null;

    return (
      <div className="absolute flex items-center gap-1 mt-1 text-red-500 text-sm">
        <span>{displayError}</span>
      </div>
    );
  };

  const selectedCityLabel = cityOptions.find(loc => loc.value === selectedCity || loc.label === selectedCity)?.label || 'Şəhər seçin'
  const selectedDistrictLabel = districtOptions.find(loc => loc.value === selectedDistrict || loc.label === selectedDistrict)?.label || 'Rayon seçin'
  const selectedSettlementLabel = settlementOptions.find(loc => loc.value === selectedSettlement || loc.label === selectedSettlement)?.label
    || 'Qəsəbə seçin'

  return (
    <div className="w-full h-full pb-4 px-2 -mx-2  flex items-start justify-start max-h-[500px] overflow-y-auto">
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
                  disabled={isCityLoading}
                  className={`w-full px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] ${showErrors && (validationErrors.selectedCity || stepErrors?.selectedCity) ? 'error-field border-red-500' : (isCityOpen ? 'border-[#26B5A0] ring-2 ring-[#26B5A0]' : 'border-black')} ${selectedCity ? 'text-gray-900' : 'text-black'}`}
                >
                  <span className="truncate">
                    {selectedCityLabel}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isCityOpen ? 'transform rotate-180' : ''
                      }`}
                  />
                </button>

                <ErrorMessage fieldName="selectedCity" />

                {isCityOpen && (
                  <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto scrollbar-custom ">
                    {isCityLoading ? (
                      <div className="px-4 py-3 text-sm text-gray-600">Yüklənir...</div>
                    ) : cityLoadError ? (
                      <div className="px-4 py-3 text-sm text-red-600">{cityLoadError}</div>
                    ) : (
                      cityOptions.map((location) => (
                        <button
                          key={location.id ?? location.value}
                          type="button"
                          onClick={() => handleSelectCity(location.value, location.label)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0 "
                        >
                          <span className="text-gray-900 font-medium">{location.label}</span>
                        </button>
                      ))
                    )}
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
                  disabled={isDistrictLoading || !selectedCityId}
                  className={`w-full px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] ${showErrors && (validationErrors.selectedDistrict || stepErrors?.selectedDistrict) ? 'error-field border-red-500' : (isDistrictOpen ? 'border-[#26B5A0] ring-2 ring-[#26B5A0]' : 'border-black')} ${selectedDistrict ? 'text-gray-900' : 'text-black'}`}
                >
                  <span className="truncate">
                    {selectedDistrictLabel}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isDistrictOpen ? 'transform rotate-180' : ''
                      }`}
                  />
                </button>

                <ErrorMessage fieldName="selectedDistrict" />

                {isDistrictOpen && (
                  <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto scrollbar-custom">
                    {!selectedCityId ? (
                      <div className="px-4 py-3 text-sm text-gray-600">Əvvəlcə şəhər seçin</div>
                    ) : isDistrictLoading ? (
                      <div className="px-4 py-3 text-sm text-gray-600">Yüklənir...</div>
                    ) : districtLoadError ? (
                      <div className="px-4 py-3 text-sm text-red-600">{districtLoadError}</div>
                    ) : !districtOptions.length ? (
                      <div className="px-4 py-3 text-sm text-gray-600">Bu şəhər üçün rayon yoxdur</div>
                    ) : (
                      districtOptions.map((location) => (
                        <button
                          key={location.id ?? location.value}
                          type="button"
                          onClick={() => handleSelectDistrict(location.value, location.label)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-gray-900 font-medium">{location.label}</span>
                        </button>
                      ))
                    )}
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
                  disabled={isSettlementLoading || !selectedDistrictId}
                  className={`w-full px-3 py-2 text-left bg-white border rounded-lg shadow-sm transition-all duration-200 flex items-center justify-between hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] ${showErrors && (validationErrors.selectedSettlement || stepErrors?.selectedSettlement) ? 'error-field border-red-500' : (isSettlementOpen ? 'border-[#26B5A0] ring-2 ring-[#26B5A0]' : 'border-black')} ${selectedSettlement ? 'text-gray-900' : 'text-black'}`}
                >
                  <span className="truncate">
                    {selectedSettlementLabel}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isSettlementOpen ? 'transform rotate-180' : ''
                      }`}
                  />
                </button>

                <ErrorMessage fieldName="selectedSettlement" />

                {isSettlementOpen && (
                  <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto scrollbar-custom ">
                    {!selectedDistrictId ? (
                      <div className="px-4 py-3 text-sm text-gray-600">Əvvəlcə rayon seçin</div>
                    ) : isSettlementLoading ? (
                      <div className="px-4 py-3 text-sm text-gray-600">Yüklənir...</div>
                    ) : settlementLoadError ? (
                      <div className="px-4 py-3 text-sm text-red-600">{settlementLoadError}</div>
                    ) : !settlementOptions.length ? (
                      <div className="px-4 py-3 text-sm text-gray-600">Bu rayon üçün qəsəbə yoxdur</div>
                    ) : (
                      settlementOptions.map((location) => (
                        <button
                          key={location.id ?? location.value}
                          type="button"
                          onClick={() => handleSelectSettlement(location.value, location.label)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-gray-900 font-medium">{location.label}</span>
                        </button>
                      ))
                    )}
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
                value={selectedAddress}
                onChange={(e) => {
                  setSelectedAddress(e.target.value);
                  setTouched(prev => ({ ...prev, selectedAddress: true }));
                }}
                onBlur={() => setTouched(prev => ({ ...prev, selectedAddress: true }))}
                placeholder={"Ünvanı daxil edin (küçə, bina və s.)"}
                className={`w-full px-3 py-2 bg-white border rounded-lg shadow-sm transition-all duration-200 hover:border-[#26B5A0] focus:outline-none focus:ring-2 focus:ring-[#26B5A0] focus:border-[#26B5A0] pr-10 ${showErrors && (validationErrors.selectedAddress || stepErrors?.selectedAddress)
                  ? 'error-field border-red-500'
                  : 'border-black'
                  }`}
              />

              {selectedAddress && (
                <button
                  type="button"
                  onClick={clearAllSelections}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <ErrorMessage fieldName="selectedAddress" />
            </div>
          </div>

          {/* Map Section */}
          <div className="relative flex flex-col items-start justify-center gap-3 w-full">
            <h6 className="text-black text-xl font-medium">Xəritədə seçin</h6>
            <p className="text-gray-600 text-sm">
              Dəqiq ünvan üçün xəritədə istədiyiniz yeri klikləyin. Markeri sürükləyərək yerini dəyişə bilərsiniz.
            </p>

            {/* {selectedSettlement && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => focusMapToSettlement(selectedSettlement)}
                  disabled={!mapLoaded || isSettlementSearching}
                  className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:border-[#26B5A0] hover:text-[#26B5A0] disabled:opacity-60"
                >
                  {isSettlementSearching ? 'Axtarılır...' : 'Qəsəbəni xəritədə göstər'}
                </button>

                {settlementSearchError && (
                  <span className="text-sm text-red-500">{settlementSearchError}</span>
                )}
              </div>
            )} */}

            {!!formik.values?.latitude && !!formik.values?.longitude && (
              <p className="text-gray-700 text-sm">
                Koordinatlar: {Number(formik.values.latitude).toFixed(6)}, {Number(formik.values.longitude).toFixed(6)}
              </p>
            )}
            <div className='absolute bottom-0 w-full '>
              <ErrorMessage fieldName="location" />
            </div>

            <div className="relative w-full" style={{ height: '400px' }}>
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

          {showErrors && (validationErrors.general || stepErrors?.general) && (
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
