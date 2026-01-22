const bcrypt = require('bcryptjs');

// Simple ID generator function
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

class Student {
    constructor(email, username, password) {
        this.id = generateId();
        this.email = email;
        this.username = username;
        this.password = password;
        this.createdAt = new Date();
    }

    // Validate student data
    static validateStudentData(email, username, password) {
        const errors = [];

        // Email validation
        if (!email || !email.trim()) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(email)) {
            errors.push('Invalid email format');
        }

        // Username validation
        if (!username || !username.trim()) {
            errors.push('Username is required');
        } else if (username.length < 3) {
            errors.push('Username must be at least 3 characters long');
        }

        // Password validation
        if (!password || !password.trim()) {
            errors.push('Password is required');
        } else if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }

        return errors;
    }

    // Email format validation
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Hash password
    async hashPassword() {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        return this.password;
    }

    // Compare password
    async comparePassword(plainPassword) {
        return await bcrypt.compare(plainPassword, this.password);
    }

    // Get student info (without password)
    getPublicInfo() {
        return {
            id: this.id,
            email: this.email,
            username: this.username,
            createdAt: this.createdAt
        };
    }
}

module.exports = Student;
