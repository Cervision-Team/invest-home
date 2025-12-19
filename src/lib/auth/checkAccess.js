import { rolePermissionMap } from "./rolePermissionMap";

// Accept either a role key (backward compatible) or a list of accessible paths
export const hasAccessUrl = (pathsOrRole, url) => {
	const accessibleRoutes = Array.isArray(pathsOrRole)
		? pathsOrRole
		: rolePermissionMap[pathsOrRole] || [];

	if (!accessibleRoutes?.length) return false;

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


