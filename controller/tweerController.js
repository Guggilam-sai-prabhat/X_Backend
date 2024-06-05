import {Tweet} from "../models/tweetSchema.js"
import { User } from "../models/userSchema.js";

export const createTweet = async (req, res) => {
    try {
        const { description } = req.body; // The ID is no longer taken from body since it should ideally come from authentication middleware
        const imageUrl = req.file ? req.file.path : null; // Get the image path from multer

        if (!description) {
            return res.status(400).json({
                message: "Description is required",
                success: false
            });
        }

        // Assuming req.user is populated by your isAuthenticated middleware
        if (!req.user) {
            return res.status(403).json({
                message: "Unauthorized",
                success: false
            });
        }

        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const newTweet = await Tweet.create({
            description,
            imageUrl, // Save the image URL in the tweet
            userId: user._id,
            userDetails: user
        });

        return res.status(201).json({
            message: "Tweet posted successfully",
            success: true,
            tweet: newTweet
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to create tweet due to server error",
            success: false
        });
    }
};


export const deleteTweet = async(req,res) =>{
    try {
        const {id} =  req.params;
        await Tweet.findByIdAndDelete(id)
        return res.status(200).json({
            message: "Deleted Sucessfully",
            success : true
        })

    } catch (err) {
        console.log(err)
        
    }
}

export const likeorDislike = async (req, res) => {
    try {
        const loggedId = req.body.id;
        const tweetID = req.params.id;
        const tweet = await Tweet.findById(tweetID); // await the promise to get the tweet object

        if (tweet && tweet.like.includes(loggedId)) { // Check if tweet is not undefined
            await Tweet.findByIdAndUpdate(tweetID, { $pull: { like: loggedId } });
            return res.status(200).json({
                message: "User Disliked  tweet"
            });
        } else {
            await Tweet.findByIdAndUpdate(tweetID, { $push: { like: loggedId } });
            return res.status(200).json({
                message: "User liked  tweet"
            });
        }
    } catch (err) {
        console.log(err);
        
    }
};
export const bookMark = async (req, res) => {
    
    try {
        const loggedId = req.body.id;
        const tweetID = req.params.id;
        const tweet = await Tweet.findById(tweetID);
        
        // await the promise to get the tweet object
      
        

        if (tweet && tweet.bookmark.includes(loggedId)) { // Check if tweet is not undefined
            await Tweet.findByIdAndUpdate(tweetID, { $pull: { bookmark: loggedId } });
            return res.status(200).json({
                message: "Removed from  Bookmark"
            });
        } 
        else {
            await Tweet.findByIdAndUpdate(tweetID, { $push: { bookmark: loggedId } });
            return res.status(200).json({
                message: "Bookmarked"
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getAllTweets = async (req,res) => {
    // loggedInUser ka tweet + following user tweet
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({userId:id});
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:loggedInUserTweets.concat(...followingUserTweet),
        })
    } catch (error) {
        console.log(error);
    }
}
export const getFollowingTweets = async (req,res) =>{
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id); 
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:[].concat(...followingUserTweet)
        });
    } catch (error) {
        console.log(error);
    }
}
 

