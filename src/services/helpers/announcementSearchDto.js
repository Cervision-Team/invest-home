export function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}

function toFiniteNumber(value) {
	if (value == null) return undefined;
	if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return undefined;
		const num = Number(trimmed);
		return Number.isFinite(num) ? num : undefined;
	}
	return undefined;
}

export function isMeaningfulNumber(value, { allowZero = false } = {}) {
	const num = toFiniteNumber(value);
	if (num === undefined) return false;
	if (!allowZero && num === 0) return false;
	return true;
}

export function cleanArray(arr) {
	if (!Array.isArray(arr)) return undefined;
	const out = [];
	const seen = new Set();

	for (const item of arr) {
		if (item == null) continue;
		if (typeof item === "string") {
			const trimmed = item.trim();
			if (!trimmed) continue;
			if (seen.has(trimmed)) continue;
			seen.add(trimmed);
			out.push(trimmed);
			continue;
		}
		if (typeof item === "number") {
			if (!Number.isFinite(item)) continue;
			const key = `n:${item}`;
			if (seen.has(key)) continue;
			seen.add(key);
			out.push(item);
		}
	}

	return out.length ? out : undefined;
}

export function normalizeRange(from, to) {
	const fromNum = isMeaningfulNumber(from) ? toFiniteNumber(from) : undefined;
	const toNum = isMeaningfulNumber(to) ? toFiniteNumber(to) : undefined;

	if (fromNum !== undefined && toNum !== undefined && fromNum > toNum) {
		return { from: toNum, to: fromNum };
	}
	return { from: fromNum, to: toNum };
}

function normalizeIsoString(value) {
	if (!isNonEmptyString(value)) return undefined;
	const trimmed = value.trim();
	const ms = Date.parse(trimmed);
	if (!Number.isFinite(ms)) return undefined;
	return trimmed;
}

export function normalizeIsoRange(from, to) {
	const fromIso = normalizeIsoString(from);
	const toIso = normalizeIsoString(to);

	if (fromIso && toIso) {
		const fromMs = Date.parse(fromIso);
		const toMs = Date.parse(toIso);
		if (fromMs > toMs) return { from: toIso, to: fromIso };
	}

	return { from: fromIso, to: toIso };
}

export function omitUndefinedShallow(obj) {
	const out = {};
	for (const [k, v] of Object.entries(obj || {})) {
		if (v !== undefined) out[k] = v;
	}
	return out;
}

function toEnum(value) {
	if (!isNonEmptyString(value)) return undefined;
	return value.trim().replace(/\s+/g, "_").replace(/-/g, "_").toUpperCase();
}

function mapSaleType(value) {
	if (!isNonEmptyString(value)) return undefined;
	const v = value.trim().toLowerCase();
	if (v === "all") return undefined;
	if (v === "daily") return "DAILY";
	if (v === "sell") return "SELL";
	if (v === "rent") return "RENT";
	return toEnum(value);
}

function mapPropertyType(value) {
	if (!isNonEmptyString(value)) return undefined;
	const v = value.trim();
	const lower = v.toLowerCase();
	const dict = {
		apartment: "APARTMENT",
		apartmentdaily: "APARTMENT_DAILY",
		object: "OBJECT",
		house: "HOUSE",
		land: "LAND",
		office: "OFFICE",
		garage: "GARAGE",
		room: "ROOM",
		afame: "AFRAME",
		aframe: "AFRAME",
		kotej: "KOTEJ",
		gardenhouse: "GARDEN_HOUSE",
	};
	return dict[lower] || toEnum(v);
}

function mapCondition(value) {
	if (!isNonEmptyString(value)) return undefined;
	const v = value.trim().toLowerCase();
	if (v === "renewed") return "RENEWED";
	if (v === "notrenewed" || v === "not_renewed" || v === "not-renewed") return "NOT_RENEWED";
	return toEnum(value);
}

export function buildAnnouncementSearchFilterDto(searchParams) {
	const name = searchParams.get("name");
	const address = searchParams.get("address") || searchParams.get("location");

	const priceFromRaw = searchParams.get("priceFrom") || searchParams.get("priceMin");
	const priceToRaw = searchParams.get("priceTo") || searchParams.get("priceMax");
	const price = normalizeRange(priceFromRaw, priceToRaw);

	const areaFromRaw = searchParams.get("areaFrom") || searchParams.get("area_min");
	const areaToRaw = searchParams.get("areaTo") || searchParams.get("area_max");
	const area = normalizeRange(areaFromRaw, areaToRaw);

	const roomsAll = searchParams.getAll("rooms");
	const roomsSingle = roomsAll.length === 1 ? roomsAll[0] : undefined;

	const floorDirect = searchParams.get("floor");
	const floorMin = searchParams.get("floor_min");
	const floorMax = searchParams.get("floor_max");
	let floorCandidate = floorDirect;
	if (!floorCandidate) {
		if (isMeaningfulNumber(floorMin) && isMeaningfulNumber(floorMax) && toFiniteNumber(floorMin) === toFiniteNumber(floorMax)) {
			floorCandidate = floorMin;
		} else if (isMeaningfulNumber(floorMin) && !isMeaningfulNumber(floorMax)) {
			floorCandidate = floorMin;
		} else if (!isMeaningfulNumber(floorMin) && isMeaningfulNumber(floorMax)) {
			floorCandidate = floorMax;
		}
	}

	const metro = cleanArray(searchParams.getAll("metro").map(toEnum));
	const district = cleanArray(searchParams.getAll("district").map(toEnum));

	const propertyTypeRaw = searchParams.getAll("propertyType");
	const legacyPropertyTypesRaw = searchParams.getAll("propertyTypes");
	const propertyTypeList = cleanArray(
		(propertyTypeRaw.length ? propertyTypeRaw : legacyPropertyTypesRaw)
			.map(mapPropertyType)
			.filter(Boolean)
	);

	const conditionRaw = searchParams.getAll("condition");
	const repairStatus = searchParams.get("repairStatus");
	const condition = cleanArray(
		(conditionRaw.length ? conditionRaw : repairStatus ? [repairStatus] : [])
			.map(mapCondition)
			.filter(Boolean)
	);

	const documentStatus = cleanArray(searchParams.getAll("documentStatus").map(toEnum));
	const characteristics = cleanArray(searchParams.getAll("characteristics").map(toEnum));
	const priority = cleanArray(searchParams.getAll("priority").map(toEnum));

	const saleTypeRaw = searchParams.getAll("saleType");
	const announcementType = searchParams.get("announcementType");
	const saleType = cleanArray(
		(saleTypeRaw.length ? saleTypeRaw : announcementType ? [announcementType] : [])
			.map(mapSaleType)
			.filter(Boolean)
	);

	const createdAtFromRaw = searchParams.get("createdAtFrom");
	const createdAtToRaw = searchParams.get("createdAtTo");
	const createdAt = normalizeIsoRange(createdAtFromRaw, createdAtToRaw);

	const userIdRaw = searchParams.get("userId");
	const agentIdRaw = searchParams.get("agentId");
	const neighborhoodIdRaw = searchParams.get("neighborhoodId");

	const body = {
		name: isNonEmptyString(name) ? name.trim() : undefined,
		address: isNonEmptyString(address) ? address.trim() : undefined,
		priceFrom: price.from,
		priceTo: price.to,
		areaFrom: area.from,
		areaTo: area.to,
		rooms: isMeaningfulNumber(roomsSingle) ? toFiniteNumber(roomsSingle) : undefined,
		floor: isMeaningfulNumber(floorCandidate) ? toFiniteNumber(floorCandidate) : undefined,
		metro,
		district,
		propertyType: propertyTypeList,
		condition,
		documentStatus,
		characteristics,
		saleType,
		priority,
		createdAtFrom: createdAt.from,
		createdAtTo: createdAt.to,
		userId: isMeaningfulNumber(userIdRaw) ? toFiniteNumber(userIdRaw) : undefined,
		agentId: isMeaningfulNumber(agentIdRaw) ? toFiniteNumber(agentIdRaw) : undefined,
		neighborhoodId: isMeaningfulNumber(neighborhoodIdRaw) ? toFiniteNumber(neighborhoodIdRaw) : undefined,
	};

	return omitUndefinedShallow(body);
}
