import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ title, subtitle, showSearch, showAddExam, children }) {
  return (
    <div className="flex bg-[#f8f9fc] min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          title={title}
          subtitle={subtitle}
          showSearch={showSearch}
          showAddExam={showAddExam}
        />
        <main className="flex-1 p-4 sm:p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}
