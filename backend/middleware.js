const { jwt_secret } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHead = req.header("Authorization");

    if(!authHead || !authHead.startsWith('Bearer')) {
        return res.status(401).json({});
    }

    const token = authHead.split('')[1];

    try {
        const decoded = jwt.verify(token, jwt_secret);

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({});
        }

    } catch (error) {
        return res.status(401).json({});
    }
};

module.exports = {
    authMiddleware
}