import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";

const PRIORITY_STYLES = {
  easy: {
    badge:  "bg-green-500/10 text-green-400 border-green-500/20",
    border: "border-green-400/30",
    dot:    "bg-green-400",
  },
  medium: {
    badge:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    border: "border-yellow-400/30",
    dot:    "bg-yellow-400",
  },
  hard: {
    badge:  "bg-red-500/10 text-red-400 border-red-500/20",
    border: "border-red-400/30",
    dot:    "bg-red-400",
  },
};

const STATUS_BUTTONS = [
  {
    value:  "todo",
    label:  "Todo",
    emoji:  "📌",
    active: "bg-cyan-500/15 border-cyan-400/40 text-cyan-400",
    idle:   "border-white/6 text-slate-500 hover:border-white/15",
  },
  {
    value:  "in-progress",
    label:  "WIP",
    emoji:  "⚡",
    active: "bg-yellow-500/15 border-yellow-400/40 text-yellow-400",
    idle:   "border-white/6 text-slate-500 hover:border-white/15",
  },
  {
    value:  "completed",
    label:  "Done",
    emoji:  "✅",
    active: "bg-green-500/15 border-green-400/40 text-green-400",
    idle:   "border-white/6 text-slate-500 hover:border-white/15",
  },
];

function formatDate(dt) {
  if (!dt) return "—";
  try {
    return new Date(dt).toLocaleString("en-GB", {
      day:    "2-digit",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dt;
  }
}

function TaskCard({ task, setTasks, index }) {
  const [hovered, setHovered] = useState(false);
  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

  function handleDelete() {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }

  function updateStatus(newStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
  }

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`
            rounded-2xl bg-[#0b1220] p-4 border select-none
            transition-all duration-200
            ${priority.border}
            ${snapshot.isDragging
              /*
               * ✅ FIX #3 — visual feedback أثناء الـ drag:
               * scale + rotate + glow بيدي إحساس إن الكارت "اتشالت"
               */
              ? "shadow-2xl shadow-cyan-500/25 scale-[1.03] rotate-1 opacity-95 border-cyan-400/50 cursor-grabbing"
              : hovered
                ? "-translate-y-0.5 shadow-lg shadow-black/20 cursor-grab"
                : "cursor-grab"
            }
          `}
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-slate-100 leading-snug line-clamp-1 mb-1">
                {task.title}
              </p>
              <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-2">
                {task.details}
              </p>
            </div>

            {/* زرار الحذف — مش بيظهر أثناء الـ drag */}
            {!snapshot.isDragging && (
              <button
                onClick={handleDelete}
                aria-label="Delete task"
                className={`
                  flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px]
                  bg-red-500/10 text-red-400 border border-red-500/20 cursor-pointer
                  transition-all duration-200 hover:scale-110
                  ${hovered ? "opacity-100" : "opacity-0"}
                `}
              >
                ✕
              </button>
            )}
          </div>

          {/* Priority badge + status dot */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex px-2.5 py-0.5 rounded-lg border text-[11px] font-semibold uppercase tracking-wide ${priority.badge}`}>
              {task.priority}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            <span className="text-[11px] text-slate-500 capitalize">
              {task.status}
            </span>
          </div>

          {/* Dates */}
          <div className="flex flex-col gap-1 mb-4">
            <p className="text-[11px] text-slate-400">🗓 Start: {formatDate(task.startDate)}</p>
            <p className="text-[11px] text-slate-400">⏰ Due: {formatDate(task.deadline)}</p>
          </div>

          {/* Status action buttons — مش بتظهر أثناء الـ drag عشان متـclickش غلط */}
          {!snapshot.isDragging && (
            <div className="flex gap-1.5">
              {STATUS_BUTTONS.map((btn) => (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => updateStatus(btn.value)}
                  className={`
                    flex-1 py-1.5 rounded-[10px] border text-[11px] cursor-pointer transition-all duration-200
                    ${task.status === btn.value ? btn.active + " font-semibold" : btn.idle}
                  `}
                >
                  {btn.emoji} {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;