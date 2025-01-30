import exprees from 'express';
const router = exprees.Router();
import Task from '../models/Task.js';
import sendResponse from '../helpers/sendResponse.js';

router.post('/', async (req, res) => {
        const {task} = req.body;
        let newTask = new Task({task});
        newTask = await newTask.save();
        sendResponse(res, 201, false, "task created", newTask);
});

router.get('/', async (req, res) => {
    let tasks = await Task.find();
    sendResponse(res, 200, false, "task fetched succesfully", tasks);
});

router.get('/:id', async (req, res) => {
    const tasks = await Task.findById(req.params.id);
    if (!tasks) {
        return sendResponse(res, 404, true, "task not found");
    }
    sendResponse(res, 200, false, "task fetched succesfully", tasks);
});

router.put('/:id', async (req, res) => {
    const {task, completed} = req.body;
    const tasksfromdb = await Task.findById(req.params.id);
    if (!tasksfromdb) {
        return sendResponse(res, 404, true, "task not found");
    }
    if(task) tasksfromdb.task = task;
    if(completed) tasksfromdb.completed = completed;

    await tasksfromdb.save();

    sendResponse(res, 200, false, "task updated succesfully", tasksfromdb);
});


router.delete('/:id', async (req, res) => {
    const tasksfromdb = await Task.findById(req.params.id);
    if (!tasksfromdb) {
        return sendResponse(res, 404, true, "task not found");
    }
    await Task.deleteOne({_id: req.params.id});

    sendResponse(res, 200, false, "task deleted succesfully");
});


export default router;