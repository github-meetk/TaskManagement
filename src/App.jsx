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
  const [tasksPerPage] = useState(6); // Number of tasks per page

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
        <div className="flex flex-col md:flex-row justify-between p-4 mb-8 rounded-lg">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <img src={logo} width={50} alt="logo" />
            <h1 className="text-md font-bold text-center md:text-left sm:text-2xl md:text-2xl">
              Task Management App
            </h1>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200 w-full md:w-auto"
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
        {currentTasks.length === 0 ? (
          <div className="text-center text-lg text-gray-500">
            No Tasks Found!!
          </div>
        ) : (
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
        )}

        {/* Pagination Controls */}
        {currentTasks.length !== 0 && (
          <div
            className="flex justify-between items-center gap-x-1 mt-6"
            aria-label="Pagination"
          >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-black hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Previous"
            >
              <svg
                className="text-black shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span aria-hidden="true" className="text-black hidden sm:block">
                Previous
              </span>
            </button>
            <div className="flex items-center gap-x-1">
              <span className="min-h-[38px] min-w-[38px] flex justify-center items-center border border-gray-300 text-black py-2 px-3 text-sm rounded-lg">
                {currentPage}
              </span>
              <span className="min-h-[38px] flex justify-center items-center text-gray-500 py-2 px-1.5 text-sm dark:text-neutral-500">
                of
              </span>
              <span className="min-h-[38px] flex justify-center items-center text-black py-2 px-1.5 text-sm">
                {totalPages}
              </span>
            </div>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-black hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span aria-hidden="true" className="hidden sm:block">
                Next
              </span>
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
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
