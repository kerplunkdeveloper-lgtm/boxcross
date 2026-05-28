import React from 'react'
import Eventbanner from '../../Components/Event/Eventbanner'
import EventList from '../../Components/Event/EventList'

const Eventpage = () => {
  return (
    <div className='w-full'>
    {/*............................ banner section for events page............................*/}
      <Eventbanner/>
    {/*............................ event listing section............................*/}
      <EventList/>
    </div>
  )
}   

export default Eventpage