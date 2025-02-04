import sendResponse from '../helpers/sendResponse.js';
import  jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/User.js';



export async function authenticateuser(req, res,next) {
    try {
        const bearerToken = req?.headers?.authorization;
        console.log(bearerToken);
        const token = bearerToken?.split(" ")[1];
        console.log(token);
        if (!token) return sendResponse(res, 401, true, "Token not provided", null);
        // res.send('put request ha bhai!');

        const decoded = jwt.verify(token, process.env["AUTH-Secret"]);
        console.log(decoded);
        if(decoded){
            const user = await User.findById(decoded.id);
            if(!user) return sendResponse(res, 404, true, "User not found", null);
            req.user = decoded;
            next();
        }else{
            sendResponse(res, 500, true, "something went wrong try again ", null);
        }
    }
    catch (err) {
        console.log(err);
        sendResponse(res, 500, true, "Something went wrong", null);
    }};
