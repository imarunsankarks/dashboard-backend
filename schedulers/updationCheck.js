const Task = require('../schema/taskSchema'); 

const updationCheck = async () => {
  try {
    const now = new Date();
    
    const allTasks = await Task.find({
    //   status: { $nin: ['pending', 'incomplete'] },
    //   deadline: { $lt: now }
    });

    const recurringTasks = [];
    const nonRecurringTasks = [];
    // console.log(allTasks);

    allTasks.forEach(task => {
      if (['daily', 'monthly', 'weekly'].includes(task.recurrence)) {
        recurringTasks.push(task);
      } else if (task.recurrence !== 'none') {
        nonRecurringTasks.push(task);
      }
    });

    const recurringTaskIds = new Set(recurringTasks.map(task => task._id.toString()));

    for (const rTask of nonRecurringTasks) {
      if (recurringTaskIds.has(rTask.parentid.toString())) {
        const parentTask = await Task.findById(rTask.parentid);

        if (rTask.status === 'in progress' || rTask.status === 'incomplete') {
          if (parentTask && parentTask.status !== rTask.status) {
            parentTask.status = rTask.status;
            await parentTask.save();
            console.log(`parent task updated to ${rTask.status}`);
          }
          break;
        } else {
          const siblingTasks = await Task.find({ parentid: rTask.parentid, recurrence: { $nin: ['daily', 'weekly', 'monthly', 'none'] } });
          const allCompleted = siblingTasks.every(task => task.status === 'completed');
          const allPending = siblingTasks.every(task => task.status === 'pending');
        //   const anyPendingCompleted = siblingTasks.some(task => task.status === 'pending');

          if (allCompleted && parentTask && parentTask.status !== 'completed') {
            parentTask.status = 'completed';
            await parentTask.save();
          }else if(allPending && parentTask && parentTask.status !== 'pending' ){
            parentTask.status = 'pending';
            await parentTask.save();
          }else if(!allPending && !allCompleted &&parentTask && parentTask.status !== 'in progress' ){
            parentTask.status = 'in progress';
            await parentTask.save();
          }
        }
      }
    }

  } catch (error) {
    console.error('Error updating task:', error);
  }
};

module.exports = updationCheck;
