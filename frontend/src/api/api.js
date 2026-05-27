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

export default API;
