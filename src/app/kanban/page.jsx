"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// সব column
const COLUMNS = [
  { id: "todo", title: "To do" },
  { id: "in_progress", title: "In progress" },
  { id: "testing", title: "Testing" },
  { id: "done", title: "Done" },
  { id: "ready_for_deploy", title: "Ready For Deployment" },
];

// tag options
const TAG_OPTIONS = [
  { id: "development", label: "Development", color: "bg-orange-500" },
  { id: "bug", label: "Bug", color: "bg-red-500" },
  { id: "high", label: "High", color: "bg-red-400" },
  { id: "medium", label: "Medium", color: "bg-yellow-400" },
  { id: "low", label: "Low", color: "bg-green-400" },
  { id: "major", label: "Major", color: "bg-purple-500" },
];

const STORAGE_KEY = "wythmyth_kanban_tasks_v1";

export default function KanbanPage() {
  const [tasks, setTasks] = useState([]);
  const [modalMode, setModalMode] = useState(null); // "create" | "edit" | null
  const [modalTask, setModalTask] = useState({
    id: "",
    title: "",
    status: "",
    tags: [],
  });

  // 🔄 localStorage থেকে লোড
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        // parse error হলে ignore
      }
    }
  }, []);

  // 💾 localStorage এ save
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // ➕ নতুন task add modal open
  const openCreateModal = (columnId) => {
    setModalMode("create");
    setModalTask({
      id: "",
      title: "",
      status: columnId,
      tags: [],
    });
  };

  // ✏️ existing task edit modal open
  const openEditModal = (task) => {
    setModalMode("edit");
    setModalTask({
      id: task.id,
      title: task.title,
      status: task.status,
      tags: task.tags ?? [],
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setModalTask({ id: "", title: "", status: "", tags: [] });
  };

  // 🧲 drag শেষ হলে status update
  const handleDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggableId
          ? { ...task, status: destination.droppableId }
          : task
      )
    );
  };

  // modal form এর title change
  const handleModalTitleChange = (e) => {
    setModalTask((prev) => ({ ...prev, title: e.target.value }));
  };

  // tag toggle
  const toggleTag = (tagId) => {
    setModalTask((prev) => {
      const exists = prev.tags.includes(tagId);
      return {
        ...prev,
        tags: exists
          ? prev.tags.filter((t) => t !== tagId)
          : [...prev.tags, tagId],
      };
    });
  };

  // modal save (create / edit)
  const handleModalSave = () => {
    if (!modalTask.title.trim() || !modalTask.status) return;

    if (modalMode === "create") {
      const newTask = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(),
        title: modalTask.title.trim(),
        status: modalTask.status,
        tags: modalTask.tags,
      };
      setTasks((prev) => [...prev, newTask]);
    } else if (modalMode === "edit") {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === modalTask.id
            ? {
                ...task,
                title: modalTask.title.trim(),
                tags: modalTask.tags,
              }
            : task
        )
      );
    }

    closeModal();
  };

  // modal delete
  const handleModalDelete = () => {
    if (!modalTask.id) return;
    setTasks((prev) => prev.filter((task) => task.id !== modalTask.id));
    closeModal();
  };

  // helper: একটি task এর tag badge render
  const renderTags = (task) => {
    if (!task.tags || task.tags.length === 0) return null;

    return (
      <div className="mt-2 flex flex-wrap gap-1">
        {task.tags.map((tagId) => {
          const tag = TAG_OPTIONS.find((t) => t.id === tagId);
          if (!tag) return null;
          return (
            <span
              key={tagId}
              className={`px-2 py-0.5 rounded-full text-[10px] text-white ${tag.color}`}
            >
              {tag.label}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">WythMyth Kanban Board</h1>

      {/* Kanban Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-5">
          {COLUMNS.map((col) => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div
                  className="bg-slate-100 rounded p-3 h-[520px] flex flex-col"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className="font-semibold mb-2 text-sm flex items-center justify-between">
                    <span>{col.title}</span>
                    <span className="text-xs text-slate-500">
                      {tasks.filter((task) => task.status === col.id).length}
                    </span>
                  </h2>

                  {/* স্ক্রল হওয়া area */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {tasks
                      .filter((t) => t.status === col.id)
                      .map((task, index) => (
                        <Draggable
                          draggableId={task.id}
                          index={index}
                          key={task.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white rounded shadow p-2 text-xs md:text-sm cursor-pointer hover:bg-slate-50"
                              onClick={() => openEditModal(task)}
                            >
                              <div className="font-medium">{task.title}</div>
                              {renderTags(task)}
                            </div>
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                  </div>

                  {/* নিচে Add item button */}
                  <button
                    onClick={() => openCreateModal(col.id)}
                    className="mt-2 text-xs text-left text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <span className="text-lg leading-none">＋</span>
                    <span>Add item</span>
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                {modalMode === "create" ? "Add Task" : "Edit Task"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-500 hover:text-slate-800 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Title
                </label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={modalTask.title}
                  onChange={handleModalTitleChange}
                  placeholder="Write task title…"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {TAG_OPTIONS.map((tag) => {
                    const active = modalTask.tags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-2 py-1 rounded-full text-[11px] ${
                          active
                            ? `${tag.color} text-white`
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              {modalMode === "edit" ? (
                <button
                  onClick={handleModalDelete}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              ) : (
                <span />
              )}

              <div className="space-x-2">
                <button
                  onClick={closeModal}
                  className="px-3 py-1.5 text-xs rounded border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSave}
                  className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
