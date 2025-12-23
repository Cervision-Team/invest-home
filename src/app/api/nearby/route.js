import { NextResponse } from "next/server";

const OVERPASS_BASE_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getOverpassSelectors(type) {
  switch (type) {
    case "bus_stop":
      return ['[highway="bus_stop"]', '[public_transport="platform"][bus=yes]'];
    case "clinic":
      return ['[amenity="hospital"]', '[amenity="clinic"]'];
    case "school":
      return ['[amenity="school"]'];
    case "park":
      return ['[leisure="park"]'];
    case "metro":
      return ['[railway="station"][station="subway"]', '[railway="subway_entrance"]'];
    case "restaurant":
      return ['[amenity="restaurant"]'];
    case "market":
      return ['[shop="supermarket"]', '[amenity="marketplace"]'];
    default:
      return null;
  }
}

function getTypeLabel(type) {
  switch (type) {
    case "bus_stop":
      return "Dayanacaq";
    case "clinic":
      return "Klinika";
    case "school":
      return "Məktəb";
    case "park":
      return "Park";
    case "metro":
      return "Metro";
    case "restaurant":
      return "Restoran";
    case "market":
      return "Market";
    default:
      return "Yaxınlıq";
  }
}

function matchesType(tags, type) {
  if (!tags) return false;

  switch (type) {
    case "bus_stop": {
      const isBusStop = tags.highway === "bus_stop";
      const isBusPlatform =
        tags.public_transport === "platform" &&
        (tags.bus === "yes" || tags.bus === "designated" || tags.bus === "true");
      return isBusStop || isBusPlatform;
    }
    case "clinic":
      return tags.amenity === "hospital" || tags.amenity === "clinic";
    case "school":
      return tags.amenity === "school";
    case "park":
      return tags.leisure === "park";
    case "metro":
      return (
        (tags.railway === "station" && tags.station === "subway") ||
        tags.railway === "subway_entrance"
      );
    case "restaurant":
      return tags.amenity === "restaurant";
    case "market":
      return (
        tags.shop === "supermarket" ||
        tags.shop === "convenience" ||
        tags.amenity === "marketplace"
      );
    default:
      return false;
  }
}

function normalizeName(value) {
  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function dedupeByName(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    if (!item?.name) {
      result.push(item);
      continue;
    }

    const key = normalizeName(item.name);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = toNumber(searchParams.get("lat"));
  const lng = toNumber(searchParams.get("lng"));
  const type = searchParams.get("type") || "bus_stop";

  const limit = Math.min(Math.max(toNumber(searchParams.get("limit")) ?? 5, 1), 20);
  const radius = Math.min(Math.max(toNumber(searchParams.get("radius")) ?? 1500, 100), 5000);

  if (lat === null || lng === null) {
    return NextResponse.json(
      { error: "Missing or invalid lat/lng" },
      { status: 400 }
    );
  }

  const selectors = getOverpassSelectors(type);
  if (!selectors?.length) {
    return NextResponse.json(
      { error: "Invalid type" },
      { status: 400 }
    );
  }


  const query = `
    [out:json][timeout:15];
    (
      ${selectors
        .map((sel) => `nwr(around:${radius},${lat},${lng})${sel};`)
        .join("\n      ")}
    );
    out center tags;
  `;

  const overpassRequestUrls = OVERPASS_BASE_URLS.map(
    (base) => `${base}?data=${encodeURIComponent(query)}`
  );

  try {
    // Use GET with query in URL so Next.js caching keys differ per query.
    let data = null;
    let lastStatus = null;
    for (const url of overpassRequestUrls) {
      const res = await fetch(url, {
        // light caching to reduce rate-limit risk
        next: { revalidate: 300 },
      });
      lastStatus = res.status;
      if (!res.ok) continue;
      try {
        data = await res.json();
        break;
      } catch {
        data = null;
      }
    }

    if (!data) {
      return NextResponse.json(
        { error: "Overpass request failed", status: lastStatus },
        { status: 502 }
      );
    }

    const label = getTypeLabel(type);

    const elements = Array.isArray(data?.elements) ? data.elements : [];

    const mapped = elements
      .map((el) => {
        if (!matchesType(el?.tags, type)) return null;

        const point = el.type === "node"
          ? { lat: el.lat, lon: el.lon }
          : el.center
            ? { lat: el.center.lat, lon: el.center.lon }
            : null;

        if (!point?.lat || !point?.lon) return null;

        const tags = el?.tags;
        const name =
          tags?.name ||
          tags?.["name:az"] ||
          tags?.["name:en"] ||
          tags?.official_name ||
          tags?.short_name ||
          tags?.brand ||
          tags?.operator ||
          tags?.ref ||
          tags?.local_ref ||
          tags?.stop_name ||
          null;

        const distanceMeters = haversineMeters(lat, lng, point.lat, point.lon);

        return {
          id: `${el.type}-${el.id}`,
          name: typeof name === "string" && name.trim() ? name.trim() : null,
          lat: point.lat,
          lon: point.lon,
          distanceMeters,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    const filtered = type === "bus_stop" ? dedupeByName(mapped) : mapped;

    const finalItems = filtered
      .slice(0, limit)
      .map((item, idx) => ({
        ...item,
        name: item.name ?? `${label} #${idx + 1}`,
      }));

    return NextResponse.json({ type, items: finalItems });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch nearby places" },
      { status: 500 }
    );
  }
}
