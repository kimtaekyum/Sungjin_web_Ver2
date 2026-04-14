"use client";

import { useState, useMemo, useEffect } from "react";
import FaIcon from "@/components/ui/FaIcon";
import type { AcademyEvent } from "@/data/events";
import { getEvents } from "@/lib/events";

const RAINBOW = [
  "#E53935",
  "#FB8C00",
  "#FDD835",
  "#43A047",
  "#1E88E5",
  "#3949AB",
  "#8E24AA",
];

function formatDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getCsatDate(year: number) {
  const nov1 = new Date(year, 10, 1);
  const firstThu = ((4 - nov1.getDay() + 7) % 7) + 1;
  return new Date(year, 10, firstThu + 14);
}

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [allEvents, setAllEvents] = useState<AcademyEvent[]>([]);

  useEffect(() => {
    getEvents().then(setAllEvents);
  }, []);

  const eventsWithColor = useMemo(
    () => allEvents.map((ev, idx) => ({ ...ev, color: RAINBOW[idx % RAINBOW.length] })),
    [allEvents]
  );

  const ddayText = useMemo(() => {
    const now = new Date();
    let csat = getCsatDate(now.getFullYear());
    if (csat < now) csat = getCsatDate(now.getFullYear() + 1);
    const diff = Math.ceil(
      (csat.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
        86400000
    );
    const csatYear = csat.getFullYear();
    if (diff === 0) return `${csatYear}학년도 수능 D-Day!`;
    return `${csatYear + 1}학년도 수능 D-${diff}`;
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const getEventsForDate = (dateStr: string): (AcademyEvent & { color: string })[] =>
    eventsWithColor.filter(
      (ev) => dateStr >= ev.startDate && dateStr <= (ev.endDate || ev.startDate)
    );

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthEvents = eventsWithColor.filter(
    (ev) =>
      ev.startDate.substring(0, 7) <= monthPrefix &&
      (ev.endDate || ev.startDate).substring(0, 7) >= monthPrefix
  );

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="min-h-[44px] md:min-h-[36px]" />);
  }
  for (let d = 1; d <= lastDate; d++) {
    const dateStr = formatDateStr(year, month, d);
    const dayEvents = getEventsForDate(dateStr);
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;
    const dow = (firstDay + d - 1) % 7;
    const evColor = dayEvents[0]?.color;

    const ariaLabel =
      dayEvents.length > 0
        ? `${month + 1}월 ${d}일 (일정 ${dayEvents.length}건)`
        : `${month + 1}월 ${d}일`;

    cells.push(
      <button
        key={d}
        type="button"
        onClick={() => setSelectedDate(dateStr)}
        aria-label={ariaLabel}
        aria-pressed={isSelected}
        className={`relative flex flex-col items-center justify-center min-h-[44px] md:min-h-[36px] rounded-lg text-sm transition-colors cursor-pointer ${
          isSelected
            ? "bg-primary text-white"
            : dayEvents.length > 0
            ? "hover:bg-bg"
            : "hover:bg-bg"
        }`}
        style={
          !isSelected && evColor
            ? { background: `color-mix(in srgb, ${evColor} 12%, transparent)` }
            : undefined
        }
      >
        <span
          className={`${
            isToday && !isSelected
              ? "inline-flex items-center justify-center w-7 h-7 border-2 border-primary rounded-full text-primary font-medium"
              : ""
          } ${
            !isSelected && !isToday && dow === 0 ? "text-primary" : ""
          } ${!isSelected && !isToday && dow === 6 ? "text-[#3a7bd5]" : ""}`}
        >
          {d}
        </span>
        {dayEvents.length > 0 && (
          <span
            className="block w-[18px] h-[3px] rounded mt-0.5"
            style={{ background: isSelected ? "#fff" : evColor }}
          />
        )}
      </button>
    );
  }

  return (
    <div className="rounded-xl bg-surface border border-border/50 p-6 md:p-7 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FDF2F2] flex items-center justify-center text-primary">
            <FaIcon name="bullseye" className="w-4 h-4" />
          </div>
          <h3 className="text-base font-medium text-[#444444]">학사 일정</h3>
        </div>
        <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
          {ddayText}
        </span>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          aria-label="이전 달"
          className="w-11 h-11 md:w-8 md:h-8 flex items-center justify-center rounded-lg border border-border text-text-sub hover:bg-bg hover:text-primary transition-colors cursor-pointer"
        >
          &#8249;
        </button>
        <strong className="text-base font-medium text-[#444444]">
          {year}년 {month + 1}월
        </strong>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="다음 달"
          className="w-11 h-11 md:w-8 md:h-8 flex items-center justify-center rounded-lg border border-border text-text-sub hover:bg-bg hover:text-primary transition-colors cursor-pointer"
        >
          &#8250;
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-text-hint mb-1.5">
        <span className="text-primary">일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span className="text-[#3a7bd5]">토</span>
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-0.5">{cells}</div>

      {/* Event list */}
      <div className="mt-4 pt-4 border-t border-border/50 flex-1">
        {selectedDate && selectedEvents.length > 0 ? (
          <ul className="space-y-1.5">
            {selectedEvents.map((ev) => (
              <li key={ev.id} className="flex items-center gap-2 bg-bg px-2 py-1.5 rounded">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ev.color }} />
                <span className="text-sm text-text font-medium flex-1 truncate">{ev.title}</span>
                {ev.endDate && ev.endDate !== ev.startDate && (
                  <span className="text-xs text-text-hint">
                    {parseInt(ev.startDate.split("-")[1])}/{parseInt(ev.startDate.split("-")[2])} ~{" "}
                    {parseInt(ev.endDate.split("-")[1])}/{parseInt(ev.endDate.split("-")[2])}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : monthEvents.length > 0 ? (
          <ul className="space-y-1.5">
            {monthEvents.map((ev) => {
              const sd = ev.startDate.split("-");
              const label =
                ev.endDate && ev.endDate !== ev.startDate
                  ? `${parseInt(sd[1])}/${parseInt(sd[2])} ~ ${parseInt(
                      ev.endDate.split("-")[1]
                    )}/${parseInt(ev.endDate.split("-")[2])}`
                  : `${parseInt(sd[1])}/${parseInt(sd[2])}`;
              return (
                <li key={ev.id} className="flex items-center gap-2 px-2 py-1.5 rounded">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ev.color }} />
                  <span className="text-xs font-medium text-text-sub min-w-[60px]">{label}</span>
                  <span className="text-sm text-text flex-1 truncate">{ev.title}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-text-hint text-center">이번 달 등록된 일정이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
