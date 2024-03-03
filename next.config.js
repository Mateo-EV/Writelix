/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  webpack: (config) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    config.resolve.alias.canvas = false;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
};

export default config;
