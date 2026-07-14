import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import EventNavbar from '../../Components/Event/EventNavbar'
import Eventbanner from '../../Components/Event/Eventbanner'
import EventList from '../../Components/Event/EventList'
import Eventlastcontact from './Eventlastcontact'
import Eventhighlight from './Eventhighlight'

const BASE_URL = "https://membership.boxandcross.com";

const Eventpage = () => {
  const { id } = useParams();

  return (
    <div className='w-full  '>
      {!id && (
        <Helmet>
          <title>Events &amp; Class Schedules | Box &amp; Cross</title>
          <meta name="description" content="View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross." />

          {/* Open Graph / Facebook / WhatsApp */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Box &amp; Cross" />
          <meta property="og:url" content={`${BASE_URL}/events`} />
          <meta property="og:title" content="Events &amp; Class Schedules | Box &amp; Cross" />
          <meta property="og:description" content="View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross." />
          <meta property="og:image" content={`${BASE_URL}/og-events.jpg`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="Box and Cross Events" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={`${BASE_URL}/events`} />
          <meta name="twitter:title" content="Events &amp; Class Schedules | Box &amp; Cross" />
          <meta name="twitter:description" content="View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross." />
          <meta name="twitter:image" content={`${BASE_URL}/og-events.jpg`} />
        </Helmet>
      )}
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
