# 🔄 LUỒNG TEST TRONG DỰ ÁN - CHI TIẾT

**Sau khi xóa DataDriven.test.js, dự án hiện có 2 file test chính với 25 test cases**

---

## 📊 **TỔNG QUAN TEST SUITE**

```
Jest Test Framework
├── 📄 StudentService.test.js    (8 tests)  - Unit Testing cơ bản
└── 📄 SimpleDataDriven.test.js  (17 tests) - Data-Driven Testing đơn giản
────────────────────────────────────────────────────────────────
Total: 25 tests ✅ ALL PASSING
```

---

## 🧪 **FILE 1: StudentService.test.js (8 tests)**

### **🎯 Mục đích:** Học Jest unit testing cơ bản

### **📋 Test Structure:**
```javascript
describe('RegisterAccount - Basic Tests', () => {
    // 4 tests về registration
    test('should register a valid student') 
    test('should reject invalid email')
    test('should reject short password') 
    test('should reject duplicate email')
});

describe('Login Tests', () => {
    // 2 tests về login
    test('should login with correct credentials')
    test('should reject wrong password')
});

describe('Student Model Tests', () => {
    // 2 tests về validation
    test('should validate email correctly')
    test('should validate student data')
});
```

### **🔄 Luồng thực hiện:**
```
1. Jest khởi động
2. Đọc StudentService.test.js
3. Chạy describe blocks tuần tự:

   📋 RegisterAccount - Basic Tests:
   ├── beforeEach() → tạo mới RegisterAccount instance
   ├── Test 1: Valid registration
   │   ├── registerStudent('john@example.com', 'johndoe', 'password123')
   │   ├── Expect success = true
   │   ├── Expect message = 'Student registered successfully'
   │   └── Expect student có id và email đúng
   ├── afterEach() → clearAllStudents()
   ├── Test 2: Invalid email
   │   ├── registerStudent('invalid-email', 'johndoe', 'password123')
   │   ├── Expect success = false
   │   └── Expect message contains 'Invalid email format'
   └── ...tiếp tục cho 2 tests còn lại

   📋 Login Tests:
   ├── beforeEach() → tạo RegisterAccount + đăng ký sẵn 1 user
   ├── Test 1: Correct credentials
   │   ├── loginStudent('john@example.com', 'password123')
   │   └── Expect success = true
   ├── Test 2: Wrong password
   │   ├── loginStudent('john@example.com', 'wrongpassword')
   │   └── Expect success = false
   └── afterEach() → cleanup

   📋 Student Model Tests:
   ├── Test 1: Email validation (static method)
   │   ├── Student.isValidEmail('test@example.com') → true
   │   ├── Student.isValidEmail('invalid-email') → false
   │   └── Student.isValidEmail('') → false
   └── Test 2: Data validation (static method)
       ├── validateStudentData(valid data) → []
       └── validateStudentData(invalid data) → [errors...]
```

---

## 🎯 **FILE 2: SimpleDataDriven.test.js (17 tests)**

### **🎯 Mục đích:** Học Data-Driven Testing patterns

### **📋 Test Structure:**
```javascript
describe('Data-Driven Testing - Simple Examples', () => {
    describe('Email Validation DDT', () => {
        // 7 tests - 3 valid + 4 invalid emails
        validEmails.forEach(email => test(...))
        invalidEmails.forEach(email => test(...))
    });
    
    describe('Registration DDT', () => {
        // 5 tests - từ array testCases
        testCases.forEach(([email, username, password, shouldPass, expectedError]) => {
            test(...)
        });
    });
});

describe('Parameterized Style Testing', () => {
    // 5 tests với describe.each (modern Jest syntax)
    describe.each([...])('Email Validation: %s', (...) => {
        test(...)
    });
});
```

### **🔄 Luồng thực hiện:**
```
1. Jest đọc SimpleDataDriven.test.js
2. Parse các arrays của test data:

   📊 Email Validation DDT:
   ├── validEmails = ['test@example.com', 'user@domain.org', 'admin@company.net']
   ├── invalidEmails = ['invalid-email', '@example.com', 'test@', '']
   ├── 
   ├── forEach validEmails:
   │   ├── Test 1: "should accept valid email: test@example.com"
   │   │   └── expect(Student.isValidEmail('test@example.com')).toBe(true)
   │   ├── Test 2: "should accept valid email: user@domain.org"
   │   └── Test 3: "should accept valid email: admin@company.net"
   │
   ├── forEach invalidEmails:
   │   ├── Test 4: "should reject invalid email: invalid-email"
   │   ├── Test 5: "should reject invalid email: @example.com"
   │   ├── Test 6: "should reject invalid email: test@"
   │   └── Test 7: "should reject invalid email: ''"

   📊 Registration DDT:
   ├── testCases = [
   │   ['john@test.com', 'johndoe', 'password123', true, null],
   │   ['jane@test.com', 'janedoe', 'mypassword', true, null],
   │   ['invalid-email', 'testuser', 'password123', false, 'Invalid email format'],
   │   ['test@example.com', 'ab', 'password123', false, 'Username must be...'],
   │   ['test@example.com', 'testuser', '123', false, 'Password must be...']
   │   ]
   ├── 
   ├── forEach testCases:
   │   ├── Test 8: "Registration DDT Case 1: Valid - john@test.com"
   │   │   ├── registerStudent('john@test.com', 'johndoe', 'password123')
   │   │   └── expect(result.success).toBe(true)
   │   ├── Test 9: "Registration DDT Case 2: Valid - jane@test.com"
   │   ├── Test 10: "Registration DDT Case 3: Invalid - invalid-email"
   │   │   ├── registerStudent('invalid-email', 'testuser', 'password123')
   │   │   ├── expect(result.success).toBe(false)
   │   │   └── expect(result.message).toContain('Invalid email format')
   │   └── Test 11 & 12: Similar validation tests

   📊 Parameterized Style (describe.each):
   ├── Test data = [
   │   ['valid standard email', 'test@example.com', true],
   │   ['valid email with plus', 'user+tag@domain.com', true],
   │   ['invalid empty email', '', false],
   │   ['invalid no @ symbol', 'invalid-email', false],
   │   ['invalid starts with @', '@example.com', false]
   │   ]
   ├── 
   ├── describe.each creates 5 test groups:
   │   ├── Test 13: "Email Validation: valid standard email"
   │   ├── Test 14: "Email Validation: valid email with plus" 
   │   ├── Test 15: "Email Validation: invalid empty email"
   │   ├── Test 16: "Email Validation: invalid no @ symbol"
   │   └── Test 17: "Email Validation: invalid starts with @"
```

---

## 🔄 **LUỒNG TỔNG THỂ KHI CHẠY `npm test`**

```
🚀 npm test
├── Jest framework starts
├── 📁 Scan src/__tests__/ directory
├── 📄 Find 2 test files: StudentService.test.js, SimpleDataDriven.test.js
├── 🔄 Execute tests:
│   │
│   ├── 📄 StudentService.test.js
│   │   ├── Load RegisterAccount & Student modules
│   │   ├── Execute 8 tests in 3 describe blocks
│   │   ├── ✅ 8 PASSED, 0 failed
│   │   └── Time: ~400ms
│   │
│   └── 📄 SimpleDataDriven.test.js  
│       ├── Load RegisterAccount & Student modules
│       ├── Generate 17 dynamic tests from arrays
│       ├── Execute tests with different data sets
│       ├── ✅ 17 PASSED, 0 failed
│       └── Time: ~300ms
│
├── 📊 Generate summary:
│   ├── Test Suites: 2 passed, 2 total
│   ├── Tests: 25 passed, 25 total
│   ├── Snapshots: 0 total  
│   └── Time: ~700ms
│
└── ✅ EXIT SUCCESS
```

---

## 🎯 **SO SÁNH 2 APPROACH**

| Khía cạnh | StudentService.test.js | SimpleDataDriven.test.js |
|-----------|------------------------|--------------------------|
| **Pattern** | Traditional Unit Tests | Data-Driven Testing |
| **Test Count** | 8 tests | 17 tests |
| **Data Source** | Hard-coded trong test | Arrays & describe.each |
| **Maintainability** | Medium | High |
| **Learning Focus** | Jest basics | DDT patterns |
| **Complexity** | Simple | Medium |
| **Real-world Usage** | Component testing | Validation testing |

---

## 📚 **JEST CONCEPTS ĐÃ HỌC**

### **✅ Fundamental Concepts:**
- `describe()` - Grouping related tests
- `test()` - Individual test cases
- `expect()` - Assertions
- `beforeEach()` / `afterEach()` - Setup và cleanup

### **✅ Matchers:**
- `toBe()` - Exact equality
- `toContain()` - String/array contains
- `toHaveProperty()` - Object property exists
- `toEqual()` - Deep equality
- `toBeGreaterThan()` - Numeric comparison

### **✅ Async Testing:**
- `async/await` - Testing async functions
- Promise handling với Jest

### **✅ Data-Driven Patterns:**
- `forEach()` - Dynamic test generation
- `describe.each()` - Parameterized test groups
- Array-based test data
- Template literals trong test names

---

## 🚀 **NEXT STEPS - LEARNING PATH**

1. **📖 Hiểu cơ bản:** Chạy từng test file riêng lẻ
   ```bash
   npx jest StudentService.test.js
   npx jest SimpleDataDriven.test.js
   ```

2. **🔍 Debug mode:** Chạy với verbose output
   ```bash
   npx jest --verbose
   ```

3. **📊 Coverage analysis:** 
   ```bash
   npm run test:coverage
   ```

4. **⏰ Watch mode:** Auto-rerun khi code thay đổi
   ```bash
   npm run test:watch
   ```

**Perfect foundation để học Jest testing! 🎉**
