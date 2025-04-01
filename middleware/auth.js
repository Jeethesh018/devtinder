const jwt = require("jsonwebtoken");
const { Usermodel } = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const decode = jwt.verify(token, "admin");

        const { _id } = decode;
        console.log("Decoded Token:", decode);

        const getUser = await Usermodel.findById(_id);

        if (!getUser) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = getUser;
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = { auth };
