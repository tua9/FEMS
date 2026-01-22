const RegisterAccount = require('../services/RegisterAccount');
const Student = require('../models/Student');

/**
 * Basic Jest Tests - Simplified for Learning Purpose
 * Các test case cơ bản để hiểu Jest framework
 */
describe('RegisterAccount - Basic Tests', () => {
    let registerAccount;

    beforeEach(() => {
        registerAccount = new RegisterAccount();
    });

    afterEach(() => {
        registerAccount.clearAllStudents();
    });

    // Test cơ bản: Registration thành công
    test('should register a valid student', async () => {
        const result = await registerAccount.registerStudent(
            'john@example.com',
            'johndoe',
            'password123'
        );

        expect(result.success).toBe(true);
        expect(result.message).toBe('Student registered successfully');
        expect(result.student).toHaveProperty('id');
        expect(result.student.email).toBe('john@example.com');
    });

    // Test validation: Email invalid
    test('should reject invalid email', async () => {
        const result = await registerAccount.registerStudent(
            'invalid-email',
            'johndoe',
            'password123'
        );

        expect(result.success).toBe(false);
        expect(result.message).toContain('Invalid email format');
    });

    // Test validation: Password quá ngắn
    test('should reject short password', async () => {
        const result = await registerAccount.registerStudent(
            'john@example.com',
            'johndoe',
            '123'
        );

        expect(result.success).toBe(false);
        expect(result.message).toContain('Password must be at least 6 characters long');
    });

    // Test duplicate: Email đã tồn tại
    test('should reject duplicate email', async () => {
        // Đăng ký student đầu tiên
        await registerAccount.registerStudent(
            'john@example.com',
            'johndoe',
            'password123'
        );

        // Thử đăng ký với email trùng
        const result = await registerAccount.registerStudent(
            'john@example.com',
            'jane',
            'password456'
        );

        expect(result.success).toBe(false);
        expect(result.message).toBe('Email already exists');
    });
});

describe('Login Tests', () => {
    let registerAccount;

    beforeEach(async () => {
        registerAccount = new RegisterAccount();
        // Setup: đăng ký 1 student để test login
        await registerAccount.registerStudent(
            'john@example.com',
            'johndoe',
            'password123'
        );
    });

    afterEach(() => {
        registerAccount.clearAllStudents();
    });

    test('should login with correct credentials', async () => {
        const result = await registerAccount.loginStudent(
            'john@example.com',
            'password123'
        );

        expect(result.success).toBe(true);
        expect(result.message).toBe('Login successful');
    });

    test('should reject wrong password', async () => {
        const result = await registerAccount.loginStudent(
            'john@example.com',
            'wrongpassword'
        );

        expect(result.success).toBe(false);
        expect(result.message).toBe('Invalid password');
    });
});

describe('Student Model Tests', () => {
    test('should validate email correctly', () => {
        expect(Student.isValidEmail('test@example.com')).toBe(true);
        expect(Student.isValidEmail('invalid-email')).toBe(false);
        expect(Student.isValidEmail('')).toBe(false);
    });

    test('should validate student data', () => {
        // Valid data
        const validErrors = Student.validateStudentData(
            'john@example.com',
            'johndoe',
            'password123'
        );
        expect(validErrors).toEqual([]);

        // Invalid data
        const invalidErrors = Student.validateStudentData(
            'invalid-email',
            'jo',
            '123'
        );
        expect(invalidErrors.length).toBeGreaterThan(0);
    });
});