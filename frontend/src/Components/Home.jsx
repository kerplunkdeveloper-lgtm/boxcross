import React from "react";
import HomeBanner from "./HomeBanner";
import CoolestCommunitySection from "./CoolestCommunitySection";
import AboutSection from "./AboutSection";
import ProgramsSection from "./Programsection";
import ExperienceSection from "./ExperienceSection";
import DifferenceSection from "./DifferenceSection";
import ArenaBanner from "./ArenaBanner";
import TrialSection from "./TrialSection";
import TestimonialsSection from "./TestimonialsSection";

const Home = () => {
  return (
    <div className="w-full bg-black text-white overflow-hidden">
      <HomeBanner />
      <CoolestCommunitySection />
      <AboutSection />
      <ProgramsSection />
      <ExperienceSection />
      <DifferenceSection />
      <ArenaBanner />
      <TrialSection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;
