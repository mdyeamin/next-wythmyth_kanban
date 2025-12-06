"use client";

import {
  TAG_OPTIONS,
  ASSIGNEE_AVATAR_URL,
  getAssigneeName,
} from "../_lib/kanbanConfig";

function TagList({ tags }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {tags.map((tagId) => {
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
}

function Avatar({ assigneeId }) {
  const assigneeName = getAssigneeName(assigneeId);

  if (!assigneeName) {
    return (
      <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-semibold text-slate-700">
        ?
      </div>
    );
  }

  return (
    <img
      src={ASSIGNEE_AVATAR_URL}
      alt={assigneeName}
      title={assigneeName}
      className="w-4 h-4 rounded-full object-cover border border-slate-300"
    />
  );
}

function HeaderLine({ issueId }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-slate-600">
      <span className="w-4 h-4 rounded-full border border-emerald-500 flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-semibold">
        Enthrall-IT{" "}
        {issueId ? (
          <span>#{issueId}</span>
        ) : (
          <span className="text-slate-400">#ID</span>
        )}
      </span>
    </div>
  );
}

export default function TaskCard({ task, onClick, draggableProps }) {
  return (
    <div
      className="bg-white rounded shadow p-2 text-xs md:text-sm cursor-pointer hover:bg-slate-50"
      onClick={onClick}
      ref={draggableProps.innerRef}
      {...draggableProps.draggableProps}
      {...draggableProps.dragHandleProps}
    >
      <div className="flex items-start justify-between mb-1">
        <HeaderLine issueId={task.issueId} />
        <Avatar assigneeId={task.assigneeId} />
      </div>

      <div className="text-[12px] leading-snug">
        {task.title || (
          <span className="text-slate-400">(No title)</span>
        )}
      </div>

      <TagList tags={task.tags} />
    </div>
  );
}
