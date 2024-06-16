/* Used to cache a database connection across multiple invocations of server less api routes in Nextjs  */
import mongoose, { mongo } from 'mongoose';

const MONGODB_URI= process.env.MONGODB_URI

let cached = (global as any).mongoose || {conn: null, promise:null} // If there is no mongoose cached connection , then simply set it to a emty object

export const connectToDatabase = async()=>{
    console.log('Connecting to database....',cached.conn)
    if(cached.conn) return cached.conn

    if(!MONGODB_URI) throw new Error("MONGODB URI is missing!!!!")

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI,{
        dbName: 'evently',
        bufferCommands: false
    })

    cached.conn =  await cached.promise;

    return cached.conn
}