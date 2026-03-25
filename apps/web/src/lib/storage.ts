import { createServerClient } from "@/lib/supabase/server";

// Bucket names
export const BUCKETS = {
  AVATARS: "avatars",
  LOGOS: "company-logos",
  POSTS: "company-posts",
  RESUMES: "resumes",
} as const;

export async function uploadFile(
  bucket: string,
  path: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const supabase = await createServerClient();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // For public buckets, return public URL; for private, return the path
  const publicBuckets: string[] = [
    BUCKETS.AVATARS,
    BUCKETS.LOGOS,
    BUCKETS.POSTS,
  ];

  if (publicBuckets.includes(bucket)) {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl;
  }

  // For private buckets (resumes), return the path for signed URL generation later
  return path;
}

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data) {
    throw new Error(`Failed to create signed URL: ${error?.message}`);
  }

  return data.signedUrl;
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<void> {
  const supabase = await createServerClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Storage delete failed: ${error.message}`);
  }
}
