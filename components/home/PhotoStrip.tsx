"use client";

import Image from "next/image";

interface Photo {
  src: string;
  ratio: number;
}

const PHOTOS: Photo[] = [
  { src: "/images/banner/banner-03.jpeg", ratio: 1.333 },
  { src: "/images/banner/banner-13.jpeg", ratio: 1.0 },
  { src: "/images/banner/banner-05.jpeg", ratio: 0.562 },
  { src: "/images/banner/banner-10.jpeg", ratio: 1.777 },
  { src: "/images/banner/banner-16.jpeg", ratio: 0.819 },
  { src: "/images/banner/banner-06.jpeg", ratio: 1.333 },
  { src: "/images/banner/banner-01.jpeg", ratio: 1.0 },
  { src: "/images/banner/banner-14.jpeg", ratio: 0.551 },
  { src: "/images/banner/banner-09.jpeg", ratio: 1.333 },
  { src: "/images/banner/banner-02.jpeg", ratio: 0.75 },
  { src: "/images/banner/banner-04.jpeg", ratio: 1.333 },
  { src: "/images/banner/banner-15.jpeg", ratio: 1.0 },
  { src: "/images/banner/banner-07.jpeg", ratio: 1.333 },
  { src: "/images/banner/banner-11.jpeg", ratio: 0.644 },
  { src: "/images/banner/banner-08.jpeg", ratio: 1.055 },
  { src: "/images/banner/banner-18.jpeg", ratio: 1.333 },
  { src: "/images/banner/banner-17.jpeg", ratio: 0.901 },
  { src: "/images/banner/banner-12.jpeg", ratio: 1.333 },
];

const H_MOBILE = 160;
const H_DESKTOP = 220;

export default function PhotoStrip() {
  const doubled = [...PHOTOS, ...PHOTOS];
  return (
    <section className="py-6 md:py-10 bg-bg overflow-hidden">
      <div className="relative">
        <div className="group overflow-hidden">
          <div className="flex items-center gap-3 md:gap-4 w-max animate-marquee group-hover:[animation-play-state:paused]">
            {doubled.map((p, i) => (
              <div
                key={i}
                className="photo-card relative flex-shrink-0 overflow-hidden rounded-xl md:rounded-2xl"
                style={{
                  "--w-m": `${Math.round(H_MOBILE * p.ratio)}px`,
                  "--h-m": `${H_MOBILE}px`,
                  "--w-d": `${Math.round(H_DESKTOP * p.ratio)}px`,
                  "--h-d": `${H_DESKTOP}px`,
                } as React.CSSProperties}
              >
                <Image
                  src={p.src}
                  alt="성진학원"
                  fill
                  sizes={`(max-width: 768px) ${Math.round(H_MOBILE * p.ratio)}px, ${Math.round(H_DESKTOP * p.ratio)}px`}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-bg to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-bg to-transparent z-10" />
      </div>
    </section>
  );
}
