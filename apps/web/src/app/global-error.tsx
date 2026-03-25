"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="th">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <div>
            <p style={{ fontSize: "3.75rem", fontWeight: 700, color: "#2563eb", margin: 0 }}>500</p>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginTop: "0.5rem" }}>เกิดข้อผิดพลาดร้ายแรง</h2>
            <p style={{ color: "#6b7280", marginTop: "0.25rem" }}>ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง</p>
          </div>
          <button
            onClick={reset}
            style={{
              borderRadius: "0.75rem",
              backgroundColor: "#2563eb",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            ลองใหม่
          </button>
        </div>
      </body>
    </html>
  );
}
