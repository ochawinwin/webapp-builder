import { Header } from "@futurecareer/ui";
import { createServerClient } from "@/lib/supabase/server";

interface AuthHeaderProps {
  variant?: "default" | "auth" | "dashboard";
}

export async function AuthHeader({ variant = "default" }: AuthHeaderProps) {
  let user: { name: string; role?: string } | undefined;

  try {
    const supabase = await createServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, user_type")
        .eq("id", authUser.id)
        .single();
      user = {
        name: profile?.full_name ?? authUser.email ?? "User",
        role: profile?.user_type ?? undefined,
      };
    }
  } catch {
    // Not logged in — show default header
  }

  return <Header variant={variant} user={user} />;
}
