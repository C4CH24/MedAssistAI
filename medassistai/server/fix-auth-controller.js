const fs = require('fs');
const path = require('path');

console.log('?? Fixing Auth Controller...\n');

// Paths
const authControllerPath = 'src/controllers/auth.controller.js';
const generateTokenPath = 'src/utils/generateToken.js';

// 1. Check/Create generateToken.js
console.log('?? Checking generateToken.js...');
if (!fs.existsSync(generateTokenPath)) {
    const tokenContent = `const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

module.exports = generateToken;`;
    
    fs.writeFileSync(generateTokenPath, tokenContent);
    console.log('? Created generateToken.js');
} else {
    console.log('? generateToken.js exists');
}

// 2. Fix auth controller imports
console.log('\n?? Fixing auth.controller.js...');
let authContent = fs.readFileSync(authControllerPath, 'utf8');

// Check if generateToken is imported
if (!authContent.includes('generateToken')) {
    // Add import after User import
    authContent = authContent.replace(
        "const User = require('../models/User');",
        "const User = require('../models/User');\nconst { generateToken } = require('../utils/generateToken');"
    );
    console.log('? Added generateToken import');
}

// Check if jwt is imported (might not be needed anymore)
if (authContent.includes("require('jsonwebtoken')")) {
    // Remove jwt import since we're using generateToken
    authContent = authContent.replace("const jwt = require('jsonwebtoken');\n", '');
    console.log('? Removed unused jwt import');
}

fs.writeFileSync(authControllerPath, authContent);
console.log('? Auth controller updated');

// 3. Check the login function structure
console.log('\n?? Verifying login function...');
const loginMatch = authContent.match(/exports\.login = async.*?\{[\s\S]*?\}/);
if (loginMatch) {
    console.log('? Login function found');
    
    // Check if generateToken is used
    if (loginMatch[0].includes('generateToken')) {
        console.log('? generateToken used in login function');
    } else {
        console.log('?? generateToken not found in login function');
    }
}

console.log('\n?? All fixes applied! Restart your server and test login again.');
