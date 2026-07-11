import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import SupportEmailLink from "@/components/SupportEmailLink";

export const metadata: Metadata = {
  title: "支持与联系",
  description: "TodoCa（我要移民啦）帮助、常见问题、问题反馈与数据删除申请方式。",
};

export default function SupportPage() {
  return (
    <LegalPage title="Support 支持" updatedAt="2026 年 7 月 10 日">
      <section className="card-soft p-5">
        <p className="font-semibold text-text-primary">TodoCa / 我要移民啦</p>
        <p className="mt-2">如果你在使用任务清单、英文脚本、资源导航或协助表单时遇到问题，请联系我们。公开联系邮箱：</p>
        <p className="mt-2 break-all"><SupportEmailLink className="font-semibold text-brand" /></p>
      </section>
      <section>
        <h2 className="font-semibold text-text-primary">常见问题</h2>
        <div className="mt-2 space-y-4">
          <div>
            <h3 className="font-medium text-text-primary">为什么换设备后看不到进度？</h3>
            <p>TodoCa V1 把画像和任务进度保存在当前浏览器 localStorage，不提供账户或云同步。换设备或清除浏览器数据后无法自动恢复。</p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary">协助表单提交后多久回复？</h3>
            <p>我们会按实际处理能力回复，但不承诺固定时效。若页面显示“仅保存在此设备”，表示请求尚未发送，请改用公开邮箱联系。</p>
          </div>
          <div>
            <h3 className="font-medium text-text-primary">TodoCa 能判断我是否符合移民资格吗？</h3>
            <p>不能。TodoCa 是任务与信息整理工具，不提供法律意见或持牌移民顾问服务。请通过加拿大政府官方来源或合资格专业人士核实。</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="font-semibold text-text-primary">数据删除申请</h2>
        <p className="mt-2">本地画像和任务进度可在“我的”页面点击“清除所有数据”。如需删除已提交到 service_leads 的协助线索，请发送邮件至 <SupportEmailLink className="font-semibold text-brand" />，并提供提交时使用的姓名、邮箱和约提交日期，以便核对。</p>
      </section>
      <section>
        <h2 className="font-semibold text-text-primary">问题反馈请提供</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>使用的设备、操作系统和浏览器版本</li>
          <li>出现问题的页面地址与操作步骤</li>
          <li>实际看到的结果和你预期的结果</li>
          <li>可选的截图（请遮盖姓名、邮箱、申请号等敏感信息）</li>
        </ul>
      </section>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/" className="btn-secondary py-3 text-center">返回首页</Link>
        <Link href="/profile" className="btn-secondary py-3 text-center">前往我的页面</Link>
      </div>
    </LegalPage>
  );
}
