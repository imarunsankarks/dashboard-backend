const Task = require('../schema/taskSchema'); 

const deleteAll = async (id) => {
    try {
        const result = await Task.deleteMany({ parentid: id });
        console.log(`Deleted ${result.deletedCount} tasks with parentid ${id}.`);
    } catch (error) {
        console.error(`Error deleting tasks with parentid ${id}:`, error);
    }
};

module.exports = deleteAll;
