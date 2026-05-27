import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Preloader from './Components/Preloader';
import MembershipPage from './pages/Membership';
import ScrollToTop from './Components/ScrollToTop';
import Footer from './Components/Footer';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

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
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
