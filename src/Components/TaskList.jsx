import TaskColumn from "./TaskColumn";

function TaskList({ tasks, setTasks }) {
  const todoTasks       = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const completedTasks  = tasks.filter((t) => t.status === "completed");

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ✅ droppableId يتطابق مع task.status بالضبط */}
        <TaskColumn
          droppableId="todo"
          title="To Do"
          icon="📌"
          tasks={todoTasks}
          setTasks={setTasks}
          emptyTitle="No Tasks Yet"
          emptyDesc="Add new tasks to start organizing your day."
          color="cyan"
        />

        <TaskColumn
          droppableId="in-progress"
          title="In Progress"
          icon="⚡"
          tasks={inProgressTasks}
          setTasks={setTasks}
          emptyTitle="No Active Tasks"
          emptyDesc="Tasks currently being worked on will appear here."
          color="yellow"
        />

        <TaskColumn
          droppableId="completed"
          title="Done"
          icon="✅"
          tasks={completedTasks}
          setTasks={setTasks}
          emptyTitle="Nothing Completed"
          emptyDesc="Completed tasks will be displayed here."
          color="green"
        />

      </div>
    </div>
  );
}

export default TaskList;