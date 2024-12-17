import React, { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import { MdRemoveRedEye } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import TaskModal from "./components/TaskModal";
import ViewTaskModal from "./components/ViewTaskModal"; // Import the new ViewTaskModal
import {
  getTasksAPI,
  deleteTaskAPI,
  createTaskAPI,
  updateTaskAPI,
} from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [tasksPerPage] = useState(3); // Number of tasks per page

  const fetchTasks = async () => {
    const response = await getTasksAPI();
    setTasks(response.data);
  };

  const deleteTask = async (taskId) => {
    await deleteTaskAPI(taskId);
    fetchTasks();
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate).toISOString().split("T")[0],
      status: task.status,
    });
  };

  const openCreateModal = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateTask = async () => {
    await createTaskAPI(formData);
    setIsCreateModalOpen(false);
    fetchTasks();
  };

  const handleUpdateTask = async () => {
    await updateTaskAPI(editTask._id, formData);
    setEditTask(null);
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container bg-gray-100 mx-auto p-6 rounded-lg">
        <div className="flex justify-between p-2 mb-8 rounded-lg">
          <div className="flex gap-4 items-center">
            <img src={logo} width={50} alt="logo" />
            <h1 className="text-2xl font-bold text-center">
              Task Management App
            </h1>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Create Task
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title or description"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Due Date: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    task.status === "Completed"
                      ? "text-green-600"
                      : task.status === "In Progress"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {task.status}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4 space-x-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setViewTask(task)} // View Task
                    className="flex gap-2 items-center bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200"
                  >
                    <MdRemoveRedEye size={20} />
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(task)} // Edit Task
                    className="flex gap-2 items-center bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200"
                  >
                    <MdEdit size={20} />
                    Edit
                  </button>
                </div>
                <button
                  onClick={() => deleteTask(task._id)} // Delete Task
                  className="bg-white border-2 border-black-600 px-2 py-2 rounded-md hover:border-red-600 transition duration-200"
                >
                  <MdDelete color="red" size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              } transition duration-200`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        taskData={null}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateTask}
        onClose={() => setIsCreateModalOpen(false)}
        action="create"
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={editTask !== null}
        taskData={editTask}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateTask}
        onClose={() => setEditTask(null)}
        action="edit"
      />

      {/* View Task Modal */}
      <ViewTaskModal
        isOpen={viewTask !== null}
        taskData={viewTask}
        onClose={() => setViewTask(null)}
      />
    </div>
  );
}

export default App;
