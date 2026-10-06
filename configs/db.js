import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected successfully');
           console.log("Database:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);

    }catch(error){
        console.error('Error while connecting to database',error);
        process.exit(1);
    }
}