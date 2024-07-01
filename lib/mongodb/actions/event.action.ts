"use server"

import { handleError } from "@/lib/utils"
import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import { error } from "console"
import Event from "../database/models/event.model"
import { revalidatePath } from "next/cache"
import Category from "../database/models/category.model"


//TO CREATE AN EVENT
export const createEvent = async ({event,userId,path}: CreateEventParams)=>{
    try {
        
        await connectToDatabase()
        const organizer = await User.findById(userId)
        console.log('organiser--',organizer,'userID--',userId)
        if(!organizer){
            throw new Error("Organizer not found!!!")
        }
        const newEvent = await Event.create({...event,category: event.categoryId,organiser: userId})

        return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
        handleError(error)
    }
}


// TO UPDATE AN EVENT

export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try {
      await connectToDatabase()
  
      const eventToUpdate = await Event.findById(event._id)
      //console.log('eventToUpdate--',eventToUpdate)
      if (!eventToUpdate || eventToUpdate.organiser.toHexString() !== userId) {
        throw new Error('Unauthorized or event not found')
      }
  
      const updatedEvent = await Event.findByIdAndUpdate(
        event._id,
        { ...event, category: event.categoryId },
        { new: true }
      )
      revalidatePath(path)
  
      return JSON.parse(JSON.stringify(updatedEvent))
    } catch (error) {
      handleError(error)
    }
  }




//TO GET CATEGORY NAME
const getCategoryByName = async (name: string) => {
    return Category.findOne({ name: { $regex: name, $options: 'i' } })
  }

 ///ELPER FUNCTION TO POPULATE ORGANIZER AND CATEGORY ID INTO EVENT OBJECT
const populateEvent= async(query: any)=>{
    return query
    .populate({path:'organiser',model:'User',select:'_id firstName lastName'})
    .populate({path:'category',model:'Category',select:'_id  name'})
}


//TO GET AN EVENT BY ID
export const getEventById = async(eventId:string)=>{
    try {
        await connectToDatabase();
        const event = await populateEvent( Event.findById(eventId))
        if(!event){
            throw new Error("Event not found!!")
        }
        console.log('EVENT--',JSON.parse(JSON.stringify(event)))
        return JSON.parse(JSON.stringify(event))
    } catch (error) {
        handleError(error)
    }
}

//TO RETRIVE ALL EVENTS
export const getAllEvents = async({ query, limit=6,page,category}: GetAllEventsParams)=>{
    try {
        await connectToDatabase();
        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
        const categoryCondition = category ? await getCategoryByName(category) : null
        const conditions = {
            $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
            }
        const skipAmount = (Number(page) - 1) * limit
        const eventsQuery= Event.find(conditions)
        .sort({createdAt: 'desc'})
        .skip(0)
        .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)
        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventsCount/limit)
        }
    } catch (error) {
        handleError(error)
    }
}

//TODELETE AN EVENT
export const deleteEvent = async({eventId,path}: DeleteEventParams)=>{
    try {
        await connectToDatabase();
        const deletedEvent = await Event.findByIdAndDelete(eventId)
        
        if(deletedEvent) revalidatePath(path)
        
        
    } catch (error) {
        handleError(error)
    }
}



// TO GET EVENTS BY ORGANIZER
export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
    try {
      await connectToDatabase()
      
      const conditions = { organiser: userId }
      const skipAmount = (page - 1) * limit
  
      const eventsQuery = Event.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
        
      const events = await populateEvent(eventsQuery)
      const eventsCount = await Event.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }



// TO GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
  }: GetRelatedEventsByCategoryParams) {
    try {
      await connectToDatabase()
  
      const skipAmount = (Number(page) - 1) * limit
      const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }
  
      const eventsQuery = Event.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
  
      const events = await populateEvent(eventsQuery)
      const eventsCount = await Event.countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }