export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/profile"],
    },
    sitemap: "https://ziyomarket.vercel.app/sitemap.xml",
  };
}
