import express from 'express';
import sendResponse from '../helpers/sendResponse.js';
import  jwt from 'jsonwebtoken';
import User from '../models/User.js';
import 'dotenv/config';
import { authenticateuser } from '../middelware/authentication.js';
const router = express.Router();
const users = [
    {
        id: 1,
        fullname: "zeeshan",
        age: 20,
        email: "XXXXXXXXXXXXXXXXX"
    },
    {
        id: 2,
        fullname: "ali",
        age: 21,
        email: "XXXXXXXXXXXXX"
    },
    {
        id: 3,
        fullname: "ahmed",
        age: 22,
        email: "XXXXXXXXXXXXXXX"
    }
]


router.get('/', (req, res) => {
    res.status(200).json({
        error: false,
        message: "all users fetched successfully",
        data: users
    })
});

router.post('/', (req, res) => {
    const { fullname, email } = req.body;
    console.log(fullname, email);


    // Generate a new ID based on the last user's ID
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    // Push the new user
    users.push({ id: newId, fullname, email, age: users.length + 20 });

    res.status(201).json({
        error: false,
        message: "User added successfully",
        data: users
    });
});

router.get('/:id', (req, res) => {
    const user = users.find((data) => data.id == req.params.id);
    if (!user) {
        res.status(404).json({
            error: true,
            message: "users not found",
            data: null
        })
    }
    res.status(200).json({
        error: false,
        message: "users found successfully",
        data: user
    })
});

router.put('/',authenticateuser, async (req, res) => {
    try {
        const {city,country} = req.body;
    const user = await User.findOneAndUpdate(

        { 
            _id: req.user.id,
         },
        {
            city,
            country,
        },{
            new: true,
        }

    ).exec();
        sendResponse(res, 200, false, "User updated successfully", user);
    }
    catch (err) {
        console.log(err);
        sendResponse(res, 401, true, "Something went wrong", null);
    }});


export default router;