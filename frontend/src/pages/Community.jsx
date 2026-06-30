import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Helmet } from 'react-helmet-async'
import Communitybanner from '../Components/Communitybanner'
import CommunityCards from '../Components/CommunityCards'
import TribeSection from '../Components/TribeSection'
import CommunitySection from '../Components/CommunitySection'
import EventList from '../Components/Event/EventList'
import comImg from '../assets/com.png'


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
      <Helmet>
        <title>Community & Tribe | Box & Cross</title>
        <meta name="description" content="The community that forms when serious people train together long enough to become something more than training partners. You train here. You belong here." />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://boxandcross.com/community" />
        <meta property="og:title" content="Community & Tribe | Box & Cross" />
        <meta property="og:description" content="The community that forms when serious people train together long enough to become something more than training partners. You train here. You belong here." />
        <meta property="og:image" content={window.location.origin + comImg} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://boxandcross.com/community" />
        <meta property="twitter:title" content="Community & Tribe | Box & Cross" />
        <meta property="twitter:description" content="The community that forms when serious people train together long enough to become something more than training partners. You train here. You belong here." />
        <meta property="twitter:image" content={window.location.origin + comImg} />
      </Helmet>
      <Communitybanner/>
      <TribeSection/>
      <CommunityCards/>
      <EventList/>
      <CommunitySection/>
   
    </div>
  )
}

export default Community