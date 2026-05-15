import { useState } from "react";

const EMPTY_TASK = {
  title:     "",
  details:   "",
  startDate: "",
  deadline:  "",
  priority:  "medium",
  status:    "todo",
};

function AddTask({ tasks, setTasks }) {
  const [task, setTask] = useState(EMPTY_TASK);

  function handleSubmit() {
    if (!task.title || !task.details || !task.startDate || !task.deadline) {
      alert("All fields are required");
      return;
    }
    setTasks([...tasks, { ...task, id: Date.now() }]);
    setTask(EMPTY_TASK);
  }

  return (
    <div className="sticky top-4 rounded-[24px] border border-white/8 bg-white/4 p-5">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xl flex-shrink-0">
          ✨
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-slate-100">Create Task</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Organize your workflow efficiently
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">

        {/* Title */}
        <div>
          <label className="text-[12px] text-slate-400 block mb-1.5">Task Title</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            placeholder="e.g. Design landing page"
            className="w-full px-3 py-2.5 rounded-xl bg-[#0b1220] border border-white/10 text-slate-300 text-sm outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-600"
          />
        </div>

        {/* Details */}
        <div>
          <label className="text-[12px] text-slate-400 block mb-1.5">Details</label>
          <textarea
            value={task.details}
            onChange={(e) => setTask({ ...task, details: e.target.value })}
            placeholder="Describe what needs to be done..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0b1220] border border-white/10 text-slate-300 text-sm outline-none focus:border-cyan-400 transition-colors resize-none placeholder:text-slate-600"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[12px] text-slate-400 block mb-1.5">Start Date</label>
            <input
              type="datetime-local"
              value={task.startDate}
              onChange={(e) => setTask({ ...task, startDate: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0b1220] border border-white/10 text-slate-300 text-sm outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-[12px] text-slate-400 block mb-1.5">Deadline</label>
            <input
              type="datetime-local"
              value={task.deadline}
              onChange={(e) => setTask({ ...task, deadline: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0b1220] border border-white/10 text-slate-300 text-sm outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="text-[12px] text-slate-400 block mb-2">Priority</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "easy",   label: "Easy",   emoji: "🌱", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  color: "#4ade80" },
              { value: "medium", label: "Medium", emoji: "⚡", bg: "rgba(234,179,8,0.1)",  border: "rgba(234,179,8,0.25)",  color: "#facc15" },
              { value: "hard",   label: "Hard",   emoji: "🔥", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.25)",  color: "#f87171" },
            ].map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setTask({ ...task, priority: p.value })}
                style={task.priority === p.value ? { background: p.bg, borderColor: p.border, color: p.color } : {}}
                className={`
                  rounded-xl border border-white/6 p-2.5 text-center
                  flex justify-center items-center gap-1.5
                  transition-all duration-200 cursor-pointer
                  ${task.priority === p.value ? "scale-[1.04]" : "opacity-60 hover:opacity-90"}
                `}
              >
                <span className="text-xs">{p.emoji}</span>
                <span className="text-[12px] font-medium">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-1 w-full py-3 rounded-[14px] bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-[15px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
        >
          + Create Task
        </button>

      </div>
    </div>
  );
}

export default AddTask;