import mongoose from "mongoose";


const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true,  },
    form: {type: String, required: true,},
    ownerId: {type: String, required: true,},
    creatorId: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
    INNnumber: {type: String},
    contactPersons: Array,
    phase: {
        number: {type: Number, required: true,},
        assignDateTimestamp: {type: Number, default: Date.now(),}
    },
    managers: Array, // возможно этот и все нижеследующие массивы не нужны? просто будем искать их по клиент id и собирать таким образом?
    lawyers: Array,
    contracts: Array, 
    projects: Array,
    events: Array,
    //notes: {type: [mongoose.Schema.Types.ObjectId], ref: 'Note', default: []} ,
}, 
{
    timestamps: true, 
});

export default mongoose.model('Client', ClientSchema);