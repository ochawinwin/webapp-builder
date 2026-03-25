export interface CompanyFeedPost {
  id: string;
  companyId: string;
  authorId: string;
  title: string;
  content: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
