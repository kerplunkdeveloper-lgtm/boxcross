import React from 'react'
import brand from '../assets/images/brandstory.png'
import { Link } from 'react-router-dom'
import StrokeMarquee from '../Components/StrokeMarquee'
import OurStory from '../Components/Ourstory'
import FounderSection from '../Components/FounderSection'
import GymMarquee from '../Components/GymMarquee'
import Foot from '../Components/Foot'

const Brandstory = () => {
  return (
    <>
        {/* Brand Banner section */}
       <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">

  {/* Background Image */}
  <img
    src={brand}
    alt="Brand Story"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">

   <h1 className="text-[50px] stroke-text sm:text-[80px] md:text-[120px] lg:text-[180px] font-extrabold uppercase text-transparent stroke-text">
  Brandstory
</h1>

    <div className="mt-6 bg-lime-400 text-black px-6 py-3 rounded-2xl font-bold text-sm md:text-lg flex items-center gap-3">
      
      <Link to="/" className="transition-colors duration-300"> 
      <span>HOME</span>
        </Link>
      <span>•</span>
      <span className="underline">BRAND STORY</span>
    </div>

  </div>
</section>



<OurStory/>
<StrokeMarquee/>
<FounderSection/>
<Foot/> 
<GymMarquee/>


      
    </>
  )
}

export default Brandstory
