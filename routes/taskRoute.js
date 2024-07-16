const express = require('express');
const router = express.Router();
const {
    postTask, getAll, getOne, deleteTask, updateTask
} = require('../controllers/taskControllers')

router.get('/', getAll)

router.get('/:id', getOne)

router.post('/', postTask)

router.delete('/:id', deleteTask)

router.patch('/:id', updateTask)


module.exports = router