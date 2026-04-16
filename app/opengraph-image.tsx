import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "성진학원 — 대학 잘 보내는 1대1 맞춤 첨삭 전문";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const fontData = await readFile(join(process.cwd(), "assets/Pretendard-Bold.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          background: "#FAFAFA",
          fontFamily: "Pretendard",
          color: "#2C2C2A",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 12, height: 40, background: "#B81D22", borderRadius: 2 }} />
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#B81D22",
              letterSpacing: "-0.02em",
            }}
          >
            SUNGJIN ACADEMY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#2C2C2A",
              lineHeight: 1.05,
            }}
          >
            대학 잘 보내는
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#2C2C2A",
              lineHeight: 1.05,
            }}
          >
            1대1 맞춤 첨삭
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 700,
              color: "#6B6A6A",
              letterSpacing: "-0.02em",
              marginTop: 16,
            }}
          >
            신월동 30년 전통 · 서울대 · 포항공대 합격
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: 24,
            fontWeight: 700,
            color: "#B81D22",
            letterSpacing: "-0.02em",
          }}
        >
          성진학원
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Pretendard", data: fontData, weight: 700, style: "normal" }],
    }
  );
}
