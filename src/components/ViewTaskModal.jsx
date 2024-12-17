import React from "react";
import { CiCircleRemove } from "react-icons/ci";

function ViewTaskModal({ isOpen, taskData, onClose }) {
  if (!isOpen || !taskData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Task Details</h2>
          <CiCircleRemove size={40} onClick={onClose} />
        </div>
        <p className="mb-2">
          <strong>Title:</strong> {taskData.title}
        </p>
        <p className="mb-2">
          <strong>Description:</strong> {taskData.description}
        </p>
        <p className="mb-2">
          <strong>Due Date:</strong> {new Date(taskData.dueDate).toDateString()}
        </p>
        <p className="mb-4">
          <strong>Status:</strong> {taskData.status}
        </p>
      </div>
    </div>
  );
}

export default ViewTaskModal;
