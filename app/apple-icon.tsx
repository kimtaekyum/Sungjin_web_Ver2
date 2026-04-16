import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fontData = await readFile(join(process.cwd(), "assets/Pretendard-Bold.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#B81D22",
          color: "#FFFFFF",
          fontFamily: "Pretendard",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        성진
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Pretendard", data: fontData, weight: 700, style: "normal" }],
    }
  );
}
