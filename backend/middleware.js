const { jwt_secret } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHead = req.header("Authorization");

    if(!authHead || !authHead.startsWith('Bearer')) {
        return res.status(401).json({});
    }

    const token = authHead.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwt_secret);

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({
                message: "Invalid token",
            });
        }

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token2",
        });
    }
};

module.exports = {
    authMiddleware
}