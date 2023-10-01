import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, },
    fullName: { type: String, required: true, },
    password: { type: String, required: true, },
    activationLink: { type: String },
    resetPasswordLink: { type: String },
    role: { type: String, default: 'owner', },
    powers: {
        canChangeResponsibleUser: { type: Boolean, default: false },
        canCreateNewClients: { type: Boolean, default: false },
        canSeeOtherClients: { type: Boolean, default: false },
        canSeeOtherCases: { type: Boolean, default: false },
        canEditSalesPipeline: { type: Boolean, default: false },
        canDeleteClients: { type: Boolean, default: false },
        canDeleteNotes: { type: Boolean, default: false },
    },
    ownerSettings: {
        salesPipeline: {
            isCustom: { type: Boolean, default: false, },
            pipeline: {
                type: Array
            }
        },
    },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    isActivated: { type: Boolean, default: false, },
    allowedToResetPassword: { type: Boolean },
    avatarUrl: String,
},
    {
        timestamps: true,
    });

export default mongoose.model('User', UserSchema);