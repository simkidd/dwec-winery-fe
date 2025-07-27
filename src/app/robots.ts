import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.WEBSITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about-us",
        "/products",
        "/contact-us",
        "/blog",
        "privacy-policy",
        "/return-policy",
        "/terms-and-conditions",
        "/faqs",
        "/login",
        "/register",
      ],
      disallow: ["/admin", "/account", "/checkout", "/cart"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
