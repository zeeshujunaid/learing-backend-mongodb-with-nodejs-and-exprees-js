import express from 'express';
import morgan from 'morgan';
import userRoutes from './routers/user.js';
import taskRoutes from './routers/tasks.js';
import authroutes from './routers/auth.js';
import 'dotenv/config';
import mongoose, { mongo } from 'mongoose';


// const tasks = [
//     {
//         id: 1,
//         title: "task 1",
//         description: "description 1",
//         completed: true
//     },
//     {
//         id: 2,
//         title: "task 2",
//         description: "description 2",
//         completed: false
//     },
//     {
//         id: 3,
//         title: "task 3",
//         description: "description 3",
//         completed: true
//     }
// ]

const app = express();
const port = 4000;

mongoose.connect(process.env.MONGODBURI).then(() => {
    console.log('database connected');
}).catch((err) => {
    console.log('database not connected', err);
});


// application middleware
function middelware(req, res, next) {
    console.log('middleware called');
    req.requestby = 'zeeshan';
    // res.status(200).send('system ma msla ha');
    next();
}

app.use(middelware);
app.use(express.json());
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/auth', authroutes);
app.use(morgan("tiny"));



// yeh get ka tareeka ha jis ma hum data pass krty hain
app.get('/', (req, res) => {
    console.log('get request called', req.requestby);
    res.status(200).send("server is running");
});

// yeh query ka tareeka ha jis ma hum data pass krty hain
// app.get('/', (req, res) => {
//     const { completed } = req.query;
//     let filteredTasks = tasks;
//     if (completed) {
//         filteredTasks = tasks.filter((data) => 
//             completed =="1" ? data.completed == true : data.completed == false);
//         res.status(200).json({
//             error: false,
//             message: "tasks found",
//             data: filteredTasks
//         });
//     }
// });

// yeh params ka tareeka ha jis ma hum id pass krty hain 
// app.get("/singeltask/:id", (req, res) => {
//     const task = tasks.find((data) => data.id == req.params.id);
//     if (!task) {
//         res.status(404).json({
//             error: true,
//             message: "task not found",
//             data: null
//         })
//     }
//     res.status(200).json({
//         error: false,
//         message: "task found",
//         data: task
//     })
// }
// )


// app.post('/', (req, res) => {
//     res.send('post request ha bhai!');
// });

// app.put('/', (req, res) => {
//     res.send('put request ha bhai!');
// });


// app.delete('/', (req, res) => {
//     res.send('delete request ha bhai!');
// });



app.listen(port, () => { console.log(`Example app listening on port ${port}!`); });  