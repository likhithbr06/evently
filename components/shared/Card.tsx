import { IEvent } from '@/lib/mongodb/database/models/event.model'
import Link from 'next/link'
import React from 'react'

type CardPropsType={
    event : IEvent,
    hasOrderLink?: boolean,
    hidePrice?: boolean
}

const Card = ({event,hasOrderLink,hidePrice}: CardPropsType) => {
  return (
    <div className='group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[480px]'>

        <Link href={`/events/${event._id}`} > Check</Link>
    </div>
  )
}

export default Card