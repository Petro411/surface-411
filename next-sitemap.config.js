/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.petro411.com",
  generateRobotsTxt: true,
  exclude: ["/owners/*"],
  transform: async (config, path) => {
    if (/^\/owners\/.+/.test(path)) {
      return null;
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/owners/*"],
      },
    ],
  },
};
