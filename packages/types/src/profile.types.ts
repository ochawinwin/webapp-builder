import type { UserType } from "./auth.types";
import type { Tag } from "./tag.types";

export interface Profile {
  id: string;
  userType: UserType;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  phone: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfilePreferences {
  tagIds: string[];
}

export interface ProfileWithTags extends Profile {
  tags: Tag[];
}
