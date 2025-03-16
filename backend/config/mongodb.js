import mongoose from "mongoose";

const connectDB =  async () => {
    mongoose.connection.on('connected', () => console.log("Databased connected") )

    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)
}

export default connectDB