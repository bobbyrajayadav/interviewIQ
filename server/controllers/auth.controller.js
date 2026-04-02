// sabse pehle frontend se kuch data yaha pe leke aayenge eg. name email etc 
// uske baad create user 
// hame current user ka pata lagane ke liye ki user kon he toh uske liye jese hi hamara user create
// hota he toh jo token hota he us token ko hum apne cookies ke andar store kara denge toh or hum us 
// token ke andar user ka id bhi dalenge to verify karne ke liye ki ye token valid he ya nahi 
// 4Steps : frontend Data ->  create user -> token -> cookies store 

import genToken from "../config/token.js";
import User from "../models/user.model.js";


export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({ name, email })
        }
        let token = await genToken(user._id)
        res.cookie("token", token, {
            http: true,
            secure: true,   // secure: true for production
            sameSite: "none", // sameSite: "none" for production
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Google auth error : ${error}` })
    }
}

export const logOut = async (req, res) => {
    try {
        await res.clearCookie("token")
        return res.status(200).json({ message: `logOut successfully` })
    } catch (error) {
        return res.status(500).json({ message: `logOut error : ${error}` })
    }
} 