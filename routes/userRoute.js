import express from "express";

import { Register , Login, Logout , bookMark, getMyProfile, getOtherUser, follow, unfollow } from "../controller/userController.js";
import isAuthenticated from "../config/auth.js";
import { getAllTweets } from "../controller/tweerController.js";
const app =  express.Router()

app.route("/register").post(Register)
app.route("/login").post(Login)
// app.route("/logout").post(Logout)
app.get('/logout', Logout)
app.put("/bookmark/:id" , isAuthenticated , bookMark)
app.get("/profile/:id" , isAuthenticated , getMyProfile)
app.get("/otheruser/:id", isAuthenticated , getOtherUser)
app.post("/follow/:id" , isAuthenticated , follow)
app.post("/unfollow/:id" , isAuthenticated , unfollow)



export default app