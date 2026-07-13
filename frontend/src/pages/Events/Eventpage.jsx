import React from 'react'
import { Helmet } from 'react-helmet-async'
import EventNavbar from '../../Components/Event/EventNavbar'
import Eventbanner from '../../Components/Event/Eventbanner'
import EventList from '../../Components/Event/EventList'
import coverImg from '../../assets/cover.jpg'
import Eventlastcontact from './Eventlastcontact'
import Eventhighlight from './Eventhighlight'

const Eventpage = () => {
  return (
    <div className='w-full mt-20 '>
      <Helmet>
        <title>Events & Class Schedules | Box & Cross</title>
        <meta name="description" content="View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross." />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://membership.boxandcross.com/events" />
        <meta property="og:title" content="Events & Class Schedules | Box & Cross" />
        <meta property="og:description" content="View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross." />
        <meta property="og:image" content={`https://membership.boxandcross.com${coverImg}`} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://membership.boxandcross.com/events" />
        <meta property="twitter:title" content="Events & Class Schedules | Box & Cross" />
        <meta property="twitter:description" content="View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross." />
        <meta property="twitter:image" content={`https://membership.boxandcross.com${coverImg}`} />
      </Helmet>
      {/*............................ separate navbar for event page............................*/}
      <EventNavbar />
      {/*............................ banner section for events page............................*/}
      <Eventbanner/>
      {/*............................ event listing section............................*/}
      <EventList/>
      {/*............................ event highlight section............................*/}
      <Eventhighlight/>
      {/*............................ last contact form............................*/}
      <Eventlastcontact/>
    </div>
  )
}   

export default Eventpage