import { useState } from "react";
import { Check, X, ShieldCheck, Zap, Clock, FolderKanban, BarChart3, ChevronDown } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import { plans, compareFeatures, upgradeFaqs } from "../data/mockData";

const WHY_UPGRADE = [
  { icon: Zap, title: "Study Smarter", desc: "Get AI-powered insights and analytics to improve faster." },
  { icon: Clock, title: "Save Time", desc: "Automate tracking, reminders and progress monitoring." },
  { icon: FolderKanban, title: "Stay Organized", desc: "Manage all your exams, notes and goals in one place." },
  { icon: BarChart3, title: "Better Performance", desc: "Identify strengths and weaknesses with advanced reports." },
];

export default function UpgradePlan() {
  const [billing, setBilling] = useState("Monthly");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <AppLayout showSearch={false} showAddExam={false}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Upgrade Your Plan</h2>
          <p className="text-sm text-gray-500">Choose the plan that best fits your exam preparation journey.</p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          {["Monthly", "Yearly"].map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${billing === b ? "bg-primary-600 text-white" : "text-gray-600"}`}
            >
              {b} {b === "Yearly" && <span className="text-[10px] text-emerald-300">Save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`p-5 relative ${plan.badge ? "border-primary-500 ring-1 ring-primary-200" : ""}`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <p className="font-semibold text-gray-800">{plan.name}</p>
            <p className="text-xs text-gray-400 mb-3">{plan.tagline}</p>
            <p className="text-2xl font-bold text-gray-900">
              {plan.price}
              <span className="text-sm font-normal text-gray-400"> / month</span>
            </p>
            <p className="text-xs text-gray-400 mb-4">{plan.price === "₹0" ? "Always free" : "Billed monthly"}</p>
            <button
              className={`w-full rounded-lg py-2.5 text-sm font-semibold mb-4 ${
                plan.price === "₹0"
                  ? "border border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
            >
              {plan.price === "₹0" ? "Current Plan" : `Upgrade to ${plan.name}`}
            </button>
            <div className="space-y-2">
              {plan.features.map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-sm">
                  {f.included ? (
                    <Check size={15} className="text-emerald-500 shrink-0" />
                  ) : (
                    <X size={15} className="text-red-300 shrink-0" />
                  )}
                  <span className={f.included ? "text-gray-700" : "text-gray-400"}>{f.label}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 flex items-center gap-3 bg-emerald-50/60 border-emerald-100">
        <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-800">7-Day Money-Back Guarantee</p>
          <p className="text-xs text-gray-500">Not satisfied? Get a full refund within 7 days of your purchase.</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-4 lg:col-span-2 overflow-x-auto">
          <p className="text-sm font-semibold text-gray-800 mb-3">Compare Plans</p>
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="py-2 font-medium">Features</th>
                <th className="py-2 font-medium text-center">Free</th>
                <th className="py-2 font-medium text-center">Premium</th>
                <th className="py-2 font-medium text-center">Pro</th>
              </tr>
            </thead>
            <tbody>
              {compareFeatures.map((f) => (
                <tr key={f.label} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-gray-700">{f.label}</td>
                  <td className="py-2.5 text-center">{f.free ? <Check size={15} className="text-emerald-500 inline" /> : <X size={15} className="text-red-300 inline" />}</td>
                  <td className="py-2.5 text-center">{f.premium ? <Check size={15} className="text-emerald-500 inline" /> : <X size={15} className="text-red-300 inline" />}</td>
                  <td className="py-2.5 text-center">{f.pro ? <Check size={15} className="text-emerald-500 inline" /> : <X size={15} className="text-red-300 inline" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="space-y-5">
          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Why Upgrade?</p>
            <div className="space-y-3">
              {WHY_UPGRADE.map((w) => (
                <div key={w.title} className="flex items-start gap-2.5 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <w.icon size={14} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{w.title}</p>
                    <p className="text-xs text-gray-400">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">Frequently Asked Questions</p>
            <div className="space-y-1">
              {upgradeFaqs.map((q, idx) => (
                <div key={q} className="border-b border-gray-50 last:border-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between py-2.5 text-sm text-gray-700 text-left"
                  >
                    {q}
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === idx && <p className="text-xs text-gray-500 pb-2.5">Yes — you can manage this anytime from your account settings.</p>}
                </div>
              ))}
            </div>
            <button className="w-full mt-2 text-primary-600 text-sm font-medium">View All FAQs →</button>
          </Card>
        </div>
      </div>

      <Card className="p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Secure & Trusted</p>
          <p className="text-xs text-gray-500">Your payment information is encrypted and secure. We never share your data with third parties.</p>
        </div>
        <p className="text-xs text-gray-400">Need a custom plan for your team or institution?</p>
        <button className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700">Contact Sales</button>
      </Card>
    </AppLayout>
  );
}
