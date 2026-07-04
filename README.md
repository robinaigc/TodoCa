# 我要移民啦（TodoCa）

> 加拿大登陆前后 6 个月中文任务清单 · 温哥华版 MVP

面向留学生、工签人士、新 PR 的登陆任务管理 PWA。用户选择身份、登陆日期和家庭情况，系统自动生成五个阶段（登陆前 → 第一周 → 第一个月 → 1–3 个月 → 4–6 个月）的个性化 Todo List，每个任务附带材料清单、操作步骤、完成标准、常见错误、英文脚本和中文人工协助入口。

需求文档见 [`docs/PRD-v2.md`](docs/PRD-v2.md)。

## 技术栈

- **Next.js 16**（App Router + Turbopack）+ React 19 + TypeScript
- **Tailwind CSS v4**
- **内容数据**：代码内 TypeScript 数据文件（`/data`），无 CMS
- **用户数据**：浏览器 localStorage，免注册
- **线索数据**：Supabase Postgres（仅 `service_leads` 一张表）
- **PWA**：Next.js manifest，可添加到主屏幕
- **部署**：Vercel

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000。未配置 Supabase 时应用照常运行（人工协助表单降级为本地保存）。

## Supabase 配置

只需要一张表。步骤：

1. 在 [supabase.com](https://supabase.com/) 创建项目（免费版即可）。
2. 在 SQL Editor 中执行 [`supabase/schema.sql`](supabase/schema.sql)（建表 + RLS）。
3. 复制 `.env.example` 为 `.env.local`，填入项目的 URL 和 publishable key（Project Settings → API）：

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxx
```

RLS 设计：匿名用户只能 INSERT 线索，不能读取/修改/删除。运营者在 Supabase Dashboard → Table Editor 中查看 `service_leads`。

## 部署到 Vercel

1. 把仓库推到 GitHub。
2. 在 [vercel.com](https://vercel.com/) Import 该仓库（框架自动识别为 Next.js）。
3. 在 Environment Variables 中添加 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
4. Deploy。之后每次 `git push` 自动部署。

## 项目结构

```
app/
  page.tsx                落地页
  onboarding/             用户信息收集（4 步问卷，免注册）
  manifest.ts             PWA manifest
  (main)/                 带底部导航的主界面
    dashboard/            今日任务首页
    tasks/  tasks/[id]/   任务列表与详情
    scripts/ scripts/[id]/ 英文脚本库
    map/  resources/[id]/  温哥华资源列表与详情
    help/                 人工协助表单
    profile/              我的
components/               TaskCard、BottomNav、HelpForm、Badges 等
data/
  stages.ts               5 个阶段定义
  tasks.ts                50 张任务卡（种子内容）
  scripts.ts              30 条英文脚本
  resources.ts            35 个温哥华资源点
lib/
  stage.ts                阶段计算（登陆日期 → 当前阶段）
  taskEngine.ts           任务过滤、排序、今日聚焦、进度统计
  store.ts                localStorage 状态管理
  supabase.ts             Supabase 客户端（仅用于线索提交）
types/                    全部 TypeScript 类型
supabase/schema.sql       数据库 schema + RLS
docs/PRD-v2.md            需求文档（修订版）
```

## 内容维护

任务卡、脚本、资源点都是 `/data` 目录下的类型化 TS 文件。修改内容 = 编辑文件 + git push，Vercel 约 1 分钟自动上线。新增任务卡时注意：

- `identities` 控制适用身份；`conditions` 控制家庭情况过滤（带孩子/无住房/有车）。
- P0 任务必须填全：whyItMatters、requiredDocs、steps、completionStandard、commonMistakes、officialSources、englishScript。

## MVP 功能清单

- ✅ 免注册 onboarding（4 步，约 30 秒）
- ✅ 按身份 + 家庭情况 + 登陆日期生成个性化任务清单
- ✅ 今日聚焦（当前阶段未完成任务按 P0/建议日期排序取前 5）
- ✅ 之前阶段 P0 未完成任务补漏提醒
- ✅ 任务完成/跳过/撤销，阶段进度统计
- ✅ 任务详情：材料、步骤、完成标准、常见错误、英文脚本、官方来源
- ✅ 30 条英文脚本（口语版/完整版/邮件版/对方回答/听不懂怎么说），一键复制
- ✅ 35 个温哥华资源点，分类筛选 + Google Maps 外链
- ✅ 人工协助表单 → Supabase service_leads
- ✅ PWA 可安装到主屏幕，移动端优先 UI，深色模式

## 已知限制

- 用户数据在 localStorage：换设备/清缓存会丢进度（V1.1 注册 + 云同步解决）
- 无离线缓存（Service Worker 留 V1.1）
- 无任务提醒（V1.1 邮件提醒）
- 资源点信息可能过期，页面已加"以官网为准"提示
- 仅温哥华/BC 省；多城市 V1.2

## 下一步（V1.1 规划）

注册登录 + 云同步、邮件任务提醒、Service Worker 离线缓存、AI 问答、截图解释入口。详见 `docs/PRD-v2.md` §13。
