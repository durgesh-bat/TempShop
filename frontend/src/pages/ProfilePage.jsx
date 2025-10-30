import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUserProfile, fetchProfile } from "../slices/authSlice";
import { logoutUser } from "../api/authApi";
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

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error('Logout failed:', err);
      dispatch(logout());
      navigate("/login");
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <img src={profilePicUrl} alt="Profile" onError={(e) => (e.target.src = fallbackImg("U", ""))} className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700" />
              {editing && (
                <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}</h1>
              <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
              {user.is_email_verified && <span className="inline-block mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">✓ Verified</span>}
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <>
                  <button onClick={() => setEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Edit</button>
                  <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>

        <EmailVerificationBanner />

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <QuickAction icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} label="Orders" onClick={() => navigate("/orders")} color="purple" />
          <QuickAction icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label="Addresses" onClick={() => navigate("/user-profile?tab=addresses")} color="blue" />
          <QuickAction icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} label="Wishlist" onClick={() => navigate("/user-profile?tab=wishlist")} color="pink" />
          <QuickAction icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>} label="Wallet" onClick={() => navigate("/user-profile?tab=wallet")} color="green" />
        </div>

        {/* Profile Info */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ProfileField label="Username" name="username" value={formData.username} editable={editing} onChange={handleChange} />
            <ProfileField label="Email" name="email" value={formData.email} editable={editing} onChange={handleChange} />
            <ProfileField label="First Name" name="first_name" value={formData.first_name} editable={editing} onChange={handleChange} />
            <ProfileField label="Last Name" name="last_name" value={formData.last_name} editable={editing} onChange={handleChange} />
            <ProfileField label="Phone" name="phone_number" value={formData.phone_number} editable={editing} onChange={handleChange} />
            <div><label className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</label><div className="mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">{new Date(user.date_joined).toLocaleDateString()}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick, color }) {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    pink: "bg-pink-600 hover:bg-pink-700",
  };
  return (
    <button onClick={onClick} className={`${colors[color]} text-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center gap-2`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function ProfileField({ label, name, value, editable, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>
      {editable ? (
        <input type="text" name={name} value={value || ""} onChange={onChange} className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
      ) : (
        <div className="mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">{value || "N/A"}</div>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return <div className="flex justify-center items-center min-h-screen text-red-500 text-lg font-semibold">{message}</div>;
}
