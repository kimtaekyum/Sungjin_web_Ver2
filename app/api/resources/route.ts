import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import {
  RESOURCE_BUCKET, resourceDetailsFromPath, resourceFolder, validCategory, validResourcePath, validPendingResourcePath, validResourceMetadata,
  type ExamResource,
} from "@/lib/resources";

export const dynamic = "force-dynamic";

function isMissingBucket(error: { statusCode?: string; message: string }): boolean {
  return error.statusCode === "404" || error.message.toLowerCase().includes("bucket not found");
}

async function authenticated(request: Request): Promise<boolean> {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return false;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return !error && !!data.user;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const level = params.get("level") ?? "";
  const year = params.get("year") ?? "";
  const semester = params.get("semester") ?? "";
  const subject = params.get("subject") ?? "";
  const page = Number(params.get("page") ?? "0");
  const schoolName = (params.get("schoolName") ?? "").trim();
  const grade = params.get("grade") ?? "";
  const exam = params.get("exam") ?? "";
  const q = (params.get("q") ?? "").trim();
  if (!validCategory(level, year, semester, subject) || !Number.isInteger(page) || page < 0 || page > 100) {
    return NextResponse.json({ error: "분류가 올바르지 않습니다." }, { status: 400 });
  }
  if (!validResourceMetadata({ schoolName, grade, exam }) || q.length > 100) {
    return NextResponse.json({ error: "검색 조건이 올바르지 않습니다." }, { status: 400 });
  }

  const folder = resourceFolder(level, year, semester, subject);
  const allItems: ExamResource[] = [];
  // 검색과 필터를 페이지 분할 전에 적용해 다음 페이지의 자료도 찾는다.
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabaseAdmin.storage.from(RESOURCE_BUCKET).list(folder, {
      limit: 1000, offset, sortBy: { column: "created_at", order: "desc" },
    });
    if (error && isMissingBucket(error)) break;
    if (error) {
      console.error("내신분석실 목록 조회 실패:", error);
      return NextResponse.json({ error: "자료 목록을 불러오지 못했습니다." }, { status: 500 });
    }
    for (const file of data ?? []) {
      if (!file.id || !validResourcePath(`${folder}/${file.name}`)) continue;
      allItems.push({ path: `${folder}/${file.name}`, ...resourceDetailsFromPath(file.name),
        createdAt: file.created_at ?? "", size: Number(file.metadata?.size ?? 0) });
    }
    if ((data?.length ?? 0) < 1000) break;
  }

  const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase("ko-KR");
  const filtered = allItems.filter((item) => (!schoolName || item.schoolName === schoolName) &&
    (!grade || item.grade === grade) && (!exam || item.exam === exam) &&
    (!q || normalize(`${item.title} ${item.schoolName}`).includes(normalize(q))));
  const schools = [...new Set(allItems.map((item) => item.schoolName).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ko"));
  return NextResponse.json({ items: filtered.slice(page * 50, (page + 1) * 50), hasMore: filtered.length > (page + 1) * 50, total: filtered.length, schools }, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!(await authenticated(request))) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 }); }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }
  const body = input as Record<string, unknown>;
  if (body.purpose !== undefined && body.purpose !== "replacement") {
    return NextResponse.json({ error: "업로드 요청이 올바르지 않습니다." }, { status: 400 });
  }
  if (body.purpose === "replacement" && !validResourcePath(body.originalPath)) {
    return NextResponse.json({ error: "교체할 자료가 올바르지 않습니다." }, { status: 400 });
  }
  if (!validResourceMetadata(body)) {
    return NextResponse.json({ error: "학교명은 50자 이하, 학년은 1~3학년, 시험은 중간·기말고사로 선택해주세요." }, { status: 400 });
  }

  const level = typeof body.level === "string" ? body.level : "";
  const year = typeof body.year === "string" ? body.year : "";
  const semester = typeof body.semester === "string" ? body.semester : "";
  const subject = typeof body.subject === "string" ? body.subject : "";
  const size = typeof body.size === "number" ? body.size : 0;
  const cleanName = typeof body.fileName === "string" ? body.fileName.trim() : "";
  const title = body.title === undefined
    ? cleanName.replace(/\.pdf$/i, "").slice(0, 100)
    : typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 100 || /[\x00-\x1f]/.test(title)) {
    return NextResponse.json({ error: "자료 제목은 1~100자로 입력해주세요." }, { status: 400 });
  }
  if (!validCategory(level, year, semester, subject) ||
      !cleanName.toLowerCase().endsWith(".pdf") || cleanName.length > 120 ||
      /[\\/\x00-\x1f]/.test(cleanName) || !Number.isFinite(size) || size < 1 || size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "PDF 파일 또는 분류가 올바르지 않습니다. 파일 크기는 50MB 이하여야 합니다." }, { status: 400 });
  }

  const storage = supabaseAdmin.storage;
  const { error: bucketError } = await storage.getBucket(RESOURCE_BUCKET);
  if (bucketError && !isMissingBucket(bucketError)) {
    console.error("내신분석실 버킷 확인 실패:", bucketError);
    return NextResponse.json({ error: "자료 저장소를 확인하지 못했습니다." }, { status: 500 });
  }
  if (bucketError) {
    const { error: createError } = await storage.createBucket(RESOURCE_BUCKET, {
      public: false,
      fileSizeLimit: 50 * 1024 * 1024,
      allowedMimeTypes: ["application/pdf"],
    });
    if (createError && !createError.message.toLowerCase().includes("already exists")) {
      console.error("내신분석실 버킷 생성 실패:", createError);
      return NextResponse.json({ error: "자료 저장소를 준비하지 못했습니다." }, { status: 500 });
    }
  }

  const details = JSON.stringify({ name: cleanName, title, schoolName: typeof body.schoolName === "string" ? body.schoolName.trim() : "", grade: body.grade ?? "", exam: body.exam ?? "" });
  const path = body.purpose === "replacement" ? `_pending/${crypto.randomUUID()}.pdf`
    : `${resourceFolder(level, year, semester, subject)}/${crypto.randomUUID()}__${Buffer.from(details).toString("base64url")}`;
  const { data, error } = await storage.from(RESOURCE_BUCKET).createSignedUploadUrl(path);
  if (error) {
    console.error("내신분석실 업로드 URL 생성 실패:", error);
    return NextResponse.json({ error: "업로드를 시작하지 못했습니다." }, { status: 500 });
  }
  return NextResponse.json({ path, token: data.token });
}

export async function PATCH(request: Request) {
  if (!(await authenticated(request))) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 }); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  const body = input as Record<string, unknown>;
  const oldPath = body.path;
  const replacement = body.replacementPath;
  if (!validResourcePath(oldPath) || (replacement !== undefined && !validPendingResourcePath(replacement))) {
    return NextResponse.json({ error: "수정할 파일 경로가 올바르지 않습니다." }, { status: 400 });
  }
  const original = resourceDetailsFromPath(oldPath);
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const name = replacement ? (typeof body.fileName === "string" ? body.fileName.trim() : "") : original.name;
  if (!validCategory(body.level, body.year, body.semester, body.subject) || !validResourceMetadata(body) ||
      !title || title.length > 100 || /[\x00-\x1f]/.test(title) || !name.toLowerCase().endsWith(".pdf") || name.length > 120 || /[\\/\x00-\x1f]/.test(name)) {
    return NextResponse.json({ error: "제목, 파일명 또는 분류가 올바르지 않습니다." }, { status: 400 });
  }
  const storage = supabaseAdmin.storage.from(RESOURCE_BUCKET);
  const { error: missing } = await storage.info(oldPath);
  if (missing) return NextResponse.json({ error: "자료가 삭제되거나 변경되었습니다. 목록을 새로고침해주세요." }, { status: 409 });

  if (replacement) {
    const { data: info, error } = await storage.info(replacement);
    const size = Number(info?.size ?? info?.metadata?.size ?? 0);
    if (error || size < 1 || size > 50 * 1024 * 1024) return NextResponse.json({ error: "교체할 PDF 업로드를 확인해주세요." }, { status: 400 });
    const { data: signed, error: signedError } = await storage.createSignedUrl(replacement, 60);
    if (signedError || !signed) return NextResponse.json({ error: "교체할 파일을 확인하지 못했습니다." }, { status: 500 });
    const file = await fetch(signed.signedUrl, { headers: { Range: "bytes=0-4" }, cache: "no-store" });
    const reader = file.body?.getReader();
    const signature = new Uint8Array(5);
    let length = 0;
    if (file.ok && reader) {
      try {
        while (length < 5) {
          const chunk = await reader.read();
          if (chunk.done) break;
          const slice = chunk.value.subarray(0, 5 - length);
          signature.set(slice, length); length += slice.length;
        }
      } finally { await reader.cancel(); }
    }
    if (length !== 5 || new TextDecoder().decode(signature) !== "%PDF-") return NextResponse.json({ error: "PDF 형식의 파일만 교체할 수 있습니다." }, { status: 400 });
  }

  const details = JSON.stringify({ name, title, schoolName: typeof body.schoolName === "string" ? body.schoolName.trim() : "", grade: body.grade ?? "", exam: body.exam ?? "" });
  const uuid = replacement ? crypto.randomUUID() : oldPath.split("/").at(-1)!.slice(0, 36);
  const path = `${resourceFolder(body.level as string, body.year as string, body.semester as string, body.subject as string)}/${uuid}__${Buffer.from(details).toString("base64url")}`;
  if (!replacement && path === oldPath) return NextResponse.json({ ok: true, path });
  const { error: moveError } = await storage.move(replacement ?? oldPath, path);
  if (moveError) {
    console.error("자료 수정 실패:", moveError);
    return NextResponse.json({ error: "자료를 저장하지 못했습니다. 기존 PDF는 유지됩니다." }, { status: 500 });
  }
  if (replacement) {
    // 새 PDF의 검증과 저장이 완료된 뒤에 기존 파일을 삭제한다.
    const { data, error } = await storage.remove([oldPath]);
    if (error || !data?.length) {
      console.error("교체 후 기존 자료 정리 실패:", error);
      return NextResponse.json({ ok: true, path, warning: "새 PDF는 저장됐지만 기존 자료 정리를 완료하지 못했습니다. 목록에서 기존 자료를 확인해주세요." });
    }
  }
  return NextResponse.json({ ok: true, path });
}

export async function DELETE(request: Request) {
  if (!(await authenticated(request))) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 }); }
  const path = input && typeof input === "object" ? (input as Record<string, unknown>).path : null;
  if (!validResourcePath(path) && !validPendingResourcePath(path)) return NextResponse.json({ error: "파일 경로가 올바르지 않습니다." }, { status: 400 });

  const { data, error } = await supabaseAdmin.storage.from(RESOURCE_BUCKET).remove([path]);
  if (error || (!data?.length && !validPendingResourcePath(path))) {
    console.error("내신분석실 삭제 실패:", error);
    return NextResponse.json({ error: "파일을 삭제하지 못했습니다." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
