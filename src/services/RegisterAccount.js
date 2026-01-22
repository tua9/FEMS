const Student = require('../models/Student');

class RegisterAccount {
    constructor() {
        this.students = []; 
    }

    // Register new student
    async registerStudent(email, username, password) {
        try {
            // Validate input data
            const validationErrors = Student.validateStudentData(email, username, password);
            if (validationErrors.length > 0) {
                throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
            }

            // Check if email already exists
            if (this.findStudentByEmail(email)) {
                throw new Error('Email already exists');
            }

            // Check if username already exists
            if (this.findStudentByUsername(username)) {
                throw new Error('Username already exists');
            }

            // Create new student
            const student = new Student(email.trim(), username.trim(), password);
            
            // Hash password
            await student.hashPassword();

            // Save student
            this.students.push(student);

            return {
                success: true,
                message: 'Student registered successfully',
                student: student.getPublicInfo()
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Find student by email
    findStudentByEmail(email) {
        return this.students.find(student => student.email.toLowerCase() === email.toLowerCase());
    }

    // Find student by username
    findStudentByUsername(username) {
        return this.students.find(student => student.username.toLowerCase() === username.toLowerCase());
    }

    // Find student by ID
    findStudentById(id) {
        return this.students.find(student => student.id === id);
    }

    // Get all students
    getAllStudents() {
        return this.students.map(student => student.getPublicInfo());
    }

    // Get total student count
    getStudentCount() {
        return this.students.length;
    }

    // Clear all students (for testing)
    clearAllStudents() {
        this.students = [];
    }

    // Login student
    async loginStudent(email, password) {
        try {
            const student = this.findStudentByEmail(email);
            if (!student) {
                throw new Error('Student not found');
            }

            const isPasswordValid = await student.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            return {
                success: true,
                message: 'Login successful',
                student: student.getPublicInfo()
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = RegisterAccount;
