const fetch = require('node-fetch');

async function testLogin() {
    const loginData = {
        phoneNumber: "745678901",
        pin: "123456"
    };

    console.log('Testing login with credentials:', loginData);
    console.log('------------------------');

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        console.log('Status:', response.status);
        
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('? Login successful! Token received');
        } else {
            console.log('? Login failed:', data.message);
        }
    } catch (error) {
        console.log('Fetch error:', error.message);
    }
}

testLogin();
