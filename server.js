const express = require('express');
const path = require('path');
const apiRouter = require('./api'); // Assume you have an api.js file exporting your routes

const app = express();

// Middleware to serve static files, e.g. for your HTML
app.use(express.static(path.join(__dirname, 'public'))); // Assuming 'public' contains your static files

// Use the API routes
app.use('/api', apiRouter);

// Route for the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve your index.html
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
