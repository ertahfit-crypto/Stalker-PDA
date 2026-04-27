const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Главный маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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
