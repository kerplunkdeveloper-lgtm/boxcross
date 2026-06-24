import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Communitybanner from '../Components/Communitybanner'
import CommunityCards from '../Components/CommunityCards'
import TribeSection from '../Components/TribeSection'
import CommunitySection from '../Components/CommunitySection'
import EventList from '../Components/Event/EventList'


const Community = () => {
  useEffect(() => {
    const initAOS = () => {
      AOS.init({ duration: 1000, once: true });
      AOS.refresh();
    };

    if (window.isPreloaderDone) {
      initAOS();
    } else {
      window.addEventListener("preloaderComplete", initAOS);
      return () => window.removeEventListener("preloaderComplete", initAOS);
    }
  }, []);

  return (
    <div className="bg-black min-h-screen overflow-x-hidden w-full relative">
      <Communitybanner/>
      <TribeSection/>
      <CommunityCards/>
      <EventList/>
      <CommunitySection/>
   
    </div>
  )
}

export default Community