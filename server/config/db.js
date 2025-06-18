import mongoose from "mongoose";

const connectDB = async (uri) => {
    try{
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        });
        console.log("MongoDB connected")
    } catch (error){
        console.error("Connection Failed", error);
        process.exit(1);
    }
}

export default connectDB;