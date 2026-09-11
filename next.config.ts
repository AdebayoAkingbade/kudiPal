import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  ...(isDevelopment ? ["'unsafe-eval'"] : []),
  "https://js.paystack.co",
];

const imageSources = [
  "'self'",
  "data:",
  "blob:",
  "https://*.supabase.co",
  ...(process.env.NEXT_PUBLIC_IMAGE_CSP_SOURCES?.split(/\s+/).filter(Boolean) ?? []),
];

const connectSources = [
  "'self'",
  "https://*.supabase.co",
  "https://api.paystack.co",
  "https://api.openai.com",
  ...(isDevelopment ? ["http://localhost:8081", "http://127.0.0.1:*", "ws://localhost:*", "ws://127.0.0.1:*"] : []),
];

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Origin-Agent-Cluster", value: "?1" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=(self), browsing-topics=()",
          },
          ...(!isDevelopment
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "object-src 'none'",
              `script-src ${scriptSources.join(" ")}`,
              "style-src 'self' 'unsafe-inline'",
              `img-src ${imageSources.join(" ")}`,
              "font-src 'self' data:",
              `connect-src ${connectSources.join(" ")}`,
              "frame-src https://checkout.paystack.com https://js.paystack.co",
              ...(!isDevelopment ? ["upgrade-insecure-requests"] : []),
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
