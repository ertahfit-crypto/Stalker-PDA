// S.T.A.L.K.E.R. Zone Terminal JavaScript

// Global State
var currentUser = null;
let messages = [];
let reports = [];
let currentSection = 'chat';

// Data structures
const locations = [
    {
        name: 'Припять',
        img: 'https://it-blok.com.ua/image/catalog/blog/2025/stalker2/pripyat-stalker-2-intro.jpg.pagespeed.ce.cw7HSIcBjU.jpg',
        desc: 'Заброшенный город-призрак',
        highlight: true
    },
    {
        name: 'Кордон',
        img: 'https://stalker-worlds.games/forum/uploads/imgs/sw_150132905__escape_farm.jpg',
        desc: 'Начальная зона сталкеров',
        highlight: false
    },
    {
        name: 'Свалка',
        img: 'https://pbs.twimg.com/media/FvSWgT1X0AAFjyN.jpg',
        desc: 'Территория металлолома и бандитов',
        highlight: false
    },
    {
        name: 'Агропром',
        img: 'https://i.ytimg.com/vi/USTs82H1MAA/sddefault.jpg',
        desc: 'Научный комплекс с лабораториями',
        highlight: false
    },
    {
        name: 'Темная долина',
        img: 'https://stalker-worlds.games/uploads/photos/show/2160_gibya-lcsb.jpg',
        desc: 'Опасная зона с аномалиями',
        highlight: false
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
            { name: 'Аммуниция 9x18', price: 50, category: 'ammo' },
            { name: 'Медикаменты', price: 100, category: 'meds' },
            { name: 'Антирад', price: 75, category: 'consumables' },
            { name: 'Хлеб', price: 20, category: 'food' }
        ]
    },
    {
        id: 'barman',
        name: 'Бармен',
        avatar: 'БАР',
        description: '«Информация стоит денег...»',
        specialty: 'Информация и задания',
        inventory: [
            { name: 'Информация об артефактах', price: 200, category: 'info' },
            { name: 'Карты аномалий', price: 150, category: 'maps' },
            { name: 'Слухи о Зоне', price: 100, category: 'rumors' },
            { name: 'Водка', price: 50, category: 'consumables' }
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
        name: 'STRELOK',
        avatar: 'https://picsum.photos/seed/strelok-stalker/100/100.jpg',
        rank: 'Легенда',
        status: 'онлайн',
        bio: 'Легендарный сталкер. Спас Зону.',
        messages: 156,
        reputation: 500
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
    
    // Initialize location highlights
    highlightLocations();
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
        console.error('User not found:', userId);
        return;
    }
    
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
}

// Render messages from users data
function renderMessages() {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;
    
    chatContainer.innerHTML = '';
    
    messages.forEach(messageData => {
        const messageElement = document.createElement('div');
        
        if (messageData.type === 'system') {
            messageElement.className = 'system-message';
            messageElement.innerHTML = `<div class="system-text">${messageData.content}</div>`;
        } else {
            const isOwn = messageData.author === currentUser.username;
            messageElement.className = `user-message ${isOwn ? 'own-message' : 'other-message'}`;
            messageElement.dataset.messageId = messageData.id;
            
            const author = users[messageData.author.toLowerCase().replace(/[^a-z0-9]/g, '')];
            const avatar = author ? author.avatar : 'https://picsum.photos/seed/default/50/50.jpg';
            const rank = author ? author.rank : 'Новичок';
            
            messageElement.innerHTML = `
                <div class="message-avatar">
                    <img src="${avatar}" alt="${messageData.author}">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-author level-${rank}">${messageData.author}</span>
                        <span class="message-time">${new Date(messageData.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="message-text">${messageData.content}</div>
                </div>
            `;
            
            // Add click handler for user messages
            if (!isOwn) {
                messageElement.addEventListener('click', () => {
                    showUserProfile(messageData.author);
                });
                messageElement.style.cursor = 'pointer';
            }
        }
        
        chatContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Setup Event Listeners
function setupEventListeners() {
    // Auth Events
    document.getElementById('loginBtn').addEventListener('click', loginUser);
    document.getElementById('registerBtn').addEventListener('click', registerUser);
    document.getElementById('switchToRegister').addEventListener('click', showRegisterForm);
    document.getElementById('switchToLogin').addEventListener('click', showLoginForm);
    
    // Navigation Events
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            switchSection(targetSection);
        });
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
}

// Time and Radiation Functions
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
        if (level > 70) {
            radiationLevel.style.backgroundColor = '#ff4444';
        } else if (level > 50) {
            radiationLevel.style.backgroundColor = '#ff8800';
        } else {
            radiationLevel.style.backgroundColor = '#44ff44';
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
function loginUser() {
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

function registerUser() {
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
    
    // Check stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username === username)) {
        showGlitchEffect('registerBtn', 'Такой пользователь уже есть!');
        return;
    }
    
    const newUser = {
        username: username,
        password: password,
        level: 'newcomer',
        description: '',
        avatar: 'https://picsum.photos/seed/' + username + '/100/100.jpg'
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMainScreen();
}

// Legacy function names for compatibility
function handleLogin() {
    loginUser();
}

function handleRegister() {
    registerUser();
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
        preview.innerHTML = '';
    }
}

function hideProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
}

function saveProfile() {
    const newUsername = document.getElementById('profileCallsign').value.trim();
    const newDescription = document.getElementById('profileDescription').value.trim();
    const newLevel = document.getElementById('profileLevelSelect').value;
    
    if (!newUsername) {
        showGlitchEffect('saveProfile', 'Позывной не может быть пустым!');
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
    const message = document.getElementById('chatInput').value.trim();
    
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
    
    const messageData = {
        id: Date.now(),
        author: currentUser.username,
        content: message,
        timestamp: new Date().toISOString(),
        level: currentUser.level
    };
    
    messages.push(messageData);
    
    // Clear input
    document.getElementById('chatInput').value = '';
    
    // Render messages
    renderMessages();
    
    // Save to localStorage (for persistence)
    localStorage.setItem('messages', JSON.stringify(messages));
    
    // Save users data
    saveUsers();
    
    // Update profile display
    updateProfileDisplay();
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
    renderMessages();
    
    // Save to localStorage
    localStorage.setItem('messages', JSON.stringify(messages));
}

function loadMessages() {
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
        renderMessages();
    }
}

function renderMessages() {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;
    
    chatContainer.innerHTML = '';
    
    messages.forEach(messageData => {
        const messageElement = document.createElement('div');
        
        if (messageData.type === 'system') {
            messageElement.className = 'system-message';
            messageElement.innerHTML = `<div class="system-text">${messageData.content}</div>`;
        } else {
            const isOwn = messageData.author === currentUser.username;
            messageElement.className = `user-message ${isOwn ? 'own-message' : 'other-message'}`;
            messageElement.dataset.messageId = messageData.id;
            
            const author = users[messageData.author.toLowerCase().replace(/[^a-z0-9]/g, '')];
            const avatar = author ? author.avatar : 'https://picsum.photos/seed/default/50/50.jpg';
            const rank = author ? author.rank : 'Новичок';
            
            messageElement.innerHTML = `
                <div class="message-avatar">
                    <img src="${avatar}" alt="${messageData.author}">
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-author level-${rank}">${messageData.author}</span>
                        <span class="message-time">${new Date(messageData.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="message-text">${messageData.content}</div>
                </div>
            `;
            
            // Add click handler for user messages
            if (!isOwn) {
                messageElement.addEventListener('click', () => {
                    showUserProfile(messageData.author);
                });
                messageElement.style.cursor = 'pointer';
            }
        }
        
        chatContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Anomaly Report Functions
function showReportModal() {
    document.getElementById('reportModal').classList.remove('hidden');
    document.getElementById('reportTitle').value = '';
    document.getElementById('reportDescription').value = '';
    document.getElementById('reportImageFile').value = '';
    document.getElementById('imagePreview').innerHTML = '';
}

function hideReportModal() {
    document.getElementById('reportModal').classList.add('hidden');
}

function saveReport() {
    const title = document.getElementById('reportTitle').value.trim();
    const description = document.getElementById('reportDescription').value.trim();
    
    if (!title || !description) {
        showGlitchEffect('saveReport', 'Заполните все поля!');
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
    localStorage.setItem('reports', JSON.stringify(reports));
    
    renderReports();
    hideReportModal();
    
    showGlitchEffect('newReportBtn', 'Отчёт отправлен!');
    
    // Clear image data
    reportImageData = null;
}

function loadReports() {
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
        reports = JSON.parse(savedReports);
        renderReports();
    }
}

function renderReports() {
    const reportsGrid = document.getElementById('reportsGrid');
    if (!reportsGrid) return;
    
    reportsGrid.innerHTML = '';
    
    reports.forEach(reportData => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';
        
        const date = new Date(reportData.timestamp).toLocaleDateString('ru-RU');
        
        reportCard.innerHTML = `
            <div class="report-image">
                <img src="${reportData.image}" alt="${reportData.title}" onerror="this.src='https://picsum.photos/seed/anomaly-fallback/300/200.jpg'">
            </div>
            <div class="report-content">
                <h3 class="report-title">${reportData.title}</h3>
                <p class="report-description">${reportData.description}</p>
                <div class="report-meta">
                    <span class="report-author level-${reportData.level}">${reportData.author}</span>
                    <span class="report-date">${date}</span>
                    ${reportData.author === currentUser.username ? '<button class="report-delete" onclick="deleteReport(' + reportData.id + ')">DELETE</button>' : ''}
                </div>
            </div>
        `;
        
        reportsGrid.appendChild(reportCard);
    });
}

function deleteReport(reportId) {
    reports = reports.filter(r => r.id !== reportId);
    localStorage.setItem('reports', JSON.stringify(reports));
    renderReports();
}

// Avatar Upload Functions
let reportImageData = null;

function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showGlitchEffect('changeAvatarBtn', 'Файл слишком большой!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const result = e.target.result;
        
        // Preview
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.innerHTML = `<img src="${result}" alt="Preview">`;
        }
        
        // Update main avatar immediately
        document.getElementById('largeAvatar').src = result;
        document.getElementById('profileAvatar').src = result;
        
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
        
        saveUsers();
        renderUI();    // ✅ обновить весь интерфейс
        
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
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showGlitchEffect('saveReport', 'Файл слишком большой!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const result = e.target.result;
        reportImageData = result;
        
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.innerHTML = `<img src="${result}" alt="Preview">`;
        }
    };
    reader.onerror = function() {
        showGlitchEffect('saveReport', 'Ошибка загрузки!');
        reportImageData = null;
    };
    reader.readAsDataURL(file);
}

// Location Modal Functions
function openModal(loc) {
    const modal = document.querySelector('#locationModal');
    
    if (!modal) {
        console.error('Location modal not found');
        return;
    }
    
    const img = modal.querySelector('#locationImage');
    const title = modal.querySelector('#locationTitle');
    const desc = modal.querySelector('#locationDescription');
    
    if (!img || !title || !desc) {
        console.error('Modal elements not found');
        return;
    }
    
    img.src = loc.img;
    title.textContent = loc.name;
    desc.textContent = loc.desc;
    
    // Handle image loading error
    img.onerror = function() {
        console.log('Image failed to load, using fallback');
        img.src = 'https://picsum.photos/seed/location-fallback/800/400.jpg';
    };
    
    modal.classList.remove('hidden');
    modal.classList.add('active');
}

function hideLocationModal() {
    document.getElementById('locationModal').classList.add('hidden');
}

// Highlight locations based on data
function highlightLocations() {
    document.querySelectorAll('[data-location]').forEach(el => {
        const name = el.dataset.location;
        const loc = locations.find(l => l.name === name);
        
        if (loc?.highlight) {
            el.classList.add('active-location');
        } else {
            el.classList.remove('active-location');
        }
    });
}

// Location click handler
document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-location]');
    if (!el) return;
    
    const name = el.dataset.location;
    console.log('Clicked location:', name);
    
    const location = locations.find(l => l.name === name);
    
    if (!location) {
        console.log('❌ Локация не найдена:', name);
        console.log('Available locations:', locations.map(l => l.name));
        return;
    }
    
    console.log('✅ Найдена локация:', location.name);
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
                <h3 class="trader-name">${trader.name}</h3>
                <p class="trader-description">${trader.description}</p>
                <p class="trader-specialty">Специализация: ${trader.specialty}</p>
                <button class="trade-btn" onclick="showTraderInventory('${trader.id}')">Торговать</button>
            </div>
        `;
        
        tradersContainer.appendChild(traderCard);
    });
}

function showTraderInventory(traderId) {
    const trader = traders.find(t => t.id === traderId);
    if (!trader) return;
    
    const modal = document.getElementById('traderModal');
    const modalTitle = modal.querySelector('.trader-modal-title');
    const inventoryContainer = modal.querySelector('.trader-inventory');
    
    modalTitle.textContent = `Торговля с ${trader.name}`;
    
    inventoryContainer.innerHTML = '';
    
    trader.inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'trader-item';
        itemElement.innerHTML = `
            <div class="item-name">${item.name}</div>
            <div class="item-price">${item.price} руб.</div>
            <div class="item-category">${item.category}</div>
        `;
        
        inventoryContainer.appendChild(itemElement);
    });
    
    modal.classList.remove('hidden');
}

function hideTraderModal() {
    document.getElementById('traderModal').classList.add('hidden');
}

// User Profile Modal Functions
function showUserProfile(username) {
    const userId = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const user = users[userId];
    
    if (!user) return;
    
    const modal = document.getElementById('userProfileModal');
    
    // Update modal content
    document.getElementById('userProfileAvatar').src = user.avatar;
    document.getElementById('userProfileName').textContent = user.name;
    document.getElementById('userProfileRank').textContent = user.rank;
    document.getElementById('userProfileStatus').textContent = user.status;
    document.getElementById('userProfileBio').textContent = user.bio;
    document.getElementById('userProfileMessages').textContent = user.messages || 0;
    document.getElementById('userProfileReputation').textContent = user.reputation || 0;
    
    modal.classList.remove('hidden');
}

function hideUserProfileModal() {
    document.getElementById('userProfileModal').classList.add('hidden');
}

// Navigation Functions
function switchSection(targetSection) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${targetSection}"]`).classList.add('active');
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${targetSection}Section`).classList.add('active');
    
    currentSection = targetSection;
}

// Utility Functions
function showGlitchEffect(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const originalText = element.textContent;
    element.textContent = message;
    element.style.color = '#ff4444';
    element.style.textShadow = '0 0 10px #ff4444';
    
    setTimeout(() => {
        element.textContent = originalText;
        element.style.color = '';
        element.style.textShadow = '';
    }, 2000);
}

function loadStoredData() {
    // Load messages
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages);
    }
    
    // Load reports
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
        reports = JSON.parse(savedReports);
    }
    
    // Load users
    loadUsers();
}

function loadUsersFromStorage() {
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
