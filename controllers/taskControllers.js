const Task = require("../schema/taskSchema");
const { initialTask } = require('../schedulers/scheduler');
const updationCheck = require('../schedulers/updationCheck')
const deleteAll = require('../schedulers/deleteAll')

// get all tasks
const getAll = async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    if (!tasks) {
      return res.status(404).json({ message: "No tasks found" });
    } else {
      res.status(200).json(tasks);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
// get one task
const getOne = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "No tasks found" });
    } else {
      res.status(200).json(task);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
// post a task
const postTask = async (req, res) => {
  const { title, description, employee, status, recurrence, deadline } =
    req.body;
  try {
    const tasks = await Task.create({
      title,
      description,
      employee,
      status,
      recurrence,
      deadline,
    });
    res.status(200).json(tasks);
    if (recurrence !== 'none') {
      initialTask(title,tasks._id, description, employee, status, recurrence, deadline).catch(error => {
        console.error(`Error creating ${recurrence} task:`, error);
      });

    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "No tasks found" });
    } else {
      res.status(200).json({ msg: "task deleted", task: task.title });
      updationCheck();
      deleteAll(req.params.id);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
// update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
      }
    );
    if (!task) {
      return res.status(404).json({ message: "No tasks found" });
    } else {
      res.status(200).json(task);
      updationCheck();
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAll,
  getOne,
  postTask,
  deleteTask,
  updateTask,
};
