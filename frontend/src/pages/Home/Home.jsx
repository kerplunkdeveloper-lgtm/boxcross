import React from "react";
import { Helmet } from "react-helmet-async";
import HomeBanner from "../../Components/HomeBanner";
import CoolestCommunitySection from "../../Components/CoolestCommunitySection";
import ChoosePathwaySection from "../../Components/ChoosePathwaySection";
import CultAdvantageSection from "../../Components/CultAdvantageSection";


const BASE_URL = "https://membership.boxandcross.com";

const Home = () => {
  return (
    <div className="w-full bg-black text-white overflow-hidden">
      <Helmet>
        <title>Box &amp; Cross – Pondicherry’s Premier Performance Arena | Home</title>
        <meta
          name="description"
          content="Box &amp; Cross is Pondicherry’s premier performance arena built for boxing, strength, HYROX, and functional fitness. Experience elite coaching and real transformation."
        />
        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Box &amp; Cross" />
        <meta property="og:url" content={`${BASE_URL}/home`} />
        <meta
          property="og:title"
          content="Box &amp; Cross – Pondicherry’s Premier Performance Arena | Home"
        />
        <meta
          property="og:description"
          content="Box &amp; Cross is Pondicherry’s premier performance arena built for boxing, strength, HYROX, and functional fitness. Experience elite coaching and real transformation."
        />
        <meta property="og:image" content={`${BASE_URL}/og-membership.png`} />
        <meta property="og:image:secure_url" content={`${BASE_URL}/og-membership.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="675" />
        <meta property="og:image:alt" content="Box and Cross Performance Arena" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`${BASE_URL}/home`} />
        <meta
          name="twitter:title"
          content="Box &amp; Cross – Pondicherry’s Premier Performance Arena | Home"
        />
        <meta
          name="twitter:description"
          content="Box &amp; Cross is Pondicherry’s premier performance arena built for boxing, strength, HYROX, and functional fitness."
        />
        <meta name="twitter:image" content={`${BASE_URL}/og-membership.png`} />
      </Helmet>

      {/* 1. CINEMATIC VIDEO / IMAGE HERO BANNER */}
      <HomeBanner />

      {/* 2. THE COOLEST FITNESS COMMUNITY REELS SECTION */}
      <CoolestCommunitySection />

      {/* 3. CHOOSE YOUR PATHWAY SECTION */}
      <ChoosePathwaySection />

     
     
    </div>
  );
};

export default Home;
