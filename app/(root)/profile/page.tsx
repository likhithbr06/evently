import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/mongodb/actions/event.action'
import { getOrdersByUser } from '@/lib/mongodb/actions/order.action'
import { IOrder } from '@/lib/mongodb/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'

const Profile = async ({searchParams}: SearchParamProps) => {
    const ordersPage = Number(searchParams?.ordersPage) || 1
    const eventsPage = Number(searchParams?.eventsPage) || 1
    const {sessionClaims}= auth();
    const userId = sessionClaims?.userId as string;
    const organisedEvents = await getEventsByUser({userId,page:eventsPage})
    const orders = await getOrdersByUser({userId,page:1})
    const orderedEvents = orders?.data.map((order:IOrder)=> order.event) || []
  return (
    <>
        <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            <div className='wrapper flex items-center justify-center sm:justify-between'>
                <h3 className='h3-bold text-center sm:text-left'>My Tickets</h3>
                <Button asChild size="lg" className='button hidden sm:flex'>
                    <Link href="/#events">Expolore More Events</Link>
                </Button>
            </div>
        </section>
        <section className='wrapper  my-8'>
        <Collection data={orderedEvents} emptyTitle="No tickets purchased yet.." emptyStateSubtext="No worries - plenty of exciting events to explore!"
         collectionType="My_tickets" Limit={3} page={ordersPage} urlParamName="ordersPage" totalPages={orders?.totalPages}/>
        </section>

        <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            <div className='wrapper flex items-center justify-center sm:justify-between'>
                <h3 className='h3-bold text-center sm:text-left'>Events Organised</h3>
                <Button asChild size="lg" className='button hidden sm:flex'>
                    <Link href="/events/create">Create new event</Link>
                </Button>
            </div>
        </section>
         <section className='wrapper  my-8'>
        <Collection data={organisedEvents?.data} emptyTitle="No events have been created yet" emptyStateSubtext="Go create some now!"
         collectionType="Events_organized" Limit={6} page={eventsPage} urlParamName="eventsPage" totalPages={organisedEvents?.totalPages}/>
        </section>
    </>
  )
}

export default Profile