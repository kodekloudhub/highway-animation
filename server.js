const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from public directory
app.use(express.static('public'));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Highway Animation Server is running' });
});

app.get('/api/pod-info', (req, res) => {
    // Get pod count from Kubernetes API or environment variable
    const podCount = parseInt(process.env.POD_COUNT) || 1;
    res.json({ podCount });
});

app.listen(PORT, () => {
    console.log(`🚗 Highway Animation Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${path.join(__dirname, 'public')}`);
});