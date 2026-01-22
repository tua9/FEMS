const RegisterAccount = require('./src/services/RegisterAccount');
const testData = require('./test-data/registration-test-data.json');

/**
 * Manual Testing with JSON Data - Tương tự test thủ công trong main method Java
 * Chạy: node manual-test-json.js
 */
async function manualTestWithJSON() {
    console.log('🧪 Manual Testing - Student Registration System (JSON Data)\n');
    console.log('='.repeat(60));
    
    const registerAccount = new RegisterAccount();
    let passCount = 0;
    let failCount = 0;
    
    // Helper function để log kết quả
    function logTestResult(testName, result, expected, passed) {
        console.log(`\n--- ${testName} ---`);
        console.log('Result:', result);
        console.log('Expected:', expected);
        console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
        console.log('-'.repeat(40));
        
        if (passed) passCount++;
        else failCount++;
    }
    
    // Test 1: Valid Registration từ JSON
    console.log('\n🔸 Testing Valid Registrations từ JSON:');
    const validUser = testData.validRegistrations[0];
    const result1 = await registerAccount.registerStudent(
        validUser.email, validUser.username, validUser.password
    );
    logTestResult(
        'Valid Registration', 
        result1,
        'success: true, message: "Student registered successfully"',
        result1.success === true && result1.message === 'Student registered successfully'
    );
    
    // Test 2: Invalid Email từ JSON
    console.log('\n🔸 Testing Invalid Email từ JSON:');
    const invalidEmail = testData.invalidEmails[1]; // "invalid-email"
    const result2 = await registerAccount.registerStudent(
        invalidEmail.email, invalidEmail.username, invalidEmail.password
    );
    logTestResult(
        'Invalid Email Test',
        result2,
        `success: false, message contains: "${invalidEmail.expectedError}"`,
        result2.success === false && result2.message.includes(invalidEmail.expectedError)
    );
    
    // Test 3: Duplicate Email
    console.log('\n🔸 Testing Duplicate Email:');
    const result3 = await registerAccount.registerStudent(
        validUser.email, 'differentuser', 'password456'
    );
    logTestResult(
        'Duplicate Email Test',
        result3,
        'success: false, message: "Email already exists"',
        result3.success === false && result3.message === 'Email already exists'
    );
    
    // Test 4: Login Test từ JSON
    console.log('\n🔸 Testing Login từ JSON:');
    const loginTest = testData.loginTestData[0];
    // Register user first
    await registerAccount.registerStudent(
        loginTest.registerFirst.email,
        loginTest.registerFirst.username, 
        loginTest.registerFirst.password
    );
    const result4 = await registerAccount.loginStudent(
        loginTest.loginData.email, 
        loginTest.loginData.password
    );
    logTestResult(
        'Valid Login Test',
        result4,
        'success: true, message: "Login successful"',
        result4.success === true && result4.message === 'Login successful'
    );
    
    // Test 5: Batch testing Invalid Passwords từ JSON
    console.log('\n🔸 Batch Testing Invalid Passwords từ JSON:');
    for (let i = 0; i < testData.invalidPasswords.length; i++) {
        const testCase = testData.invalidPasswords[i];
        const result = await registerAccount.registerStudent(
            testCase.email, testCase.username, testCase.password
        );
        
        const passed = result.success === testCase.shouldPass && 
                      result.message.includes(testCase.expectedError);
        
        console.log(`  ${i + 1}. ${testCase.description}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
        if (passed) passCount++; else failCount++;
    }
    
    // Test 6: Edge Cases từ JSON
    console.log('\n🔸 Testing Edge Cases từ JSON:');
    for (let i = 0; i < testData.edgeCases.length; i++) {
        const testCase = testData.edgeCases[i];
        const result = await registerAccount.registerStudent(
            testCase.email, testCase.username, testCase.password
        );
        
        let passed = result.success === testCase.shouldPass;
        
        // Check trimming if expected
        if (testCase.expectedTrimmedEmail && passed) {
            passed = result.student.email === testCase.expectedTrimmedEmail &&
                    result.student.username === testCase.expectedTrimmedUsername;
        }
        
        console.log(`  ${i + 1}. ${testCase.description}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
        if (passed) passCount++; else failCount++;
    }
    
    // Summary Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests Run: ${passCount + failCount}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(2)}%`);
    
    console.log('\n📋 System State:');
    console.log(`Total Students Registered: ${registerAccount.getStudentCount()}`);
    console.log('Registered Students:');
    registerAccount.getAllStudents().forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.username} (${student.email})`);
    });
    
    console.log('\n✨ Manual testing với JSON data completed!');
    
    return {
        totalTests: passCount + failCount,
        passed: passCount,
        failed: failCount,
        successRate: (passCount / (passCount + failCount)) * 100
    };
}

// Chạy manual test nếu file được execute trực tiếp
if (require.main === module) {
    manualTestWithJSON()
        .then(summary => {
            console.log('\n🎯 Final Result:', summary);
            process.exit(summary.failed > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('❌ Manual test failed:', error);
            process.exit(1);
        });
}

module.exports = { manualTestWithJSON };
