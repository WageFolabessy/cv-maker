import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OGImage() {
  const logo = "https://cvmaker.efolabessy.app/images/gasnative.webp";
  const title = "CV Maker";
  const subtitle = "Create your CV with ATS optimization";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          color: "#111827",
          padding: 48,
        }}
      >
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 9999,
            overflow: "hidden",
            marginBottom: 24,
            border: "2px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f9fafb",
          }}
        >
          <img src={logo} width={96} height={96} alt="Logo" />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#374151",
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
        <div style={{ height: 24 }} />
        <div
          style={{
            fontSize: 24,
            color: "#1f2937",
            borderTop: "1px solid #e5e7eb",
            paddingTop: 12,
          }}
        >
          cvmaker.efolabessy.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
