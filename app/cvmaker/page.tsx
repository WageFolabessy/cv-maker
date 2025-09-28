"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Wysiwyg from "./Wysiwyg";
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
const uid = () => Math.random().toString(36).slice(2, 9);

export default function CVMakerPage() {
  const [data, setData] = useState<CvData>(() => ({
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
  }));

  const [dragOver, setDragOver] = useState(false);
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

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {}
  }, [data, loaded]);

  const addHeaderSocial = () =>
    setData((d) => ({
      ...d,
      headerSocials: [...d.headerSocials, { id: uid(), label: "", url: "" }],
    }));

  const removeHeaderSocial = (id: string) =>
    setData((d) => ({
      ...d,
      headerSocials: d.headerSocials.filter((s) => s.id !== id),
    }));

  const addFooterSocial = () =>
    setData((d) => ({
      ...d,
      footerSocials: [...d.footerSocials, { id: uid(), label: "", url: "" }],
    }));

  const removeFooterSocial = (id: string) =>
    setData((d) => ({
      ...d,
      footerSocials: d.footerSocials.filter((s) => s.id !== id),
    }));

  const addSection = () =>
    setData((d) => ({
      ...d,
      sections: [...d.sections, { id: uid(), title: "", content: "" }],
    }));

  const removeSection = (id: string) =>
    setData((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }));

  const moveSection = (id: string, dir: -1 | 1) =>
    setData((d) => {
      const arr = [...d.sections];
      const idx = arr.findIndex((s) => s.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= arr.length) return d;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return { ...d, sections: arr };
    });

  const readImageFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () =>
      setData((d) => ({
        ...d,
        header: { ...d.header, avatarDataUrl: String(reader.result || "") },
      }));
    reader.readAsDataURL(file);
  };

  const onAvatarUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readImageFile(file);
  };

  const onDropAvatar: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readImageFile(file);
  };

  const onDragOverAvatar: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeaveAvatar: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const mapsValid =
    !data.header.mapsUrl ||
    /https?:\/\/(www\.)?google\.[a-z.]+\/maps/i.test(data.header.mapsUrl) ||
    /https?:\/\/maps\.app\.goo\.gl\//i.test(data.header.mapsUrl);

  const isCvEmpty = (d: CvData) => {
    const h = d.header;
    const isEmptyHeader =
      [
        h.name,
        h.role,
        h.email,
        h.phone,
        h.locationName,
        h.mapsUrl,
        h.avatarDataUrl,
      ].every((x) => !x || String(x).trim() === "");
    const isEmptyBody =
      d.headerSocials.length === 0 &&
      d.sections.length === 0 &&
      (!d.footerNote || d.footerNote.trim() === "") &&
      d.footerSocials.length === 0;
    return isEmptyHeader && isEmptyBody;
  };

  const hasData = loaded && !isCvEmpty(data);

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/gasnative.webp"
              alt="CV Maker Logo"
              width={36}
              height={36}
              className="rounded"
            />
            <Link href="/" className="text-lg font-semibold tracking-tight">
              CV Maker
            </Link>
          </div>

          <nav aria-label="CV Maker navigation" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <a href="#editor-header" className="hover:text-blue-600">
                  Header
                </a>
              </li>
              <li>
                <a href="#editor-sections" className="hover:text-blue-600">
                  Sections
                </a>
              </li>
              <li>
                <a href="#editor-footer" className="hover:text-blue-600">
                  Footer
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              scroll={false}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
            >
              See CV
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Editor */}
          <aside
            className="lg:w-[420px] print:hidden"
            aria-label="CV Editor Panel"
          >
            <section
              id="editor-header"
              aria-labelledby="legend-header"
              className="bg-white rounded-xl border shadow-sm p-4 md:p-5 mb-6"
            >
              <fieldset>
                <legend
                  id="legend-header"
                  className="text-base font-semibold mb-3"
                >
                  Header
                </legend>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      autoComplete="name"
                      value={data.header.name}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          header: { ...d.header, name: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm text-gray-700"
                    >
                      Role
                    </label>
                    <input
                      id="role"
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      autoComplete="organization-title"
                      value={data.header.role}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          header: { ...d.header, role: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      autoComplete="email"
                      value={data.header.email}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          header: { ...d.header, email: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      autoComplete="tel"
                      value={data.header.phone}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          header: { ...d.header, phone: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="loc"
                      className="block text-sm text-gray-700"
                    >
                      Location
                    </label>
                    <input
                      id="loc"
                      className="mt-1 w-full border rounded-lg px-3 py-2"
                      placeholder="City, State/Province, Country"
                      autoComplete="address-level2"
                      value={data.header.locationName}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          header: {
                            ...d.header,
                            locationName: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="maps"
                      className="block text-sm text-gray-700"
                    >
                      Google Maps link
                    </label>
                    <input
                      id="maps"
                      className={`mt-1 w-full border rounded-lg px-3 py-2 ${mapsValid ? "" : "border-red-500"}`}
                      placeholder="https://www.google.com/maps/..."
                      aria-invalid={!mapsValid}
                      autoComplete="url"
                      value={data.header.mapsUrl}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          header: { ...d.header, mapsUrl: e.target.value },
                        }))
                      }
                    />
                    {!mapsValid && (
                      <p className="mt-1 text-xs text-red-600">
                        Enter a valid Google Maps URL.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700">
                      Photo (upload image)
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={onAvatarUpload}
                    />
                    <label
                      htmlFor="avatar-upload"
                      onDrop={onDropAvatar}
                      onDragOver={onDragOverAvatar}
                      onDragLeave={onDragLeaveAvatar}
                      className={`mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-5 text-center transition-colors cursor-pointer select-none ${
                        dragOver
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-10 h-10 text-gray-400"
                        aria-hidden="true"
                      >
                        <path d="M12 5.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0-2a5.5 5.5 0 0 0-5.5 5.5c0 3.038 2.462 5.5 5.5 5.5s5.5-2.462 5.5-5.5A5.5 5.5 0 0 0 12 3.5ZM4 19a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1H4v-1Z" />
                      </svg>
                      <span className="mt-2 text-sm text-gray-700">
                        Click to upload or drag & drop
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG up to a few MB
                      </span>
                    </label>
                    {data.header.avatarDataUrl && (
                      <figure className="mt-3 flex items-center gap-3">
                        {/* Replace <img> with <Image> */}
                        <Image
                          src={data.header.avatarDataUrl}
                          alt="Profile photo"
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover border"
                        />
                        <figcaption>
                          <button
                            type="button"
                            className="text-sm text-red-600 underline"
                            onClick={() =>
                              setData((d) => ({
                                ...d,
                                header: { ...d.header, avatarDataUrl: "" },
                              }))
                            }
                          >
                            Remove photo
                          </button>
                        </figcaption>
                      </figure>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Media Socials</h3>
                      <button
                        type="button"
                        onClick={addHeaderSocial}
                        className="px-2 py-1 rounded bg-[#117de7] text-white text-sm hover:bg-[#117de7]"
                      >
                        + Add
                      </button>
                    </div>
                    <ul className="mt-2 space-y-3">
                      {data.headerSocials.map((s) => (
                        <li
                          key={s.id}
                          className="border rounded-lg p-2 grid grid-cols-1 sm:grid-cols-5 gap-2 bg-white"
                        >
                          <input
                            className="sm:col-span-2 border rounded px-2 py-1"
                            placeholder="Label (e.g., GitHub)"
                            aria-label="Header social label"
                            autoComplete="off"
                            value={s.label}
                            onChange={(e) =>
                              setData((d) => ({
                                ...d,
                                headerSocials: d.headerSocials.map((x) =>
                                  x.id === s.id
                                    ? { ...x, label: e.target.value }
                                    : x
                                ),
                              }))
                            }
                          />
                          <input
                            className="sm:col-span-3 border rounded px-2 py-1"
                            placeholder="https://..."
                            aria-label="Header social URL"
                            autoComplete="off"
                            value={s.url}
                            onChange={(e) =>
                              setData((d) => ({
                                ...d,
                                headerSocials: d.headerSocials.map((x) =>
                                  x.id === s.id
                                    ? { ...x, url: e.target.value }
                                    : x
                                ),
                              }))
                            }
                          />
                          <div className="sm:col-span-5 text-right">
                            <button
                              type="button"
                              className="text-sm text-red-600 underline"
                              onClick={() => removeHeaderSocial(s.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </fieldset>
            </section>

            <section
              id="editor-sections"
              aria-labelledby="legend-sections"
              className="bg-white rounded-xl border shadow-sm p-4 md:p-5 mb-6"
            >
              <fieldset>
                <legend
                  id="legend-sections"
                  className="text-base font-semibold mb-3"
                >
                  Sections
                </legend>

                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">
                    Add sections such as About Me, etc.
                  </p>
                  <button
                    type="button"
                    onClick={addSection}
                    className="px-2 py-1 rounded bg-[#117de7] text-white text-sm hover:bg-[#117de7]"
                  >
                    + Add
                  </button>
                </div>

                <ul className="space-y-6">
                  {data.sections.map((s) => (
                    <li key={s.id} className="border rounded-xl p-3 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor={`title-${s.id}`} className="sr-only">
                          Section title
                        </label>
                        <input
                          id={`title-${s.id}`}
                          className="w-full border rounded px-3 py-2"
                          placeholder="Section title (e.g., About Me)"
                          autoComplete="off"
                          value={s.title}
                          onChange={(e) =>
                            setData((d) => ({
                              ...d,
                              sections: d.sections.map((x) =>
                                x.id === s.id
                                  ? { ...x, title: e.target.value }
                                  : x
                              ),
                            }))
                          }
                        />
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="px-2 py-1 rounded border bg-white hover:bg-gray-50"
                            onClick={() => moveSection(s.id, -1)}
                            title="Move up"
                            aria-label="Move section up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 rounded border bg-white hover:bg-gray-50"
                            onClick={() => moveSection(s.id, 1)}
                            title="Move down"
                            aria-label="Move section down"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            className="px-2 py-1 rounded border text-red-600 hover:bg-red-50"
                            onClick={() => removeSection(s.id)}
                            title="Delete"
                            aria-label="Delete section"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <Wysiwyg
                        value={s.content}
                        onChange={(html) =>
                          setData((d) => ({
                            ...d,
                            sections: d.sections.map((x) =>
                              x.id === s.id ? { ...x, content: html } : x
                            ),
                          }))
                        }
                        placeholder="Write the section content here..."
                      />
                    </li>
                  ))}
                </ul>
              </fieldset>
            </section>

            <section
              id="editor-footer"
              aria-labelledby="legend-footer"
              className="bg-white rounded-xl border shadow-sm p-4 md:p-5"
            >
              <fieldset>
                <legend
                  id="legend-footer"
                  className="text-base font-semibold mb-3"
                >
                  Footer
                </legend>

                <div className="mb-4">
                  <label
                    htmlFor="footnote"
                    className="block text-sm text-gray-700"
                  >
                    Footer Note
                  </label>
                  <input
                    id="footnote"
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                    placeholder="© Year Name. All rights reserved."
                    autoComplete="off"
                    value={data.footerNote}
                    onChange={(e) =>
                      setData((d) => ({ ...d, footerNote: e.target.value }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Media Socials</h3>
                  <button
                    type="button"
                    onClick={addFooterSocial}
                    className="px-2 py-1 rounded bg-[#117de7] text-white text-sm hover:bg-[#117de7]"
                  >
                    + Add
                  </button>
                </div>

                <ul className="space-y-3">
                  {data.footerSocials.map((s) => (
                    <li
                      key={s.id}
                      className="border rounded-lg p-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
                    >
                      <input
                        className="sm:col-span-2 border rounded px-2 py-1"
                        placeholder="Label"
                        aria-label="Footer social label"
                        autoComplete="off"
                        value={s.label}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            footerSocials: d.footerSocials.map((x) =>
                              x.id === s.id
                                ? { ...x, label: e.target.value }
                                : x
                            ),
                          }))
                        }
                      />
                      <input
                        className="sm:col-span-3 border rounded px-2 py-1"
                        placeholder="https://..."
                        aria-label="Footer social URL"
                        autoComplete="off"
                        value={s.url}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            footerSocials: d.footerSocials.map((x) =>
                              x.id === s.id ? { ...x, url: e.target.value } : x
                            ),
                          }))
                        }
                      />
                      <div className="sm:col-span-5 text-right">
                        <button
                          type="button"
                          className="text-sm text-red-600 underline"
                          onClick={() => removeFooterSocial(s.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </fieldset>
            </section>
          </aside>

          {/* CV Preview */}
          <section className="flex-1">
            {hasData && (
              <article
                aria-label="CV Preview"
                id="cv-preview"
                className="mx-auto w-full max-w-[794px] bg-white rounded-2xl border shadow-lg print:shadow-none"
              >
              <header className="border-b">
                <div className="px-8 py-8 text-center">
                  <div className="flex items-center justify-center">
                    {data.header.avatarDataUrl && (
                      <Image
                        alt="Profile photo"
                        src={data.header.avatarDataUrl}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-cover border"
                      />
                    )}
                  </div>
                  {data.header.name && (
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                      {data.header.name}
                    </h1>
                  )}
                  {data.header.role && (
                    <p className="text-blue-600">{data.header.role}</p>
                  )}

                  <address className="not-italic mt-3 text-sm text-gray-600 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    {data.header.email && (
                      <a
                        className="text-gray-600 hover:underline"
                        href={`mailto:${data.header.email}`}
                      >
                        {data.header.email}
                      </a>
                    )}
                    {data.header.phone && (
                      <a
                        className="text-gray-600 hover:underline"
                        href={`tel:${data.header.phone.replace(/[^+\d]/g, "")}`}
                      >
                        {data.header.phone}
                      </a>
                    )}
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
                      <h2
                        id={`h-${s.id}`}
                        className="font-semibold text-gray-800"
                      >
                        {s.title || "Untitled"}
                      </h2>
                    </header>
                    <div className="px-5 py-4 text-gray-800 text-sm leading-7">
                      <div
                        dangerouslySetInnerHTML={{ __html: s.content || "" }}
                      />
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
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
