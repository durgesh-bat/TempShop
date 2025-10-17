import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/auth/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
        const data = await res.json();
        setUser(data);
      })
      .catch(() => setError("Failed to load profile data."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-300 text-lg">
        Loading your profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-black transition-all duration-300">
      
     

      {/* Profile Content */}
      <div className="flex justify-center items-start py-16">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-600 dark:text-gray-300">
              {user.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-center">{user.username}</h2>
          </div>

          <div className="space-y-3">
            <ProfileRow label="Email" value={user.email || "N/A"} />
            <ProfileRow label="First Name" value={user.first_name || "N/A"} />
            <ProfileRow label="Last Name" value={user.last_name || "N/A"} />
            <ProfileRow
              label="Joined"
              value={new Date(user.date_joined).toLocaleDateString()}
            />
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:scale-105 hover:shadow-lg transition-transform"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between bg-gray-200 dark:bg-gray-800 p-3 rounded-xl">
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
      <span className="text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}
