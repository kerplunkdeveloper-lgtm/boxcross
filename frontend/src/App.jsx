import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Preloader from './Components/Preloader';
import MembershipPage from './pages/Membership';
import ScrollToTop from './Components/ScrollToTop';
import Footer from './Components/Footer';
import Auth from './pages/Auth';
import DashboardLayout from './Components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import DashboardBookings from './pages/DashboardBookings';
import DashboardSettings from './pages/DashboardSettings';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout with Navbar and Footer
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <ScrollToTop />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-white">
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#0a0a0a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: '"Bai Jamjuree", sans-serif',
              fontSize: '13px',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#defb02',
                secondary: '#000',
              },
            },
          }}
        />
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
        <BrowserRouter>
          <Routes>
            {/* Routes WITH Navbar and Footer */}
            <Route element={<Layout />}>
              <Route path="/" element={<MembershipPage />} />
            </Route>

            {/* Routes WITHOUT Navbar and Footer */}
            <Route path="/login" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              } 
            >
              <Route index element={<DashboardHome />} />
              <Route path="bookings" element={<DashboardBookings />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
