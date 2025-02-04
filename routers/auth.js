import exprees from 'express';
import user from '../models/User.js';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import sendResponse from '../helpers/sendResponse.js';
const router = exprees.Router();


const registerSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(6).required(),
    fullname: Joi.string().alphanum().min(3).max(30).required(),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(6).required(),
});


router.post('/register', async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
        console.log("Validation error:", error.message);
        return sendResponse(res, 400, true, error.message, null);
    }

    // Check if user already exists
    const existingUser = await user.findOne({ email: value.email });  // ✅ Renamed variable
    if (existingUser) {
        return sendResponse(res, 403, true, "User with this email already exists", null);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(value.password, 12);  // ✅ Added `await`
    value.password = hashedPassword;

    // Save new user
    let newUser = new user({ ...value });  
    newUser = await newUser.save();

    sendResponse(res, 201, false, "User registered successfully", newUser);
});

router.post('/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
        console.log("Validation error:", error.message);
        return sendResponse(res, 400, true, error.message, null);
    }

    // Check if user exists
    const existingUser = await user.findOne({ email: value.email }).lean();
    if (!existingUser) {
        return sendResponse(res, 403, true, "User with this email does not exist", null);
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(value.password, existingUser.password);
    if (!isPasswordValid) {
        return sendResponse(res, 403, true, "Invalid credentials", null);
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: existingUser._id, email: existingUser.email },  // Payload (avoid storing full user object)
        process.env["AUTH-Secret"],  // ✅ Corrected Environment Variable Access
        { expiresIn: "1h" }  // Token expiry time
    );

    sendResponse(res, 200, false, "User login successful", { existingUser, token });
});


export default router;


// router.post('/reset-password', async (req, res) => {});
// router.post('/forget-password', async (req, res) => {});