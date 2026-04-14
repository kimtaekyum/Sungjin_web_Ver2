import Anthropic from "@anthropic-ai/sdk";

export interface SummaryResult {
  title: string;
  content: string;
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `당신은 성진학원의 공지사항 편집자입니다. 학원 블로그에 올라온 글을 학부모용 공지사항으로 재가공합니다.

규칙:
- title: 원 제목을 공지사항 톤으로 간결하게 재작성 (30자 이내)
- content: 본문을 2~3문장 한국어로 요약. 존댓말 사용.
- 마케팅 문구는 자제하고, 학부모가 알아야 할 핵심 정보 위주로 작성
- 반드시 JSON 한 개만 응답. 코드 블록이나 다른 설명 없이 오로지 JSON 객체만 반환
- JSON 형식: {"title":"...","content":"..."}`;

export async function summarizeBlogPost(
  originalTitle: string,
  originalContent: string
): Promise<SummaryResult> {
  const userMessage = `원본 제목: ${originalTitle}

원본 본문:
${originalContent}`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = response.content[0];
  if (!block || block.type !== "text") {
    throw new Error("Claude 응답 형식이 올바르지 않습니다.");
  }

  const text = block.text.trim();
  // 코드 블록 제거 (```json ... ``` 형태로 올 경우 대비)
  const jsonText = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  let parsed: SummaryResult;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`Claude 응답 JSON 파싱 실패: ${text.slice(0, 200)}`);
  }

  if (!parsed.title || !parsed.content) {
    throw new Error("Claude 응답에 title 또는 content 필드가 없습니다.");
  }

  return {
    title: String(parsed.title).trim(),
    content: String(parsed.content).trim(),
  };
}
