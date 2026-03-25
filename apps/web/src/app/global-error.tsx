"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[Global error boundary]", error);
    }
  }, [error]);

  return (
    <html lang="th">
      <body
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          background: "#0f172a",
          color: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          padding: "1rem",
        }}
      >
        {/* Brand mark using inline styles — no Tailwind available at global error level */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(99,102,241,0.4)",
          }}
        >
          <span style={{ color: "white", fontSize: 28, fontWeight: 700 }}>F</span>
        </div>

        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            ระบบเกิดข้อผิดพลาดร้ายแรง
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.6 }}>
            {error.message ||
              "เกิดข้อผิดพลาดที่ไม่คาดคิดกับระบบ กรุณาลองโหลดหน้าใหม่อีกครั้ง หากยังพบปัญหา กรุณาติดต่อทีมสนับสนุน"}
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <button
          onClick={reset}
          style={{
            padding: "12px 32px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "white",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
          }}
        >
          โหลดหน้าใหม่
        </button>
      </body>
    </html>
  );
}
