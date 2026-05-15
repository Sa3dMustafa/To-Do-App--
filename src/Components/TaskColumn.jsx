import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

// ✅ color → isDraggingOver highlight color
const COLOR_MAP = {
  cyan: {
    badge:       "bg-cyan-500/12 border-cyan-500/20 text-cyan-400",
    dragOver:    "bg-cyan-500/6 ring-1 ring-cyan-500/25 ring-dashed",
  },
  yellow: {
    badge:       "bg-yellow-500/12 border-yellow-500/20 text-yellow-400",
    dragOver:    "bg-yellow-500/6 ring-1 ring-yellow-500/25 ring-dashed",
  },
  green: {
    badge:       "bg-green-500/12 border-green-500/20 text-green-400",
    dragOver:    "bg-green-500/6 ring-1 ring-green-500/25 ring-dashed",
  },
};

function TaskColumn({
  title,
  icon,
  tasks,
  setTasks,
  emptyTitle,
  emptyDesc,
  color,
  droppableId,
}) {
  const colors = COLOR_MAP[color] || COLOR_MAP.cyan;

  return (
    <div className="rounded-[20px] border border-white/7 bg-white/3 p-4 min-h-[400px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[16px] font-bold text-slate-100 flex items-center gap-2">
            {icon} {title}
          </h2>
          <p className="text-[12px] text-slate-500 mt-0.5">{emptyDesc}</p>
        </div>
        <div className={`text-[13px] font-bold border rounded-[10px] px-2.5 py-0.5 min-w-[28px] text-center ${colors.badge}`}>
          {tasks.length}
        </div>
      </div>

      {/* ✅ Droppable zone */}
      <Droppable droppableId={droppableId} type="task" direction="vertical">
        {(provided, snapshot) => (
          /*
           * ✅ FIX #2 — الـ flex container هو نفس الـ provided.innerRef div.
           * الـ provided.placeholder لازم يكون جوّا نفس الـ flex container
           * عشان الـ column تكبر صح أثناء الـ drag.
           * لو حطيناهم في div منفصل، الـ placeholder مش بيأثر على الـ layout.
           */
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex flex-col gap-2.5 rounded-2xl p-1 transition-all duration-200
              min-h-[80px]
              ${snapshot.isDraggingOver ? colors.dragOver : ""}
            `}
          >
            {/* Empty state — بس لو مفيش tasks ومفيش drag فوقيها */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="border border-dashed border-white/8 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-[14px] font-semibold text-slate-600">{emptyTitle}</p>
                <p className="text-[12px] text-slate-700 mt-1.5">{emptyDesc}</p>
              </div>
            )}

            {/* ✅ FIX #1 — index بيتمرر صح */}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                setTasks={setTasks}
                index={index}
              />
            ))}

            {/* ✅ placeholder جوّا نفس الـ flex div */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

    </div>
  );
}

export default TaskColumn;