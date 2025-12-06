"use client";

import { useEffect, useState } from "react";
import { TAG_OPTIONS, ASSIGNEES, COLUMNS } from "../_lib/kanbanConfig";

const ANIMATION_MS = 200;

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

  // animation er jonno
  const [visible, setVisible] = useState(false);

  // open animation
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // smooth close helper
  const startClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose(); // parent -> closeModal (modalMode = null)
    }, ANIMATION_MS);
  };

  const handleOverlayMouseDown = (e) => {
    // শুধু overlay তে ক্লিক করলে close হবে
    if (e.target === e.currentTarget) {
      startClose();
    }
  };

  const handleSaveClick = () => {
    onSave();     // শুধু data save
    startClose(); // তারপর animation সহ close
  };

  const handleDeleteClick = () => {
    if (onDelete) onDelete(); // task delete
    startClose();             // তারপর close
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black/40 transition-opacity duration-${ANIMATION_MS} ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onMouseDown={handleOverlayMouseDown} // বাইরের ক্লিক
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md p-4 space-y-4 transform transition-all duration-${ANIMATION_MS} ${
          visible
            ? "scale-100 translate-y-0"
            : "scale-95 translate-y-3"
        }`}
        onMouseDown={(e) => e.stopPropagation()} // ভিতরে ক্লিক করলে overlay event বন্ধ
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button
            onClick={startClose}
            className="text-slate-500 hover:text-slate-800 text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3">
          {/* Problem ID */}
          <div>
            <label className="text-xs font-medium text-slate-600">
              Problem ID (e.g. 112)
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm mt-1 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
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
              className="w-full border rounded px-3 py-2 text-sm mt-1 min-h-[70px] outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none"
              value={task.title}
              onChange={(e) => onChangeField("title", e.target.value)}
              placeholder="Recording Feature in Enthrall IT course 01-01 Milestone"
            />
          </div>

          {/* Status / Column */}
          <div>
            <label className="text-xs font-medium text-slate-600">
              Status / Column
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
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
          </div>

          {/* Assign to */}
          <div>
            <label className="text-xs font-medium text-slate-600">
              Assign to
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
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
                    className={`px-2 py-1 rounded-full text-[11px] transition-all ${
                      active
                        ? `${tag.color} text-white shadow-sm`
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          {mode === "edit" ? (
            <button
              onClick={handleDeleteClick}
              className="text-xs text-red-600 hover:text-red-800 transition-colors"
            >
              Delete
            </button>
          ) : (
            <span />
          )}

          <div className="space-x-2">
            <button
              onClick={startClose}
              className="px-3 py-1.5 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97] transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
