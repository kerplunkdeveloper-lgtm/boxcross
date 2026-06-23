import React from 'react'
import Communitybanner from '../Components/Communitybanner'
import CommunityCards from '../Components/CommunityCards'
import TribeSection from '../Components/TribeSection'
import CommunitySection from '../Components/CommunitySection'

const Community = () => {
  return (
    <div className="bg-black min-h-screen">
      <Communitybanner/>
      <TribeSection/>
         <CommunityCards/>
      <CommunitySection/>
    </div>
  )
}

export default Community