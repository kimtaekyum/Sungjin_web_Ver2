import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { RESOURCE_BUCKET, fileNameFromPath, validResourcePath } from "@/lib/resources";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  if (!validResourcePath(path)) return NextResponse.json({ error: "파일 경로가 올바르지 않습니다." }, { status: 400 });
  const { data, error } = await supabaseAdmin.storage.from(RESOURCE_BUCKET).createSignedUrl(path, 60);
  if (error || !data?.signedUrl) return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });

  // Storage의 download 옵션은 한글 이름을 퍼센트 인코딩된 상태로 저장할 수 있다.
  // 파일 본문을 스트리밍하고 표준 filename* 헤더로 원래 이름을 전달한다.
  const file = await fetch(data.signedUrl, { cache: "no-store" });
  if (!file.ok || !file.body) return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
  const fileName = encodeURIComponent(fileNameFromPath(path)).replace(/['()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="exam-analysis.pdf"; filename*=UTF-8''${fileName}`,
    "Cache-Control": "private, no-store",
  });
  const length = file.headers.get("content-length");
  if (length && !file.headers.get("content-encoding")) headers.set("Content-Length", length);
  return new Response(file.body, { headers });
}
