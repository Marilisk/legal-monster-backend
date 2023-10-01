import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, },
    role: {type: String, default: 'manager',},
    ownerId: {type: String, required: true,},
}, 
{
    timestamps: true, 
});

export default mongoose.model('Candidate', CandidateSchema);