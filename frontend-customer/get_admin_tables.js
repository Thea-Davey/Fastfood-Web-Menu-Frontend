async function run() {
  const apiUrl = 'https://fastfood-web-menu-backend-production.up.railway.app';
  
  try {
    // Step 1: Login to get token
    const loginRes = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@blainewings.com',
        password: 'password123'
      })
    });

    console.log('Login Status:', loginRes.status);
    const loginJson = await loginRes.json();
    
    if (!loginRes.ok) {
      console.error('Login failed:', loginJson);
      return;
    }

    const token = loginJson.data?.access_token ?? loginJson.access_token;
    console.log('Login successful, token retrieved.');

    // Step 2: Fetch tables
    const tablesRes = await fetch(`${apiUrl}/api/tables`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Fetch Tables Status:', tablesRes.status);
    const tablesJson = await tablesRes.json();
    console.log('Tables Data:');
    console.log(JSON.stringify(tablesJson, null, 2));

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
