import React from 'react'
import { Helmet } from 'react-helmet-async'
import Eventbanner from '../../Components/Event/Eventbanner'
import EventList from '../../Components/Event/EventList'

const Eventpage = () => {
  return (
    <div className='w-full'>
      <Helmet>
        <title>Events & Class Schedules | Box & Cross</title>
        <meta name="description" content="View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross." />
      </Helmet>
      {/*............................ banner section for events page............................*/}
      <Eventbanner/>
      {/*............................ event listing section............................*/}
      <EventList/>
    </div>
  )
}   

export default Eventpage