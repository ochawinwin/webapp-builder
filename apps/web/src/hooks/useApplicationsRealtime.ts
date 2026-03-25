"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import type { ApplicationWithCandidate } from "@futurecareer/types";

export function useApplicationsRealtime(
  jobId: string,
  initialApplications: ApplicationWithCandidate[]
): [
  ApplicationWithCandidate[],
  React.Dispatch<React.SetStateAction<ApplicationWithCandidate[]>>,
] {
  const [applications, setApplications] = useState<ApplicationWithCandidate[]>(
    initialApplications
  );

  useEffect(() => {
    const supabase = getBrowserClient();

    const channel = supabase
      .channel(`applications:job:${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "applications",
          filter: `job_id=eq.${jobId}`,
        },
        (payload: { new: { id: string; status: ApplicationWithCandidate["status"] } }) => {
          setApplications((prev) =>
            prev.map((app) =>
              app.id === payload.new.id
                ? { ...app, status: payload.new.status }
                : app
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  // Sync when initialApplications changes (e.g. page re-fetch)
  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  return [applications, setApplications];
}
