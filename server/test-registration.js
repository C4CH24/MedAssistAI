const fetch = require('node-fetch');

const testFormats = [
    { phoneNumber: "723456789", desc: "9 digits no leading zero" },
    { phoneNumber: "0723456789", desc: "10 digits with leading zero" },
    { phoneNumber: "254723456789", desc: "with country code" },
    { phoneNumber: "+254723456789", desc: "with plus and country code" }
];

async function testRegistration() {
    for (const test of testFormats) {
        console.log(`\n?? Testing: ${test.desc} - ${test.phoneNumber}`);
        
        const body = {
            phoneNumber: test.phoneNumber,
            fullName: "Dylan Fadhili",
            pin: "123456",
            language: "en"
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.text();
            console.log(`Status: ${response.status}`);
            console.log(`Response: ${data}`);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }
}

testRegistration();
