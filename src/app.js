const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const todoRoutes = require('./routes/todos');
app.use('/', todoRoutes);

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).render('error', { error: 'Page not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Todo app is running on http://localhost:${PORT}`);
});

module.exports = app;