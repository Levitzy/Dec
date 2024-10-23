const express = require('express');
const path = require('path');
const apiRouter = require('./api'); // Assuming you have an api.js file for API routes

const app = express();

// Middleware to serve static files (e.g., HTML, CSS, JS files from 'public' directory)
app.use(express.static(path.join(__dirname, 'public')));

// Use the API routes defined in api.js
app.use('/api', apiRouter);

// Serve the index.html page for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the main HTML file
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
