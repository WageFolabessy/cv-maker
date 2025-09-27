"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Social = { id: string; label: string; url: string };
type Section = { id: string; title: string; content: string };
type CvData = {
  header: {
    name: string;
    role: string;
    email: string;
    phone: string;
    locationName: string;
    mapsUrl: string;
    avatarDataUrl?: string;
  };
  headerSocials: Social[];
  sections: Section[];
  footerSocials: Social[];
  footerNote: string;
};

const LS_KEY = "cv-maker";

export default function Home() {
  const [data, setData] = useState<CvData>({
    header: {
      name: "",
      role: "",
      email: "",
      phone: "",
      locationName: "",
      mapsUrl: "",
      avatarDataUrl: "",
    },
    headerSocials: [],
    sections: [],
    footerSocials: [],
    footerNote: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, []);

  const printCv = () => window.print();

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/gasnative.webp"
              alt="CV Maker Logo"
              width={36}
              height={36}
              className="rounded"
            />
            <h1 className="text-lg font-semibold tracking-tight">CV Maker</h1>
          </div>

          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link href="/cvmaker" className="hover:underline">
                  Go to Editor
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={printCv}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
            >
              Print
            </button>
          </div>
        </div>
      </header>

      <main className="flex justify-center bg-gray-50 min-h-dvh">
        <article
          id="cv-preview"
          aria-label="CV Preview"
          className="mx-auto my-8 w-full max-w-[794px] bg-white rounded-2xl border shadow-lg print:shadow-none"
        >
          <header className="border-b">
            <div className="px-8 py-8 text-center">
              <div className="flex items-center justify-center">
                {data.header.avatarDataUrl ? (
                  <Image
                    alt="Profile photo"
                    src={data.header.avatarDataUrl}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 border flex items-center justify-center text-3xl text-gray-500">
                    ?
                  </div>
                )}
              </div>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">
                {data.header.name || "Name"}
              </h2>
              <p className="text-blue-600">{data.header.role || ""}</p>

              <address className="not-italic mt-3 text-sm text-gray-600 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                {data.header.email && <span>{data.header.email}</span>}
                {data.header.phone && <span>{data.header.phone}</span>}
                {data.header.locationName && data.header.mapsUrl && (
                  <a
                    className="text-gray-600 hover:underline"
                    href={data.header.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.header.locationName}
                  </a>
                )}
              </address>

              {data.headerSocials.length > 0 && (
                <nav
                  aria-label="Header Socials"
                  className="mt-3 text-sm flex items-center justify-center gap-4 flex-wrap"
                >
                  {data.headerSocials.map((s) =>
                    s.url ? (
                      <a
                        key={s.id}
                        className="text-black hover:underline"
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {s.label || s.url}
                      </a>
                    ) : null
                  )}
                </nav>
              )}
            </div>
          </header>

          <div className="px-6 sm:px-10 py-6 space-y-6">
            {data.sections.map((s) => (
              <section
                key={s.id}
                aria-labelledby={`h-${s.id}`}
                className="border rounded-xl overflow-hidden"
              >
                <header className="px-5 py-3 bg-gray-50 border-b">
                  <h3 id={`h-${s.id}`} className="font-semibold text-gray-800">
                    {s.title || "Untitled"}
                  </h3>
                </header>
                <div className="px-5 py-4 text-gray-800 text-sm leading-7">
                  <div dangerouslySetInnerHTML={{ __html: s.content || "" }} />
                </div>
              </section>
            ))}

            <footer className="text-center text-sm text-gray-600 pt-6">
              {data.footerNote}
              {data.footerSocials.length > 0 && (
                <nav
                  aria-label="Footer Socials"
                  className="mt-2 flex items-center justify-center gap-4 flex-wrap"
                >
                  {data.footerSocials.map((s) =>
                    s.url ? (
                      <a
                        key={s.id}
                        className="text-black hover:underline"
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {s.label || s.url}
                      </a>
                    ) : null
                  )}
                </nav>
              )}
            </footer>
          </div>
        </article>
      </main>
    </>
  );
}
