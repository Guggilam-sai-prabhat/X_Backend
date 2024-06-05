import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User ALready Exists",
                success: false
            })
        }

        const hasedpassowrd = await bcryptjs.hash(password, 18)

        await User.create({
            name,
            username,
            email,
            password: hasedpassowrd
        });

        return res.status(201).json({
            message: "Succesfully created ",
            success: true
        })
    }

    catch (err) {
        console.log(err)

    }
}

export const Login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            })
        };
        const user = await User.findOne({ email })
        console.log(user)

        if (!user) {
            return res.status(401).json({
                message: "user doesn't exit",
                success: false
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Username or passowrd is incorrect.",
                success: false
            })
        }
        const tokenData = {
            userID: user._id
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECERET, { expiresIn: "1d" });
        return res.status(201).cookie("token", token, { expiresIn: "1d", httpOnly: true }).json({
            message: `welcome back ${user.name}`,
            user,
            success: true
        })


    } catch (err) {

        console.log(err)

    }

}

export const Logout = async (req, res) => {

    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "user Logout Successfully.",
        success: true

    })

}

export const bookMark = async (req, res) => {
    try {
        const loggedId = req.body.id;
        const tweetID = req.params.id;
        const user = await User.findById(loggedId); // await the promise to get the tweet object

        if (user && user.bookmarks.includes(tweetID)) { // Check if tweet is not undefined
            await User.findByIdAndUpdate(loggedId, { $pull: { bookmarks: tweetID } });
            return res.status(200).json({
                message: " Removed from  Bookmark"
            });
        } else {
            await User.findByIdAndUpdate(loggedId, { $push: { bookmarks: tweetID } });
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

export const getMyProfile = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user,
        })
    } catch (err) {
        console.log(err)

    }
}

export const getOtherUser = async (req, res) => {
    try {
        const id = req.params.id
        const otherUsers = await User.find({ _id: { $ne: id } }).select("-password")

        if (!otherUsers) {
            return res.status(401).json({
                message: "Currently no registered users"
            })
        }
        return res.status(200).json({
            otherUsers
        })
    } catch (err) {

        console.log(err)

    }
}

export const follow = async (req, res) => {
    try {
        const loggedId = req.body.id
        const userId = req.params.id

        const loggedUser = await User.findById(loggedId)
        const user = await User.findById(userId)

        if (!user.followrs.includes(loggedId)) {
            await user.updateOne({ $push: { followrs: loggedId } })
            await loggedUser.updateOne({ $push: { following: userId } })

        } else {
            return res.status(400).json({
                message: `User already followed to ${user.name}`
            })
        }
        return res.status(200).json({
            message: `${loggedUser.name} just following ${user.name} `
        })
    } catch (err) {
        console.log(err)

    }
}

export const unfollow = async (req, res) => {
    try {
        const loggedId = req.body.id
        const userId = req.params.id

        const loggedUser = await User.findById(loggedId)
        const user = await User.findById(userId)

        if (loggedUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followrs: loggedId } })
            await loggedUser.updateOne({ $pull: { following: userId } })

        } else {
            return res.status(400).json({
                message: `User has not followed it`
            })
        }
        return res.status(200).json({
            message: `${loggedUser.name} just Unfollow ${user.name} `
        })
    } catch (err) {
        console.log(err)

    }
}