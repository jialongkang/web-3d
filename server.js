const express = require('express');
const path = require('path');
const app = express();

// Use the port provided by Heroku or default to 4000 for local development
const port = process.env.PORT || 4000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "node_modules" directory
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Send index.html for the homepage route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server and listen on the dynamic Heroku port or 4000 locally
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
