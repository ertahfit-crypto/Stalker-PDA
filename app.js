// Firebase конфигурация
const firebaseConfig = {
  apiKey: "AIzaSyBVsfUAcq4wrYmfPV-KhA1_NhGxlh9e9GQ",
  authDomain: "stalker-pda-online.firebaseapp.com",
  projectId: "stalker-pda-online",
  storageBucket: "stalker-pda-online.firebasestorage.app",
  messagingSenderId: "699881348726",
  appId: "1:699881348726:web:1b389438115c937b00c957",
  measurementId: "G-HR2VQ6YWZY"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Глобальные переменные
let currentUser = null;
let chatListener = null;
let userListener = null;
let usersListener = null;
let usersMap = {};
let userProfile = null;
let statsListener = null;
let activityChart = null;
let activityListener = null;

// Данные о локациях
const locations = {
    cordon: {
        name: "Кордон",
        description: "Вход в Зону. Первое, что видят новички. Здесь находятся лагерь новичков и пост военных. Относительно безопасное место, но beware - мутанты и бандиты не дремлют. Идеальное место для старта.",
        image: "https://i.ytimg.com/vi/a_QtASKK9X8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDF6EK3G4DBIv__Yadbkp2Aef0Zpw",
        danger: "НИЗКАЯ",
        artifacts: "ОБЫЧНЫЕ",
        mutants: "СВИНЬИ, ПСЫ"
    },
    garbage: {
        name: "Свалка",
        description: "Промышленная зона с кучами металлолома. Бандиты считают это своей территорией. Множество аномалий и артефактов. Здесь можно найти хорошие вещи, если сможешь отбиться от бандитов.",
        image: "https://i.ytimg.com/vi/vmvo78KMk5E/sddefault.jpg",
        danger: "СРЕДНЯЯ",
        artifacts: "ХОРОШИЕ",
        mutants: "СВИНЬИ, ПЛЕСЕНЬ"
    },
    agroprom: {
        name: "Агропром",
        description: "Подземный исследовательский комплекс. Множество секретов и опасностей. Здесь проводились эксперименты, которые привели к появлению странных созданий. Очень опасно для неподготовленных сталкеров.",
        image: "https://images.steamusercontent.com/ugc/2406697825693633480/D9EAF147E3439F19B1C515EBF1C9109192A0ED76/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
        danger: "ВЫСОКАЯ",
        artifacts: "РЕДКИЕ",
        mutants: "КРОВОСОСЫ, СНОРКИ"
    },
    darkvalley: {
        name: "Тёмная долина",
        description: "Территория контролируемая бандитами. Старый завод и заброшенные деревни. Множество укрытий и тайников. Не лучшее место для одиноких сталкеров.",
        image: "https://storyboom.com.ua/wp-content/uploads/2025/02/image.jpg",
        danger: "СРЕДНЯЯ",
        artifacts: "ОБЫЧНЫЕ",
        mutants: "ЗОМБИ, ПСЫ"
    },
    bar: {
        name: "Бар 100 Рентген",
        description: "Центральная точка для всех сталкеров. Здесь можно найти работу, информацию и отдохнуть. Бармен - лучший источник слухов. Здесь собираются все группировки.",
        image: "https://stalker-news.info/wp-content/uploads/2025/01/vlx-berzin-100rads2-1.jpg",
        danger: "НИЗКАЯ",
        artifacts: "НЕТ",
        mutants: "НЕТ"
    },
    yantar: {
        name: "Янтарь",
        description: "Научная станция посреди болот. Высокий уровень радиации и психоактивных выбросов. Ученые изучают Зону, но им постоянно нужна помощь. Множество уникальных аномалий.",
        image: "https://i.ytimg.com/vi/5ayHBZxv3UQ/maxresdefault.jpg",
        danger: "ВЫСОКАЯ",
        artifacts: "УНИКАЛЬНЫЕ",
        mutants: "ЗОМБИ, КОНТРОЛЛЕР"
    },
    military: {
        name: "Военные склады",
        description: "Охраняемая территория военных. Хорошее снаряжение, но очень опасно. Военные стреляют без предупреждения. Только опытные сталкеры решаются сюда заходить.",
        image: "https://it-blok.com.ua/image/catalog/blog/2025/stalker2/%20%D1%81%D0%BA%D0%BB%D0%B0%D0%B4%D1%8B%20%D0%A1%D1%82%D0%B0%D0%BB%D0%BA%D0%B5%D1%80%202.png",
        danger: "ЭКСТРЕМАЛЬНАЯ",
        artifacts: "ОТЛИЧНЫЕ",
        mutants: "НЕТ"
    },
    pripyat: {
        name: "Припять",
        description: "Мёртвый город-призрак. Когда-то здесь жили семьи ученых и работников ЧАЭС. Теперь - логово монстров и место последнего испытания для сталкеров. Очень высокая радиация.",
        image: "https://i.ytimg.com/vi/_-iUvHbDc_A/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBMhLZzla9y2SkXczQsJ8SKCe7rdg",
        danger: "ЭКСТРЕМАЛЬНАЯ",
        artifacts: "УНИКАЛЬНЫЕ",
        mutants: "ЧЕРНОПЫХ, БЮВЕР"
    },
    chernobyl: {
        name: "ЧАЭС",
        description: "Сердце Зоны. Самый опасный и самый таинственный участок. Здесь находится Изгнанник и Монолит. Никто не знает, что скрывается в саркофаге. Легендарное место.",
        image: "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/B216/production/_123409554_gettyimages-72450926.jpg.webp",
        danger: "ЛЕТАЛЬНАЯ",
        artifacts: "ЛЕГЕНДАРНЫЕ",
        mutants: "МОНОЛИТ, ИЗГНАННИК"
    },
    redforest: {
        name: "Рыжий лес",
        description: "Аномальный лес с высоким уровнем радиации и мутантами. Деревья здесь стали рыжими из-за мутаций. Очень опасно для неподготовленных сталкеров.",
        image: "https://i.ytimg.com/vi/nLAdxTsPUHI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAcM_W0fuME0B00hgUZ4kgYmh_vkw",
        danger: "ВЫСОКАЯ",
        artifacts: "РЕДКИЕ",
        mutants: "КРОВОСОСЫ, СНОРКИ"
    },
    limansk: {
        name: "Лиманск",
        description: "Заброшенный город с узкими улицами и опасными засадами. Когда-то здесь жили люди, но после катастрофы город опустел. Множество укрытий и тайников.",
        image: "https://i.ytimg.com/vi/Qolb3YtpinU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAjhlFjt9VqNuTU3Ua-fBn5UhNvog",
        danger: "ВЫСОКАЯ",
        artifacts: "ХОРОШИЕ",
        mutants: "ЗОМБИ, ПСЫ"
    },
    radar: {
        name: "РЛС Дуга",
        description: "Огромная советская радиолокационная станция с сильным пси-воздействием. Старый радарный комплекс всё ещё работает и создаёт опасные психоактивные зоны.",
        image: "https://inside-ua.com/files/originals/rls-duha-1.webp",
        danger: "ЭКСТРЕМАЛЬНАЯ",
        artifacts: "УНИКАЛЬНЫЕ",
        mutants: "КОНТРОЛЛЕР, БЮВЕР"
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthState();
    registerServiceWorker();
});

// Регистрация Service Worker для PWA
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker зарегистрирован:', registration);
            })
            .catch(error => {
                console.log('Ошибка регистрации Service Worker:', error);
            });
    }
}

// Статистика в реальном времени
function initializeStatistics() {
    const onlineCountEl = document.getElementById('onlineCount');
    const messagesTodayEl = document.getElementById('messagesToday');
    const totalUsersEl = document.getElementById('totalUsers');

    if (!onlineCountEl || !messagesTodayEl || !totalUsersEl) return;

    // Listen to users collection for online count and total users
    statsListener = db.collection('users').onSnapshot(snapshot => {
        let onlineCount = 0;
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.online === true) {
                onlineCount++;
            }
        });

        onlineCountEl.textContent = onlineCount;
        totalUsersEl.textContent = snapshot.size;
    });

    // Listen to messages collection for today's messages
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    db.collection('chatMessages')
        .where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(today))
        .onSnapshot(snapshot => {
            messagesTodayEl.textContent = snapshot.size;
        });

    // Initialize activity chart
    initializeActivityChart();
}

// Activity Chart
function initializeActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;

    // Initialize chart with empty data
    const ctx = canvas.getContext('2d');
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const data = new Array(24).fill(0);

    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Сообщения',
                data: data,
                borderColor: '#d4a017',
                backgroundColor: 'rgba(212, 160, 23, 0.1)',
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: '#d4a017',
                pointBorderColor: '#0b0b0b',
                pointBorderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(11, 11, 11, 0.9)',
                    titleColor: '#d4a017',
                    bodyColor: '#d4a017',
                    borderColor: '#d4a017',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(212, 160, 23, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#d4a017',
                        font: {
                            size: 10,
                            family: 'VT323'
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(212, 160, 23, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#d4a017',
                        font: {
                            size: 10,
                            family: 'VT323'
                        },
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Load initial data
    loadActivityData();

    // Set up realtime updates
    setupActivityListener();
}

function loadActivityData() {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Fetch messages from last 24 hours
    db.collection('chatMessages')
        .where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(yesterday))
        .orderBy('timestamp', 'desc')
        .limit(300)
        .get()
        .then(snapshot => {
            const hourlyData = new Array(24).fill(0);

            snapshot.forEach(doc => {
                const message = doc.data();
                if (message.timestamp) {
                    const date = message.timestamp.toDate();
                    const hour = date.getHours();
                    hourlyData[hour]++;
                }
            });

            // Update chart
            if (activityChart) {
                activityChart.data.datasets[0].data = hourlyData;
                activityChart.update();
                updateActivityStatus(hourlyData);
            }
        })
        .catch(error => {
            console.error('Error loading activity data:', error);
        });
}

function setupActivityListener() {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    activityListener = db.collection('chatMessages')
        .where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(yesterday))
        .orderBy('timestamp', 'desc')
        .limit(300)
        .onSnapshot(snapshot => {
            const hourlyData = new Array(24).fill(0);

            snapshot.forEach(doc => {
                const message = doc.data();
                if (message.timestamp) {
                    const date = message.timestamp.toDate();
                    const hour = date.getHours();
                    hourlyData[hour]++;
                }
            });

            if (activityChart) {
                activityChart.data.datasets[0].data = hourlyData;
                activityChart.update();
                updateActivityStatus(hourlyData);
            }
        });
}

function updateActivityStatus(hourlyData) {
    const activityStatusEl = document.getElementById('activityStatus');
    if (!activityStatusEl) return;

    const totalMessages = hourlyData.reduce((a, b) => a + b, 0);
    const avgPerHour = totalMessages / 24;

    let status = 'СПОКОЙНО';
    let color = '#4caf50';

    if (avgPerHour > 15) {
        status = 'ОПАСНО';
        color = '#f44336';
    } else if (avgPerHour > 5) {
        status = 'АКТИВНОСТЬ';
        color = '#ff9800';
    }

    activityStatusEl.textContent = status;
    activityStatusEl.style.color = color;
}

// Логика установки PWA
let deferredPrompt;
const pwaInstallBtn = document.getElementById('pwaInstallBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    pwaInstallBtn.style.display = 'block';
});

pwaInstallBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        deferredPrompt = null;
        pwaInstallBtn.style.display = 'none';
    }
});

window.addEventListener('appinstalled', () => {
    pwaInstallBtn.style.display = 'none';
    console.log('PWA установлено');
});

function initializeApp() {
    // Добавляем эффекты при загрузке
    animateRadiationLevel();
    animateTerminalLines();

    // Обновляем время каждую минуту
    setInterval(updateTime, 60000);

    // Эффект помех периодически
    setInterval(addGlitchEffect, 8000);

    // Показываем кнопку мобильного меню на маленьких экранах
    checkMobileView();
    window.addEventListener('resize', checkMobileView);

    // Инициализируем статистику
    initializeStatistics();
}

function checkMobileView() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const authButtons = document.getElementById('authButtons');

    if (window.innerWidth <= 480) {
        if (mobileMenuBtn) {
            mobileMenuBtn.style.display = 'block';
        }
        if (authButtons && !currentUser) {
            authButtons.style.display = 'none';
        }
    } else {
        if (mobileMenuBtn) mobileMenuBtn.style.display = 'none';
        if (authButtons && !currentUser) {
            authButtons.style.display = 'flex';
        }
    }
}

function setupEventListeners() {
    // Навигация
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Форма входа
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    // Форма регистрации
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
    
    // Чат - отправка по Enter
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Закрытие модального окна по клику вне его
    document.getElementById('locationModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLocationModal();
        }
    });
}

function switchSection(sectionName) {
    // Скрываем все секции
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Показываем выбранную секцию
    document.getElementById(sectionName).classList.add('active');
    
    // Обновляем навигацию
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Специальная инициализация для чата
    if (sectionName === 'chat' && currentUser) {
        initializeChat();
    }
}

// Аутентификация
function checkAuthState() {
    auth.onAuthStateChanged(function(user) {
        currentUser = user;
        if (user) {
            // Set online status when user is authenticated
            db.collection('users').doc(user.uid).update({
                online: true,
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(() => {
                // Ignore if user document doesn't exist yet
            });
        }
        updateUserInterface(user);
    });

    // Set offline status when page is closed
    window.addEventListener('beforeunload', () => {
        if (currentUser) {
            navigator.sendBeacon('/api/offline', JSON.stringify({ uid: currentUser.uid }));
        }
    });
}

function updateUserInterface(user) {
    const profileSection = document.getElementById('profileSection');
    const authButtons = document.getElementById('authButtons');
    const guestAuthSection = document.getElementById('guestAuthSection');
    const profileNav = document.getElementById('profileNav');
    const profileFooter = document.getElementById('profileFooter');
    const profileHeader = document.querySelector('.profile-header');

    if (user) {
        // Показываем профиль
        if (window.innerWidth > 480) {
            profileSection.style.display = 'flex';
        } else {
            profileSection.style.display = '';
        }
        authButtons.style.display = 'none';

        // Скрываем секцию для гостей, показываем профиль
        if (guestAuthSection) guestAuthSection.style.display = 'none';
        if (profileNav) profileNav.style.display = 'block';
        if (profileFooter) profileFooter.style.display = 'block';
        if (profileHeader) profileHeader.style.display = 'block';

        // Загружаем профиль пользователя из Firestore
        loadUserProfile(user);

        // Проверяем мобильное представление
        checkMobileView();

        // Разблокируем чат
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const authWarning = document.getElementById('authWarning');

        messageInput.disabled = false;
        sendBtn.disabled = false;
        authWarning.style.display = 'none';

        // Инициализируем чат если на странице чата
        if (document.getElementById('chat').classList.contains('active')) {
            initializeChat();
        }
    } else {
        // Показываем кнопки авторизации на десктопе
        if (window.innerWidth > 480) {
            profileSection.style.display = 'none';
            authButtons.style.display = 'flex';
        } else {
            profileSection.style.display = '';
            authButtons.style.display = 'none';
        }

        // На мобильном показываем секцию для гостей в панели
        if (guestAuthSection) guestAuthSection.style.display = 'block';
        if (profileNav) profileNav.style.display = 'none';
        if (profileFooter) profileFooter.style.display = 'none';
        if (profileHeader) profileHeader.style.display = 'none';

        // Проверяем мобильное представление
        checkMobileView();

        // Блокируем чат
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const authWarning = document.getElementById('authWarning');

        messageInput.disabled = true;
        sendBtn.disabled = true;
        authWarning.style.display = 'block';

        // Отписываемся от чата и профиля
        if (chatListener) {
            chatListener();
            chatListener = null;
        }
        if (userListener) {
            userListener();
            userListener = null;
        }
        userProfile = null;
    }
}

// Загрузка профиля пользователя из Firestore
function loadUserProfile(user) {
    // Создаём или обновляем документ пользователя в Firestore
    const userRef = db.collection('users').doc(user.uid);
    
    // Слушаем изменения профиля в реальном времени
    userListener = userRef.onSnapshot((doc) => {
        if (doc.exists) {
            userProfile = doc.data();
            updateProfileUI(userProfile);
        } else {
            // Создаём профиль если его нет
            const defaultProfile = {
                nickname: user.displayName || user.email.split('@')[0] || 'Stalker',
                avatar: '/images/default-avatar.png',
                status: 'Новичок',
                about: '',
                level: 1,
                xp: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            userRef.set(defaultProfile);
            userProfile = defaultProfile;
            updateProfileUI(userProfile);
        }
    }, (error) => {
        console.error('Ошибка загрузки профиля:', error);
    });
}

// Обновление UI профиля
function updateProfileUI(profile) {
    const userNickname = document.getElementById('userNickname');
    const profileName = document.getElementById('profileName');
    const profileStatus = document.getElementById('profileStatus');
    const nicknameInput = document.getElementById('nicknameInput');
    const statusSelect = document.getElementById('statusSelect');
    const aboutInput = document.getElementById('aboutInput');
    const userAvatar = document.getElementById('userAvatar');
    const userAvatarLarge = document.getElementById('userAvatarLarge');
    const avatarPreview = document.getElementById('avatarPreview');
    const userLevel = document.getElementById('userLevel');
    const xpFill = document.getElementById('xpFill');
    
    if (userNickname) userNickname.textContent = profile.nickname;
    if (profileName) profileName.textContent = profile.nickname;
    if (profileStatus) profileStatus.textContent = profile.status;
    if (nicknameInput) nicknameInput.value = profile.nickname;
    if (statusSelect) statusSelect.value = profile.status;
    if (aboutInput) aboutInput.value = profile.about || '';
    if (userAvatar) userAvatar.src = profile.avatar;
    if (userAvatarLarge) userAvatarLarge.src = profile.avatar;
    if (avatarPreview) avatarPreview.src = profile.avatar;
    if (userLevel) userLevel.textContent = profile.level || 1;
    if (xpFill) xpFill.style.width = ((profile.xp || 0) % 100) + '%';
}

function updateProfileData(user) {
    // Эта функция больше не нужна, используем loadUserProfile
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const result = await auth.signInWithEmailAndPassword(email, password);

        // Auto-assign admin role for specific email
        if (email === 'erikmetr6546@gmail.com') {
            await db.collection('users').doc(result.user.uid).update({
                role: 'admin'
            });
        }

        // Set online status
        await db.collection('users').doc(result.user.uid).update({
            online: true,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        });
        switchSection('home');
        showSystemMessage('Успешный вход в систему, сталкер');
    } catch (error) {
        errorDiv.textContent = 'Ошибка доступа, сталкер: ' + getErrorMessage(error.code);
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

async function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorDiv = document.getElementById('registerError');

    // Banned nicknames filter
    const bannedNicknames = ['чмо', 'гнида', 'лох', 'эриклох', 'путин', 'зеленский'];
    const lowerUsername = username.toLowerCase();

    for (const banned of bannedNicknames) {
        if (lowerUsername.includes(banned)) {
            errorDiv.textContent = 'Недопустимый ник';
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
            return;
        }
    }

    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);

        // Обновляем displayName
        await result.user.updateProfile({
            displayName: username
        });

        // Check if this is the first user (make them admin)
        const usersSnapshot = await db.collection('users').limit(1).get();
        const isFirstUser = usersSnapshot.empty;

        // Create user profile with default role
        await db.collection('users').doc(result.user.uid).set({
            nickname: username,
            email: email,
            avatar: '/images/default-avatar.png',
            status: 'Новичок',
            about: '',
            level: 1,
            xp: 0,
            role: isFirstUser ? 'admin' : 'user',
            online: true,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        switchSection('home');
        const roleMsg = isFirstUser ? ' (первый пользователь - АДМИН)' : '';
        showSystemMessage('Регистрация завершена. Добро пожаловать в Зону, ' + username + roleMsg);
    } catch (error) {
        errorDiv.textContent = 'Ошибка регистрации: ' + getErrorMessage(error.code);
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function logout() {
    if (currentUser) {
        db.collection('users').doc(currentUser.uid).update({
            online: false,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            auth.signOut().then(() => {
                switchSection('home');
                showSystemMessage('Выход из системы выполнен');
            });
        });
    } else {
        auth.signOut().then(() => {
            switchSection('home');
            showSystemMessage('Выход из системы выполнен');
        });
    }
}

// Временная функция для назначения админа по email (вызвать в консоли браузера)
async function makeAdminByEmail(email) {
    try {
        const usersSnapshot = await db.collection('users').where('email', '==', email).get();
        if (usersSnapshot.empty) {
            console.log('Пользователь не найден');
            return;
        }
        const userDoc = usersSnapshot.docs[0];
        await userDoc.ref.update({ role: 'admin' });
        console.log('Пользователь', email, 'теперь админ');
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Временная функция для назначения админа по UID (вызвать в консоли браузера)
async function makeAdminByUID(uid) {
    try {
        await db.collection('users').doc(uid).update({ role: 'admin' });
        console.log('Пользователь с UID', uid, 'теперь админ');
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'Пользователь не найден',
        'auth/wrong-password': 'Неверный пароль',
        'auth/email-already-in-use': 'Email уже используется',
        'auth/weak-password': 'Слишком слабый пароль',
        'auth/invalid-email': 'Неверный формат email',
        'auth/network-request-failed': 'Проблемы с соединением'
    };
    return errorMessages[errorCode] || 'Неизвестная ошибка';
}

// Чат
function initializeChat() {
    if (chatListener) return;

    const chatMessages = document.getElementById('chatMessages');

    // Подписка на изменения пользователей для realtime обновления ника и аватара
    if (!usersListener) {
        usersListener = db.collection('users')
            .onSnapshot(function(snapshot) {
                snapshot.docChanges().forEach(function(change) {
                    if (change.type === 'added' || change.type === 'modified') {
                        const userData = change.doc.data();
                        usersMap[change.doc.id] = {
                            nickname: userData.nickname || 'Stalker',
                            avatar: userData.avatar || '/images/default-avatar.png',
                            role: userData.role || 'user'
                        };
                    } else if (change.type === 'removed') {
                        delete usersMap[change.doc.id];
                    }
                });

                // Перерисовываем сообщения при обновлении пользователей
                if (chatListener) {
                    refreshChatMessages();
                }
            });
    }

    chatListener = db.collection('chatMessages')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .onSnapshot(function(snapshot) {
            chatMessages.innerHTML = '';

            snapshot.docs.reverse().forEach(doc => {
                const message = doc.data();
                message.id = doc.id; // Сохраняем ID для удаления
                addMessageToChat(message);
            });

            // Прокручиваем вниз
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
}

// Перерисовка сообщений (при обновлении данных пользователей)
function refreshChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    const currentMessages = Array.from(chatMessages.children);

    currentMessages.forEach(messageDiv => {
        const messageId = messageDiv.dataset.messageId;
        if (!messageId) return;

        db.collection('chatMessages').doc(messageId).get()
            .then(doc => {
                if (doc.exists) {
                    const message = doc.data();
                    message.id = doc.id;
                    messageDiv.remove();
                    addMessageToChat(message);
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении сообщения:', error);
            });
    });
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    let message = messageInput.value.trim();

    if (!message || !currentUser) return;

    // Profanity filter with replacement
    const bannedWords = ['чмо', 'гнида', 'лох', 'еб', 'хуй', 'пизд', 'бля', 'сука', 'пидор', 'гандон', 'мудак', 'ахуе', 'ахуенный', 'блядь', 'ебучий', 'заебал', 'наебал', 'пиздец'];
    const lowerMessage = message.toLowerCase();

    for (const word of bannedWords) {
        const regex = new RegExp(word, 'gi');
        message = message.replace(regex, '***');
    }

    const messageData = {
        text: message,
        userId: currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        deleted: false
    };

    db.collection('chatMessages').add(messageData)
        .then(() => {
            messageInput.value = '';
        })
        .catch(error => {
            console.error('Ошибка отправки сообщения:', error);
            showSystemMessage('Ошибка отправки сообщения');
        });
}

function addMessageToChat(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');

    const timestamp = message.timestamp ?
        new Date(message.timestamp.toDate()).toLocaleTimeString() :
        new Date().toLocaleTimeString();

    const isOwnMessage = currentUser && message.userId === currentUser.uid;
    const isDeleted = message.deleted;

    // Get current user's role from usersMap or userProfile
    const currentUserData = currentUser ? (usersMap[currentUser.uid] || userProfile) : null;
    const isAdmin = currentUserData && currentUserData.role === 'admin';

    // Получаем актуальные данные пользователя из usersMap
    const userData = usersMap[message.userId] || {
        nickname: message.user || 'Stalker',
        avatar: message.avatar || '/images/default-avatar.png',
        role: 'user'
    };

    messageDiv.className = 'user-log';
    messageDiv.dataset.messageId = message.id;

    let messageContent = '';
    if (isDeleted) {
        messageContent = '<span class="deleted-text">Сообщение удалено</span>';
    } else {
        messageContent = `<span class="log-text">${message.text}</span>`;
    }

    const adminBadge = userData.role === 'admin' ? '<span class="admin-badge">[ADMIN]</span>' : '';
    const canDelete = (isOwnMessage || isAdmin) && !isDeleted;

    messageDiv.innerHTML = `
        <span class="log-time">[${timestamp}]</span>
        <div class="message-content-wrapper">
            <img src="${userData.avatar}" class="message-avatar" alt="${userData.nickname}">
            <div class="message-text-wrapper">
                <span class="message-nickname">${userData.nickname} ${adminBadge}</span>
                ${messageContent}
            </div>
            ${canDelete ? `<button class="delete-message-btn" onclick="deleteMessage('${message.id}')" title="Удалить сообщение">🗑️</button>` : ''}
        </div>
    `;

    chatMessages.appendChild(messageDiv);
}

function showSystemMessage(text) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    const timestamp = new Date().toLocaleTimeString();
    
    messageDiv.className = 'system-log';
    messageDiv.innerHTML = `
        <span class="log-time">[${timestamp}]</span>
        <span class="log-text">${text}</span>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Переменная для хранения ID сообщения к удалению
let messageToDelete = null;

// Открытие модалки подтверждения удаления
function openDeleteModal(messageId) {
    messageToDelete = messageId;
    document.getElementById('deleteConfirmModal').style.display = 'flex';
}

// Закрытие модалки подтверждения удаления
function closeDeleteModal() {
    messageToDelete = null;
    document.getElementById('deleteConfirmModal').style.display = 'none';
}

// Подтверждение удаления сообщения
function confirmDeleteMessage() {
    if (!messageToDelete || !currentUser) {
        closeDeleteModal();
        return;
    }

    db.collection('chatMessages').doc(messageToDelete).update({
        deleted: true,
        deletedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        showSystemMessage('Сообщение удалено');
        closeDeleteModal();
    }).catch(error => {
        console.error('Ошибка удаления сообщения:', error);
        showSystemMessage('Ошибка удаления сообщения');
        closeDeleteModal();
    });
}

// Удаление сообщения
function deleteMessage(messageId) {
    if (!currentUser) return;
    openDeleteModal(messageId);
}

// Карта локаций
function showLocation(locationKey) {
    const location = locations[locationKey];
    if (!location) return;
    
    document.getElementById('locationTitle').textContent = location.name;
    document.getElementById('locationImage').src = location.image;
    document.getElementById('locationDescription').textContent = location.description;
    document.getElementById('locationDanger').textContent = location.danger;
    document.getElementById('locationArtifacts').textContent = location.artifacts;
    document.getElementById('locationMutants').textContent = location.mutants;
    
    const modal = document.getElementById('locationModal');
    modal.classList.add('show');
    
    // Добавляем эффект открытия
    setTimeout(() => {
        modal.querySelector('.metal-modal-content').style.animation = 'modal-slide-in 0.5s ease';
    }, 100);
}

function closeLocationModal() {
    const modal = document.getElementById('locationModal');
    modal.classList.remove('show');
}

// Анимации и эффекты
function animateRadiationLevel() {
    const radValue = document.querySelector('.rad-value');
    setInterval(() => {
        const newValue = (Math.random() * 0.5 + 0.05).toFixed(2);
        radValue.textContent = newValue;
        
        // Изменяем цвет в зависимости от уровня
        if (newValue > 0.3) {
            radValue.style.color = 'var(--danger-red)';
        } else if (newValue > 0.2) {
            radValue.style.color = 'var(--warning-orange)';
        } else {
            radValue.style.color = 'var(--radiation-orange)';
        }
    }, 3000);
}

function animateTerminalLines() {
    const lines = document.querySelectorAll('.log-line');
    lines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.5}s`;
    });
}

function addGlitchEffect() {
    const randomElement = document.querySelector('.glitch-text-yellow');
    if (randomElement) {
        randomElement.style.animation = 'none';
        setTimeout(() => {
            randomElement.style.animation = '';
        }, 100);
    }
}

function updateTime() {
    // Можно добавить обновление времени в интерфейсе
    console.log('Time updated');
}

// Дополнительные эффекты при наведении
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.monitor-panel, .location-btn');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            card.style.transform = `perspective(1000px) rotateY(${(x - rect.width/2) * 0.01}deg) rotateX(${-(y - rect.height/2) * 0.01}deg)`;
        } else {
            card.style.transform = '';
        }
    });
});

// Обработка ошибок Firebase
window.addEventListener('error', function(e) {
    if (e.message.includes('firebase')) {
        console.error('Firebase error:', e);
        // Можно показать пользователю сообщение о проблеме с соединением
    }
});

// Функции профиля
function toggleProfileDropdown() {
    const profileSection = document.getElementById('profileSection');
    const profileMenu = document.getElementById('profileMenu');

    if (profileMenu.classList.contains('show')) {
        profileMenu.classList.remove('show');
        profileSection.classList.remove('active');
    } else {
        profileMenu.classList.add('show');
        profileSection.classList.add('active');
    }
}

// Мобильное меню профиля
function toggleMobileProfile() {
    const profileSection = document.getElementById('profileSection');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (profileSection.classList.contains('active')) {
        profileSection.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
    } else {
        profileSection.classList.add('active');
        if (mobileOverlay) mobileOverlay.classList.add('active');
    }
}

// Закрытие dropdown при клике вне его
document.addEventListener('click', function(e) {
    const profileSection = document.getElementById('profileSection');
    const profileMenu = document.getElementById('profileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    // Закрытие мобильного drawer при клике на overlay
    if (window.innerWidth <= 480 && mobileOverlay && e.target === mobileOverlay) {
        if (profileSection.classList.contains('active')) {
            toggleMobileProfile();
        }
        return;
    }

    // На мобильном не закрываем при клике вне (только по overlay или бургеру)
    if (window.innerWidth <= 480) {
        return;
    }

    // Закрытие dropdown на десктопе
    if (!profileSection.contains(e.target)) {
        profileMenu.classList.remove('show');
        profileSection.classList.remove('active');
    }
});

function openProfileSettings() {
    switchSection('profile-settings');
    toggleProfileDropdown();
}

function openSettings() {
    showSystemMessage('Раздел "Настройки" в разработке');
    toggleProfileDropdown();
}

function openSecurity() {
    showSystemMessage('Раздел "Безопасность" в разработке');
    toggleProfileDropdown();
}

function openMessages() {
    switchSection('chat');
    toggleProfileDropdown();
}

function openAchievements() {
    showSystemMessage('Раздел "Достижения" в разработке');
    toggleProfileDropdown();
}

// Настройки профиля
function updateNickname() {
    const newNickname = document.getElementById('nicknameInput').value.trim();
    if (!newNickname) {
        showSystemMessage('Ник не может быть пустым');
        return;
    }
    
    if (currentUser) {
        // Сохраняем в Firestore users collection
        db.collection('users').doc(currentUser.uid).update({
            nickname: newNickname
        }).then(() => {
            showSystemMessage('Ник успешно изменён');
        }).catch(error => {
            console.error('Ошибка изменения ника:', error);
            showSystemMessage('Ошибка изменения ника: ' + error.message);
        });
    }
}

function saveProfileSettings() {
    const nickname = document.getElementById('nicknameInput').value.trim();
    const status = document.getElementById('statusSelect').value;
    const about = document.getElementById('aboutInput').value.trim();
    
    if (!nickname) {
        showSystemMessage('Ник не может быть пустым');
        return;
    }
    
    if (!currentUser) {
        showSystemMessage('Необходимо авторизоваться');
        return;
    }
    
    // Сохраняем в Firestore users collection
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarUrl = avatarPreview ? avatarPreview.src : userProfile?.avatar || '/images/default-avatar.png';
    
    db.collection('users').doc(currentUser.uid).update({
        nickname: nickname,
        status: status,
        about: about,
        avatar: avatarUrl,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        showSystemMessage('Настройки профиля сохранены');
    }).catch(error => {
        console.error('Ошибка сохранения профиля:', error);
        showSystemMessage('Ошибка сохранения: ' + error.message);
    });
}

function resetAvatar() {
    const avatarPreview = document.getElementById('avatarPreview');
    const userAvatar = document.getElementById('userAvatar');
    const userAvatarLarge = document.getElementById('userAvatarLarge');
    
    const defaultAvatar = '/images/default-avatar.png';
    
    if (avatarPreview) avatarPreview.src = defaultAvatar;
    if (userAvatar) userAvatar.src = defaultAvatar;
    if (userAvatarLarge) userAvatarLarge.src = defaultAvatar;
    
    // Сохраняем в Firestore если пользователь авторизован
    if (currentUser) {
        db.collection('users').doc(currentUser.uid).update({
            avatar: defaultAvatar,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            showSystemMessage('Аватар сброшен');
        }).catch(error => {
            console.error('Ошибка сброса аватара:', error);
            showSystemMessage('Ошибка сброса аватара');
        });
    } else {
        showSystemMessage('Аватар сброшен');
    }
}

// Загрузка аватара
document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const avatarPreview = document.getElementById('avatarPreview');
            const userAvatar = document.getElementById('userAvatar');
            const userAvatarLarge = document.getElementById('userAvatarLarge');
            
            const avatarUrl = e.target.result;
            
            if (avatarPreview) avatarPreview.src = avatarUrl;
            if (userAvatar) userAvatar.src = avatarUrl;
            if (userAvatarLarge) userAvatarLarge.src = avatarUrl;
            
            // Сохраняем в Firestore если пользователь авторизован
            if (currentUser) {
                db.collection('users').doc(currentUser.uid).update({
                    avatar: avatarUrl,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    showSystemMessage('Аватар загружен');
                }).catch(error => {
                    console.error('Ошибка сохранения аватара:', error);
                    showSystemMessage('Ошибка сохранения аватара');
                });
            } else {
                showSystemMessage('Аватар загружен (сохранится при авторизации)');
            }
        };
        reader.readAsDataURL(file);
    }
});

// Загрузка сохранённых настроек при загрузке страницы
window.addEventListener('load', function() {
    // Убрали localStorage, теперь используем Firestore
});

// Экспорт функций для глобального доступа
window.switchSection = switchSection;
window.showLocation = showLocation;
window.closeLocationModal = closeLocationModal;
window.logout = logout;
window.sendMessage = sendMessage;
window.deleteMessage = deleteMessage;
window.toggleProfileDropdown = toggleProfileDropdown;
window.toggleMobileProfile = toggleMobileProfile;
window.openProfileSettings = openProfileSettings;
window.openSettings = openSettings;
window.openSecurity = openSecurity;
window.openMessages = openMessages;
window.openAchievements = openAchievements;
window.updateNickname = updateNickname;
window.saveProfileSettings = saveProfileSettings;
window.resetAvatar = resetAvatar;
