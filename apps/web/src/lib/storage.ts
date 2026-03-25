import { createServerClient } from "@/lib/supabase/server";

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ publicUrl: string } | { error: string }> {
  const supabase = await createServerClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { publicUrl: data.publicUrl };
}

export async function getPublicUrl(bucket: string, path: string): Promise<string> {
  const supabase = await createServerClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<{ signedUrl: string } | { error: string }> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) return { error: error.message };
  return { signedUrl: data.signedUrl };
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
