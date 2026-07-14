import React, { useState, lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Preloader from "./Components/Preloader";
import ScrollToTop from "./Components/ScrollToTop";
import FloatingActions from "./Components/FloatingActions";
import Footer from "./Components/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import Commingsoon from "./pages/Commingsoon";

// Lazy-load page components for code splitting & optimized initial bundle sizes
const MembershipPage = lazy(() => import("./pages/Membership"));
const Auth = lazy(() => import("./pages/Auth"));
const DashboardLayout = lazy(() => import("./Components/DashboardLayout"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const DashboardBookings = lazy(() => import("./pages/DashboardBookings"));
const DashboardSettings = lazy(() => import("./pages/DashboardSettings"));
const DashboardMemberships = lazy(() => import("./pages/DashboardMemberships"));
const DashboardFoundingMembers = lazy(() => import("./pages/DashboardFoundingMembers"));
const DashboardFoundingOffer = lazy(() => import("./pages/DashboardFoundingOffer"));
const DashboardPayments = lazy(() => import("./pages/DashboardPayments"));
const DashboardEvents = lazy(() => import("./pages/DashboardEvents"));
const DashboardEventsList = lazy(() => import("./pages/DashboardEventsList"));
const DashboardEventPayments = lazy(
  () => import("./pages/DashboardEventPayments"),
);
const DashboardProfile = lazy(() => import("./pages/DashboardProfile"));
const DashboardCalendar = lazy(() => import("./pages/DashboardCalendar"));
const Eventpage = lazy(() => import("./pages/Events/Eventpage"));
const Community = lazy(() => import("./pages/Community"));
const DashboardHomec1 = lazy(() => import("./pages/DashboardHomec1"));
const DashboardHomec2 = lazy(() => import("./pages/DashboardHomec2"));
const DashboardHomec3 = lazy(() => import("./pages/DashboardHomec3"));
const VistingCard = lazy(() => import("./pages/vistingcard/VistingCard"));
const Foot = lazy(() => import("./Components/Foot"));
const GymMarquee = lazy(() => import("./Components/GymMarquee"));



// import LeadModal from "./Components/LeadModal";

// Layout with Navbar and Footer
const Layout = () => {
  const location = useLocation();
  const isEventsPage = location.pathname.startsWith("/events");

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {!isEventsPage && <Navbar />}
      <ScrollToTop />
      {/* <LeadModal /> */}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isEventsPage && <Foot />}
      {!isEventsPage && <GymMarquee />}
      {!isEventsPage && <Footer />}
    </div>
  );
};

// Sleek fallback loading indicator for code-splitted chunks
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] bg-black">
    <div className="w-8 h-8 border-2 border-[var(--db-accent-highlight, #e5ff00)]/20 border-t-[var(--db-accent-highlight, #e5ff00)] rounded-full animate-spin"></div>
  </div>
);

// Triggers preloader on specific route changes
const RoutePreloader = ({ setIsLoading }) => {
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath) {
      const isCurrentEvents = location.pathname.startsWith("/events");
      const isPrevEvents = prevPath.startsWith("/events");

      if (
        location.pathname === "/" ||
        (isCurrentEvents && !isPrevEvents) ||
        location.pathname === "/community"
      ) {
        window.isPreloaderDone = false;
        setIsLoading(true);
      }
      setPrevPath(location.pathname);
    }
  }, [location.pathname, prevPath, setIsLoading]);

  return null;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AuthProvider>
      <HelmetProvider>
        <div className="min-h-screen bg-black text-white">
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#0a0a0a",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: '"BrutalTypeBold", sans-serif',
                fontSize: "13px",
                borderRadius: "12px",
              },
              success: {
                iconTheme: {
                  primary: "#e5ff00",
                  secondary: "#000",
                },
              },
            }}
          />
          {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
          <BrowserRouter>
            <RoutePreloader setIsLoading={setIsLoading} />
            {!isLoading && <FloatingActions />}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Routes WITH Navbar and Footer */}
                <Route element={<Layout />}>
                  {/* <Route path="/" element={<MembershipPage />} /> */}
                  <Route path="/events" element={<Eventpage />} />
                  <Route path="/events/:id" element={<Eventpage />} />
                  <Route path="/community" element={<Community />} />
                </Route>

                {/* Routes WITHOUT Navbar and Footer */}
                <Route path="/" element={<Commingsoon />} />
                <Route path="/vistingcard" element={<VistingCard />} />
                <Route path="/login" element={<Auth />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <ThemeProvider>
                        <DashboardLayout />
                      </ThemeProvider>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardHome />} />
                  <Route path="bookings" element={<DashboardBookings />} />
                  <Route
                    path="memberships"
                    element={<DashboardMemberships />}
                  />
                  <Route
                    path="founding-members"
                    element={<DashboardFoundingMembers />}
                  />
                  <Route
                    path="founding-offer"
                    element={<DashboardFoundingOffer />}
                  />
                  <Route path="payments" element={<DashboardPayments />} />
                  <Route path="events" element={<DashboardEvents />} />
                  <Route path="events-list" element={<DashboardEventsList />} />
                  <Route
                    path="event-payments"
                    element={<DashboardEventPayments />}
                  />
                  <Route path="profile" element={<DashboardProfile />} />
                  <Route path="homec1" element={<DashboardHomec1 />} />
                  <Route path="homec2" element={<DashboardHomec2 />} />
                  <Route path="homec3" element={<DashboardHomec3 />} />
                  <Route path="settings" element={<DashboardSettings />} />
                  <Route path="calendar" element={<DashboardCalendar />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </HelmetProvider>
    </AuthProvider>
  );
};

export default App;
