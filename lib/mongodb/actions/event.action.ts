"use server"

import { handleError } from "@/lib/utils"
import { CreateEventParams } from "@/types"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import { error } from "console"
import Event from "../database/models/event.model"

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


const populateEvent= async(query: any)=>{
    return query
    .populate({path:'organiser',model:'User',select:'_id firstName lastName'})
    .populate({path:'category',model:'Category',select:'_id  name'})
}

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