import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import SupportEmailLink from "@/components/SupportEmailLink";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "TodoCa（我要移民啦）隐私政策与数据处理说明。",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy 隐私政策" updatedAt="2026 年 8 月 12 日">
      <section>
        <h2 className="font-semibold text-text-primary">1. TodoCa 保存哪些数据</h2>
        <p className="mt-2">
          你的用户画像（例如身份、登陆日期和家庭情况），以及任务的完成、跳过和进度数据，保存在当前设备。iOS App 使用 Capacitor Preferences（Apple UserDefaults）；网页和 PWA 使用浏览器 localStorage 作为回退。这些本地数据不会因为你使用任务功能而自动上传到 TodoCa 的服务器。
        </p>
        <p className="mt-2">
          本地数据只属于当前安装或浏览器。卸载 App、更换设备、使用其他浏览器、无痕模式结束，或清除应用/浏览器数据，都可能导致本地画像和进度永久丢失。TodoCa V1 不提供账户或云同步恢复。
        </p>
        <p className="mt-2">
          为兼容从 1.0 升级并提供回退，本版本也会在 App 的本地 Web 存储中保留画像和进度兼容副本。该副本同样只留在当前设备，不会自动上传。
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-text-primary">2. 协助表单与联系方式</h2>
        <p className="mt-2">
          当你主动使用 /help 协助或内容纠错表单时，表单可能收集姓名或昵称、邮箱、微信号或其他你在问题描述中提供的联系方式，以及问题类别、描述和关联的任务或资源编号。
        </p>
        <p className="mt-2">
          Supabase 配置正常时，协助线索可能保存到 Supabase 的 service_leads 表。数据用途仅限联系你并回应本次协助请求，不用于广告投放或与本次请求无关的营销。
        </p>
        <p className="mt-2">
          如果服务端未配置或提交失败，页面可能把线索暂存在当前浏览器的 localStorage（键名 todoca_leads_local），并会明确提示“尚未发送”。本机暂存不会自动让 TodoCa 收到你的请求，你需要通过公开邮箱另行联系。
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-text-primary">3. 未使用的追踪与第三方 SDK</h2>
        <p className="mt-2">
          TodoCa V1 未使用广告 SDK、Firebase、Analytics 或 Sentry。Google Maps 仅通过外部链接在浏览器中打开，TodoCa 不集成 Google Maps 地图 SDK。打开外部链接后，第三方网站会按其自身隐私政策处理数据。
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-text-primary">4. 查询、更正与删除协助线索</h2>
        <p className="mt-2">
          如需查询、更正或申请删除你已提交到 service_leads 的协助线索，请发送邮件至 <SupportEmailLink className="font-semibold text-brand" />。请提供提交时使用的姓名、邮箱、约提交日期及请求事项，以便核对记录。请勿在邮件中发送身份证件、移民申请号或其他非必要敏感资料。
        </p>
        <p className="mt-2">
          设备本地的用户画像和任务进度可在“我的”页面使用“清除所有数据”删除；卸载 App 也会清除原生 Preferences。浏览器设置可以清除 TodoCa 的站点数据。本机暂存的协助线索需要通过浏览器站点数据设置清除。
        </p>
      </section>
    </LegalPage>
  );
}
