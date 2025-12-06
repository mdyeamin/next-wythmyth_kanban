"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import { COLUMNS } from "../_lib/kanbanConfig";
import { useKanbanState } from "../_lib/useKanbanState";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

export default function KanbanBoard() {
  const {
    tasks,
    modalMode,
    modalTask,
    openCreateModal,
    openEditModal,
    closeModal,
    updateModalField,
    toggleTagOnModalTask,
    saveModalTask,
    deleteModalTask,
    handleDragEnd,
  } = useKanbanState();

  if (tasks === null) {
    return <div>Loading WythMyth Kanban board…</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-2">WythMyth Kanban Board</h1>

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

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {tasks
                      .filter((t) => t.status === col.id)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(dragProvided) => (
                            <TaskCard
                              task={task}
                              onClick={() => openEditModal(task)}
                              draggableProps={dragProvided}
                            />
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                  </div>

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

      {modalMode && (
        <TaskModal
          mode={modalMode}
          task={modalTask}
          onChangeField={updateModalField}
          onToggleTag={toggleTagOnModalTask}
          onClose={closeModal}
          onSave={saveModalTask}
          onDelete={deleteModalTask}
        />
      )}
    </div>
  );
}
