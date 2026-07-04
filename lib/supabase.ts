import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * MVP 阶段 Supabase 仅用于 service_leads（人工协助线索）。
 * 未配置环境变量时返回 null，表单会降级为本地保存，开发时不阻塞。
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
