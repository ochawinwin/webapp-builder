export interface Resume {
  id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  isPrimary: boolean;
  createdAt: string;
}
