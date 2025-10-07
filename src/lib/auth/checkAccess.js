import { rolePermissionMap } from "./rolePermissionMap";

export const hasAccessUrl = (role, url) => {
	const accessibleRoutes = rolePermissionMap[role] || [];
	return accessibleRoutes.some((route) => {
		const regexPattern = route
			.replace(/\[.*?\]/g, "[^/]+")
			.replace("/", "\\/");
		const regex = new RegExp(`^${regexPattern}$`);
		return regex.test(url);
	});
};
