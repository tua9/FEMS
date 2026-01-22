const RegisterAccount = require('../services/RegisterAccount');
const Student = require('../models/Student');

/**
 * Simple Data-Driven Testing - Chỉ những pattern cơ bản
 * Để hiểu Jest + DDT concept
 */
describe('Data-Driven Testing - Simple Examples', () => {
    let registerAccount;

    beforeEach(() => {
        registerAccount = new RegisterAccount();
    });

    afterEach(() => {
        registerAccount.clearAllStudents();
    });

    // DDT với inline data (đơn giản nhất)
    describe('Email Validation DDT', () => {
        // Valid emails
        const validEmails = [
            'test@example.com',
            'user@domain.org',
            'admin@company.net'
        ];

        // Invalid emails  
        const invalidEmails = [
            'invalid-email',
            '@example.com',
            'test@',
            ''
        ];

        // Test valid emails
        validEmails.forEach(email => {
            test(`should accept valid email: ${email}`, () => {
                expect(Student.isValidEmail(email)).toBe(true);
            });
        });

        // Test invalid emails
        invalidEmails.forEach(email => {
            test(`should reject invalid email: "${email}"`, () => {
                expect(Student.isValidEmail(email)).toBe(false);
            });
        });
    });

    // DDT với test cases array (tương tự @ParameterizedTest)
    describe('Registration DDT', () => {
        const testCases = [
            // [email, username, password, shouldPass, expectedErrorContains]
            ['john@test.com', 'johndoe', 'password123', true, null],
            ['jane@test.com', 'janedoe', 'mypassword', true, null],
            ['invalid-email', 'testuser', 'password123', false, 'Invalid email format'],
            ['test@example.com', 'ab', 'password123', false, 'Username must be at least 3 characters long'],
            ['test@example.com', 'testuser', '123', false, 'Password must be at least 6 characters long']
        ];

        testCases.forEach(([email, username, password, shouldPass, expectedError], index) => {
            test(`Registration DDT Case ${index + 1}: ${shouldPass ? 'Valid' : 'Invalid'} - ${email}`, async () => {
                const result = await registerAccount.registerStudent(email, username, password);
                
                if (shouldPass) {
                    expect(result.success).toBe(true);
                    expect(result.student.email).toBe(email);
                } else {
                    expect(result.success).toBe(false);
                    expect(result.message).toContain(expectedError);
                }
            });
        });
    });
});

// Jest describe.each syntax (modern approach)
describe('Parameterized Style Testing', () => {
    // Test với describe.each (tương tự @ParameterizedTest)
    describe.each([
        ['valid standard email', 'test@example.com', true],
        ['valid email with plus', 'user+tag@domain.com', true], 
        ['invalid empty email', '', false],
        ['invalid no @ symbol', 'invalid-email', false],
        ['invalid starts with @', '@example.com', false]
    ])('Email Validation: %s', (description, email, expected) => {
        test(`should return ${expected} for "${email}"`, () => {
            expect(Student.isValidEmail(email)).toBe(expected);
        });
    });
});
