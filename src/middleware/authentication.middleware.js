const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");

const authMiddleware = {};

authMiddleware.authenticate = async (req, res, next) => {
    // Confimr There is a field called Authorization
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return res.status(401).send({
            statuscode: 401,
            status: 'error',
            message: 'No token provided'
        });
    }

    const token = await bearerToken.split(' ')[1];

    // If no token return unauthorized
    if (token === undefined) {
        return res.status(404).json({
            status: 'error',
            statusCode: 401,
            message: 'No token provided'
        });
    }


    // Decode the Token

    const decodedToken =await jwt.verify(token, process.env.AUTHENTICATION_SECRET_KEY);
        // cofirm that the token is valid
        if (!decodedToken) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'token is not valid'
            });
        };

        // Extract Use4rs Id From Decoded Token
        const userId = decodedToken.userId;

        // Confirm id is not unefined
        if (!userId) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'token is not valid'
            });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                statusCode: 401,
                message:  'Unauthorized Request! Sign In Or SignUp!. If you are already signed in, please logout and login again'
            });
        }


        // Attach Users Object To The Request Body
        req.body.user = user;

        // Pass To Next Middleware
        next();
}
module.exports = authMiddleware