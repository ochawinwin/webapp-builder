export type TagCategory = "skill" | "industry" | "level" | "location" | "type";

export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
  createdAt: string;
}
