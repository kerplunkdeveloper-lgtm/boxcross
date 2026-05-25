import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Preloader from './Components/Preloader';
import MembershipPage from './pages/Membership';
import ScrollToTop from './Components/ScrollToTop';
import Footer from './Components/Footer';



const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <BrowserRouter>
 
        <ScrollToTop />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<MembershipPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App
