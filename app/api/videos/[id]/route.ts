import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

/**
 * 관리자 전용 강의영상 삭제.
 *
 * videos 테이블은 RLS에서 anon에게 읽기만 허용하므로, 삭제는 service_role 키를 쓰는
 * 이 서버 라우트를 거친다. 호출자는 관리자 로그인(Supabase Auth) 세션 토큰을 보내야 한다.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const videoId = Number(id);
  if (!Number.isInteger(videoId) || videoId <= 0) {
    return NextResponse.json({ error: "올바르지 않은 영상 id입니다." }, { status: 400 });
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseAdmin.from("videos").delete().eq("id", videoId);
  if (error) {
    console.error("영상 삭제 실패:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: videoId });
}
