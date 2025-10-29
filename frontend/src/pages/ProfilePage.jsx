import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUserProfile, fetchProfile } from "../slices/authSlice";
import { showToast } from "../utils/toast";
import EmailVerificationBanner from "../components/EmailVerificationBanner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { user, loading, error, isAuthenticated, saving } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    profile_picture: null,
  });

  const fallbackImg = (first, last) => {
    const text = encodeURIComponent(`${first}${last}`);
    return `https://placehold.co/150x150?text=${text}`;
  };

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        profile_picture: null,
      });
    } else {
      dispatch(fetchProfile()).catch(error => console.error('Failed to load profile:', error));
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
      showToast.success("Profile updated successfully!");
      setEditing(false);
      dispatch(fetchProfile());
    } catch (err) {
      showToast.error("Failed to update profile.");
    }
  };

  const profilePicUrl = formData.profile_picture
    ? (typeof formData.profile_picture === "string" ? formData.profile_picture : URL.createObjectURL(formData.profile_picture))
    : (user?.profile_picture ? (typeof user.profile_picture === "string" ? user.profile_picture : user.profile_picture.url) : fallbackImg(user?.first_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || "U", user?.last_name?.charAt(0)?.toUpperCase() || ""));

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              <div className="relative group">
                <img src={profilePicUrl} alt="Profile" onError={(e) => (e.target.src = fallbackImg("U", ""))} className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-xl" />
                {editing && (
                  <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}</h1>
                <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {user.is_email_verified ? "✓ Verified" : "⚠ Unverified"}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    Member since {new Date(user.date_joined).getFullYear()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {!editing ? (
                  <>
                    <button onClick={() => setEditing(true)} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button onClick={handleLogout} className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition shadow-lg hover:shadow-xl flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition shadow-lg disabled:opacity-50">
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => setEditing(false)} className="px-6 py-2 bg-gray-400 text-white rounded-xl font-medium hover:bg-gray-500 transition">
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Email Verification Banner */}
        <div className="mb-6">
          <EmailVerificationBanner />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <QuickAction icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label="Addresses" onClick={() => navigate("/user-profile")} color="blue" />
          <QuickAction icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>} label="Wallet" onClick={() => navigate("/user-profile")} color="green" />
          <QuickAction icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} label="Orders" onClick={() => navigate("/user-profile")} color="purple" />
          <QuickAction icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} label="Wishlist" onClick={() => navigate("/user-profile")} color="pink" />
        </div>

        {/* Profile Details */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ProfileField icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} label="Username" name="username" value={formData.username} editable={editing} onChange={handleChange} />
            <ProfileField icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} label="Email" name="email" value={formData.email} editable={editing} onChange={handleChange} />
            <ProfileField icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} label="First Name" name="first_name" value={formData.first_name} editable={editing} onChange={handleChange} />
            <ProfileField icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} label="Last Name" name="last_name" value={formData.last_name} editable={editing} onChange={handleChange} />
            <ProfileField icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} label="Phone Number" name="phone_number" value={formData.phone_number} editable={editing} onChange={handleChange} />
            <ProfileRow icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} label="Member Since" value={new Date(user.date_joined).toLocaleDateString()} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    pink: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
  };
  return (
    <button onClick={onClick} className={`bg-gradient-to-br ${colors[color]} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center gap-2`}>
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function ProfileField({ icon, label, name, value, editable, onChange }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {icon}
        {label}
      </label>
      {editable ? (
        <input type="text" name={name} value={value || ""} onChange={onChange} className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
      ) : (
        <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white font-medium">{value || "N/A"}</div>
      )}
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {icon}
        {label}
      </label>
      <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white font-medium">{value}</div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-pulse">
          <div className="h-32 bg-gray-300 dark:bg-gray-700"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end gap-6 -mt-16">
              <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return <div className="flex justify-center items-center min-h-screen text-red-500 text-lg font-semibold">{message}</div>;
}
