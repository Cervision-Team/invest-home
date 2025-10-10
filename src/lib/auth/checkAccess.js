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

const rolePermissions = {
	admin: ["view:post"],
};

export const hasAccess = (role, resource, action) => {
	const accessiblePermissions = rolePermissions[role] || [];
	const target = `${resource}:${action}`;
	return accessiblePermissions.includes(target);
};

console.log(hasAccess("admin", "view", "post"));


