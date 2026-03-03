import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "6px",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stacked layers */}
          <rect x="3" y="4" width="18" height="4" rx="1" fill="white" />
          <rect x="3" y="10" width="14" height="4" rx="1" fill="white" fillOpacity="0.8" />
          <rect x="3" y="16" width="10" height="4" rx="1" fill="white" fillOpacity="0.6" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
