import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Video,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Smartphone,
  Monitor,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  getAllHomeBanners,
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
  toggleHomeBannerStatus,
} from "../api/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const DashboardHomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Status and Order
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);

  // Desktop media
  const [desktopFile, setDesktopFile] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState("");
  const [desktopType, setDesktopType] = useState("video"); // "image" or "video"
  const [desktopUrlInput, setDesktopUrlInput] = useState("");

  // Mobile media
  const [useSameForMobile, setUseSameForMobile] = useState(true);
  const [mobileFile, setMobileFile] = useState(null);
  const [mobilePreview, setMobilePreview] = useState("");
  const [mobileType, setMobileType] = useState("video"); // "image" or "video"
  const [mobileUrlInput, setMobileUrlInput] = useState("");

  // Delete modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Fetch all banners
  const fetchBanners = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const { data } = await getAllHomeBanners();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load home banners");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners(true);
  }, []);

  // Handle Desktop File Selection
  const handleDesktopFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Desktop file exceeds 100MB limit.");
      return;
    }

    setDesktopFile(file);
    const objectUrl = URL.createObjectURL(file);
    setDesktopPreview(objectUrl);
    setDesktopType(file.type.startsWith("video/") ? "video" : "image");
  };

  // Handle Mobile File Selection
  const handleMobileFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Mobile file exceeds 100MB limit.");
      return;
    }

    setMobileFile(file);
    const objectUrl = URL.createObjectURL(file);
    setMobilePreview(objectUrl);
    setMobileType(file.type.startsWith("video/") ? "video" : "image");
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentId(null);
    setIsActive(true);
    setOrder(0);

    setDesktopFile(null);
    setDesktopPreview("");
    setDesktopType("video");
    setDesktopUrlInput("");

    setMobileFile(null);
    setMobilePreview("");
    setMobileType("video");
    setMobileUrlInput("");

    setUseSameForMobile(true);
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (banner) => {
    setEditMode(true);
    setCurrentId(banner._id);
    setIsActive(banner.isActive ?? true);
    setOrder(banner.order || 0);

    setDesktopFile(null);
    setDesktopPreview(banner.desktopMediaUrl || "");
    setDesktopType(banner.desktopMediaType || "video");
    setDesktopUrlInput(banner.desktopMediaUrl || "");

    const hasDistinctMobile =
      banner.mobileMediaUrl &&
      banner.mobileMediaUrl !== banner.desktopMediaUrl;

    setUseSameForMobile(!hasDistinctMobile);
    setMobileFile(null);
    setMobilePreview(banner.mobileMediaUrl || "");
    setMobileType(banner.mobileMediaType || "video");
    setMobileUrlInput(banner.mobileMediaUrl || "");

    setShowModal(true);
  };

  // Submit Create or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editMode && !desktopFile && !desktopUrlInput) {
      toast.error("Please upload or enter a desktop video or image.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("isActive", isActive);
    formData.append("order", order);

    // Desktop Media
    if (desktopFile) {
      formData.append("desktopMedia", desktopFile);
    } else if (desktopUrlInput) {
      formData.append("desktopMediaUrl", desktopUrlInput);
      formData.append("desktopMediaType", desktopType);
    }

    // Mobile Media
    if (useSameForMobile) {
      if (!desktopFile && desktopUrlInput) {
        formData.append("mobileMediaUrl", desktopUrlInput);
        formData.append("mobileMediaType", desktopType);
      }
    } else {
      if (mobileFile) {
        formData.append("mobileMedia", mobileFile);
      } else if (mobileUrlInput) {
        formData.append("mobileMediaUrl", mobileUrlInput);
        formData.append("mobileMediaType", mobileType);
      }
    }

    try {
      if (editMode) {
        const { data } = await updateHomeBanner(currentId, formData);
        if (data.success) {
          toast.success("Home banner updated successfully!");
          setShowModal(false);
          fetchBanners();
        }
      } else {
        const { data } = await createHomeBanner(formData);
        if (data.success) {
          toast.success("Home banner uploaded successfully!");
          setShowModal(false);
          fetchBanners();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save banner");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (id) => {
    try {
      const { data } = await toggleHomeBannerStatus(id);
      if (data.success) {
        toast.success(data.message || "Banner status updated");
        setBanners((prev) =>
          prev.map((b) => (b._id === id ? { ...b, isActive: !b.isActive } : b))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle status");
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    try {
      const { data } = await deleteHomeBanner(id);
      if (data.success) {
        toast.success("Home banner deleted successfully");
        setDeleteConfirmId(null);
        fetchBanners();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/30">
              <Layers size={22} />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase flex items-center gap-2">
                Home Banner Media
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Upload & manage pure Video or Image banners for Desktop and Mobile view
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchBanners(true)}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold"
            title="Refresh banners"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-[#ccf141]" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#ccf141] text-black font-black text-xs uppercase tracking-wider rounded-xl hover:bg-lime-300 transition-all shadow-[0_0_20px_rgba(204,241,65,0.3)] cursor-pointer"
          >
            <Plus size={16} />
            Upload Banner Media
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-2xl bg-zinc-950/70 border border-[#ccf141]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="text-[#ccf141] shrink-0" size={20} />
          <div className="text-xs sm:text-sm text-zinc-300">
            <span className="text-white font-bold">Pure Media Mode:</span> Upload your promotional{" "}
            <span className="text-[#ccf141] font-semibold">Video</span> or{" "}
            <span className="text-[#ccf141] font-semibold">Image</span>. You can upload separate media for{" "}
            <span className="text-white font-semibold">Desktop</span> (widescreen 16:9) and{" "}
            <span className="text-white font-semibold">Mobile</span> (vertical 9:16) or use desktop media for both.
          </div>
        </div>
        <a
          href="/home"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#ccf141] hover:underline"
        >
          View Live Home <ExternalLink size={13} />
        </a>
      </div>

      {/* Banners Grid / List */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-zinc-900/40 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-zinc-950 border border-white/10 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
            <Video size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Banner Media Uploaded Yet</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Upload your high-definition video or image to display on the Home page banner!
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ccf141] text-black font-black text-xs uppercase rounded-xl hover:bg-lime-300 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Upload Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map((banner, index) => {
            const isDesktopVideo = banner.desktopMediaType === "video";
            const isMobileVideo = banner.mobileMediaType === "video";
            const hasCustomMobile =
              banner.mobileMediaUrl &&
              banner.mobileMediaUrl !== banner.desktopMediaUrl;

            return (
              <motion.div
                key={banner._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-300 ${
                  banner.isActive
                    ? "bg-zinc-950 border-[#ccf141]/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                    : "bg-zinc-950/60 border-white/10 opacity-70"
                }`}
              >
                {/* Media Preview Stage */}
                <div className="relative aspect-video w-full bg-black overflow-hidden group">
                  {isDesktopVideo ? (
                    <video
                      src={banner.desktopMediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={banner.desktopMediaUrl}
                      alt="Banner Desktop"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-md border border-white/20 text-white">
                        <Monitor size={12} className="text-[#ccf141]" />
                        {isDesktopVideo ? "Desktop Video" : "Desktop Image"}
                      </span>

                      {hasCustomMobile ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-md border border-[#ccf141]/30 text-[#ccf141]">
                          <Smartphone size={12} />
                          {isMobileVideo ? "Custom Mobile Video" : "Custom Mobile Image"}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-zinc-400 bg-black/60 backdrop-blur-md border border-white/10">
                          <Smartphone size={12} />
                          Auto-Scale on Mobile
                        </span>
                      )}
                    </div>

                    {/* Active toggle button */}
                    <button
                      onClick={() => handleToggleActive(banner._id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md ${
                        banner.isActive
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-zinc-800/80 text-zinc-400 border border-white/10"
                      }`}
                    >
                      {banner.isActive ? (
                        <>
                          <CheckCircle2 size={12} /> Active
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Inactive
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Banner Details & Action Footer */}
                <div className="p-4 sm:p-5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase text-zinc-400">
                      Banner #{index + 1}
                    </span>
                    <p className="text-xs text-zinc-500">
                      Priority Order: <strong className="text-white">{banner.order || 0}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit size={14} /> Change Media
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(banner._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl my-8 bg-zinc-950 border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-[#ccf141]/10 text-[#ccf141] border border-[#ccf141]/30">
                    {editMode ? <Edit size={18} /> : <Upload size={18} />}
                  </span>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white">
                      {editMode ? "Change Banner Media" : "Upload Home Banner Media"}
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Upload Video or Image for Desktop & Mobile view
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. DESKTOP MEDIA UPLOAD */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#ccf141] flex items-center gap-2">
                      <Monitor size={15} /> 1. Desktop Media (Video or Image)
                    </h4>
                    <span className="text-[10px] text-zinc-400">Max size 100MB</span>
                  </div>

                  {/* Dropzone / Upload button */}
                  <div
                    onClick={() => desktopInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-[#ccf141]/60 rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04] group"
                  >
                    <input
                      ref={desktopInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleDesktopFileChange}
                      className="hidden"
                    />

                    {desktopPreview ? (
                      <div className="space-y-3">
                        <div className="relative aspect-video max-h-56 mx-auto rounded-xl overflow-hidden border border-white/20 bg-black">
                          {desktopType === "video" ? (
                            <video
                              src={desktopPreview}
                              controls
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <img
                              src={desktopPreview}
                              alt="Desktop Preview"
                              className="w-full h-full object-contain"
                            />
                          )}
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/80 text-[#ccf141] border border-[#ccf141]/30">
                            {desktopType}
                          </span>
                        </div>
                        <p className="text-xs text-[#ccf141] font-semibold">
                          Click to select a different desktop file
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-[#ccf141] transition-colors">
                          <Upload size={22} />
                        </div>
                        <p className="text-xs font-semibold text-white">
                          Click to upload Desktop Video (MP4/WebM) or Image (JPG/PNG/WebP)
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          Recommended format: 1920x1080 (16:9 widescreen)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Or direct URL */}
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-1">
                      Or paste an existing Media URL:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={desktopUrlInput}
                        onChange={(e) => {
                          setDesktopUrlInput(e.target.value);
                          if (!desktopFile && e.target.value) {
                            setDesktopPreview(e.target.value);
                            setDesktopType(
                              e.target.value.match(/\.(mp4|webm|mov)(\?.*)?$/i)
                                ? "video"
                                : "image"
                            );
                          }
                        }}
                        placeholder="https://... (Direct Video or Image URL)"
                        className="flex-grow px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#ccf141]"
                      />
                      <select
                        value={desktopType}
                        onChange={(e) => setDesktopType(e.target.value)}
                        className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="video">Video</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. MOBILE MEDIA UPLOAD */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#ccf141] flex items-center gap-2">
                      <Smartphone size={15} /> 2. Mobile Media (Optional)
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={useSameForMobile}
                        onChange={(e) => setUseSameForMobile(e.target.checked)}
                        className="w-4 h-4 accent-[#ccf141] rounded cursor-pointer"
                      />
                      <span>Use Desktop Media for Mobile</span>
                    </label>
                  </div>

                  {!useSameForMobile && (
                    <div className="space-y-3 pt-1">
                      <div
                        onClick={() => mobileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/20 hover:border-[#ccf141]/60 rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04] group"
                      >
                        <input
                          ref={mobileInputRef}
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMobileFileChange}
                          className="hidden"
                        />

                        {mobilePreview ? (
                          <div className="space-y-3">
                            <div className="relative aspect-[9/16] max-h-56 mx-auto rounded-xl overflow-hidden border border-white/20 bg-black">
                              {mobileType === "video" ? (
                                <video
                                  src={mobilePreview}
                                  controls
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <img
                                  src={mobilePreview}
                                  alt="Mobile Preview"
                                  className="w-full h-full object-contain"
                                />
                              )}
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/80 text-[#ccf141] border border-[#ccf141]/30">
                                {mobileType}
                              </span>
                            </div>
                            <p className="text-xs text-[#ccf141] font-semibold">
                              Click to select a different mobile file
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-[#ccf141] transition-colors">
                              <Smartphone size={22} />
                            </div>
                            <p className="text-xs font-semibold text-white">
                              Upload Vertical Video (9:16) or Mobile Image for phone screens
                            </p>
                            <p className="text-[10px] text-zinc-400">
                              Recommended: 1080x1920 portrait
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Or direct mobile URL */}
                      <div>
                        <span className="text-[10px] text-zinc-400 block mb-1">
                          Or paste Mobile Media URL:
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={mobileUrlInput}
                            onChange={(e) => {
                              setMobileUrlInput(e.target.value);
                              if (!mobileFile && e.target.value) {
                                setMobilePreview(e.target.value);
                                setMobileType(
                                  e.target.value.match(/\.(mp4|webm|mov)(\?.*)?$/i)
                                    ? "video"
                                    : "image"
                                );
                              }
                            }}
                            placeholder="https://... (Mobile video or image link)"
                            className="flex-grow px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#ccf141]"
                          />
                          <select
                            value={mobileType}
                            onChange={(e) => setMobileType(e.target.value)}
                            className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none cursor-pointer"
                          >
                            <option value="video">Video</option>
                            <option value="image">Image</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. SETTINGS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActiveBanner"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-[#ccf141] rounded cursor-pointer"
                    />
                    <label
                      htmlFor="isActiveBanner"
                      className="text-xs font-semibold text-white cursor-pointer select-none"
                    >
                      Active on Home Page immediately
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Priority Order
                    </label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#ccf141]"
                    />
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ccf141] text-black text-xs font-black uppercase tracking-wider hover:bg-lime-300 transition-all cursor-pointer shadow-[0_0_20px_rgba(204,241,65,0.3)] disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Uploading to S3...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        {editMode ? "Update Media" : "Save & Publish Media"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-zinc-950 border border-red-500/30 rounded-3xl p-6 space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
                <Trash2 size={22} />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-white uppercase">
                  Delete Banner Media?
                </h3>
                <p className="text-xs text-zinc-400">
                  This will permanently delete this banner and remove all media files from storage.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardHomeBanner;
