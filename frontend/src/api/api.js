import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
    : "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Crucial for sending HttpOnly cookies
});

// ──────────────── AUTH API ────────────────

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const logoutUser = () => API.get("/auth/logout");
export const getMe = () => API.get("/auth/me");
export const updateMembership = (data) => API.put("/auth/membership", data);

// ──────────────── BOOKING API ────────────────

export const createBooking = (data) => API.post("/bookings", data);

export const getBookings = () => API.get("/bookings");

export const getMyBookings = () => API.get("/bookings/my");

export const getBookingById = (id) => API.get(`/bookings/${id}`);

export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);

export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

// ──────────────── MEMBERSHIP API ────────────────

export const getMembershipPlans = () => API.get("/memberships");

export const updateMembershipPlan = (id, data) => API.put(`/memberships/${id}`, data);

// ──────────────── PAYMENT API ────────────────

export const createPayment = (data) => API.post("/payments", data);

export const getPayments = () => API.get("/payments");

export const updatePaymentStatus = (id, data) => API.put(`/payments/${id}`, data);

// ──────────────── EVENT BANNERS API ────────────────

export const getActiveBanners = () => API.get("/event-banners");
export const getAllBanners = () => API.get("/event-banners/admin");
export const createBanner = (formData) => API.post("/event-banners", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const updateBanner = (id, formData) => API.put(`/event-banners/${id}`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const deleteBanner = (id) => API.delete(`/event-banners/${id}`);

// ──────────────── EVENTS LIST API ────────────────
export const getEventsList = () => API.get("/events");
export const getEventsListAdmin = () => API.get("/events/admin");
export const createEventItem = (formData) => API.post("/events", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const updateEventItem = (id, formData) => API.put(`/events/${id}`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const deleteEventItem = (id) => API.delete(`/events/${id}`);
export const bookEventItem = (data) => API.post("/events/book", data);
export const verifyEventPayment = (data) => API.post("/events/verify", data);
export const getEventBookings = () => API.get("/events/bookings");
export const deleteEventBooking = (id) => API.delete(`/events/bookings/${id}`);
export const updateProfile = (formData) => API.put("/auth/profile", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// ──────────────── LEAD CAPTURE API ────────────────
export const createLead = (data) => API.post("/leads", data);
export const getLeadsAdmin = () => API.get("/leads");

export default API;
