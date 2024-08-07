// scheduleTasks.js
const cron = require('node-cron');
const Task = require('../schema/taskSchema'); 
const updationCheck = require('./updationCheck')
const moment = require('moment');

const scheduleTasks = () => {
  // Daily recurrence at 9.30 am
  cron.schedule('11 11 * * 1-5', async () => {
    await createRecurringTasks('daily');
  });

  // Weekly recurrence (every Sunday at 9.30 am)
  cron.schedule('30 9 * * 0', async () => {
    await createRecurringTasks('weekly');
  });

  // Monthly recurrence (first day of each month at 9.30 am)
  cron.schedule('30 9 1 * *', async () => {
    await createRecurringTasks('monthly');
  });
};

const initialTask = async (title,id, description, employee, status, recurrence, deadline) => {
  try {
    let newDeadline;
    switch (recurrence) {
      case 'daily':
        newDeadline = moment(new Date()).endOf('day').toDate();
        break;
      case 'weekly':
        newDeadline = moment(new Date()).endOf('week').toDate();
        break;
      case 'monthly':
        newDeadline = moment(new Date()).endOf('month').toDate();
        break;
      default:
        newDeadline = task.deadline;
    }
    const newTask = new Task({
      title: title,
      parentid: id,
      description: description,
      employee: employee,
      status: status,
      recurrence: recurrence + ' recur',
      deadline: newDeadline,
    });

    await newTask.save();
    console.log(`New ${recurrence} task created for ${employee}`);
  } catch (error) {
    console.error(`Error creating ${recurrence} tasks:`, error);
  }
}

const createRecurringTasks = async (recurrence) => {
  try {
    const tasks = await Task.find({
      recurrence: recurrence,
      deadline: { $gte: new Date() }
    });

    for (const task of tasks) {
      let newDeadline;
      switch (recurrence) {
        case 'daily':
          newDeadline = moment(new Date()).endOf('day').toDate();
          break;
        case 'weekly':
          newDeadline = moment(new Date()).endOf('week').toDate();
          break;
        case 'monthly':
          newDeadline = moment(new Date()).endOf('month').toDate();
          break;
        default:
          newDeadline = task.deadline;
      }
      const newTask = new Task({
        title: task.title,
        parentid: task._id,
        description: task.description,
        employee: task.employee,
        status: 'pending',
        recurrence: recurrence + ' recur', 
        deadline: newDeadline,
      });

      await newTask.save();
      updationCheck();
      console.log(`New ${recurrence} task created for ${task.employee}`);
    }
  } catch (error) {
    console.error(`Error creating ${recurrence} tasks:`, error);
  }
};

module.exports = {scheduleTasks, initialTask};
