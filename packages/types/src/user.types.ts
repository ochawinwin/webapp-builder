export type UserType = "seeker" | "company";

export interface Profile {
  id: string;
  user_type: UserType;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  phone: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  created_at: string;
}

export interface UserWithProfile {
  id: string;
  email: string;
  profile: Profile;
}
