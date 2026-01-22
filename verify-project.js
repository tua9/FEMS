#!/usr/bin/env node

/**
 * Quick project verification script
 * Kiểm tra nhanh dự án có hoạt động không
 */

const { execSync } = require('child_process');

console.log('🚀 Student Registration System - Project Verification\n');

const tests = [
    {
        name: 'Demo Application',
        command: 'node index.js',
        description: 'Test main demo app'
    },
    {
        name: 'Manual Testing',  
        command: 'npm run test:manual',
        description: 'Test manual JSON-based testing'
    },
    {
        name: 'Simple Jest Tests',
        command: 'npm run test:simple', 
        description: 'Test basic Jest patterns (25 tests)'
    },
    {
        name: 'Test Coverage',
        command: 'npm run test:coverage',
        description: 'Generate coverage report'
    }
];

let passedTests = 0;

tests.forEach((test, index) => {
    console.log(`\n${index + 1}. 🧪 ${test.name}`);
    console.log(`   📝 ${test.description}`);
    
    try {
        console.log(`   ⏳ Running: ${test.command}`);
        execSync(test.command, { stdio: 'pipe', cwd: process.cwd() });
        console.log(`   ✅ PASSED`);
        passedTests++;
    } catch (error) {
        console.log(`   ❌ FAILED`);
        console.log(`   🔍 Error: ${error.message.split('\n')[0]}`);
    }
});

console.log('\n' + '='.repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed: ${passedTests}/${tests.length}`);
console.log(`❌ Failed: ${tests.length - passedTests}/${tests.length}`);

if (passedTests === tests.length) {
    console.log('\n🎉 All systems working! Ready for Jest learning!');
} else {
    console.log('\n⚠️  Some issues found. Check the errors above.');
}

console.log('\n📚 Next steps:');
console.log('1. Read README.md for project overview'); 
console.log('2. Run "npm run test:simple" for basic Jest learning');
console.log('3. Run "npm test" for full test suite');
console.log('4. Open coverage/lcov-report/index.html for coverage report');
