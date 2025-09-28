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
  const [data, setData] = useState<CvData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {}
    finally {
      setLoaded(true);
    }
  }, []);

  const isCvEmpty = (d: CvData) => {
    const h = d.header;
    const isEmptyHeader =
      [h.name, h.role, h.email, h.phone, h.locationName, h.mapsUrl, h.avatarDataUrl]
        .every((x) => !x || String(x).trim() === "");
    const isEmptyBody =
      d.headerSocials.length === 0 &&
      d.sections.length === 0 &&
      (!d.footerNote || d.footerNote.trim() === "") &&
      d.footerSocials.length === 0;
    return isEmptyHeader && isEmptyBody;
  };

  const hasData = !!data && !isCvEmpty(data);

  const linkifyHtml = (html: string) => {
    if (!html) return html;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
      const urlRe = /(https?:\/\/[^\s<]+)|(www\.[^\s<]+\.[^\s<]+)/gi;
      const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

      const needsLinkify = (node: Node) => {
        let p: Node | null = node.parentNode;
        while (p) {
          if ((p as HTMLElement).tagName === "A") return false;
          p = p.parentNode;
        }
        return true;
      };

      const replaceTextNode = (textNode: Text) => {
        const text = textNode.nodeValue || "";
        const parts: Array<string | { href: string; label: string }> = [];

        let idx = 0;
        const pushPlain = (end: number) => {
          if (end > idx) parts.push(text.slice(idx, end));
          idx = end;
        };

        const collectMatches = () => {
          const matches: Array<{
            start: number;
            end: number;
            href: string;
            label: string;
          }> = [];
          const add = (
            start: number,
            end: number,
            href: string,
            label: string
          ) => {
            matches.push({ start, end, href, label });
          };
          let m: RegExpExecArray | null;
          const urlRx = new RegExp(urlRe);
          while ((m = urlRx.exec(text))) {
            const raw = m[0];
            const hasProto = /^https?:\/\//i.test(raw);
            const href = hasProto ? raw : `https://${raw}`;
            add(m.index, m.index + raw.length, href, raw);
          }
          const emailRx = new RegExp(emailRe);
          while ((m = emailRx.exec(text))) {
            const raw = m[0];
            add(m.index, m.index + raw.length, `mailto:${raw}`, raw);
          }
          matches.sort((a, b) => a.start - b.start);
          return matches;
        };

        const matches = collectMatches();
        for (const match of matches) {
          if (match.start < idx) continue;
          pushPlain(match.start);
          parts.push({ href: match.href, label: match.label });
          idx = match.end;
        }
        pushPlain(text.length);

        if (parts.length === 1 && typeof parts[0] === "string") return;

        const frag = document.createDocumentFragment();
        for (const p of parts) {
          if (typeof p === "string") {
            frag.appendChild(document.createTextNode(p));
          } else {
            const a = document.createElement("a");
            a.href = p.href;
            a.textContent = p.label;
            a.target = "_blank";
            a.rel = "noreferrer";
            frag.appendChild(a);
          }
        }
        textNode.parentNode?.replaceChild(frag, textNode);
      };

      const toProcess: Text[] = [];
      let n = walker.nextNode();
      while (n) {
        const isText = n.nodeType === Node.TEXT_NODE;
        if (isText && needsLinkify(n)) toProcess.push(n as Text);
        n = walker.nextNode();
      }
      toProcess.forEach(replaceTextNode);
      return doc.body.innerHTML;
    } catch {
      return html;
    }
  };

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

          <div className="flex items-center gap-2">
            <nav aria-label="Main navigation">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link href="/cvmaker" className="hover:underline">
                    Go to Editor
                  </Link>
                </li>
              </ul>
            </nav>
            {hasData && (
              <Link
                href="/print"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
              >
                Print
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex justify-center bg-gray-50 min-h-dvh">
        {!loaded ? null : !hasData ? (
          <div className="mx-auto my-16 max-w-2xl text-center px-6">
            <h2 className="text-xl font-semibold">No CV yet</h2>
            <p className="text-gray-600 mt-2">No CV data found. Create your CV in the editor.</p>
            <div className="mt-4">
              <Link
                href="/cvmaker"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
              >
                Open Editor
              </Link>
            </div>
          </div>
        ) : (
          <article
            id="cv-preview"
            aria-label="CV Preview"
            className="mx-auto my-8 w-full max-w-[794px] bg-white rounded-2xl border shadow-lg print:shadow-none"
          >
            <header className="cv-header border-b print:border-none">
              <div className="px-8 py-8 text-center">
                <div className="flex items-center justify-center">
                  {data!.header.avatarDataUrl && (
                    <Image
                      alt="Profile photo"
                      src={data!.header.avatarDataUrl}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover border avatar"
                    />
                  )}
                </div>
                {data!.header.name && (
                  <h2 className="mt-4 text-3xl font-bold text-gray-900 name">
                    {data!.header.name}
                  </h2>
                )}
                {data!.header.role && (
                  <p className="text-blue-600 role">{data!.header.role}</p>
                )}

                <address className="not-italic mt-3 text-sm text-gray-600 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                  {data!.header.email && (
                    <a
                      className="text-gray-600 hover:underline"
                      href={`mailto:${data!.header.email}`}
                    >
                      {data!.header.email}
                    </a>
                  )}
                  {data!.header.phone && (
                    <a
                      className="text-gray-600 hover:underline"
                      href={`tel:${data!.header.phone.replace(/[^+\d]/g, "")}`}
                    >
                      {data!.header.phone}
                    </a>
                  )}
                  {data!.header.locationName && data!.header.mapsUrl && (
                    <a
                      className="text-gray-600 hover:underline"
                      href={data!.header.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data!.header.locationName}
                    </a>
                  )}
                </address>

                {data!.headerSocials.length > 0 && (
                  <nav
                    aria-label="Header Socials"
                    className="mt-3 text-sm flex items-center justify-center gap-4 flex-wrap link-row"
                  >
                    {data!.headerSocials.map((s) =>
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

            <div className="px-6 sm:px-10 py-6 space-y-6 cv-content">
              {data!.sections.map((s) => (
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
                    <div
                      dangerouslySetInnerHTML={{
                        __html: linkifyHtml(s.content || ""),
                      }}
                    />
                  </div>
                </section>
              ))}

              <footer className="text-center text-sm text-gray-600 pt-6">
                {data!.footerNote}
                {data!.footerSocials.length > 0 && (
                  <nav
                    aria-label="Footer Socials"
                    className="mt-2 flex items-center justify-center gap-4 flex-wrap"
                  >
                    {data!.footerSocials.map((s) =>
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
        )}
      </main>
    </>
  );
}
