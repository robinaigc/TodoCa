import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "使用条款",
  description: "TodoCa（我要移民啦）使用条款与重要免责声明。",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms 使用条款" updatedAt="2026 年 7 月 10 日">
      <section>
        <h2 className="font-semibold text-text-primary">1. 产品定位</h2>
        <p className="mt-2">TodoCa（我要移民啦）是移民准备任务管理、信息整理和生活资源导航工具，帮助用户组织登陆前后的待办事项、一般信息、英文办事脚本和外部资源。</p>
      </section>
      <section>
        <h2 className="font-semibold text-text-primary">2. 非专业及非官方服务</h2>
        <p className="mt-2">TodoCa 不提供法律意见，不提供持牌移民顾问服务，也不替代律师、持牌移民顾问或其他合资格专业人士。TodoCa 不代表加拿大政府、任何省市政府或其他官方机构，也不构成任何官方推荐或指定服务。</p>
      </section>
      <section>
        <h2 className="font-semibold text-text-primary">3. 申请结果与信息变化</h2>
        <p className="mt-2">TodoCa 不保证签证、工作许可、学习许可、永久居民或其他申请的资格、审批时间或结果。移民政策、办理要求、地址、联系电话、开放时间和其他资源信息都可能发生变化。</p>
        <p className="mt-2">在作出重要决定、提交申请或前往办理前，用户应通过加拿大政府及相关机构的官方网站、正式通知或合资格专业人士核实最新信息。</p>
      </section>
      <section>
        <h2 className="font-semibold text-text-primary">4. 第三方服务和外部链接</h2>
        <p className="mt-2">TodoCa 可能提供政府网站、地图、机构、商家或其他第三方服务的外部链接。第三方内容、可用性、收费、隐私与服务质量不受 TodoCa 控制；用户应自行判断并对使用第三方服务和外部链接负责。</p>
      </section>
    </LegalPage>
  );
}
