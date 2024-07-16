const Employee = require('../schema/employeeSchema');
const jwt = require('jsonwebtoken');

// create token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '30d' });
};

const signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const employee = await Employee.signup(name, email, password, role);
        const token = createToken(employee._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const employee = await Employee.login(email, password);
        const token = createToken(employee._id);
        const role = employee.role;
        const name = employee.name;
        res.status(200).json({ email, token, name, role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    signup,
    login
}