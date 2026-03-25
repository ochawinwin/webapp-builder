import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FutureCareer — หางานที่ใช่ สมัครงานง่าย";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background accent circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 40, color: "white", fontWeight: 700 }}>F</span>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          FutureCareer
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "rgba(196,181,253,1)",
            marginBottom: 48,
          }}
        >
          หางานที่ใช่ สมัครงานง่าย ด้วย AI Tags
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["Smart Matching", "Real-time Status", "Kanban ATS"].map((label) => (
            <div
              key={label}
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(99,102,241,0.4)",
                color: "rgba(196,181,253,1)",
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "rgba(148,163,184,1)",
          }}
        >
          futurecareer.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
