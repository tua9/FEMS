async function test() {
  const baseURL = 'http://localhost:5001/api';
  try {
    console.log('--- Testing Login ---');
    const loginRes = await fetch(`${baseURL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin1', password: 'admin1' })
    });
    
    const loginData = await loginRes.json();
    console.log('Login Status:', loginRes.status);
    
    if (loginRes.status !== 200) {
      console.log('Login failed:', loginData);
      return;
    }

    const setCookie = loginRes.headers.get('set-cookie');
    console.log('Cookies received.');

    const headers = { 
      'Cookie': setCookie,
      'Content-Type': 'application/json'
    };

    console.log('\n--- Testing GET /api/admin/users ---');
    const usersRes = await fetch(`${baseURL}/admin/users`, { headers });
    const usersData = await usersRes.json();
    console.log('Status:', usersRes.status);
    console.log('Data:', Array.isArray(usersData) ? `Array[${usersData.length}]` : usersData);

    console.log('\n--- Testing GET /api/requests ---');
    const borrowsRes = await fetch(`${baseURL}/requests`, { headers });
    const borrowsData = await borrowsRes.json();
    console.log('Status:', borrowsRes.status);
    console.log('Data:', Array.isArray(borrowsData) ? `Array[${borrowsData.length}]` : borrowsData);

  } catch (err) {
    console.error('Error:', err);
  }
}

test();
