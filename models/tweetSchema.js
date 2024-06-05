import mongoose from "mongoose";
const tweetSchema = new mongoose.Schema({
    description: {
        require: true,
        type: String
    },
    imageUrl: {
        type: String // Assuming you're storing the image URL
    },
    like: {
        type: Array,
        default: []
    },
    bookmark: {
        type: Array,
        default: []
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    userDetails: {
        type: Object,
        default: {}
    }
}, { timestamps: true });


export const Tweet =  mongoose.model("Tweet",tweetSchema)   