'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth-middleware.js');
const Tasks = require('../models/task-model.js');
const tasks = new Tasks();

const Users = require('../models/user-model.js');
const users = new Users();
/**
 * @route GET /all-tasks
 * @group tasks - Task based end points
 * @param {Object} req.user.required - The authenticated user to get the tasks from
 * @returns {JSON} 200 - The list of user tasks
 * @returns {Error} 401 - Access denied
 * @security JWT
 */
router.get('/all-tasks', auth, async (req, res, next) => {
    let taskList = [];

    for (let i = 0; i < req.user.tasks.length; i++)
        taskList.push(await tasks.read(req.user.tasks[i]));

    res.send({ tasks: taskList });
});

/**
 * @route POST /add-task
 * @group tasks - Task based end points
 * @param {Object} req.user.required - The authenticated user to add a task to
 * @param {Object} req.body - The information about the task to add
 * @returns {JSON} 200 - The user record
 * @returns {Error} 401 - Access denied
 * @security JWT
 */
router.post('/add-task', auth, async (req, res, next) => {
    // cool, you should create a task
    let task = await tasks.create(req.body);


    // get the id of that task
    let t_id = task._id;

    // add that id to the user's task array
    console.log(req.user);
    let taskArr = req.user.tasks;
    taskArr.push(t_id);

    await users.update(req.user._id, { tasks: taskArr });
    let user = await users.read(req.user._id);

    res.send({ user: user });
});
/**
 * @route PATCH /update-task
 * @group tasks - Task based end points
 * @param {String} req.params.t_id.required - The task ID you want to patch
 * @param {Object} req.user.required - The authenticated user to get the tasks from
 * @returns {JSON} 200 - The updated task
 * @returns {Error} 401 - Access denied
 * @security JWT
 */
router.patch('/update-task/:t_id', auth, async (req, res, next) => {
    // let's update the task

    await tasks.update(req.params.t_id, req.body);
    let task = await tasks.read(req.params.t_id);

    res.send({ task: task });
});

/**
 * @route  DELETE /delete-task
 * @group tasks - Task based end points
 * @param {String} req.params.t_id.required - The task ID you want to delete
 * @param {Object} req.user.required - The authenticated user to get the tasks from
 * @returns {JSON} 200 - The user record
 * @returns {Error} 401 - Access denied
 * @security JWT
 */
router.delete('/delete-task/:t_id', auth, async (req, res, next) => {
    let taskArr = req.user.tasks.filter(val => {
        return val.toString() !== req.params.t_id;
    });

    await tasks.delete(req.params.t_id);
    await users.update(req.user._id, { tasks: taskArr });

    let user = await users.read(req.user._id);

    res.send({ user: user });
});
/**
 * @route PATCH /mark-done
 * @group tasks - Task based end points
 * @param {String} req.params.t_id.required - The task ID you want to patch
 * @returns {JSON} 200 - The updated task
 * @returns {Error} 401 - Access denied
 * @security JWT
 */
router.patch('/mark-done/:t_id', auth, async (req, res, next) => {
    await tasks.update(req.params.t_id, { isCompleted: true });
    let task = await tasks.read(req.params.t_id);
    res.send({ task: task });
});
/**
 * @route PATCH /mark-undone
 * @group tasks - Task based end points
 * @param {String} req.params.t_id.required - The task ID you want to patch
 * @returns {JSON} 200 - The updated task
 * @returns {Error} 401 - Access denied
 * @security JWT
 */
router.patch('/mark-undone/:t_id', auth, async (req, res, next) => {
    await tasks.update(req.params.t_id, { isCompleted: false });
    let task = await tasks.read(req.params.t_id);
    res.send({ task: task });
});

/**
 * @route GET /priority
 * @group tasks - Task based end points
 * @param {String} req.params.level.required - The priority level of tasks you wish to display
 * @param {Object} req.user.required - The authenticated user to get the tasks from
 * @returns {JSON} 200 - The list of matching tasks
 * @returns {Error} 401 - Access denied
 * @security JWT
 */
router.get('/priority/:level', auth, async (req, res) => {
    let level = parseInt(req.params.level);
    let matchingTasks = [];
    for (let i = 0; i < req.user.tasks.length; i++){
        let task = await tasks.read(req.user.tasks[i]);
        if(task.priority === level)matchingTasks.push(task);
    }

    res.send(matchingTasks);

 
});

module.exports = router;
