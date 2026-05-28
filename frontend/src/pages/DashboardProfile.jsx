import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Phone,
  Camera,
  Save,
  Trash2,
  Shield,
  Edit3,
  Award,
} from "lucide-react";
import { updateProfile } from "../api/api";
import { toast } from "react-hot-toast";

const DashboardProfile = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  // Profile form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Image states
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  // Initialize fields with current context user details
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setDob(user.dob || "");
      setContactNumber(user.contactNumber || "");
      setImagePreview(user.profileImage || "");
    }
  }, [user]);

  // Handle Avatar selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should not exceed 5MB");
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      toast.success("Image selected! Click Save to upload.");
    }
  };

  // Trigger file picker
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Reset/Remove Profile Image preview
  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setImagePreview("");
    // If user already had a profile photo, we mark it as removed
    toast.success("Avatar preview removed. Save to apply changes.");
  };

  // Submit Profile update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name field is required");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Updating your profile details...");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("username", username.trim());
      formData.append("dob", dob);
      formData.append("contactNumber", contactNumber.trim());

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imagePreview === "") {
        // If image was explicitly removed
        formData.append("profileImage", "");
      }

      const { data } = await updateProfile(formData);

      if (data.success) {
        toast.success("Profile updated successfully!", { id: toastId });
        setUser(data.user);
        setSelectedFile(null);
      } else {
        toast.error(data.message || "Failed to update profile", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Server error while updating profile",
        { id: toastId },
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#050505] min-h-screen text-white relative">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#defb02]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        {/* Title Header */}
        <div className="text-left">
          <h1
            className="text-2xl md:text-3xl font-black uppercase tracking-wide text-white"
            style={{ fontFamily: '"Brutal Font", sans-serif' }}
          >
            Account Profile
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Configure your profile settings, upload a custom profile image, and
            manage your credentials.
          </p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Quick Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:col-span-1 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden"
          >
            {/* Design accents */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#defb02]/5 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#defb02]/5 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-6 w-full flex flex-col items-center">
              {/* Profile Avatar Frame */}
              <div className="relative group w-32 h-32">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#defb02]/30 via-transparent to-[#defb02]/10 border-2 border-white/10 flex items-center justify-center overflow-hidden relative shadow-2xl">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-gray-600" />
                  )}
                </div>

                {/* Edit overlay trigger */}
                <button
                  onClick={triggerFileSelect}
                  className="absolute bottom-1 right-1 p-2 bg-[#defb02] hover:bg-[#defb02]/80 text-black rounded-full border border-black transition-all cursor-pointer shadow-lg hover:scale-105"
                  title="Upload profile picture"
                >
                  <Camera size={16} />
                </button>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {/* Action Buttons below Avatar */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={triggerFileSelect}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-semibold tracking-wider transition-colors border border-white/5 cursor-pointer"
                >
                  Change Image
                </button>
                {imagePreview && (
                  <button
                    onClick={handleRemovePhoto}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full border border-red-500/10 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              {/* User Bio and Role status */}
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white uppercase tracking-wide">
                  {name || "Box & Cross User"}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  @{username || "username"}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mt-2">
                  <Shield size={12} className="text-[#defb02]" />
                  <span className="text-[10px] text-[#defb02] font-black uppercase tracking-wider">
                    {user?.role || "Member"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Columns: Profile Fields Editing Form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8"
          >
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                <Edit3 size={18} className="text-[#defb02]" />
                <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-[#defb02]">
                  Edit Profile Fields
                </span>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Your full name"
                      className="w-full h-12 bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 text-xs font-semibold outline-none focus:border-[#defb02] transition-colors"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Username
                  </label>
                  <div className="relative">
                    <Edit3
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="w-full h-12 bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 text-xs font-semibold outline-none focus:border-[#defb02] transition-colors"
                    />
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative opacity-60">
                    <Mail
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      placeholder="your.email@domain.com"
                      className="w-full h-12 bg-black border border-white/5 text-gray-400 rounded-xl pl-11 pr-4 text-xs font-semibold outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      placeholder="e.g. YYYY-MM-DD or DD/MM/YYYY"
                      className="w-full h-12 bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 text-xs font-semibold outline-none focus:border-[#defb02] transition-colors"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="space-y-1.5 text-left sm:col-span-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Enter mobile or contact number"
                      className="w-full h-12 bg-white/[0.03] border border-white/10 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 text-xs font-semibold outline-none focus:border-[#defb02] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end border-t border-white/5 gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 bg-[#defb02] hover:bg-[#defb02]/90 hover:scale-[1.02] active:scale-95 text-black font-extrabold uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-[#defb02]/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={14} />
                  {saving ? "Saving Changes..." : "Save Profile Details"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
