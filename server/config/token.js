import jwt from "jsonwebtoken"

const genToken = async (userId) => {
    try {
        // use the same key name that isAuth expects (userId)
        const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return token;
    } catch (error) {
        console.log(error)
    }
}

export default genToken