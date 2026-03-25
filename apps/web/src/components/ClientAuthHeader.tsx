"use client";

import { useState, useEffect } from "react";
import { Header } from "@futurecareer/ui";
import { createBrowserClient } from "@/lib/supabase/browser";

export function ClientAuthHeader() {
  const [user, setUser] = useState<{ name: string; role?: string } | undefined>(undefined);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createBrowserClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, user_type")
          .eq("id", authUser.id)
          .single();
        setUser({
          name: profile?.full_name ?? authUser.email ?? "User",
          role: profile?.user_type ?? undefined,
        });
      }
    }
    fetchUser();
  }, []);

  return <Header user={user} />;
}
