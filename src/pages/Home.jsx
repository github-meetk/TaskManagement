import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { MdRemoveRedEye, MdEdit, MdDelete } from "react-icons/md";
import TaskModal from "../components/TaskModal";
import ViewTaskModal from "../components/ViewTaskModal";
import {
  getTasksAPI,
  deleteTaskAPI,
  createTaskAPI,
  updateTaskAPI,
} from "../services/taskService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {
  const { token, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // New state for filtering by status
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const fetchTasks = async () => {
    setLoading(true);
    const response = await getTasksAPI();
    setTasks(response.data);
    setLoading(false);
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
    setFormErrors({});
  };

  const handleCreateTask = async () => {
    if (validateForm()) {
      await createTaskAPI(formData);
      setIsCreateModalOpen(false);
      fetchTasks();
    }
  };

  const handleUpdateTask = async () => {
    if (validateForm()) {
      await updateTaskAPI(editTask._id, formData);
      setEditTask(null);
      fetchTasks();
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Title is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.dueDate) errors.dueDate = "Due Date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Filter tasks by search query and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
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
        <div className="flex flex-row justify-between p-4 mb-8 rounded-lg">
          <div className="flex items-center gap-4">
            <img className="m-auto" src={logo} width={50} alt="logo" />
            <h1 className="text-md hidden sm:block font-bold text-center md:text-left sm:text-2xl md:text-2xl">
              Task Management App
            </h1>
          </div>
          <div className="flex gap-2">
            {token && (
              <button
                onClick={() => navigate("/profile")}
                className="m-2 flex border-2 border-white bg-white p-2.5 rounded-full items-center justify-center gap-3 text-black hover:border-2 hover:border-black  transition-transform transform hover:scale-105"
              >
                <img src={userData.image} width={30} alt="Profile" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full flex justify-between gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by title or description"
            className="w-5/6 p-2 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={openCreateModal}
            className="w-1/6 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200 w-auto md:w-auto"
          >
            Create Task
          </button>
        </div>

        {/* Status Filter */}
        <div className="mb-4 flex items-center gap-4 justify-end">
          <label className="text-sm font-semibold">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
              <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full" />
            </div>
          </div>
        ) : (
          <div>
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
          </div>
        )}

        {/* Pagination Controls */}
        {currentTasks.length !== 0 && !loading && (
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
      {isCreateModalOpen && (
        <TaskModal
          formData={formData}
          setFormData={setFormData}
          handleCreateTask={handleCreateTask}
          formErrors={formErrors}
          setIsCreateModalOpen={setIsCreateModalOpen}
        />
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <TaskModal
          formData={formData}
          setFormData={setFormData}
          handleUpdateTask={handleUpdateTask}
          formErrors={formErrors}
          setIsCreateModalOpen={setIsCreateModalOpen}
          isEdit={true}
        />
      )}

      {/* View Task Modal */}
      {viewTask && <ViewTaskModal task={viewTask} setViewTask={setViewTask} />}
    </div>
  );
}

export default Home;
