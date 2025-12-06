"use client";

import { TAG_OPTIONS, ASSIGNEES, COLUMNS } from "../_lib/kanbanConfig";

export default function TaskModal({
  mode,
  task,
  onChangeField,
  onToggleTag,
  onClose,
  onSave,
  onDelete,
}) {
  const title = mode === "create" ? "Add Task" : "Edit Task";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {/* Problem ID */}
          <div>
            <label className="text-xs font-medium text-slate-600">
              Problem ID (e.g. 112)
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm mt-1"
              value={task.issueId}
              onChange={(e) => onChangeField("issueId", e.target.value)}
              placeholder="112"
            />
          </div>

          {/* Title / description */}
          <div>
            <label className="text-xs font-medium text-slate-600">
              Issue title / description
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm mt-1 min-h-[70px]"
              value={task.title}
              onChange={(e) => onChangeField("title", e.target.value)}
              placeholder="Recording Feature in Enthrall IT course 01-01 Milestone"
            />
          </div>

          {/* ✅ Status / Column নির্বাচন */}
          <div>
            <label className="text-xs font-medium text-slate-600">
              Status / Column
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm mt-1 bg-white"
              value={task.status}
              onChange={(e) => onChangeField("status", e.target.value)}
            >
              <option value="">Select column</option>
              {COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
            {/* চাইলে নিচে ছোট হিন্ট দিতে পারো */}
            {/* <p className="mt-1 text-[10px] text-slate-400">
              যেই কলাম থেকে Add item এ ক্লিক করেছো, সেটা default আছে।
            </p> */}
          </div>

          {/* Assign to */}
          <div>
            <label className="text-xs font-medium text-slate-600">
              Assign to
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm mt-1 bg-white"
              value={task.assigneeId}
              onChange={(e) => onChangeField("assigneeId", e.target.value)}
            >
              <option value="">Select assignee</option>
              {ASSIGNEES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-slate-600">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TAG_OPTIONS.map((tag) => {
                const active = task.tags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => onToggleTag(tag.id)}
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
          {mode === "edit" ? (
            <button
              onClick={onDelete}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          ) : (
            <span />
          )}

          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded border border-slate-300 text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
