import { rolePermissionMap } from "./rolePermissionMap";

const normalizePath = (value) => {
	if (typeof value !== "string") return "";
	let path = value.trim();
	if (!path) return "";
	if (!path.startsWith("/")) path = `/${path}`;
	if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
	return path;
};

export const hasAccessUrl = (allowedPaths, currentPath) => {
	const accessibleRoutes = allowedPaths || [];

	if (!accessibleRoutes?.length) return false;

	const normalizedUrl = normalizePath(currentPath);

	return accessibleRoutes.some((route) => {
		const normalizedRoute = normalizePath(route);
		if (!normalizedRoute) return false;

		const regexPattern = route
			.replace(/\[.*?\]/g, "[^/]+")
			.replace(/\//g, "\\/");
		const regex = new RegExp(`^${regexPattern}$`);
		if (normalizedRoute === normalizedUrl) return true;
		return regex.test(normalizedUrl);
	});
};

// const rolePermissions = {
// 	admin: ["view:post"],
// };

// export const hasAccess = (role, resource, action) => {
// 	const accessiblePermissions = rolePermissions[role] || [];
// 	const target = `${resource}:${action}`;
// 	return accessiblePermissions.includes(target);
// };

// console.log(hasAccess("admin", "view", "post"));
