# 📚 STUDENT REGISTRATION SYSTEM - JEST TESTING PROJECT

**Mục đích:** Học Jest testing framework với Node.js thông qua dự án đăng ký sinh viên đơn giản

---

## 🎯 **MỤC ĐÍCH DỰ ÁN**
- ✅ Học **Jest testing framework**  
- ✅ Hiểu **Unit Testing** patterns
- ✅ Thực hành **Data-Driven Testing** (DDT)
- ✅ So sánh với **JUnit testing** (Java)
- ✅ **Manual vs Automated testing**

---

## 📁 **CẤU TRÚC DỰ ÁN**

```
FEMS/
├── 📄 package.json              # Dependencies & scripts
├── 📄 index.js                  # Demo app (main method style)
├── 📄 manual-test-json.js       # Manual testing với JSON data
│
├── 📁 src/
│   ├── 📁 models/
│   │   └── Student.js           # Student model & validation
│   │
│   ├── 📁 services/
│   │   └── RegisterAccount.js   # Registration business logic
│   │
│   └── 📁 __tests__/            # Jest test files
│       ├── StudentService.test.js      # Unit tests (8 tests)
│       └── SimpleDataDriven.test.js    # DDT đơn giản (17 tests)
│
├── 📁 test-data/
│   └── registration-test-data.json     # Test data cho DDT
│
└── 📁 coverage/                 # Coverage reports (auto-generated)
```

---

## 🔧 **VAI TRÒ TỪNG FILE**

### **📦 Core Files:**
- **`package.json`** - Dependencies (jest, bcryptjs, uuid), test scripts
- **`index.js`** - Demo app, tương đương main() method trong Java

### **📚 Business Logic:**
- **`src/models/Student.js`** - Data model, validation logic
- **`src/services/RegisterAccount.js`** - Registration service (login, register, password hashing)

### **🧪 Test Files:**
- **`StudentService.test.js`** - **8 tests** - Unit testing cơ bản
- **`SimpleDataDriven.test.js`** - **17 tests** - DDT patterns đơn giản

### **📊 Test Data:**
- **`test-data/registration-test-data.json`** - External test data cho DDT
- **`manual-test-json.js`** - Manual testing script (non-Jest)

### **📈 Generated:**
- **`coverage/`** - Jest coverage reports (HTML + JSON)

---

## 🚀 **LUỒNG HOẠT ĐỘNG**

### **1. 🎪 Demo Application:**
```bash
npm start                    # Chạy demo registration system
```
**Luồng:** index.js → RegisterAccount.registerStudent() → Student validation → bcrypt hashing → success/error

### **2. 🔧 Manual Testing:**
```bash
npm run test:manual          # Test thủ công với JSON data
```
**Luồng:** manual-test-json.js → load JSON data → test scenarios → custom reporting

### **3. 🧪 Automated Testing:**
```bash
npm test                     # Chạy tất cả Jest tests
npm run test:simple          # Chỉ chạy tests đơn giản (25 tests)
npm run test:coverage        # Chạy tests + coverage report
```

**Luồng Jest:**
```
Jest framework
├── Discover test files (**/*.test.js)
├── Setup (beforeEach)
├── Run test cases
├── Assertions (expect)
├── Cleanup (afterEach)
└── Generate report
```

### **4. 📊 Test Patterns:**

#### **A. Unit Testing Pattern:**
```javascript
describe('RegisterAccount', () => {
    beforeEach(() => setup());
    afterEach(() => cleanup());
    
    test('should register valid student', () => {
        // Arrange, Act, Assert
    });
});
```

#### **B. Data-Driven Testing Pattern:**
```javascript
// Simple DDT
const testCases = [['email', 'user', 'pass', true]];
testCases.forEach(([email, user, pass, expected]) => {
    test(`case: ${email}`, () => {
        expect(register(email, user, pass)).toBe(expected);
    });
});

// JSON DDT  
const jsonData = require('../test-data/data.json');
jsonData.validCases.forEach(testCase => {
    test(testCase.description, () => {
        // test logic
    });
});
```

---

## 📊 **SO SÁNH VỚI JUNIT**

| Concept | JUnit 5 | Jest | File Demo |
|---------|---------|------|-----------|
| **Test Class** | `@Test class` | `describe()` | StudentService.test.js |
| **Test Method** | `@Test void test()` | `test('name', () => {})` | All test files |
| **Setup** | `@BeforeEach` | `beforeEach()` | All test files |
| **Cleanup** | `@AfterEach` | `afterEach()` | All test files |
| **Assertions** | `assertEquals(expected, actual)` | `expect(actual).toBe(expected)` | All test files |
| **Parameterized** | `@ParameterizedTest @CsvSource` | `describe.each()` | SimpleDataDriven.test.js |
| **Data-Driven** | `@CsvFileSource` | `forEach()` with JSON | DataDriven.test.js |

---

## 🎯 **HỌC JEST QUA DỰ ÁN NÀY**

### **📚 Concepts được cover:**
1. ✅ **Basic Testing** - describe, test, expect
2. ✅ **Async Testing** - async/await với database operations  
3. ✅ **Setup/Teardown** - beforeEach, afterEach
4. ✅ **Matchers** - toBe, toContain, toHaveProperty, toBeTruthy
5. ✅ **Data-Driven Testing** - forEach, describe.each
6. ✅ **External Data** - JSON file loading
7. ✅ **Coverage** - jest --coverage
8. ✅ **Manual vs Automated** - comparison

### **📋 Recommended Learning Path:**
1. **Start:** `npm start` - hiểu business logic
2. **Manual:** `npm run test:manual` - hiểu test scenarios  
3. **Simple:** `npm run test:simple` - học Jest basics (25 tests)
4. **Advanced:** `npm test` - xem full test suite
5. **Coverage:** `npm run test:coverage` - analyze coverage report

---

## 🎉 **KẾT LUẬN**

Dự án này cung cấp **complete learning experience** cho Jest testing:
- ✅ **2 test files** với different patterns
- ✅ **25 test cases** covering various scenarios  
- ✅ **Multiple approaches** - unit, DDT, manual
- ✅ **Real-world example** - student registration system
- ✅ **Professional practices** - coverage, CI/CD ready

**Perfect để học Jest từ cơ bản đến nâng cao!** 🚀
