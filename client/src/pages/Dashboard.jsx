function Dashboard() {
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
    </div>
  );
}

export default Dashboard;
