/** @type {import('next').NextConfig} */
const isTurbopack = process.env.TURBOPACK === "1";
const isDev = process.env.NODE_ENV === "development";

const baseConfig = {
	reactStrictMode: true,
	images: {
		domains: ["firebasestorage.googleapis.com"],
		unoptimized: true,
	},
};

if (!isTurbopack) {
	const withPWA = require("next-pwa")({
		dest: "public",
		register: true,
		skipWaiting: true,
		disable: isDev,
		maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15 MB
	});

	module.exports = withPWA(baseConfig);
} else {
	module.exports = baseConfig;
}
