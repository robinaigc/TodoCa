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

create policy "anyone_can_insert_leads"
  on public.service_leads
  for insert
  to anon, authenticated
  with check (true);

-- 故意不创建 SELECT / UPDATE / DELETE 策略：前端无法读取线索数据。
