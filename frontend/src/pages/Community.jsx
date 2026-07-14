import React, { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Helmet } from 'react-helmet-async'
import Communitybanner from '../Components/Communitybanner'
import CommunityMarquee from '../Components/CommunityMarquee'
import CommunityCards from '../Components/CommunityCards'
import TribeSection from '../Components/TribeSection'
import TribeDashboard from '../Components/TribeDashboard'
import CommunitySection from '../Components/CommunitySection'
import EventList from '../Components/Event/EventList'
import TrialCTA from '../Components/TrialCTA'

const BASE_URL = "https://membership.boxandcross.com";

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
        <title>Community &amp; Tribe | Box &amp; Cross</title>
        <meta name="description" content="The community that forms when serious people train together long enough to become something more than training partners. You train here. You belong here." />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Box &amp; Cross" />
        <meta property="og:url" content={`${BASE_URL}/community`} />
        <meta property="og:title" content="Community &amp; Tribe | Box &amp; Cross" />
        <meta property="og:description" content="The community that forms when serious people train together long enough to become something more than training partners. You train here. You belong here." />
        <meta property="og:image" content={`${BASE_URL}/og-community.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Box and Cross Community" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`${BASE_URL}/community`} />
        <meta name="twitter:title" content="Community &amp; Tribe | Box &amp; Cross" />
        <meta name="twitter:description" content="The community that forms when serious people train together long enough to become something more than training partners. You train here. You belong here." />
        <meta name="twitter:image" content={`${BASE_URL}/og-community.jpg`} />
      </Helmet>
      <Communitybanner/>
      <CommunityMarquee/>
      
      <TribeSection/>
       <CommunityCards/>
      <TribeDashboard/>
     
      <EventList/>
      <CommunitySection/>
      <TrialCTA/>
   
    </div>
  )
}

export default Community