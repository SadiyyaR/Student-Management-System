const Student = require('../models/Student');

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create student
exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Duplicate field value entered' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Duplicate field value entered' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
