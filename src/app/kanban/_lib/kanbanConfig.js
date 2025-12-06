// সব column
export const COLUMNS = [
  { id: "todo", title: "To do" },
  { id: "in_progress", title: "In progress" },
  { id: "testing", title: "Testing" },
  { id: "done", title: "Done" },
  { id: "ready_for_deploy", title: "Ready For Deployment" },
];

// সব tag অপশন
export const TAG_OPTIONS = [
  { id: "development", label: "Development", color: "bg-orange-500" },
  { id: "bug", label: "Bug", color: "bg-red-500" },
  { id: "high", label: "High", color: "bg-red-400" },
  { id: "medium", label: "Medium", color: "bg-yellow-400" },
  { id: "low", label: "Low", color: "bg-green-400" },
  { id: "major", label: "Major", color: "bg-purple-500" },
];

// যাদের assign করা যাবে
export const ASSIGNEES = [
  { id: "rayhun", name: "Rayhun" },
  { id: "sakib", name: "Sakib" },
  { id: "yeamin", name: "Yeamin" },
  { id: "timon mridha", name: "Rimon Mridha" },
];

// static avatar image
export const ASSIGNEE_AVATAR_URL =
  "https://static.vecteezy.com/system/resources/thumbnails/004/753/002/small/custom-coding-icon-shadowed-detailed-custom-coding-logo-free-vector.jpg";

// localStorage key
export const STORAGE_KEY = "wythmyth_kanban_tasks_v1";

// helper: assignee id → name
export const getAssigneeName = (assigneeId) =>
  ASSIGNEES.find((a) => a.id === assigneeId)?.name || "";
