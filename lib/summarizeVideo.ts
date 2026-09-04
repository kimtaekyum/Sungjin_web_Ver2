import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `당신은 성진학원 홈페이지의 강의 영상 소개 문구를 작성하는 편집자입니다.

규칙:
- 학생과 학부모가 읽기 쉬운 2~3문장의 소개 문구를 한국어로 작성. 존댓말 사용.
- 영상 설명이 비어 있으면 제목만 보고 작성한다.
- 과장된 마케팅 표현은 자제하고, 무엇을 배우는 영상인지 담백하게 전달한다.
- 마크다운 문법(#, **, ---, 목록 기호)을 쓰지 않는다.
- 제목, 머리말, "다음은...", 선택지 제시, 부연 설명 없이 완성된 소개 문구 본문만 출력한다.`;

/**
 * 마크다운·머리말이 섞여 나올 때를 대비한 최소 정리.
 * 시스템 프롬프트로 막고 있지만, 그대로 홈페이지에 노출되는 값이라 한 겹 더 둔다.
 */
function stripMarkdown(text: string): string {
  return text
    .split("\n")
    .filter((line) => !/^\s*#{1,6}\s/.test(line) && !/^\s*-{3,}\s*$/.test(line))
    .join("\n")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function summarizeVideo(title: string, description: string): Promise<string> {
  const userMessage = `다음은 학원 홈페이지에 올릴 영상의 제목과 설명입니다. 학생과 학부모가 읽기 쉽게 2~3문장의 짧은 소개 문구를 한국어로 작성해주세요.

제목: ${title}
설명: ${description || "(설명 없음)"}`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = response.content[0];
  if (!block || block.type !== "text") {
    throw new Error("Claude 응답 형식이 올바르지 않습니다.");
  }

  const summary = stripMarkdown(block.text);
  if (!summary) {
    throw new Error("Claude가 빈 소개 문구를 반환했습니다.");
  }

  return summary;
}
