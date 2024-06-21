import { getEventById } from '@/lib/mongodb/actions/event.action'
import { SearchParamProps } from '@/types'
import React from 'react'

const EventDetails = async ({params: {id}}: SearchParamProps) => {
  const event = await getEventById(id)

  console.log("EVENT --",event)
  return (
    <div>EventDetails</div>
  )
}

export default EventDetails