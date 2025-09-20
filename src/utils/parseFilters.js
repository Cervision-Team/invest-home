export function parseFiltersFromSearchParams(searchParams) {
  const announcementType = searchParams.get("announcementType") || "all";
  const propertyTypes = searchParams.getAll("propertyTypes") || [];
  const location = searchParams.get("location") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const rooms = (searchParams.getAll("rooms") || []).map(r => (isNaN(r) ? r : Number(r)));

  const additionalFilters = {};
  for (const [key, value] of searchParams.entries()) {
    if (["announcementType","propertyTypes","location","priceMin","priceMax","rooms"].includes(key)) continue;

    if (value === "true" || value === "false") additionalFilters[key] = (value === "true");
    else if (!isNaN(value) && value !== "") additionalFilters[key] = Number(value);
    else additionalFilters[key] = value;
  }

  return {
    announcementType,
    propertyTypes,
    location,
    priceRange: { min: priceMin, max: priceMax },
    rooms,
    additionalFilters
  };
}
