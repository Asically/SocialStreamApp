const express = require('express');
const cors = require('cors'); // Import the cors module

const app = express();

// ...existing code...

app.use(cors()); // Enable CORS for all routes

// ...existing code...

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
