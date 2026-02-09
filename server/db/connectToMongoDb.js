import mongoose from "mongoose";

const connectToMongoDb = async () => {
    try {
        await mongoose.connect(process.env.NODE_ENV === "development" ? process.env.MONGO_LOCAL : process.env.MONGO_DB_URL)
        console.log(`Connected to MongoDB at ${process.env.NODE_ENV}`)
    } catch (err) {
        console.log(`Error connecting to MongoDB: ${err}`)
    }
}

export default connectToMongoDb