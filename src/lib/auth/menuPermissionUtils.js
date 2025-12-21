export const normalizePath = (value) => {
	if (typeof value !== "string") return "";
	let path = value.trim();
	if (!path) return "";
	if (!path.startsWith("/")) path = `/${path}`;
	if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
	return path;
};

export const extractMenuPaths = (menuList = []) => {
	if (!Array.isArray(menuList)) return [];
	return menuList.flatMap((item) => [
		item?.path,
		...(item?.subMenuEntities?.length ? extractMenuPaths(item.subMenuEntities) : []),
	]);
};
