import React from "react";
import { CiCircleRemove } from "react-icons/ci";

const TaskModal = ({
  isOpen,
  taskData,
  formData,
  setFormData,
  onSubmit,
  onClose,
  action,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {action === "create" ? "Create Task" : "Edit Task"}
          </h2>

          <CiCircleRemove size={40} onClick={onClose} />
        </div>

        <label className="block mb-2">
          Title:
          <input
            type="text"
            placeholder="Enter Name"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Description:
          <textarea
            value={formData.description}
            placeholder="Enter Description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          ></textarea>
        </label>
        <label className="block mb-2">
          Due Date:
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-4">
          Status:
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <div className="flex justify-end">
          <button
            onClick={() => onSubmit(taskData)}
            className="bg-gray-100 text-black hover:bg-gray-200 transition duration-200 px-4 py-2 rounded-md"
          >
            {action === "create" ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
