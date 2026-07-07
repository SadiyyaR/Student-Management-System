const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static folder setup for serving frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Mount routers
app.use('/api/students', studentRoutes);

// Fallback to serving views for the main routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add.html'));
});

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
