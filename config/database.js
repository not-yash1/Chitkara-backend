import mongoose from "mongoose";

export const connectDatabase = async () => {
    mongoose.connect(process.env.DB_URI)
    .then((c) => {
        console.log(`MongoDB connected to ${c.connection.host}`)
    })
    .catch((err) => {
        console.log(err)
    })
}