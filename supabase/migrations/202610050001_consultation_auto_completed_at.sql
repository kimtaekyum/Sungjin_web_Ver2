-- 자동 처리로 연락 완료된 신청의 처리 시각. 수동 상태 변경 시 NULL로 초기화한다.
ALTER TABLE public.consultations
ADD COLUMN IF NOT EXISTS auto_completed_at timestamptz;
