import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  // HTTPS 강제 (2년, 서브도메인 포함, HSTS preload 등록 가능)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // MIME 타입 스니핑 차단
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // 클릭재킹 방지 (iframe 임베드는 동일 출처만 허용)
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Referrer 최소한만 전달
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // 사용 안 하는 브라우저 기능 전부 차단
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()",
  },
  // DNS 프리페치 허용 (성능)
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // 오리진 간 리소스 공유 정책
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
