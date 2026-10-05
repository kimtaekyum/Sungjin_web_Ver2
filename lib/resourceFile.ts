import { NextResponse } from "next/server";
import { supabaseAdmin } from "./supabaseServer";
import { RESOURCE_BUCKET, fileNameFromPath, validResourcePath } from "./resources";

export async function serveResourceFile(request: Request, disposition: "inline" | "attachment") {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  if (!validResourcePath(path)) return NextResponse.json({ error: "파일 경로가 올바르지 않습니다." }, { status: 400 });
  const range = request.headers.get("range");
  if (range && !/^bytes=\d+-\d*$/.test(range)) return new Response(null, { status: 416 });
  try {
    const { data, error } = await supabaseAdmin.storage.from(RESOURCE_BUCKET).createSignedUrl(path, 60);
    if (error || !data?.signedUrl) return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
    const file = await fetch(data.signedUrl, { cache: "no-store", headers: range ? { Range: range } : undefined });
    if (file.status === 416) return new Response(null, { status: 416 });
    if (!file.ok || !file.body) return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
    const name = encodeURIComponent(fileNameFromPath(path)).replace(/['()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="exam-analysis.pdf"; filename*=UTF-8''${name}`,
      "Cache-Control": "private, no-store",
      "Accept-Ranges": "bytes",
    });
    const length = file.headers.get("content-length");
    if (length && !file.headers.get("content-encoding")) headers.set("Content-Length", length);
    const contentRange = file.headers.get("content-range");
    if (contentRange) headers.set("Content-Range", contentRange);
    return new Response(file.body, { status: file.status === 206 ? 206 : 200, headers });
  } catch (error) {
    console.error("내신 PDF 조회 실패:", error);
    return NextResponse.json({ error: "PDF를 불러오지 못했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 });
  }
}
