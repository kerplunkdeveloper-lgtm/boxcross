import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ──────────────── BOOKING API ────────────────

export const createBooking = (data) => API.post("/bookings", data);

export const getBookings = () => API.get("/bookings");

export const getBookingById = (id) => API.get(`/bookings/${id}`);

export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);

export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

export default API;
