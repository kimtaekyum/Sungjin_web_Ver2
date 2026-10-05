import { supabaseAdmin } from "./supabaseServer";
import {
  RESOURCE_BUCKET, RESOURCE_LEVELS, RESOURCE_SEMESTERS, RESOURCE_SUBJECTS,
  LEVEL_LABELS, SUBJECT_LABELS, EXAM_LABELS, resourceDetailsFromPath, validResourcePath,
  type ExamResource, type ResourceLevel, type ResourceSubject,
} from "./resources";

export interface ResourceFilters {
  level: ResourceLevel | "";
  year: string;
  semester: string;
  subject: ResourceSubject | "";
  schoolName: string;
  grade: string;
  exam: string;
  q: string;
  page: number;
}

/** 전체 선택은 실제 저장된 폴더를 순회한다. 업로드 대기 폴더는 포함하지 않는다. */
export async function listResources(filters: ResourceFilters) {
  const bucket = supabaseAdmin.storage.from(RESOURCE_BUCKET);
  async function listFolder(folder: string) {
    const entries = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await bucket.list(folder, {
        limit: 1000, offset, sortBy: { column: "name", order: "asc" },
      });
      if (error) {
        if (error.statusCode === "404" || error.message.toLowerCase().includes("bucket not found")) return [];
        throw new Error("자료 목록을 불러오지 못했습니다.");
      }
      entries.push(...(data ?? []));
      if ((data?.length ?? 0) < 1000) return entries;
    }
  }

  const allItems: ExamResource[] = [];
  const availableYears = new Set<string>();
  const levels = filters.level ? [filters.level] : RESOURCE_LEVELS;
  await Promise.all(levels.map(async (level) => {
    const folders = await listFolder(level);
    const storedYears = folders.filter((folder) => !folder.id && /^20\d{2}$/.test(folder.name) && Number(folder.name) >= 2026)
      .map((folder) => folder.name);
    storedYears.forEach((year) => availableYears.add(year));
    const years = filters.year ? [filters.year] : storedYears;
    await Promise.all(years.map(async (year) => {
      const yearFolder = `${level}/${year}`;
      const semesters = filters.semester ? [filters.semester]
        : (await listFolder(yearFolder)).filter((folder) => !folder.id && RESOURCE_SEMESTERS.includes(folder.name as "1" | "2"))
          .map((folder) => folder.name);
      await Promise.all(semesters.map(async (semester) => {
        const semesterFolder = `${yearFolder}/${semester}`;
        const subjects = filters.subject ? [filters.subject]
          : (await listFolder(semesterFolder)).filter((folder) => !folder.id && RESOURCE_SUBJECTS.includes(folder.name as ResourceSubject))
            .map((folder) => folder.name as ResourceSubject);
        await Promise.all(subjects.map(async (subject) => {
          const folder = `${semesterFolder}/${subject}`;
          for (const file of await listFolder(folder)) {
            const path = `${folder}/${file.name}`;
            if (!file.id || !validResourcePath(path)) continue;
            allItems.push({ path, level, year, semester, subject, ...resourceDetailsFromPath(file.name),
              createdAt: file.created_at ?? "", size: Number(file.metadata?.size ?? 0) });
          }
        }));
      }));
    }));
  }));

  // 폴더별 나열 순서와 관계없이 최신 등록순으로 정렬하고 마지막에 페이지를 나눈다.
  allItems.sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0) || a.path.localeCompare(b.path));
  const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\s+/g, "");
  const terms = filters.q.split(/\s+/).filter(Boolean).map(normalize);
  const filtered = allItems.filter((item) => {
    if ((filters.schoolName && item.schoolName !== filters.schoolName) ||
        (filters.grade && item.grade !== filters.grade) || (filters.exam && item.exam !== filters.exam)) return false;
    const text = normalize([
      item.title, item.name, item.schoolName, LEVEL_LABELS[item.level], `${item.year}년`,
      `${item.semester}학기`, SUBJECT_LABELS[item.subject], item.grade && `${item.grade}학년`,
      item.exam && EXAM_LABELS[item.exam],
    ].filter(Boolean).join(" "));
    return terms.every((term) => text.includes(term));
  });
  const schools = [...new Set(allItems.map((item) => item.schoolName).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ko"));
  return {
    items: filtered.slice(filters.page * 50, (filters.page + 1) * 50),
    hasMore: filtered.length > (filters.page + 1) * 50, total: filtered.length, schools,
    years: [...availableYears].sort((a, b) => Number(b) - Number(a)),
  };
}
