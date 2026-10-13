import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        messages: [
            {
                
            }
        ]
    },
    {timestamps: true}
);

const User = mongoose.models.User || mongoose.model("User", ChatSchema)

export default User;