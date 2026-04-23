// S.T.A.L.K.E.R. Zone Terminal JavaScript

// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Global State
let currentUser = null;
let messages = [];
let reports = [];
let currentSection = 'chat';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBVsfUAcq4wrYmfPV-KhA1_NhGxlh9e9GQ",
  authDomain: "stalker-pda-online.firebaseapp.com",
  projectId: "stalker-pda-online",
  storageBucket: "stalker-pda-online.firebasestorage.app",
  messagingSenderId: "699881348726",
  appId: "1:699881348726:web:1b389438115c937b00c957",
  measurementId: "G-HR2VQ6YWZY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
    updateTime();
    loadStoredData();
});

// Initialize Application
function initApp() {
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
    document.querySelector('.profile-toggle-container').addEventListener('click', () => {
        showProfileModal(); // Открываем модальное окно профиля
    });
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
    startPdaSync(); // Запускаем реальную синхронизацию с Firebase
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
    
    // Update stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === newUsername);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
    } else {
        users.push(currentUser);
    }
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updateProfileDisplay();
    hideProfileModal();
}

function updateProfileDisplay() {
    if (!currentUser) return;
    
    // Update profile avatar in top-right corner
    const avatar = document.getElementById('profileAvatar');
    if (avatar) {
        avatar.src = currentUser.avatar;
    }
    
    // Update profile name
    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.textContent = currentUser.username;
    }
}

// Chat Functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
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
    messageElement.className = 'user-message';
    messageElement.dataset.messageId = messageData.id;
    
    const time = new Date(messageData.timestamp).toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const deleteButton = messageData.author === currentUser.username ? 
        `<span class="pda-delete-trigger" onclick="window.pdaDelete('messages', '${messageData.id}')">[X]</span>` : '';
    
    messageElement.innerHTML = `
        <div class="message-header">
            <div class="message-info">
                <span class="message-author level-${messageData.level}">${messageData.author}</span>
                <span class="message-time">${time}</span>
            </div>
            ${deleteButton}
        </div>
        <div class="message-content">${messageData.content}</div>
    `;
    
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
    
    if (!title || !description) {
        showGlitchEffect('saveReport', 'Заголовок и описание обязательны!');
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
    hideReportModal();
    
    // Clear image data
    reportImageData = null;
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
            ${reportData.author === currentUser.username ? '<button class="report-delete" onclick="window.pdaDelete(\'reports\', ' + reportData.id + ')">DELETE</button>' : ''}
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
        document.getElementById('largeAvatar').src = result;
        
        // Store for saving
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
            showLocationInfo(locationName);
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

// PDA Delete Function
window.pdaDelete = (collection, id) => {
    const modal = document.getElementById('pda-confirm-modal');
    modal.classList.remove('pda-hidden');
    
    document.getElementById('pda-confirm-yes').onclick = async () => {
        try {
            if (collection === 'messages') {
                messages = messages.filter(m => m.id !== id);
                saveMessages();
                loadMessages();
            } else if (collection === 'reports') {
                reports = reports.filter(r => r.id !== id);
                saveReports();
                loadReports();
            }
            modal.classList.add('pda-hidden');
            console.log("✅ Сектор очищен");
        } catch (e) { 
            console.error("❌ Ошибка:", e); 
        }
    };
    
    document.getElementById('pda-confirm-no').onclick = () => {
        modal.classList.add('pda-hidden');
    };
};

// Location Data Object
const locationData = {
    'Кордон': {
        img: 'https://stalker-worlds.games/forum/uploads/imgs/sw_1501329037__3120_escape_11.jpg',
        desc: 'Предбанник Зоны. Место, где новички проходят боевое крещение. Опасность низкая, но военные на блокпосту не жалуют гостей.'
    },
    'Свалка': {
        img: 'https://preview.redd.it/stalker-2-has-the-truck-cemetery-map-this-is-amazing-v0-6egv2ufny76d1.jpg?width=1280&format=pjpg&auto=webp&s=114cc3bda1376379ed899c17339852fefeb350a7',
        desc: 'Кладбище старой техники. Радиационный фон повышен. Обитель бандитов и мутантов, ищущих наживу среди гор металлолома.'
    },
    'Агропром': {
        img: 'https://static.wikia.nocookie.net/stalker/images/2/29/Agroprom_factory_CS.jpg',
        desc: 'Индустриальная зона с НИИ. Подземелья скрывают ужасы, а на поверхности хозяйничают военные патрули.'
    },
    'Припять': {
        img: 'https://it-blok.com.ua/image/catalog/blog/2025/stalker2/pripyat-stalker-2-intro.jpg.pagespeed.ce.cw7HSIcBjU.jpg',
        desc: 'Город-призрак. Мертвая тишина, прерываемая лишь треском счетчика Гейгера. Территория "Монолита" и самых опасных аномалий.'
    }
};

// Real-time Sync Implementation
function startPdaSync() {
    // Messages listener
    const messagesQ = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    onSnapshot(messagesQ, (snapshot) => {
        const container = document.getElementById('chatMessages');
        if (container) {
            container.innerHTML = '<div class="system-message"><span class="system-text">SYSTEM: Welcome to the Zone, stalker...</span></div>';
            snapshot.forEach((doc) => {
                displayMessage({ id: doc.id, ...doc.data() }); // Рисуем актуальное
            });
            container.scrollTop = container.scrollHeight;
        }
    });

    // Reports listener
    const reportsQ = query(collection(db, "reports"), orderBy("timestamp", "desc"));
    onSnapshot(reportsQ, (snapshot) => {
        const grid = document.getElementById('reportsGrid');
        if (grid) {
            grid.innerHTML = ''; // Очищаем старое
            snapshot.forEach((doc) => {
                displayReport({ id: doc.id, ...doc.data() }); // Рисуем актуальное
            });
        }
    });
}

// Location Viewer Function
function showLocationInfo(name) {
    const modal = document.getElementById('location-modal');
    const data = locationData[name];
    
    if (!data || !modal) {
        console.error("☢️ Ошибка ПДА: Данные по локации " + name + " не найдены");
        return;
    }
    
    document.getElementById('loc-title').textContent = name;
    document.getElementById('loc-image').src = data.img;
    document.getElementById('loc-description').textContent = data.desc;
    
    modal.classList.remove('pda-hidden');
    modal.style.display = 'flex'; // Гарантируем отображение
    console.log("📡 Загрузка данных по сектору: " + name);
}

// PDA Delete Function
function pdaDelete(collection, id) {
    const modal = document.getElementById('pda-confirm-modal');
    if (!modal) return;
    
    modal.classList.remove('pda-hidden');
    modal.style.display = 'flex';

    document.getElementById('pda-confirm-yes').onclick = async () => {
        try {
            // Используем глобальные db, doc и deleteDoc из импортов
            const docRef = doc(db, collection, id);
            await deleteDoc(docRef);
            
            modal.classList.add('pda-hidden');
            modal.style.display = 'none';
            console.log(`✅ Сектор ${collection} очищен: ${id}`);
        } catch (e) {
            console.error("❌ Ошибка ПДА при удалении:", e);
            alert("Ошибка связи с базой данных");
        }
    };

    document.getElementById('pda-confirm-no').onclick = () => {
        modal.classList.add('pda-hidden');
        modal.style.display = 'none';
    };
}

// Global Function Binding
window.showLocationInfo = showLocationInfo;
window.pdaDelete = pdaDelete;
window.switchSection = switchSection;
