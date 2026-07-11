-- =====================================================================
-- 《我要移民啦》TodoCa — Supabase 数据库 schema（V2 文档 §6.3）
-- MVP 阶段唯一的数据库表：service_leads（人工协助线索）
-- 内容数据（任务/脚本/资源）在代码仓库 /data 目录，用户数据在 localStorage
-- =====================================================================

create table public.service_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  wechat text,
  identity_type text,                     -- student / work_permit / new_pr
  city text default 'Vancouver',
  category text not null,                 -- housing / health / bill / school / bank / phone / sin / kids_school / english_mail / other
  urgency text not null default 'normal', -- normal / urgent
  willing_to_pay boolean not null default false,
  description text not null,
  related_task_id text,                   -- 关联的任务卡 id（如从任务详情页进入）
  status text not null default 'new' check (status in ('new','contacted','scheduled','closed')),
  created_at timestamptz not null default now()
);

-- RLS：匿名用户只能提交（INSERT），不能读取/修改/删除。
-- 运营者通过 Supabase Dashboard 的 Table Editor 查看和管理线索。
alter table public.service_leads enable row level security;

-- Data API 最小权限：前端匿名角色只能写入表单允许的字段。
-- authenticated 当前未被产品使用，因此不授予任何表权限。
revoke all on table public.service_leads from anon, authenticated;

grant insert (
  name,
  email,
  wechat,
  identity_type,
  city,
  category,
  urgency,
  willing_to_pay,
  description,
  related_task_id,
  status
) on table public.service_leads to anon;

create policy "anyone_can_insert_leads"
  on public.service_leads
  for insert
  to anon
  with check (
    char_length(btrim(name)) between 1 and 100
    and char_length(btrim(email)) between 3 and 320
    and position('@' in email) > 1
    and (wechat is null or char_length(wechat) <= 100)
    and (identity_type is null or identity_type in ('student', 'work_permit', 'new_pr'))
    and city = 'Vancouver'
    and category in (
      'housing', 'health', 'bill', 'school', 'bank', 'phone',
      'sin', 'kids_school', 'english_mail', 'other'
    )
    and urgency in ('normal', 'urgent')
    and char_length(btrim(description)) between 1 and 5000
    and (related_task_id is null or char_length(related_task_id) <= 100)
    and status = 'new'
  );

-- 故意不创建 SELECT / UPDATE / DELETE 策略：前端无法读取线索数据。
