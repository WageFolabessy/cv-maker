import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
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
            fontSize: 56,
            fontWeight: 800,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          GAS Native - CV Maker
        </div>
        <div style={{ fontSize: 26, color: "#374151", textAlign: "center" }}>
          Create your CV with ATS optimization
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
