import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, verifyAuthToken, updateUserProfile } from "../slices/authSlice";

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { user, loading, error, isAuthenticated, saving } = useSelector((state) => state.auth);

  const fallbackImg = "https://via.placeholder.com/150?text=Profile";

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    profile_picture: null,
  });

  // Load user data into form
  useEffect(() => {
    if (!user) dispatch(verifyAuthToken());
    else {
      setFormData({
        username: user.user?.username || "",
        email: user.user?.email || "",
        first_name: user.user?.first_name || "",
        last_name: user.user?.last_name || "",
        profile_picture: null,
      });
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profile_picture: e.target.files[0] });
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      await dispatch(updateUserProfile(data)).unwrap();
      alert("✅ Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile.");
    }
  };
  // Determine what to show in profile image
const profilePicUrl = formData.profile_picture
  ? typeof formData.profile_picture === "string"
    ? formData.profile_picture // existing URL from backend
    : URL.createObjectURL(formData.profile_picture) // newly selected file
  : user.profile_picture;


  if (loading) return <LoadingScreen message="Loading your profile..." />;
  if (error) return <ErrorScreen message={error} />;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black px-6 py-12">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-lg transition-all duration-300">
        {/* Profile Image */}
        <div className="flex flex-col items-center relative">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <img
              src={profilePicUrl}
              alt="Profile"
              onError={(e) => (e.target.src = fallbackImg)}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-700 shadow-md"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm rounded-full transition">
              📸 Change
            </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <h2 className="mt-4 text-3xl font-bold text-center text-gray-800 dark:text-white">{formData.username || "User"}</h2>
        </div>

        {/* Editable Form */}
        <div className="mt-8 space-y-4">
          <ProfileField label="Username" name="username" value={formData.username} editable={editing} onChange={handleChange} />
          <ProfileField label="Email" name="email" value={formData.email} editable={editing} onChange={handleChange} />
          <ProfileField label="First Name" name="first_name" value={formData.first_name} editable={editing} onChange={handleChange} />
          <ProfileField label="Last Name" name="last_name" value={formData.last_name} editable={editing} onChange={handleChange} />
          <ProfileRow
            label="Joined"
            value={user?.user?.date_joined ? new Date(user.user.date_joined).toLocaleDateString() : "N/A"}
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-between gap-4">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-70">
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={() => setEditing(false)} className="flex-1 bg-gray-400 dark:bg-gray-700 text-white py-2 rounded-xl font-semibold hover:bg-gray-500 dark:hover:bg-gray-600 transition">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
                ✏️ Edit Profile
              </button>
              <button onClick={handleLogout} className="flex-1 bg-red-600 text-white py-2 rounded-xl font-semibold hover:bg-red-700 transition">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable field
function ProfileField({ label, name, value, editable, onChange }) {
  return (
    <div>
      <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">{label}</label>
      {editable ? (
        <input type="text" name={name} value={value || ""} onChange={onChange} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
      ) : (
        <div className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-white">{value || "N/A"}</div>
      )}
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div>
      <label className="block text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">{label}</label>
      <div className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-white">{value}</div>
    </div>
  );
}

function LoadingScreen({ message }) {
  return <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-300 text-lg">{message}</div>;
}

function ErrorScreen({ message }) {
  return <div className="flex justify-center items-center min-h-screen text-red-500 text-lg font-semibold">{message}</div>;
}
