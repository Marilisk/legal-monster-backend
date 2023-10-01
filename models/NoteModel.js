import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    author: {
        authorId: String,
        fullName: String
    },
    createTimeStamp: Number,
    deadLine: Number,
    title: String,
    text: String,
    priority: String, 
    isDone: Boolean,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client'}
},
{
    timestamps: true, 
})


export default mongoose.model('Note', NoteSchema);