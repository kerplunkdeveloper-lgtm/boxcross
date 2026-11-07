import React from 'react'
import Hero from './Hero'
import ExperienceSection from './ExperienceSection'
import TestimonialsSection from './TestimonialsSection'
import Foot from './Foot'
import GymMarquee from './GymMarquee'
import DifferenceSection from './DifferenceSection'
import ArenaBanner from './ArenaBanner'
import AboutSection from './AboutSection'
import TrialSection from './TrialSection'
import ProgramsSection from './Programsection'

const Home = () => {
  return (
    <div>
      <Hero />
      <AboutSection/>
      <ProgramsSection/>
  <ExperienceSection/>
  <DifferenceSection/>
   <ArenaBanner/>
  <TrialSection/>
 
      <TestimonialsSection/>
      <Foot/> 
<GymMarquee/>
    </div>
  );
}

export default Home
