const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Serve static files with proper MIME types
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/manifest+json');
        }
        if (filePath.endsWith('.js') && filePath.includes('sw.js')) {
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('Service-Worker-Allowed', '/');
        }
    }
}));

// Главный маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Service Worker route with proper headers
app.get('/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Service-Worker-Allowed', '/');
    res.sendFile(path.join(__dirname, 'sw.js'));
});

// Manifest route with proper MIME type
app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json');
    res.sendFile(path.join(__dirname, 'manifest.json'));
});

// API маршруты для будущей функциональности
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        zone: 'active',
        radiation: (Math.random() * 0.5 + 0.05).toFixed(2),
        anomalies: Math.floor(Math.random() * 10) + 1,
        stalkers: Math.floor(Math.random() * 20) + 5
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`S.T.A.L.K.E.R. PDA сервер запущен на порту ${PORT}`);
    console.log(`Откройте http://localhost:${PORT} в браузере`);
});
