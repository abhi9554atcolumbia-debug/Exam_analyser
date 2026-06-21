import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Settings, Plus, ChevronDown } from "lucide-react";
import { currentUser } from "../../data/mockData";

export default function Topbar({ title, subtitle, showSearch = false, showAddExam = true }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        <div className="min-w-0">
          {title && <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>}
          {subtitle && <p className="text-sm text-gray-500 truncate">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {showSearch && (
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-64">
              <Search size={16} className="text-gray-400" />
              <input
                placeholder="Search exams, categories, stages..."
                className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
              />
            </div>
          )}

          {showAddExam && (
            <button className="hidden sm:flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
              <Plus size={16} /> Add Exam
            </button>
          )}

          <Link
            to="/settings"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
          >
            <Settings size={18} />
          </Link>

          <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 pl-1"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {currentUser.name}
              </span>
              <ChevronDown size={14} className="hidden sm:block text-gray-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 text-sm">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  Settings
                </Link>
                <Link to="/sign-out" className="block px-4 py-2 hover:bg-gray-50 text-red-600" onClick={() => setMenuOpen(false)}>
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
