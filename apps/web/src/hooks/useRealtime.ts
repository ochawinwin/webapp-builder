"use client";

import { useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@futurecareer/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface UseRealtimeOptions<T> {
  table: string;
  event?: RealtimeEvent;
  filter?: string;
  callback: (payload: { eventType: RealtimeEvent; new: T; old: Partial<T> }) => void;
}

export function useRealtime<T>({
  table,
  event = "*",
  filter,
  callback,
}: UseRealtimeOptions<T>): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const supabase = createBrowserClient<Database>(
      process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
      process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channelConfig: any = {
      event,
      schema: "public",
      table,
    };
    if (filter) channelConfig = { ...channelConfig, filter };

    const channel: RealtimeChannel = supabase
      .channel(`realtime:${table}`)
      .on(
        "postgres_changes",
        channelConfig,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          callbackRef.current({
            eventType: payload.eventType as RealtimeEvent,
            new: payload.new as T,
            old: payload.old as Partial<T>,
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [table, event, filter]);
}
