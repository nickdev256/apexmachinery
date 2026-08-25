import fs from "fs";
import path from "path";

const BASE_URL = "https://apexmachinery256.com";

const productsPath = path.resolve("src/data/products.json");
const outputPath = path.resolve("public/sitemap.xml");

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

const staticPages = [
  {
    path: "/",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/about",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/shop",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/industrial-equipment",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/power-tools",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/brands",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/contact",
    changefreq: "monthly",
    priority: "0.7",
  },
];

const productPages = products.map((product) => ({
  path: `/product/${product.id}`,
  changefreq: "weekly",
  priority: "0.8",
}));

const pages = [...staticPages, ...productPages];

const urls = pages
  .map(
    ({ path, changefreq, priority }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(outputPath, sitemap.trim());

console.log(
  `Sitemap generated successfully with ${pages.length} URLs.`
);