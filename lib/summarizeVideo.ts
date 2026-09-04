import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * 유튜브 영상 제목/설명을 홈페이지 노출용 소개 문구로 요약한다.
 * lib/summarize.ts(블로그 공지 요약)와 동일한 SDK 초기화·모델을 쓰되,
 * 출력이 JSON이 아닌 plain text라 파싱 로직은 없다.
 */
export async function summarizeVideo(title: string, description: string): Promise<string> {
  const userMessage = `다음은 학원 홈페이지에 올릴 영상의 제목과 설명입니다. 학생과 학부모가 읽기 쉽게 2~3문장의 짧은 소개 문구를 한국어로 작성해주세요.

제목: ${title}
설명: ${description}`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 300,
    messages: [{ role: "user", content: userMessage }],
  });

  const block = response.content[0];
  if (!block || block.type !== "text") {
    throw new Error("Claude 응답 형식이 올바르지 않습니다.");
  }

  return block.text.trim();
}
