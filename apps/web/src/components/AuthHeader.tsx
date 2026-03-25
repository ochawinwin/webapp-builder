import { Header } from "@futurecareer/ui";
import { getAuthUser } from "@/lib/data/auth";
import { logoutAction } from "@/app/actions/auth.actions";

export async function AuthHeader() {
  const auth = await getAuthUser();
  const user = auth
    ? {
        name:
          `${auth.profile.first_name ?? ""} ${auth.profile.last_name ?? ""}`.trim() ||
          auth.user.email,
        role: auth.profile.user_type === "company" ? "company" : "seeker",
      }
    : undefined;

  return <Header user={user} onLogout={logoutAction} />;
}
