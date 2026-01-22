const RegisterAccount = require('./src/services/RegisterAccount');

async function demo() {
    console.log('🎓 Student Registration System Demo\n');
    
    const registerAccount = new RegisterAccount();

    // Test registration
    console.log('1. Registering students...');
    
    const student1 = await registerAccount.registerStudent(
        'john@example.com',
        'johndoe',
        'password123'
    );
    console.log('Student 1:', student1);

    const student2 = await registerAccount.registerStudent(
        'jane@example.com',
        'janedoe',
        'password456'
    );
    console.log('Student 2:', student2);

    // Test duplicate email
    const duplicateEmail = await registerAccount.registerStudent(
        'john@example.com',
        'johnsmith',
        'password789'
    );
    console.log('Duplicate email test:', duplicateEmail);

    // Test login
    console.log('\n2. Testing login...');
    const login1 = await registerAccount.loginStudent('john@example.com', 'password123');
    console.log('Valid login:', login1);

    const login2 = await registerAccount.loginStudent('john@example.com', 'wrongpassword');
    console.log('Invalid login:', login2);

    // Show all students
    console.log('\n3. All registered students:');
    console.log(registerAccount.getAllStudents());
    console.log(`Total students: ${registerAccount.getStudentCount()}`);
}

if (require.main === module) {
    demo().catch(console.error);
}