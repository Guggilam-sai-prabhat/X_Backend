import express from "express";


import { createTweet, deleteTweet, getAllTweets, getFollowingTweets, likeorDislike , bookMark} from "../controller/tweerController.js";
import isAuthenticated from "../config/auth.js";
import multer from 'multer';

const app =  express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  });
  
  const upload = multer({ storage: storage });

app.post("/create", isAuthenticated, upload.single('image'), createTweet);
app.delete("/delete/:id", isAuthenticated, deleteTweet)
app.route("/like/:id").put(isAuthenticated , likeorDislike)
app.get("/alltweet/:id" , isAuthenticated , getAllTweets)
app.get("/followingtweet/:id" , isAuthenticated , getFollowingTweets)
app.put("/bookmark/:id" , isAuthenticated , bookMark)


export default app