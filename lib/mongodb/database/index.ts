/* Used to cache a database connection across multiple invocations of server less api routes in Nextjs  */
import mongoose from 'mongoose';

const MONGODB_URI= process.env.MONGODB_URI

let cached = (global as any).mongoose || {conn: null, promise:null} // If there is no mongoose cached connection , then simply set it to a emty object

export const connectToDatabase = async()=>{
    if(cached.conn) return cached.conn
}