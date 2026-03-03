import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#6366f1", // primary color (indigo)
          borderRadius: "32px",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stacked layers */}
          <rect x="4" y="6" width="24" height="5" rx="1.5" fill="white" />
          <rect x="4" y="13" width="18" height="5" rx="1.5" fill="white" fillOpacity="0.8" />
          <rect x="4" y="20" width="12" height="5" rx="1.5" fill="white" fillOpacity="0.6" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
