const express = require('express');
const path = require('path');
const app = express();
const port = 4000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the node_modules directory
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Send index.html for any other route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
