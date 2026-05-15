import { useState, useMemo, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import AddTask from "./Components/AddTask";
import TaskList from "./Components/TaskList";

const STORAGE_KEY = "taskflow_tasks";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn("localStorage write failed:", e);
    }
  }, [tasks]);

  // ─── Derived stats ────────────────────────────────────────────────────────
  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === "completed").length;
  const wipCount = tasks.filter((t) => t.status === "in-progress").length;
  const progress = total ? Math.round((doneCount / total) * 100) : 0;

  // ─── Search + priority filter ─────────────────────────────────────────────
  const filteredTasks = useMemo(
    () =>
      tasks.filter((t) => {
        const q = search.toLowerCase();
        const matchSearch =
          t.title.toLowerCase().includes(q) ||
          t.details.toLowerCase().includes(q);
        const matchPri =
          filterPriority === "all" || t.priority === filterPriority;
        return matchSearch && matchPri;
      }),
    [tasks, search, filterPriority],
  );

  // ─── Drag & Drop ──────────────────────────────────────────────────────────
  function onDragEnd(result) {
    const { source, destination, draggableId } = result;

    // Dropped outside any column
    if (!destination) return;

    // Dropped back in exact same spot
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    setTasks((prev) => {
      const updated = [...prev];
      const taskIdx = updated.findIndex((t) => String(t.id) === draggableId);
      if (taskIdx === -1) return prev;

      /*
       * destination.droppableId يتطابق مع task.status لأن TaskList
       * بتمرر droppableId="todo" / "in-progress" / "completed"
       */
      updated[taskIdx] = {
        ...updated[taskIdx],
        status: destination.droppableId,
      };

      return updated;
    });
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-[#020817] text-white overflow-x-hidden relative">
        {/* Background glows */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/6 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-blue-500/6 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-5 py-6 pb-16">
          {/* ── Header ── */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight">
                TaskFlow 🚀
              </h1>
              <p className="text-slate-400 mt-1.5 text-[15px]">
                Smart productivity dashboard for modern workflow.
              </p>
            </div>

            {/* Stat chips */}
            <div className="flex gap-2.5">
              {[
                ["Total", total, "rgba(34,211,238,0.12)", "#22d3ee"],
                ["Done", doneCount, "rgba(74,222,128,0.12)", "#4ade80"],
                ["WIP", wipCount, "rgba(234,179,8,0.12)", "#facc15"],
              ].map(([label, value, bg, color]) => (
                <div
                  key={label}
                  style={{ background: bg, borderColor: color + "22" }}
                  className="border rounded-[14px] px-4 py-2.5 text-center"
                >
                  <p className="text-[11px] text-slate-500 mb-1">{label}</p>
                  <p
                    style={{ color }}
                    className="text-[22px] font-black leading-none"
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Progress bar ── */}
          {total > 0 && (
            <div className="flex items-center gap-4 bg-white/3 border border-white/7 rounded-2xl px-4 py-3 mb-5">
              <span className="text-[13px] text-slate-400 flex-shrink-0">
                Overall Progress
              </span>
              <div className="flex-1 h-1.5 bg-white/7 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${progress}%`,
                    transition: "width 0.5s ease",
                  }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full"
                />
              </div>
              <span className="text-[13px] font-bold text-green-400 flex-shrink-0">
                {progress}%
              </span>
            </div>
          )}

          {/* ── Search & Filter ── */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search tasks..."
              className="flex-1 min-w-[180px] px-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-slate-300 text-sm outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-400"
            />
            <div className="flex gap-1.5">
              {["all", "easy", "medium", "hard"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilterPriority(p)}
                  className={`
                    px-3.5 py-2 rounded-[10px] border text-slate-200 text-[13px] cursor-pointer capitalize transition-all duration-200
                    ${
                      filterPriority === p
                        ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-400 font-semibold"
                        : "border-white/7 text-slate-500 hover:border-white/15"
                    }
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* ── Main Layout ── */}
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5 items-start">
            <AddTask tasks={tasks} setTasks={setTasks} />
            <TaskList tasks={filteredTasks} setTasks={setTasks} />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
