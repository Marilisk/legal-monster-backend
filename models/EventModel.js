import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    startDate: {
        day: { type: Number, required: true, },
        year: { type: Number, required: true, },
        month: { type: Number, required: true, },
        timeStamp: { type: Number, required: true, },
    },
    finishDate: {
        day: { type: Number, required: true, },
        year: { type: Number, required: true, },
        month: { type: Number, required: true, },
        timeStamp: { type: Number, required: true, },
    },
    title: { type: String, required: true, },
    description: String,
    owner: {
        userId: { type: String, required: true, },
        userName: { type: String, required: true, },
        authorId: { type: String, required: true, },
    },
    client: {
        clientId: { type: String, },
        clientName: { type: String, },
    },
    type: { type: String, default: 'задача', },


},
    {
        timestamps: true,
    });

export default mongoose.model('Event', EventSchema);