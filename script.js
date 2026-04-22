// S.T.A.L.K.E.R. Zone Terminal JavaScript

// Global State
let currentUser = null;
let messages = [];
let reports = [];
let currentSection = 'chat';

// Data structures
const locations = [
    {
        name: 'Кордон',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTAVkHybq9y-8hjNNC0vO8yuM_YGBSTYi86w&s',
        desc: 'Начальная зона сталкеров'
    },
    {
        name: 'Агропром',
        img: 'https://static.wikia.nocookie.net/stalker/images/0/0c/XrEngine_2017-02-24_21-34-53-71.png',
        desc: 'Научный комплекс'
    },
    {
        name: 'Тёмная Долина',
        img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
        desc: 'Заброшенная промышленная зона'
    },
    {
        name: 'Янтарь',
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        desc: 'Болотистая местность'
    },
    {
        name: 'Припять',
        img: 'https://images.unsplash.com/photo-1608178398316-45f9616a2d5b?w=800&h=400&fit=crop',
        desc: 'Город-призрак, центр Зоны'
    }
];

const traders = [
    {
        id: 'sidorovich',
        name: 'Сидорович',
        avatar: 'СИД',
        description: '«Хороший товар, хорошая цена...»',
        specialty: 'Базовые товары',
        inventory: [
            { name: 'Патроны 5.45', price: '50₽', icon: '🔫', description: 'Стандартные патроны' },
            { name: 'Аптечка', price: '150₽', icon: '💊', description: 'Лечит ранения' },
            { name: 'Хлеб', price: '20₽', icon: '🍞', description: 'Базовая еда' },
            { name: 'Водка', price: '100₽', icon: '🍺', description: 'Снимает радиацию' },
            { name: 'Бинт', price: '30₽', icon: '🩹', description: 'Первая помощь' },
            { name: 'Нож', price: '200₽', icon: '🔪', description: 'Ближний бой' }
        ]
    },
    {
        id: 'barman',
        name: 'Бармен',
        avatar: 'БАР',
        description: '«Добро пожаловать в Бар, сталкер!»',
        specialty: 'Уникальные товары',
        inventory: [
            { name: 'Артефакт «Янтарь»', price: '2000₽', icon: '💎', description: 'Снижает радиацию' },
            { name: 'Экзоскелет', price: '50000₽', icon: '🦾', description: 'Лучшая защита' },
            { name: 'Винтовка «Гром»', price: '8000₽', icon: '🔫', description: 'Мощное оружие' },
            { name: 'Детектор «Велес»', price: '3000₽', icon: '📡', description: 'Находит артефакты' },
            { name: 'Костюм «Страж Свободы»', price: '15000₽', icon: '🥋', description: 'Защита от аномалий' },
            { name: 'Энергетик', price: '80₽', icon: '⚡', description: 'Восстанавливает выносливость' }
        ]
    },
    {
        id: 'petrenko',
        name: 'Петренко',
        avatar: 'ПЕТ',
        description: '«Военное снаряжение по лучшим ценам»',
        specialty: 'Военные товары',
        inventory: [
            { name: 'Бронежилет «Военный»', price: '12000₽', icon: '🦺', description: 'Отличная защита' },
            { name: 'Шлем «Берилл»', price: '3000₽', icon: '⛑️', description: 'Защита головы' },
            { name: 'Патроны 7.62', price: '80₽', icon: '🔫', description: 'Снайперские патроны' },
            { name: 'Гранаты Ф-1', price: '300₽', icon: '💣', description: 'Фрагментационные' },
            { name: 'ПНВ', price: '5000₽', icon: '👁️', description: 'Ночное видение' },
            { name: 'Компас', price: '500₽', icon: '🧭', description: 'Навигация' }
        ]
    }
];

// User data
const users = {
    erik: {
        name: 'ERIK',
        avatar: 'https://picsum.photos/seed/erik-stalker/100/100.jpg',
        rank: 'Сталкер',
        status: 'онлайн',
        bio: 'Опытный исследователь зоны. Знаю все тайные тропы.',
        messages: 42,
        reputation: 150
    },
    fanatic: {
        name: 'FANATIC',
        avatar: 'https://picsum.photos/seed/fanatic-stalker/100/100.jpg',
        rank: 'Новичок',
        status: 'оффлайн',
        bio: 'Ищу напарников для вылазки. Есть артефакты на обмен.',
        messages: 15,
        reputation: 25
    },
    ghost: {
        name: 'GHOST',
        avatar: 'https://picsum.photos/seed/ghost-stalker/100/100.jpg',
        rank: 'Ветеран',
        status: 'онлайн',
        bio: 'Бывалый сталкер. Много раз ходил в центр зоны.',
        messages: 89,
        reputation: 320
    },
    strelok: {
        name: 'СТРЕЛОК',
        avatar: 'https://picsum.photos/seed/strelok-stalker/100/100.jpg',
        rank: 'Легенда',
        status: 'онлайн',
        bio: 'Легендарный сталкер. Спас Zone не один раз.',
        messages: 156,
        reputation: 500
    },
    wanderer: {
        name: 'WANDERER',
        avatar: 'https://picsum.photos/seed/wanderer-stalker/100/100.jpg',
        rank: 'Сталкер',
        status: 'оффлайн',
        bio: 'Вечный странник. Ищу артефакты в забытых местах.',
        messages: 67,
        reputation: 180
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateTime();
    loadStoredData();
});

// Initialize Application
function initializeApp() {
    // Load users from localStorage
    loadUsersFromStorage();
    
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showMainScreen();
    } else {
        showAuthScreen();
    }
    
    // Start time updates
    setInterval(updateTime, 1000);
    
    // Simulate radiation fluctuations
    setInterval(updateRadiation, 3000);
    
    // Initialize traders
    loadTraders();
}

// Save all users data to localStorage
function saveUsers() {
    try {
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Users data saved successfully');
    } catch (error) {
        console.error('Error saving users data:', error);
    }
}

// Load all users data from localStorage
function loadUsers() {
    try {
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            const parsedUsers = JSON.parse(savedUsers);
            // Merge with default users to preserve any new users
            Object.assign(users, parsedUsers);
            console.log('Users data loaded successfully');
        }
    } catch (error) {
        console.error('Error loading users data:', error);
    }
}

// Show save notification message
function showSaveMessage() {
    const existingMsg = document.querySelector('.save-msg');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const msg = document.createElement('div');
    msg.className = 'save-msg';
    msg.textContent = '✔ Сохранения применены';
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        if (msg.parentNode) {
            msg.remove();
        }
    }, 2000);
}

// Render profile only
function renderProfile() {
    if (!currentUser) return;
    
    const userId = currentUser.username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const user = users[userId];
    
    if (!user) return;
    
    // Update profile avatar
    const profileAvatar = document.getElementById('largeAvatar');
    if (profileAvatar) {
        profileAvatar.src = user.avatar;
    }
    
    // Update main profile if open
    const profileUsername = document.getElementById('profileUsername');
    if (profileUsername) {
        profileUsername.textContent = user.name;
    }
    
    const profileLevel = document.getElementById('profileLevel');
    if (profileLevel) {
        profileLevel.textContent = user.rank;
    }
    
    const profileDescription = document.getElementById('profileDescription');
    if (profileDescription) {
        profileDescription.textContent = user.bio;
    }
}

// Render complete UI from users data
function renderUI() {
    if (!currentUser) return;
    
    const userId = currentUser.username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const user = users[userId];
    
    if (!user) {
        console.warn('User not found in users object:', userId);
        return;
    }
    
    // Update all avatars in chat
    document.querySelectorAll('.message-avatar[data-user="' + userId + '"]').forEach(img => {
        img.src = user.avatar;
    });
    
    // Update profile avatar
    const profileAvatar = document.getElementById('largeAvatar');
    if (profileAvatar) {
        profileAvatar.src = user.avatar;
    }
    
    // Update user profile modal if open
    const userProfileAvatar = document.getElementById('userProfileAvatar');
    if (userProfileAvatar) {
        userProfileAvatar.src = user.avatar;
        userProfileAvatar.dataset.user = userId;
        
        // Update profile stats
        const messageCount = document.getElementById('userProfileMessages');
        if (messageCount) {
            messageCount.textContent = user.messages || 0;
        }
        
        const reputation = document.getElementById('userProfileReputation');
        if (reputation) {
            reputation.textContent = user.reputation || 0;
        }
        
        const userProfileName = document.getElementById('userProfileName');
        if (userProfileName) {
            userProfileName.textContent = user.name;
        }
        
        const userProfileRank = document.getElementById('userProfileRank');
        if (userProfileRank) {
            userProfileRank.textContent = user.rank;
        }
        
        const userProfileStatus = document.getElementById('userProfileStatus');
        if (userProfileStatus) {
            userProfileStatus.textContent = user.status;
        }
        
        const userProfileBio = document.getElementById('userProfileBio');
        if (userProfileBio) {
            userProfileBio.textContent = user.bio;
        }
    }
    
    // Update main profile if open
    const profileUsername = document.getElementById('profileUsername');
    if (profileUsername) {
        profileUsername.textContent = user.name;
    }
    
    const profileLevel = document.getElementById('profileLevel');
    if (profileLevel) {
        profileLevel.textContent = user.rank;
    }
    
    const profileDescription = document.getElementById('profileDescription');
    if (profileDescription) {
        profileDescription.textContent = user.bio;
    }
    
    // Re-render messages to use current avatars
    renderMessages();
    
    console.log('UI rendered successfully from users data');
}

// Legacy functions for compatibility
function saveUsersToStorage() {
    saveUsers();
}

function loadUsersFromStorage() {
    loadUsers();
}

function updateUI() {
    renderUI();
}

// Setup Event Listeners
function setupEventListeners() {
    // Auth Events
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('registerBtn').addEventListener('click', handleRegister);
    document.getElementById('switchToRegister').addEventListener('click', showRegisterForm);
    document.getElementById('switchToLogin').addEventListener('click', showLoginForm);
    
    // Navigation Events
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => switchSection(item.dataset.section));
    });
    
    // Profile Events
    document.getElementById('profileBtn').addEventListener('click', showProfileModal);
    document.getElementById('closeProfile').addEventListener('click', hideProfileModal);
    document.getElementById('saveProfile').addEventListener('click', saveProfile);
    document.getElementById('changeAvatarBtn').addEventListener('click', () => {
        document.getElementById('avatarInput').click();
    });
    document.getElementById('avatarInput').addEventListener('change', handleAvatarChange);
    
    // Chat Events
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    document.getElementById('voiceBtn').addEventListener('click', sendVoiceMessage);
    
    // Anomalies Events
    document.getElementById('newReportBtn').addEventListener('click', showReportModal);
    document.getElementById('closeReport').addEventListener('click', hideReportModal);
    document.getElementById('saveReport').addEventListener('click', saveReport);
    document.getElementById('reportImageFile').addEventListener('change', handleReportImageChange);
    
    // Map hover effects are handled by CSS
    
    // Location Modal Events
    document.getElementById('closeLocation').addEventListener('click', hideLocationModal);
    document.getElementById('locationModal').addEventListener('click', (e) => {
        if (e.target.id === 'locationModal') hideLocationModal();
    });
    
    // Trader Modal Events
    document.getElementById('closeTrader').addEventListener('click', hideTraderModal);
    document.getElementById('traderModal').addEventListener('click', (e) => {
        if (e.target.id === 'traderModal') hideTraderModal();
    });
    
    // User Profile Modal Events
    document.getElementById('closeUserProfile').addEventListener('click', hideUserProfileModal);
    document.getElementById('userProfileModal').addEventListener('click', (e) => {
        if (e.target.id === 'userProfileModal') hideUserProfileModal();
    });
    
    // User click events (delegated)
    document.addEventListener('click', (e) => {
        const userElement = e.target.closest('.clickable-user');
        if (userElement) {
            const userId = userElement.dataset.user;
            openUserProfile(userId);
        }
    });
    
    // Enter key for forms
    document.querySelectorAll('.pda-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const form = input.closest('.auth-form');
                if (form.id === 'loginForm') handleLogin();
                else if (form.id === 'registerForm') handleRegister();
            }
        });
    });
}

// Time Functions
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { hour12: false });
    
    const authTime = document.getElementById('authTime');
    const zoneTime = document.getElementById('zoneTime');
    
    if (authTime) authTime.textContent = timeString;
    if (zoneTime) zoneTime.textContent = timeString;
}

function updateRadiation() {
    const radiationLevel = document.getElementById('radiationLevel');
    if (radiationLevel) {
        const level = Math.random() * 60 + 20; // 20-80%
        radiationLevel.style.width = level + '%';
        
        // Change color based on level
        if (level > 60) {
            radiationLevel.style.background = 'linear-gradient(90deg, #ff6b6b, #8b0000)';
        } else if (level > 40) {
            radiationLevel.style.background = 'linear-gradient(90deg, #ff8c00, #ff6b6b)';
        } else {
            radiationLevel.style.background = 'linear-gradient(90deg, #ff8c00, #8fbc8f)';
        }
    }
}

// Screen Management
function showAuthScreen() {
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('mainScreen').classList.add('hidden');
}

function showMainScreen() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');
    updateProfileDisplay();
    loadMessages();
    loadReports();
}

function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// Authentication Functions
function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showGlitchEffect('loginBtn', 'Все поля обязательны!');
        return;
    }
    
    // Check stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = { ...user };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainScreen();
    } else {
        showGlitchEffect('loginBtn', 'Неверные данные!');
    }
}

function handleRegister() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || !password || !confirmPassword) {
        showGlitchEffect('registerBtn', 'Все поля обязательны!');
        return;
    }
    
    if (password !== confirmPassword) {
        showGlitchEffect('registerBtn', 'Пароли не совпадают!');
        return;
    }
    
    if (username.length < 3) {
        showGlitchEffect('registerBtn', 'Позывной слишком короткий!');
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === username)) {
        showGlitchEffect('registerBtn', 'Позывной уже занят!');
        return;
    }
    
    // Create new user
    const newUser = {
        username,
        password,
        level: 'newcomer',
        description: '',
        avatar: `https://picsum.photos/seed/${username}/100/100.jpg`,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMainScreen();
}

// Navigation Functions
function switchSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(section + 'Section').classList.add('active');
    
    currentSection = section;
}

// Profile Functions
function showProfileModal() {
    document.getElementById('profileModal').classList.remove('hidden');
    
    // Load current user data
    document.getElementById('profileCallsign').value = currentUser.username;
    document.getElementById('profileDescription').value = currentUser.description || '';
    document.getElementById('profileLevelSelect').value = currentUser.level;
    document.getElementById('largeAvatar').src = currentUser.avatar;
    
    // Clear image preview
    const preview = document.getElementById('imagePreview');
    if (preview) {
        preview.innerHTML = '<div class="image-preview-placeholder">Предпросмотр изображения</div>';
    }
}

function hideProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
}

function saveProfile() {
    const newUsername = document.getElementById('profileCallsign').value.trim();
    const newDescription = document.getElementById('profileDescription').value;
    const newLevel = document.getElementById('profileLevelSelect').value;
    
    if (!newUsername || newUsername.length < 3) {
        showGlitchEffect('saveProfile', 'Неверный позывной!');
        return;
    }
    
    // Update user data
    currentUser.username = newUsername;
    currentUser.description = newDescription;
    currentUser.level = newLevel;
    
    // Update avatar if changed
    if (currentUser.tempAvatar) {
        currentUser.avatar = currentUser.tempAvatar;
        delete currentUser.tempAvatar;
    }
    
    // Update users object
    const userId = newUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!users[userId]) {
        users[userId] = {
            name: newUsername.toUpperCase(),
            avatar: currentUser.avatar,
            rank: newLevel === 'newcomer' ? 'Новичок' : newLevel === 'stalker' ? 'Сталкер' : newLevel === 'veteran' ? 'Ветеран' : 'Легенда',
            status: 'онлайн',
            bio: newDescription,
            messages: 0,
            reputation: 0
        };
    } else {
        users[userId].name = newUsername.toUpperCase();
        users[userId].bio = newDescription;
        users[userId].rank = newLevel === 'newcomer' ? 'Новичок' : newLevel === 'stalker' ? 'Сталкер' : newLevel === 'veteran' ? 'Ветеран' : 'Легенда';
        users[userId].avatar = currentUser.avatar;
    }
    
    // Save users data
    saveUsers();
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updateProfileDisplay();
    hideProfileModal();
}

function updateProfileDisplay() {
    if (!currentUser) return;
    
    document.getElementById('profileAvatar').src = currentUser.avatar;
    
    const levelMap = {
        'newcomer': 'Новичок',
        'stalker': 'Сталкер', 
        'veteran': 'Бывалый'
    };
    
    document.getElementById('profileLevel').textContent = levelMap[currentUser.level] || currentUser.level;
    document.getElementById('profileLevel').className = 'profile-level level-' + currentUser.level;
}

// Chat Functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Increment user message counter
    const userId = currentUser.username.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!users[userId]) {
        users[userId] = {
            name: currentUser.username,
            avatar: currentUser.avatar,
            rank: currentUser.level || 'Новичок',
            status: 'онлайн',
            bio: currentUser.description || '',
            messages: 0,
            reputation: 0
        };
    }
    users[userId].messages = (users[userId].messages || 0) + 1;
    
    // Save users data
    saveUsers();
    
    const messageData = {
        id: Date.now(),
        author: currentUser.username,
        content: message,
        timestamp: new Date().toISOString(),
        level: currentUser.level
    };
    
    messages.push(messageData);
    saveMessages();
    displayMessage(messageData);
    input.value = '';
    
    // Update UI with new message count
    renderMessages();
    
    // Simulate response
    setTimeout(() => {
        simulateResponse();
    }, 2000 + Math.random() * 3000);
}

function sendVoiceMessage() {
    const voiceData = {
        id: Date.now(),
        author: currentUser.username,
        content: '[VOICE MESSAGE]',
        timestamp: new Date().toISOString(),
        level: currentUser.level,
        isVoice: true
    };
    
    messages.push(voiceData);
    saveMessages();
    displayMessage(voiceData);
    
    // Simulate voice processing
    showGlitchEffect('voiceBtn', 'Голос передан...');
}

function playVoiceMessage(messageId) {
    const voiceElement = document.getElementById(`voice-${messageId}`);
    const playBtn = voiceElement.querySelector('.voice-play-btn');
    const isPlaying = voiceElement.classList.contains('playing');
    
    if (isPlaying) {
        // Stop playing
        voiceElement.classList.remove('playing');
        playBtn.textContent = '▶️';
    } else {
        // Start playing
        voiceElement.classList.add('playing');
        playBtn.textContent = '⏸️';
        
        // Simulate playback progress
        const progressBar = voiceElement.querySelector('.voice-progress-bar');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += 2;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                voiceElement.classList.remove('playing');
                playBtn.textContent = '▶️';
                progressBar.style.width = '0%';
            }
        }, 60);
    }
}

function simulateResponse() {
    const responses = [
        'Осторожнее там, сталкер...',
        'Остерегайся аномалий в этом районе.',
        'Слыхал про находки артефактов near завод?',
        'Уровень радиации сегодня растёт.',
        'Осторожно, военные патруль замечен поблизости.',
        'Кто-нибудь хочет объединиться для экспедиции?',
        'Нашёл редкие артефакты, интересно?',
        'Zone сегодня тиха... слишком тихо.'
    ];
    
    const stalkers = ['Стрелок', 'Призрак', 'Проводник', 'Фанатик', 'Странник'];
    
    const responseData = {
        id: Date.now(),
        author: stalkers[Math.floor(Math.random() * stalkers.length)],
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        level: ['newcomer', 'stalker', 'veteran'][Math.floor(Math.random() * 3)]
    };
    
    messages.push(responseData);
    saveMessages();
    displayMessage(responseData);
}

function displayMessage(messageData) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageElement = document.createElement('div');
    
    // Determine message type and apply appropriate class
    if (messageData.author === 'SYSTEM') {
        messageElement.className = 'system-message';
        messageElement.innerHTML = `<div class="system-text">${messageData.content}</div>`;
    } else {
        const isOwn = messageData.author === currentUser.username;
        messageElement.className = `user-message ${isOwn ? 'own-message' : 'other-message'}`;
        messageElement.dataset.messageId = messageData.id;
        
        const time = new Date(messageData.timestamp).toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const deleteButton = isOwn ? 
            `<div class="message-actions">
                <button class="message-delete" onclick="deleteMessage(${messageData.id})">Удалить</button>
            </div>` : '';
        
        const userId = messageData.author.toLowerCase().replace(/[^a-z0-9]/g, '');
        const user = users[userId];
        const avatarUrl = (user && user.avatar) || messageData.avatar || `https://picsum.photos/seed/${messageData.author}/30/30.jpg`;
        
        if (messageData.isVoice) {
            messageElement.innerHTML = `
                <div class="message-header">
                    <img src="${avatarUrl}" alt="${messageData.author}" class="message-avatar clickable-user" data-user="${userId}">
                    <div class="message-info">
                        <span class="message-author level-${messageData.level} clickable-user" data-user="${userId}">${messageData.author}</span>
                        <span class="message-time">${time}</span>
                    </div>
                    ${deleteButton}
                </div>
                <div class="voice-message" id="voice-${messageData.id}">
                    <div class="voice-player">
                        <button class="voice-play-btn" onclick="playVoiceMessage(${messageData.id})">▶️</button>
                        <div class="voice-waveform">
                            ${Array(20).fill('').map(() => '<div class="voice-wave-bar"></div>').join('')}
                        </div>
                        <div class="voice-duration">0:03</div>
                    </div>
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="message-header">
                    <img src="${avatarUrl}" alt="${messageData.author}" class="message-avatar clickable-user" data-user="${userId}">
                    <div class="message-info">
                        <span class="message-author level-${messageData.level} clickable-user" data-user="${userId}">${messageData.author}</span>
                        <span class="message-time">${time}</span>
                    </div>
                    ${deleteButton}
                </div>
                <div class="message-content">${messageData.content}</div>
            `;
        }
    }
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function deleteMessage(messageId) {
    messages = messages.filter(m => m.id !== messageId);
    saveMessages();
    loadMessages();
}

function saveMessages() {
    localStorage.setItem('messages', JSON.stringify(messages));
}

function loadMessages() {
    messages = JSON.parse(localStorage.getItem('messages') || '[]');
    renderMessages();
}

function renderMessages() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = '<div class="system-message"><span class="system-text">SYSTEM: Welcome to the Zone, stalker...</span></div>';
    
    messages.forEach(message => displayMessage(message));
}

// Anomalies Functions
function showReportModal() {
    document.getElementById('reportModal').classList.remove('hidden');
}

function hideReportModal() {
    document.getElementById('reportModal').classList.add('hidden');
    // Clear form
    document.getElementById('reportTitle').value = '';
    document.getElementById('reportDescription').value = '';
    document.getElementById('reportImageFile').value = '';
    
    // Clear image preview
    const preview = document.getElementById('imagePreview');
    if (preview) {
        preview.innerHTML = '<div class="image-preview-placeholder">Предпросмотр изображения</div>';
    }
}

let reportImageData = null;

function saveReport() {
    const title = document.getElementById('reportTitle').value.trim();
    const description = document.getElementById('reportDescription').value.trim();
    
    // Enhanced validation
    if (!title) {
        showGlitchEffect('saveReport', 'Введите заголовок!');
        document.getElementById('reportTitle').focus();
        return;
    }
    
    if (!description) {
        showGlitchEffect('saveReport', 'Введите описание!');
        document.getElementById('reportDescription').focus();
        return;
    }
    
    if (title.length < 3) {
        showGlitchEffect('saveReport', 'Заголовок слишком короткий!');
        document.getElementById('reportTitle').focus();
        return;
    }
    
    if (description.length < 10) {
        showGlitchEffect('saveReport', 'Описание слишком короткое!');
        document.getElementById('reportDescription').focus();
        return;
    }
    
    const reportData = {
        id: Date.now(),
        title,
        description,
        image: reportImageData || `https://picsum.photos/seed/anomaly${Date.now()}/300/200.jpg`,
        author: currentUser.username,
        timestamp: new Date().toISOString(),
        level: currentUser.level
    };
    
    reports.push(reportData);
    saveReports();
    displayReport(reportData);
    
    // Show success message
    showSuccessMessage('Отчёт отправлен в ПДА!');
    
    hideReportModal();
    
    // Clear image data
    reportImageData = null;
}

function showSuccessMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const successMessage = {
        id: Date.now(),
        author: 'SYSTEM',
        content: message,
        timestamp: new Date().toISOString(),
        level: 'system'
    };
    
    messages.push(successMessage);
    saveMessages();
    displayMessage(successMessage);
}

function displayReport(reportData) {
    const reportsGrid = document.getElementById('reportsGrid');
    
    const reportElement = document.createElement('div');
    reportElement.className = 'report-card';
    reportElement.dataset.reportId = reportData.id;
    
    const date = new Date(reportData.timestamp).toLocaleDateString('ru-RU');
    
    reportElement.innerHTML = `
        <h3 class="report-title">${reportData.title}</h3>
        ${reportData.image ? `<img src="${reportData.image}" alt="${reportData.title}" class="report-image" onerror="this.style.display='none'">` : ''}
        <p class="report-description">${reportData.description}</p>
        <div class="report-meta">
            <span class="report-author level-${reportData.level}">${reportData.author}</span>
            <span class="report-date">${date}</span>
            ${reportData.author === currentUser.username ? '<button class="report-delete" onclick="deleteReport(' + reportData.id + ')">DELETE</button>' : ''}
        </div>
    `;
    
    reportsGrid.appendChild(reportElement);
}

function deleteReport(reportId) {
    reports = reports.filter(r => r.id !== reportId);
    saveReports();
    loadReports();
}

function saveReports() {
    localStorage.setItem('reports', JSON.stringify(reports));
}

function loadReports() {
    reports = JSON.parse(localStorage.getItem('reports') || '[]');
    const reportsGrid = document.getElementById('reportsGrid');
    reportsGrid.innerHTML = '';
    
    reports.forEach(report => displayReport(report));
}

// File Handling Functions
function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showGlitchEffect('changeAvatarBtn', 'Только изображения!');
        event.target.value = '';
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showGlitchEffect('changeAvatarBtn', 'Файл слишком большой!');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const result = e.target.result;
        
        // Update preview
        document.getElementById('largeAvatar').src = result;
        
        // Save to users object
        const userId = currentUser.username.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!users[userId]) {
            users[userId] = {
                name: currentUser.username,
                avatar: result,
                rank: currentUser.level || 'Новичок',
                status: 'онлайн',
                bio: currentUser.description || '',
                messages: 0,
                reputation: 0
            };
        } else {
            users[userId].avatar = result;
        }
        
        // Save to localStorage
        saveUsers();
        
        // Show save notification
        showSaveMessage();
        
        // Update UI immediately
        renderProfile();     // ✅ обновить профиль
        renderMessages();    // ✅ обновить чат
        
        // Store for profile save
        currentUser.tempAvatar = result;
    };
    reader.onerror = function() {
        showGlitchEffect('changeAvatarBtn', 'Ошибка загрузки!');
    };
    reader.readAsDataURL(file);
}

function handleReportImageChange(event) {
    const file = event.target.files[0];
    if (!file) {
        reportImageData = null;
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = '<div class="image-preview-placeholder">Предпросмотр изображения</div>';
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showGlitchEffect('saveReport', 'Только изображения!');
        event.target.value = '';
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showGlitchEffect('saveReport', 'Файл слишком большой!');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const result = e.target.result;
        reportImageData = result;
        
        // Show preview
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${result}" alt="Preview">`;
    };
    reader.onerror = function() {
        showGlitchEffect('saveReport', 'Ошибка загрузки!');
        reportImageData = null;
    };
    reader.readAsDataURL(file);
}

// Location Modal Functions
function openModal(loc) {
    const modal = document.getElementById('locationModal');
    
    modal.querySelector('img').src = loc.img;
    modal.querySelector('h2').textContent = loc.name;
    modal.querySelector('p').textContent = loc.desc;
    
    // Handle image loading error
    const img = modal.querySelector('img');
    img.onerror = function() {
        img.src = 'https://picsum.photos/seed/fallback-location/800/400.jpg';
    };
    
    modal.classList.remove('hidden');
}

function hideLocationModal() {
    document.getElementById('locationModal').classList.add('hidden');
}

// Location click handler
document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-location]');
    if (!el) return;
    
    const name = el.dataset.location;
    
    const location = locations.find(l => l.name === name);
    
    if (!location) {
        console.log('Локация не найдена:', name);
        return;
    }
    
    openModal(location);
});

// Trader Functions
function loadTraders() {
    const tradersContainer = document.getElementById('tradersContainer');
    tradersContainer.innerHTML = '';
    
    traders.forEach(trader => {
        const traderCard = document.createElement('div');
        traderCard.className = 'trader-card';
        traderCard.innerHTML = `
            <div class="trader-avatar">${trader.avatar}</div>
            <div class="trader-info">
                <h3>${trader.name}</h3>
                <p>"${trader.description}"</p>
                <div class="trader-specialty">${trader.specialty}</div>
                <div class="trader-action">
                    <button class="open-trader-btn" onclick="showTraderModal('${trader.id}')">Открыть</button>
                </div>
            </div>
        `;
        tradersContainer.appendChild(traderCard);
    });
}

function showTraderModal(traderId) {
    const trader = traders.find(t => t.id === traderId);
    if (!trader) return;
    
    document.getElementById('traderTitle').textContent = `Ассортимент: ${trader.name}`;
    
    const traderItems = document.getElementById('traderItems');
    traderItems.innerHTML = '';
    
    trader.inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'trader-item';
        itemElement.innerHTML = `
            <div class="trader-item-icon">${item.icon}</div>
            <div class="trader-item-name">${item.name}</div>
            <div class="trader-item-price">${item.price}</div>
            <div class="trader-item-description">${item.description}</div>
        `;
        traderItems.appendChild(itemElement);
    });
    
    document.getElementById('traderModal').classList.remove('hidden');
}

function hideTraderModal() {
    document.getElementById('traderModal').classList.add('hidden');
}

// User Profile Functions
function openUserProfile(userId) {
    const user = users[userId];
    if (!user) {
        showUserProfileError('Данные не найдены');
        return;
    }
    
    // Fill modal with user data
    document.getElementById('userProfileTitle').textContent = `Профиль: ${user.name}`;
    document.getElementById('userProfileAvatar').src = user.avatar;
    document.getElementById('userProfileName').textContent = user.name;
    document.getElementById('userProfileRank').textContent = user.rank;
    document.getElementById('userProfileStatus').textContent = user.status;
    document.getElementById('userProfileBio').textContent = user.bio;
    document.getElementById('userProfileMessages').textContent = user.messages;
    document.getElementById('userProfileReputation').textContent = user.reputation;
    
    // Set status color
    const statusElement = document.getElementById('userProfileStatus');
    statusElement.className = user.status === 'онлайн' ? 'status-indicator online' : 'status-indicator offline';
    
    // Set rank color
    const rankElement = document.getElementById('userProfileRank');
    const rankColors = {
        'Новичок': 'level-newcomer',
        'Сталкер': 'level-stalker',
        'Ветеран': 'level-veteran',
        'Легенда': 'level-legend'
    };
    rankElement.className = `rank-badge ${rankColors[user.rank] || 'level-stalker'}`;
    
    // Show modal
    document.getElementById('userProfileModal').classList.remove('hidden');
}

function hideUserProfileModal() {
    document.getElementById('userProfileModal').classList.add('hidden');
}

function showUserProfileError(message) {
    // Fill modal with error message
    document.getElementById('userProfileTitle').textContent = 'Ошибка';
    document.getElementById('userProfileAvatar').src = 'https://picsum.photos/seed/error/100/100.jpg';
    document.getElementById('userProfileName').textContent = 'Неизвестный сталкер';
    document.getElementById('userProfileRank').textContent = '---';
    document.getElementById('userProfileStatus').textContent = 'недоступен';
    document.getElementById('userProfileBio').textContent = message;
    document.getElementById('userProfileMessages').textContent = '0';
    document.getElementById('userProfileReputation').textContent = '0';
    
    // Set error styling
    document.getElementById('userProfileRank').className = 'rank-badge level-error';
    document.getElementById('userProfileStatus').className = 'status-indicator offline';
    
    // Show modal
    document.getElementById('userProfileModal').classList.remove('hidden');
}

// Utility Functions
function showGlitchEffect(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Store original text and style
    const originalText = element.textContent;
    const originalColor = element.style.color;
    const originalAnimation = element.style.animation;
    
    // Show error message
    element.textContent = message;
    element.style.color = '#8b0000';
    element.style.animation = 'glitch 0.3s';
    
    setTimeout(() => {
        element.textContent = originalText;
        element.style.color = originalColor;
        element.style.animation = originalAnimation;
    }, 2000);
}

function loadStoredData() {
    // Load messages and reports if on main screen
    if (!document.getElementById('mainScreen').classList.contains('hidden')) {
        loadMessages();
        loadReports();
    }
}

// Add CSS animation for glitch effect
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-2px); }
        40% { transform: translateX(2px); }
        60% { transform: translateX(-1px); }
        80% { transform: translateX(1px); }
    }
`;
document.head.appendChild(style);

// Map interaction
document.addEventListener('DOMContentLoaded', function() {
    const locations = document.querySelectorAll('.map-location');
    locations.forEach(location => {
        location.addEventListener('click', function() {
            const locationName = this.dataset.location;
            showGlitchEffect('zoneTime', `Location: ${locationName}`);
        });
    });
});

// Artifact counter update
function updateArtifactCounter() {
    const artifactCount = document.getElementById('artifactCount');
    if (artifactCount) {
        const count = Math.floor(Math.random() * 10);
        artifactCount.textContent = count;
    }
}

// Update artifacts periodically
setInterval(updateArtifactCounter, 10000);
