import { LogOut, ShieldCheck, Laptop, Smartphone, Tablet, Monitor, HelpCircle } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import { currentUser, signedInDevices, securityTips } from "../data/mockData";

const DEVICE_ICON = {
  "Windows • Chrome": Monitor,
  "Android • Mobile App": Smartphone,
  "iPad • Safari": Tablet,
  "Mac OS • Chrome": Laptop,
};

export default function SignOut() {
  return (
    <AppLayout showSearch={false} showAddExam={false}>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
        <p className="text-sm text-gray-500">Manage your session and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <LogOut size={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Ready to Sign Out?</p>
              <p className="text-xs text-gray-400">You are currently signed in as:</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-gray-100 rounded-lg p-3 mb-4">
            <img src={currentUser.avatar} className="w-9 h-9 rounded-full" alt={currentUser.name} />
            <div>
              <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
              <p className="text-xs text-gray-400">{currentUser.email}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">Signing out will securely end your session on this device.</p>
          <button className="border border-red-200 text-red-600 font-medium text-sm rounded-lg px-4 py-2 hover:bg-red-50">
            Sign Out from This Device
          </button>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-1">Signed In Devices</p>
            <p className="text-xs text-gray-400 mb-3">You are currently signed in on the following devices.</p>
            <div className="space-y-2">
              {signedInDevices.map((d) => {
                const Icon = DEVICE_ICON[d.device] || Monitor;
                return (
                  <div key={d.device} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          {d.device} {d.current && <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-md font-medium">Current Device</span>}
                        </p>
                        <p className="text-xs text-gray-400">{d.location} {d.current && "• "}{d.current ? <span className="text-emerald-600">Active now</span> : d.lastActive}</p>
                      </div>
                    </div>
                    {!d.current && (
                      <button className="text-xs font-medium border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600">Sign Out</button>
                    )}
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-3 text-red-600 text-sm font-medium border border-red-100 rounded-lg py-2 hover:bg-red-50 flex items-center justify-center gap-1.5">
              <LogOut size={14} /> Sign Out from All Devices
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-3">Security Tips</p>
            <div className="space-y-2">
              {securityTips.map((t) => (
                <div key={t.label} className="flex items-start gap-3 text-sm">
                  <ShieldCheck size={15} className="text-primary-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">{t.label}</p>
                    <p className="text-xs text-gray-400">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={26} />
            </div>
            <p className="font-semibold text-gray-800 mb-1">Your Account is Secure</p>
            <p className="text-xs text-gray-400">We take your security and privacy seriously. All your data is encrypted and protected.</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Before You Go</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✓ Your progress is automatically saved.</p>
              <p>✓ You can sign in anytime to continue your journey.</p>
              <p>✓ Premium benefits will remain active.</p>
              <p>✓ Your data and settings are safe.</p>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5"><HelpCircle size={15} /> Need Help?</p>
            <p className="text-xs text-gray-400 mb-3">If you're having trouble signing out or have any concerns, our support team is here to help.</p>
            <button className="w-full border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Visit Help Center</button>
            <p className="text-xs text-gray-400 mt-3">Or reach us at <span className="text-primary-600">support@examjourney.com</span></p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
