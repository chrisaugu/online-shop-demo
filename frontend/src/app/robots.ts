import type { MetadataRoute } from "next";
// import { getCanonicalUrl } from "@/lib/commerce";

export default function robots(): MetadataRoute.Robots {
	// const baseUrl = getCanonicalUrl();
	const baseUrl = "";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/checkout", "/order/", "/search", "/api/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	};
}