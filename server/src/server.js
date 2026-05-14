const app = require('./app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
    console.log('Test the API at http://localhost:' + PORT + '/');
    console.log('Health check at http://localhost:' + PORT + '/api/health');
});
