const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "employee",
    },
  },
  { timestamps: true }
);

employeeSchema.statics.signup = async function (name, email, password, role) {
  if (!name || !email || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Enter a strong password");
  }
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Employee already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const employee = await this.create({
    name,
    email,
    password: hash,
    role,
  });
  return employee;
};

employeeSchema.statics.login = async function (email, password) {
  if (!email || !password) throw Error("All fields must be filled");
  const employee = await this.findOne({ email });
  if (!employee) throw Error("User not found");
  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) throw Error("Incorrect password");
  return employee;
};
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
