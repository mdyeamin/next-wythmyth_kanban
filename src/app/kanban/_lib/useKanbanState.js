"use client";

import { useEffect, useState } from "react";
import { STORAGE_KEY } from "./kanbanConfig";

const createEmptyTask = (status = "") => ({
  id: "",
  issueId: "",
  title: "",
  assigneeId: "",
  status,
  tags: [],
});

// এই hook-এ সব state + logic রাখা হয়েছে
export function useKanbanState() {
  const [tasks, setTasks] = useState(null); // null = এখনো লোড হয়নি
  const [modalMode, setModalMode] = useState(null); // "create" | "edit" | null
  const [modalTask, setModalTask] = useState(createEmptyTask());

  // 🔄 localStorage থেকে লোড
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        setTasks([]);
      }
    } else {
      setTasks([]);
    }
  }, []);

  // 💾 localStorage এ save
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (tasks === null) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // modal helpers
  const openCreateModal = (columnId) => {
    setModalMode("create");
    setModalTask(createEmptyTask(columnId));
  };

  const openEditModal = (task) => {
    setModalMode("edit");
    setModalTask({
      id: task.id,
      issueId: task.issueId ?? "",
      title: task.title ?? "",
      assigneeId: task.assigneeId ?? "",
      status: task.status,
      tags: task.tags ?? [],
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setModalTask(createEmptyTask());
  };

  const updateModalField = (field, value) => {
    setModalTask((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTagOnModalTask = (tagId) => {
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

  const saveModalTask = () => {
    if (!modalTask.title.trim() || !modalTask.status) return;

    if (modalMode === "create") {
      const newTask = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(),
        issueId: modalTask.issueId.trim(),
        title: modalTask.title.trim(),
        assigneeId: modalTask.assigneeId,
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
                issueId: modalTask.issueId.trim(),
                title: modalTask.title.trim(),
                assigneeId: modalTask.assigneeId,
                status: modalTask.status,
                tags: modalTask.tags,
              }
            : task
        )
      );
    }

    // ❌ এখানে আর closeModal নয়, close করবে TaskModal নিজে
  };

  const deleteModalTask = () => {
    if (!modalTask.id) return;
    setTasks((prev) => prev.filter((task) => task.id !== modalTask.id));

    // এটাও modal নিজে বন্ধ করবে, তাই এখানে closeModal লাগবে না
  };

  // drag & drop
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    setTasks((prev) => {
      const tasks = [...prev];

      const sourceColId = source.droppableId;
      const destColId = destination.droppableId;

      // যে task টা drag হয়েছে তাকে বের করি
      const fromIndexGlobal = tasks.findIndex((t) => t.id === draggableId);
      if (fromIndexGlobal === -1) return prev;

      const draggedTask = tasks[fromIndexGlobal];

      // আগে global array থেকে এই task-টা বের করে দেই
      tasks.splice(fromIndexGlobal, 1);

      // এখন গন্তব্য column-এর সব task-এর global index বের করি
      const destIndexes = tasks
        .map((t, i) => (t.status === destColId ? i : -1))
        .filter((i) => i !== -1);

      let insertIndexGlobal;
      if (destIndexes.length === 0) {
        // ওই column-এ আগে কিছুই নেই → array এর শেষে add
        insertIndexGlobal = tasks.length;
      } else if (destination.index >= destIndexes.length) {
        // column-এর একেবারে শেষে drop করা হয়েছে
        insertIndexGlobal = destIndexes[destIndexes.length - 1] + 1;
      } else {
        // column-এর মাঝখানে বা উপর দিকে drop করা হয়েছে
        insertIndexGlobal = destIndexes[destination.index];
      }

      // status update করে নতুন জায়গায় বসিয়ে দেই
      tasks.splice(insertIndexGlobal, 0, {
        ...draggedTask,
        status: destColId,
      });

      return tasks;
    });
  };

  return {
    tasks,
    modalMode,
    modalTask,
    // modal actions
    openCreateModal,
    openEditModal,
    closeModal,
    updateModalField,
    toggleTagOnModalTask,
    saveModalTask,
    deleteModalTask,
    // dnd
    handleDragEnd,
  };
}
