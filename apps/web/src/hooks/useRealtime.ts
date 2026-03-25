"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { ApplicationWithCandidate } from "@futurecareer/types";

export function useApplicationsRealtime(
  jobId: string,
  initialData: ApplicationWithCandidate[]
): ApplicationWithCandidate[] {
  const [applications, setApplications] = useState(initialData);

  useEffect(() => {
    const supabase = getBrowserClient();

    const channel = supabase
      .channel(`applications:${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
          filter: `job_id=eq.${jobId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            // New application — we only have the raw row, not the full candidate details.
            // The ATS board will show a placeholder until the page refreshes or re-fetches.
            const newRow = payload.new as {
              id: string;
              job_id: string;
              candidate_id: string;
              intro_message: string;
              prescreen_answers: Record<string, string>;
              status: ApplicationWithCandidate["status"];
              resume_url: string;
              applied_at: string;
            };

            setApplications((prev) => {
              // Avoid duplicates
              if (prev.some((a) => a.id === newRow.id)) return prev;

              const newApp: ApplicationWithCandidate = {
                id: newRow.id,
                job_id: newRow.job_id,
                candidate_id: newRow.candidate_id,
                intro_message: newRow.intro_message,
                prescreen_answers: newRow.prescreen_answers ?? {},
                status: newRow.status,
                resume_url: newRow.resume_url,
                applied_at: newRow.applied_at,
                candidate: {
                  id: newRow.candidate_id,
                  first_name: null,
                  last_name: null,
                  avatar_url: null,
                  phone: null,
                  email: "",
                },
              };

              return [newApp, ...prev];
            });
          }

          if (payload.eventType === "UPDATE") {
            const updated = payload.new as { id: string; status: ApplicationWithCandidate["status"] };
            setApplications((prev) =>
              prev.map((app) =>
                app.id === updated.id
                  ? { ...app, status: updated.status }
                  : app
              )
            );
          }

          if (payload.eventType === "DELETE") {
            const deleted = payload.old as { id: string };
            setApplications((prev) =>
              prev.filter((app) => app.id !== deleted.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  return applications;
}
