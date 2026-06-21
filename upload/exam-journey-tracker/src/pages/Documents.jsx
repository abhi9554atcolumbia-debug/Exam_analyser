import {
  Search,
  FileText,
  IdCard,
  ThumbsUp,
  Receipt,
  BookOpenCheck,
  NotebookPen,
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
  Upload,
  ChevronDown,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";
import { documentCategories, documentsList, recentUploads, linkedExams } from "../data/mockData";

const CATEGORY_ICONS = [Receipt, IdCard, ThumbsUp, FileText, FileText, BookOpenCheck, NotebookPen, MoreHorizontal];
const CATEGORY_COLORS = [
  { bg: "bg-purple-50", text: "text-purple-600" },
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-orange-50", text: "text-orange-600" },
  { bg: "bg-red-50", text: "text-red-600" },
  { bg: "bg-teal-50", text: "text-teal-600" },
  { bg: "bg-indigo-50", text: "text-indigo-600" },
  { bg: "bg-gray-100", text: "text-gray-600" },
];

const categoryVariant = (category) => {
  if (category === "Scorecard") return "purple";
  if (category === "Admit Card") return "info";
  if (category === "Answer Key") return "danger";
  if (category === "Result") return "success";
  if (category === "Syllabus") return "indigo";
  return "neutral";
};

export default function Documents() {
  return (
    <AppLayout showSearch={false} showAddExam={false}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Documents</h2>
          <p className="text-sm text-gray-500">Store and manage all your exam related documents in one place.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
          <Upload size={16} /> Upload Document
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[220px]">
          <Search size={16} className="text-gray-400" />
          <input placeholder="Search documents, exams, files..." className="bg-transparent text-sm outline-none w-full" />
        </div>
        {["All Exams", "All Categories", "All Years", "Sort: Newest"].map((f) => (
          <button key={f} className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white">
            {f} <ChevronDown size={14} />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {documentCategories.map((cat, idx) => (
          <Card key={cat.label} className="p-3 text-center">
            <div className={`w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center ${CATEGORY_COLORS[idx].bg}`}>
              {(() => {
                const Icon = CATEGORY_ICONS[idx];
                return <Icon size={16} className={CATEGORY_COLORS[idx].text} />;
              })()}
            </div>
            <p className="text-xs font-semibold text-gray-700">{cat.label}</p>
            <p className="text-[11px] text-gray-400">{cat.count} Files</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="p-4 xl:col-span-2 overflow-x-auto">
          <p className="text-sm font-semibold text-gray-800 mb-3">All Documents (140)</p>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="py-2 font-medium">Document</th>
                <th className="py-2 font-medium">Linked Exam</th>
                <th className="py-2 font-medium">Category</th>
                <th className="py-2 font-medium">Uploaded On</th>
                <th className="py-2 font-medium">Size</th>
                <th className="py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documentsList.map((doc) => (
                <tr key={doc.name} className="border-b border-gray-50 last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-red-400 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700 truncate max-w-[160px]">{doc.name}</p>
                        <p className="text-[11px] text-gray-400 truncate max-w-[160px]">{doc.note}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500 text-xs whitespace-nowrap">{doc.exam}</td>
                  <td className="py-3"><Badge variant={categoryVariant(doc.category)}>{doc.category}</Badge></td>
                  <td className="py-3 text-gray-500 text-xs whitespace-nowrap">{doc.uploaded}</td>
                  <td className="py-3 text-gray-500 text-xs whitespace-nowrap">{doc.size}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Eye size={15} />
                      <Download size={15} />
                      <MoreHorizontal size={15} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>Showing 1 to 8 of 140 documents</span>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Quick Upload</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-center py-8 px-3">
                <Upload size={20} className="text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">Drag & drop files here<br />or click to browse</p>
                <p className="text-[10px] text-gray-400 mt-2">PDF, JPG, PNG up to 10MB</p>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="text-xs text-gray-500">Link to Exam *</label>
                  <select className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none">
                    <option>Select Exam</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Document Category *</label>
                  <select className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none">
                    <option>Select Category</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Add Notes (Optional)</label>
                  <textarea placeholder="Add a short note about this document..." className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none resize-none h-14" />
                </div>
                <button className="w-full bg-gray-100 text-gray-400 rounded-lg py-2 text-sm font-medium cursor-not-allowed">Upload Document</button>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">Storage Overview</p>
            <p className="text-xs text-gray-500 mb-2">2.48 GB of 10 GB used</p>
            <ProgressBar percent={24.8} />
            <p className="text-xs text-gray-400 mt-1">24.8%</p>
            <button className="w-full mt-3 border border-gray-200 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Manage Storage
            </button>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Recent Uploads</p>
            <div className="space-y-3">
              {recentUploads.map((u) => (
                <div key={u.name} className="flex items-center gap-2 text-sm">
                  <FileText size={15} className="text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700 truncate">{u.name}</p>
                    <p className="text-[11px] text-gray-400">{u.date} • {u.size}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-primary-600 text-sm font-medium">View All Recent Uploads →</button>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Linked Exams</p>
            <div className="space-y-2">
              {linkedExams.map((e) => (
                <div key={e.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 truncate">{e.name}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{e.count} Documents</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-primary-600 text-sm font-medium">View All Exams →</button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
