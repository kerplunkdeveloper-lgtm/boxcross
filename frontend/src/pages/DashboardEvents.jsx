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
} from "lucide-react";
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../api/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const DashboardEvents = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form states (simplified to only Media, Title, and Description)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [previewType, setPreviewType] = useState(""); // "image" or "video"

  const fileInputRef = useRef(null);

  // Fetch banners on load
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await getAllBanners();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle file select and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("File is too large. Max size is 100MB.");
      return;
    }

    setMediaFile(file);
    const objectUrl = URL.createObjectURL(file);
    setMediaPreview(objectUrl);

    if (file.type.startsWith("video/")) {
      setPreviewType("video");
    } else {
      setPreviewType("image");
    }
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentId(null);
    setTitle("");
    setDescription("");
    setMediaFile(null);
    setMediaPreview("");
    setPreviewType("");
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (banner) => {
    setEditMode(true);
    setCurrentId(banner._id);
    setTitle(banner.title);
    setDescription(banner.description || "");
    setMediaFile(null);
    setMediaPreview(banner.mediaUrl);
    setPreviewType(banner.mediaType);
    setShowModal(true);
  };

  // Handle Submit (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!editMode && !mediaFile) {
      toast.error("Please upload an image or video file");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(
      editMode ? "Updating banner..." : "Creating banner...",
    );

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      let res;
      if (editMode) {
        res = await updateBanner(currentId, formData);
      } else {
        res = await createBanner(formData);
      }

      if (res.data.success) {
        toast.success(res.data.message || "Saved successfully!", {
          id: toastId,
        });
        setShowModal(false);
        fetchBanners();
      } else {
        toast.error(res.data.message || "Failed to save banner", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while uploading. Please check files and credentials.",
        { id: toastId },
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event banner? This will also delete it from Cloudinary.",
      )
    ) {
      return;
    }

    const toastId = toast.loading("Deleting banner...");
    try {
      const { data } = await deleteBanner(id);
      if (data.success) {
        toast.success("Banner deleted successfully", { id: toastId });
        fetchBanners();
      } else {
        toast.error("Failed to delete banner", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete banner", { id: toastId });
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[var(--db-bg)] text-[var(--db-text)] transition-colors">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#e5ff00]/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--db-card-border)]">
          <div>
            <h1
              className="text-md md:text-xl font-black uppercase tracking-wide text-[var(--db-accent-highlight)]"
              style={{ fontFamily: '"Brutal Font", sans-serif' }}
            >
              Event Banner Manager
            </h1>
            <p className="text-[var(--db-text-muted)] text-xs md:text-sm mt-1">
              Upload and manage event banners (only Media, Title, and
              Description) displayed dynamically on the events page.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchBanners}
              className="p-3 bg-[var(--db-input-bg)] hover:bg-[var(--db-sidebar-link-hover)] text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-xl border border-[var(--db-input-border)] transition-all flex items-center justify-center cursor-pointer"
              title="Reload data"
            >
              <RefreshCw
                size={18}
                className={
                  loading
                    ? "animate-spin text-[var(--db-accent-highlight)]"
                    : ""
                }
              />
            </button>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-[var(--db-accent)] text-[var(--db-accent-text)] font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-xl shadow-lg shadow-[var(--db-accent-glow)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Banner
            </button>
          </div>
        </div>

        {/* Content list (TABLE instead of CARDS) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2
              className="animate-spin text-[var(--db-accent-highlight)]"
              size={36}
            />
            <p className="text-xs uppercase tracking-widest text-[var(--db-text-muted)] font-bold">
              Fetching banner records...
            </p>
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <ImageIcon size={48} className="text-[var(--db-text-muted)] mb-4" />
            <h3 className="text-lg font-bold uppercase mb-1">
              No Banners Found
            </h3>
            <p className="text-sm text-[var(--db-text-muted)] max-w-sm mb-6">
              Create your first promotional image or video banner to engage
              members on the upcoming events carousel.
            </p>
            <button
              onClick={handleOpenCreate}
              className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
            >
              Upload First Banner
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="bg-[var(--db-accent)] border-b border-[var(--db-card-border)] text-[var(--db-accent-text)] text-[10px] uppercase font-extrabold tracking-widest"
                  style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                >
                  <th className="py-4 px-6 rounded-l-xl whitespace-nowrap">
                    Media
                  </th>
                  <th className="py-4 px-6 whitespace-nowrap">Title</th>
                  <th className="py-4 px-6 whitespace-nowrap">Description</th>
                  <th className="py-4 px-6 text-right rounded-r-xl whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--db-card-border)]">
                {banners.map((banner) => (
                  <tr
                    key={banner._id}
                    className="hover:bg-[var(--db-table-hover)] transition-all group"
                  >
                    {/* Media Preview Column */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="w-24 h-14 md:w-28 md:h-16 bg-black rounded-xl overflow-hidden relative border border-[var(--db-card-border)] flex items-center justify-center group-hover:border-white/20 transition-all">
                        {banner.mediaType === "video" ? (
                          <video
                            src={banner.mediaUrl}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            onMouseOver={(e) => e.target.play()}
                            onMouseOut={(e) => {
                              e.target.pause();
                              e.target.currentTime = 0;
                            }}
                          />
                        ) : (
                          <img
                            src={banner.mediaUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}

                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-black/80 text-[var(--db-accent-highlight)] border border-white/10 flex items-center gap-1">
                          {banner.mediaType === "video" ? (
                            <Video size={8} />
                          ) : (
                            <ImageIcon size={8} />
                          )}
                          {banner.mediaType}
                        </span>
                      </div>
                    </td>

                    {/* Title Column */}
                    <td className="py-4 px-6 font-bold text-sm text-[var(--db-text)] group-hover:text-[var(--db-accent-highlight)] transition-colors max-w-[200px] truncate">
                      {banner.title}
                    </td>

                    {/* Description Column */}
                    <td className="py-4 px-6 text-xs text-[var(--db-text-muted)] max-w-[300px] truncate leading-relaxed">
                      {banner.description || (
                        <span className="text-[var(--db-text-muted)] italic">
                          No description
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleOpenEdit(banner)}
                          className="p-2.5 bg-[var(--db-input-bg)] hover:bg-[var(--db-accent)] hover:text-[var(--db-accent-text)] text-[var(--db-text-muted)] rounded-lg border border-[var(--db-input-border)] transition-all duration-200 cursor-pointer"
                          title="Edit Banner"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-2.5 bg-[var(--db-input-bg)] hover:bg-red-500/20 text-[var(--db-text-muted)] hover:text-red-400 rounded-lg border border-[var(--db-input-border)] transition-all duration-200 cursor-pointer"
                          title="Delete Banner"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Banner Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--db-card)] border border-[var(--db-card-border)] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative"
              >
                {/* Modal Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--db-card-border)]">
                  <h3 className="font-bold uppercase text-sm tracking-wider text-[var(--db-accent-highlight)]">
                    {editMode ? "Edit Event Banner" : "Add Event Banner"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1.5 text-[var(--db-text-muted)] hover:text-[var(--db-text)] rounded-lg hover:bg-[var(--db-sidebar-link-hover)] transition-all cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Form */}
                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
                >
                  {/* Title */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--db-text-muted)] mb-1.5">
                      Banner Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Annual Powerlifting Tournament"
                      className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-sm text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--db-text-muted)] mb-1.5">
                      Description / Subtitle
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Give a brief brief description of the event..."
                      rows={3}
                      className="w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] focus:border-[var(--db-accent-highlight)]/50 outline-none rounded-xl px-4 py-3 text-sm text-[var(--db-text)] placeholder-[var(--db-text-muted)] transition-all resize-none"
                    />
                  </div>

                  {/* Media Upload Area */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--db-text-muted)] mb-1.5">
                      Upload Banner Media (Image or Video){" "}
                      <span className="text-red-500">
                        {editMode ? "" : "*"}
                      </span>
                    </label>

                    {/* Preview box */}
                    {mediaPreview ? (
                      <div className="aspect-[16/9] w-full bg-[var(--db-input-bg)] border border-[var(--db-input-border)] rounded-2xl relative overflow-hidden flex items-center justify-center mb-3 group">
                        {previewType === "video" ? (
                          <video
                            src={mediaPreview}
                            className="w-full h-full object-cover"
                            controls
                            playsInline
                          />
                        ) : (
                          <img
                            src={mediaPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setMediaFile(null);
                            setMediaPreview("");
                            setPreviewType("");
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-black/85 text-red-400 hover:text-red-300 rounded-full transition-all border border-red-500/20 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[var(--db-input-border)] hover:border-[var(--db-accent-highlight)]/50 bg-[var(--db-input-bg)] hover:bg-white/[0.01] rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[var(--db-accent-glow)] group-hover:text-[var(--db-accent-highlight)] flex items-center justify-center transition-all">
                          <Upload
                            size={20}
                            className="text-[var(--db-text-muted)] group-hover:text-[var(--db-accent-highlight)]"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-[var(--db-text)]">
                            Click to upload files
                          </p>
                          <p className="text-[10px] text-[var(--db-text-muted)] mt-1">
                            Supports PNG, JPG, JPEG, or MP4 video (Max 100MB)
                          </p>
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,video/*"
                      className="hidden"
                    />
                  </div>

                  {/* Submit Panel */}
                  <div className="pt-4 border-t border-[var(--db-card-border)] flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      disabled={submitting}
                      className="px-5 py-3 rounded-xl border border-[var(--db-input-border)] bg-transparent text-xs font-bold uppercase tracking-wider text-[var(--db-text-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-sidebar-link-hover)] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 bg-[var(--db-accent)] text-[var(--db-accent-text)] font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-xl shadow-lg shadow-[var(--db-accent-glow)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                      style={{ fontFamily: '"BrutalTypeBold", sans-serif' }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          Save Banner
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardEvents;
