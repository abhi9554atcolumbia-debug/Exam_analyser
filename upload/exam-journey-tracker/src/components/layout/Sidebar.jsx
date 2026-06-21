import { NavLink } from "react-router-dom";
import { GraduationCap, Crown } from "lucide-react";
import { NAV_ITEMS, NAV_FOOTER_ITEMS } from "../../constants/nav";

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white">
          <GraduationCap size={20} />
        </div>
        <span className="font-bold text-gray-900 leading-tight text-[15px]">
          Exam Journey
          <br />
          Tracker
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-3">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-4 text-white mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={16} />
            <span className="text-sm font-semibold">Pro Plan</span>
          </div>
          <p className="text-xs text-primary-100 mb-3 leading-snug">
            Unlock advanced analytics, AI insights & unlimited exam entries.
          </p>
          <NavLink
            to="/upgrade"
            className="block text-center bg-white text-primary-700 text-xs font-semibold rounded-lg py-2 hover:bg-primary-50"
          >
            Upgrade Now
          </NavLink>
        </div>

        {NAV_FOOTER_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
