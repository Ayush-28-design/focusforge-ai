import { useState } from "react";

function Dashboard() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Welcome to FocusForge AI 🚀</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none"
        />

        <button
          onClick={() => {
            if (task.trim() === "") return;

            setTasks([...tasks, task]);
            setTask("");
          }}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-2">Tasks</h2>
          <p>Manage your productivity tasks.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-2">AI Insights</h2>
          <p>Get smart productivity suggestions.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-2">Analytics</h2>
          <p>Track your progress and focus.</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>

        <div className="space-y-3">
          {tasks.map((t, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-xl flex justify-between"
            >
              <span>{t}</span>

              <button
                onClick={() => {
                  const updatedTasks = tasks.filter((_, i) => i !== index);
                  setTasks(updatedTasks);
                }}
                className="bg-red-500 px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
