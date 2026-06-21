import { useState } from "react";
import { ArrowLeft, ChevronDown, FileText, Trash2, Upload, Bell } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { reflectionData, reflectionExamOptions } from "../data/mockData";

const DIFFICULTY = ["Easy", "Medium", "Hard", "Very Hard"];
const EMOTIONS = ["Calm", "Neutral", "Nervous", "Stressed"];
const MISTAKE_TAGS = ["Time Management", "Concept Gap", "Calculation Error", "Guessing", "Silly Mistake", "Revision Issue", "Negative Marking", "Stress / Pressure", "Poor Accuracy", "Too Many Attempts"];
const STRENGTH_TAGS = ["Strong in Reasoning", "Good Speed", "Better Accuracy", "Good Revision", "Strong in Static GK", "Good Focus", "Consistent Performance"];

export default function Reflections() {
  const r = reflectionData;
  const [difficulty, setDifficulty] = useState(r.difficulty);
  const [emotion, setEmotion] = useState(r.emotionalState);
  const [confidence, setConfidence] = useState(r.confidence);
  const [mistakes, setMistakes] = useState(r.mistakeTags);
  const [strengths, setStrengths] = useState(r.strengthTags);

  const toggle = (list, setList, item) =>
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);

  return (
    <AppLayout showSearch={false}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reflection</h2>
          <p className="text-sm text-gray-500">Review your exam performance and plan your improvement.</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700">
          {r.exam} ({r.date}) <ChevronDown size={14} />
        </button>
      </div>

      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={15} /> Back to History
      </button>

      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <FileText size={18} />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{r.exam}</p>
              <p className="text-xs text-gray-400">{r.date}</p>
            </div>
          </div>
          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-xs text-gray-400">Score</p>
              <p className="font-bold text-primary-600">{r.score}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Cutoff</p>
              <p className="font-bold text-gray-700">{r.cutoff}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Gap</p>
              <p className="font-bold text-red-500">{r.gap}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Result</p>
              <Badge variant="danger">{r.result}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-4">1. Exam Experience</p>
          <p className="text-xs text-gray-500 mb-2">How difficult was the exam?</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {DIFFICULTY.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`text-xs font-medium rounded-lg py-2 border ${difficulty === d ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-600"}`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-2">How confident were you before the exam?</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold text-primary-600 w-12">{confidence}%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="flex-1 accent-primary-600"
            />
          </div>
          <p className="text-xs text-gray-500 mb-2">Emotional state before exam</p>
          <div className="grid grid-cols-4 gap-2">
            {EMOTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEmotion(e)}
                className={`text-xs font-medium rounded-lg py-2 border ${emotion === e ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-600"}`}
              >
                {e}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">4. What Went Wrong?</p>
          <ul className="text-xs text-gray-400 mb-2 space-y-0.5">
            <li>• Where did you lose marks?</li>
            <li>• Which section was weak?</li>
            <li>• What mistake happened most?</li>
            <li>• Did you manage time properly?</li>
          </ul>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none h-32 outline-none focus:border-primary-400"
            defaultValue={r.whatWentWrong}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">2. Mistake Tags <span className="text-xs text-gray-400 font-normal">(Select all that apply)</span></p>
          <div className="flex flex-wrap gap-2 mb-5">
            {MISTAKE_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggle(mistakes, setMistakes, tag)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${mistakes.includes(tag) ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 text-gray-600"}`}
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-gray-800 mb-3">3. Strength Tags <span className="text-xs text-gray-400 font-normal">(Select all that apply)</span></p>
          <div className="flex flex-wrap gap-2">
            {STRENGTH_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggle(strengths, setStrengths, tag)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${strengths.includes(tag) ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-600"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">5. What Went Well?</p>
          <ul className="text-xs text-gray-400 mb-2 space-y-0.5">
            <li>• What are you proud of?</li>
            <li>• Which section went well?</li>
            <li>• What improved compared to last time?</li>
          </ul>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none h-32 outline-none focus:border-primary-400"
            defaultValue={r.whatWentWell}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">6. Biggest Lesson Learned</p>
          <p className="text-xs text-gray-400 mb-2">One key takeaway from this exam.</p>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none h-24 outline-none focus:border-primary-400"
            defaultValue={r.biggestLesson}
          />
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">7. Action Plan</p>
          <p className="text-xs text-gray-400 mb-2">What will you do before the next attempt?</p>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none h-24 outline-none focus:border-primary-400"
            defaultValue={r.actionPlan.map((a) => `• ${a}`).join("\n")}
          />
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">8. Next Attempt Goal</p>
          <p className="text-xs text-gray-400 mb-1">Set your goal for the next attempt.</p>
          <label className="text-xs text-gray-500">Target Score</label>
          <input
            type="text"
            defaultValue={r.targetScore}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-700 mb-3 outline-none focus:border-primary-400"
          />
          <label className="text-xs text-gray-500">Goal Description</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-700 resize-none h-16 outline-none focus:border-primary-400"
            defaultValue={r.goalDescription}
          />
        </Card>
      </div>

      <Card className="p-4 overflow-x-auto">
        <p className="text-sm font-semibold text-gray-800 mb-3">9. Section-wise Reflection <span className="text-xs text-gray-400 font-normal">(Optional)</span></p>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="py-2 font-medium">Section</th>
              <th className="py-2 font-medium">Score</th>
              <th className="py-2 font-medium">Strength</th>
              <th className="py-2 font-medium">Weakness</th>
              <th className="py-2 font-medium">Action Plan</th>
            </tr>
          </thead>
          <tbody>
            {r.sectionWise.map((s) => (
              <tr key={s.section} className="border-b border-gray-50 last:border-0">
                <td className="py-3 font-medium text-gray-700">{s.section}</td>
                <td className="py-3 text-gray-600">{s.score}</td>
                <td className="py-3 text-emerald-600">{s.strength}</td>
                <td className="py-3 text-red-500">{s.weakness}</td>
                <td className="py-3 text-gray-500">{s.actionPlan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3">10. Attachments <span className="text-xs text-gray-400 font-normal">(Upload files related to this exam)</span></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-center py-8 px-3">
              <Upload size={20} className="text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">Drag & drop files here or</p>
              <button className="text-xs font-medium bg-primary-600 text-white px-3 py-1.5 rounded-lg mt-2">Choose Files</button>
              <p className="text-[10px] text-gray-400 mt-2">PDF, JPG, PNG up to 10MB</p>
            </div>
            <div className="space-y-2">
              {r.attachments.map((f) => (
                <div key={f} className="flex items-center justify-between text-xs border border-gray-100 rounded-lg px-3 py-2">
                  <span className="flex items-center gap-2 text-gray-600 truncate"><FileText size={14} className="text-red-400 shrink-0" /> {f}</span>
                  <Trash2 size={14} className="text-gray-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5"><Bell size={15} /> 11. Reminder / Follow-up</p>
          <p className="text-xs text-gray-400 mb-3">Set a reminder to revisit this reflection.</p>
          <div className="grid grid-cols-2 gap-3">
            <select className="border border-gray-200 rounded-lg p-2 text-sm text-gray-700 outline-none">
              <option>Review after 1 week</option>
              <option>Review after 2 weeks</option>
              <option>Review after 1 month</option>
            </select>
            <input type="date" defaultValue="2026-07-22" className="border border-gray-200 rounded-lg p-2 text-sm text-gray-700 outline-none" />
          </div>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save Reflection</Button>
      </div>
    </AppLayout>
  );
}
