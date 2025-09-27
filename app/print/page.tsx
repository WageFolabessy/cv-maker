"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

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

export default function PrintPage() {
  const [data, setData] = useState<CvData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setData(JSON.parse(raw));
      setTimeout(() => window.print(), 100);
    } catch {
      setTimeout(() => window.print(), 200);
    }
  }, []);

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
          let m: RegExpExecArray | null;
          const urlRx = new RegExp(urlRe);
          while ((m = urlRx.exec(text))) {
            const raw = m[0];
            const hasProto = /^https?:\/\//i.test(raw);
            const href = hasProto ? raw : `https://${raw}`;
            matches.push({
              start: m.index,
              end: m.index + raw.length,
              href,
              label: raw,
            });
          }
          const emailRx = new RegExp(emailRe);
          while ((m = emailRx.exec(text))) {
            const raw = m[0];
            matches.push({
              start: m.index,
              end: m.index + raw.length,
              href: `mailto:${raw}`,
              label: raw,
            });
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
          if (typeof p === "string")
            frag.appendChild(document.createTextNode(p));
          else {
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
        if (n.nodeType === Node.TEXT_NODE && needsLinkify(n))
          toProcess.push(n as Text);
        n = walker.nextNode();
      }
      toProcess.forEach(replaceTextNode);
      return doc.body.innerHTML;
    } catch {
      return html;
    }
  };

  const d = data || {
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
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-[186mm] px-0 py-0">
        <article id="cv-preview" className="mx-auto">
          <header className="text-center mb-6" style={{ breakInside: "avoid" }}>
            <div className="flex items-center justify-center">
              {d.header.avatarDataUrl ? (
                <Image
                  alt="Profile photo"
                  src={d.header.avatarDataUrl}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 border flex items-center justify-center text-2xl text-gray-500">
                  ?
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold mt-2">
              {d.header.name || "Name"}
            </h1>
            <p className="text-[12.5px] text-gray-700">{d.header.role || ""}</p>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 justify-center text-[12.5px] text-gray-700">
              {d.header.email && (
                <a href={`mailto:${d.header.email}`} className="underline">
                  {d.header.email}
                </a>
              )}
              {d.header.email && (d.header.phone || d.header.locationName) && (
                <span className="text-gray-400">|</span>
              )}
              {d.header.phone && (
                <a
                  href={`tel:${d.header.phone.replace(/[^+\d]/g, "")}`}
                  className="underline"
                >
                  {d.header.phone}
                </a>
              )}
              {d.header.phone && d.header.locationName && (
                <span className="text-gray-400">|</span>
              )}
              {d.header.locationName && d.header.mapsUrl && (
                <a
                  href={d.header.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {d.header.locationName}
                </a>
              )}
            </div>

            {d.headerSocials.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 justify-center text-[12.5px] text-gray-700">
                {d.headerSocials.map((s, i) =>
                  s.url ? (
                    <React.Fragment key={s.id}>
                      {i > 0 && <span className="text-gray-400">|</span>}
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {s.label || s.url}
                      </a>
                    </React.Fragment>
                  ) : null
                )}
              </div>
            )}
          </header>

          <div className="cv-content text-[13px] leading-snug">
            {d.sections.map((s) => (
              <section
                key={s.id}
                className="mb-4"
                style={{ breakInside: "avoid" }}
              >
                <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
                  {s.title || "Untitled"}
                </h2>
                <div className="text-gray-800">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: linkifyHtml(s.content || ""),
                    }}
                  />
                </div>
              </section>
            ))}

            <footer
              className="text-center text-[12.5px] text-gray-700 pt-2"
              style={{ breakInside: "avoid" }}
            >
              {d.footerNote}
              {d.footerSocials.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 justify-center">
                  {d.footerSocials.map((s, i) =>
                    s.url ? (
                      <React.Fragment key={s.id}>
                        {i > 0 && <span className="text-gray-400">|</span>}
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {s.label || s.url}
                        </a>
                      </React.Fragment>
                    ) : null
                  )}
                </div>
              )}
            </footer>
          </div>
        </article>
      </main>
    </div>
  );
}
