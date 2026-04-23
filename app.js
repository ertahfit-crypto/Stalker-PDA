// S.T.A.L.K.E.R. PDA Online Application

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "stalker-pda-online.firebaseapp.com",
    projectId: "stalker-pda-online",
    storageBucket: "stalker-pda-online.firebasestorage.app",
    messagingSenderId: "699881348726",
    appId: "1:699881348726:web:1b389438115c937b00c957"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Location Data
const locationData = {
    'Кордон': {
        img: 'https://stalker-worlds.games/forum/uploads/imgs/sw_1501329037__3120_escape_11.jpg',
        desc: 'Предбанник Зоны. Здесь начинаются все новички. Место относительно безопасное, но всегда будь начеку.'
    },
    'Свалка': {
        img: 'https://preview.redd.it/stalker-2-has-the-truck-cemetery-map-this-is-amazing-v0-6egv2ufny76d1.jpg?auto=webp&s=1234567890abcdef',
        desc: 'Кладбище техники. Здесь можно найти много полезного, но опасности поджидают на каждом шагу.'
    },
    'Агропром': {
        img: 'https://static.wikia.nocookie.net/stalker/images/2/29/Agroprom_factory_CS.jpg',
        desc: 'Индустриальная зона. Мутанты abound here. Be careful in the underground tunnels.'
    },
    'Припять': {
        img: 'https://it-blok.com.ua/image/catalog/blog/2025/stalker2/pripyat-stalker-2-intro.jpg',
        desc: 'Город-призрак. Самое опасное место в Зоне. Только самые опытные сталкеры решаются сюда войти.'
    }
};

// Application State
let currentUser = null;
let isAdmin = false;
let isLoginMode = false;

// DOM Elements
const authPage = document.getElementById('authPage');
const mainMenuPage = document.getElementById('mainMenuPage');
const chatPage = document.getElementById('chatPage');
const mapPage = document.getElementById('mapPage');
const marketPage = document.getElementById('marketPage');
const profilePage = document.getElementById('profilePage');
const adminPage = document.getElementById('adminPage');

// Auth Elements
const authTitle = document.getElementById('authTitle');
const authButton = document.getElementById('authButton');
const authSwitch = document.getElementById('authSwitch');
const authSwitchText = document.getElementById('authSwitchText');
const secretSection = document.getElementById('secretSection');
const authError = document.getElementById('authError');

// Input Elements
const callsignInput = document.getElementById('callsign');
const passwordInput = document.getElementById('password');
const secretQuestionInput = document.getElementById('secretQuestion');
const secretAnswerInput = document.getElementById('secretAnswer');

// Menu Elements
const userCallsign = document.getElementById('userCallsign');
const profileBtn = document.getElementById('profileBtn');

// Chat Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessage');

// Map Elements
const zoneMap = document.getElementById('zoneMap');

// Market Elements
const marketItems = document.getElementById('marketItems');
const addItemBtn = document.getElementById('addItemBtn');

// Profile Elements
const profileCallsign = document.getElementById('profileCallsign');
const profileDate = document.getElementById('profileDate');
const logoutBtn = document.getElementById('logoutBtn');
const adminPanelBtn = document.getElementById('adminPanelBtn');

// Admin Elements
const adminLogin = document.getElementById('adminLogin');
const adminPanel = document.getElementById('adminPanel');
const adminLoginInput = document.getElementById('adminLoginInput');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const adminAuthBtn = document.getElementById('adminAuthBtn');

// Modal Elements
const locationModal = document.getElementById('locationModal');
const addItemModal = document.getElementById('addItemModal');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    checkAuthState();
    initializeMap();
});

// Event Listeners
function initializeEventListeners() {
    // Auth Events
    authButton.addEventListener('click', handleAuth);
    authSwitch.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthMode();
    });

    // Menu Navigation
    document.querySelectorAll('.menu-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            navigateToPage(page);
        });
    });

    // Back Buttons
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', () => {
            showPage('mainMenuPage');
        });
    });

    // Profile Button
    profileBtn.addEventListener('click', () => {
        navigateToPage('profile');
    });

    // Chat Events
    sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Market Events
    addItemBtn.addEventListener('click', () => {
        showModal('addItemModal');
    });

    // Profile Events
    logoutBtn.addEventListener('click', logout);
    adminPanelBtn.addEventListener('click', () => {
        showPage('adminPage');
    });

    // Admin Events
    adminAuthBtn.addEventListener('click', handleAdminAuth);

    // Modal Events
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            hideModal(modal.id);
        });
    });

    // Add Item Form
    document.getElementById('submitItem').addEventListener('click', addMarketItem);

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });
}

// Authentication Functions
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        authTitle.textContent = 'ВХОД В ЗОНУ';
        authButton.textContent = 'ВОЙТИ';
        authSwitchText.innerHTML = 'Нет аккаунта? <a href="#" id="authSwitch">Зарегистрироваться</a>';
        secretSection.style.display = 'none';
        authSwitch = document.getElementById('authSwitch');
        authSwitch.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthMode();
        });
    } else {
        authTitle.textContent = 'РЕГИСТРАЦИЯ В ЗОНЕ';
        authButton.textContent = 'ЗАРЕГИСТРИРОВАТЬСЯ';
        authSwitchText.innerHTML = 'Есть аккаунт? <a href="#" id="authSwitch">Войти</a>';
        secretSection.style.display = 'block';
        authSwitch = document.getElementById('authSwitch');
        authSwitch.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthMode();
        });
    }
}

async function handleAuth() {
    const callsign = callsignInput.value.trim();
    const password = passwordInput.value;
    
    if (!callsign || !password) {
        showError('Позывной и пароль обязательны');
        return;
    }

    try {
        if (isLoginMode) {
            // Login
            const email = `${callsign.toLowerCase()}@stalker.pda`;
            await auth.signInWithEmailAndPassword(email, password);
        } else {
            // Registration
            const secretQuestion = secretQuestionInput.value.trim();
            const secretAnswer = secretAnswerInput.value.trim();
            
            if (!secretQuestion || !secretAnswer) {
                showError('Секретный вопрос и ответ обязательны');
                return;
            }

            const email = `${callsign.toLowerCase()}@stalker.pda`;
            const result = await auth.createUserWithEmailAndPassword(email, password);
            
            // Save user data
            await db.collection('users').doc(result.user.uid).set({
                callsign: callsign,
                email: email,
                secretQuestion: secretQuestion,
                secretAnswer: secretAnswer,
                registrationDate: new Date().toISOString(),
                isAdmin: false
            });
        }
    } catch (error) {
        showError(getErrorMessage(error));
    }
}

function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'Такой сталкер уже существует';
        case 'auth/user-not-found':
            return 'Сталкер не найден';
        case 'auth/wrong-password':
            return 'Неверный пароль';
        case 'auth/weak-password':
            return 'Пароль слишком слабый';
        case 'auth/invalid-email':
            return 'Неверный формат позывного';
        default:
            return 'Ошибка: ' + error.message;
    }
}

function showError(message) {
    authError.textContent = message;
    authError.classList.add('show');
    setTimeout(() => {
        authError.classList.remove('show');
    }, 5000);
}

// Auth State Management
function checkAuthState() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            
            if (userData) {
                userCallsign.textContent = userData.callsign;
                isAdmin = userData.isAdmin || false;
                
                showPage('mainMenuPage');
                loadChatMessages();
                loadMarketItems();
            }
        } else {
            currentUser = null;
            isAdmin = false;
            showPage('authPage');
        }
    });
}

async function logout() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Navigation Functions
function navigateToPage(page) {
    switch (page) {
        case 'chat':
            showPage('chatPage');
            break;
        case 'map':
            showPage('mapPage');
            break;
        case 'market':
            showPage('marketPage');
            break;
        case 'profile':
            showPage('profilePage');
            loadProfile();
            break;
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Chat Functions
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !currentUser) return;

    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();

        await db.collection('chat').add({
            userId: currentUser.uid,
            callsign: userData.callsign,
            message: message,
            timestamp: new Date()
        });

        messageInput.value = '';
    } catch (error) {
        console.error('Send message error:', error);
    }
}

function loadChatMessages() {
    if (!currentUser) return;

    db.collection('chat')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .onSnapshot((snapshot) => {
            chatMessages.innerHTML = '';
            snapshot.docs.reverse().forEach(doc => {
                const messageData = doc.data();
                displayMessage(messageData, doc.id);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
}

function displayMessage(messageData, messageId) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    if (messageData.userId === currentUser.uid) {
        messageDiv.classList.add('own');
    }

    const time = new Date(messageData.timestamp.toDate()).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">${messageData.callsign}</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-text">${messageData.message}</div>
        ${isAdmin || messageData.userId === currentUser.uid ? 
            `<button class="message-delete" onclick="deleteMessage('${messageId}')">Удалить</button>` : ''}
    `;

    chatMessages.appendChild(messageDiv);
}

async function deleteMessage(messageId) {
    if (!confirm('Удалить это сообщение?')) return;

    try {
        await db.collection('chat').doc(messageId).delete();
    } catch (error) {
        console.error('Delete message error:', error);
    }
}

// Map Functions
function initializeMap() {
    Object.keys(locationData).forEach((location, index) => {
        const point = document.createElement('div');
        point.className = 'location-point';
        point.style.left = `${20 + (index * 20)}%`;
        point.style.top = `${30 + (index * 15)}%`;
        
        const label = document.createElement('div');
        label.className = 'location-label';
        label.textContent = location;
        point.appendChild(label);
        
        point.addEventListener('click', () => {
            showLocationModal(location);
        });
        
        zoneMap.appendChild(point);
    });
}

function showLocationModal(location) {
    const data = locationData[location];
    document.getElementById('modalTitle').textContent = location;
    document.getElementById('modalImage').src = data.img;
    document.getElementById('modalDescription').textContent = data.desc;
    showModal('locationModal');
}

// Market Functions
async function addMarketItem() {
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    const price = document.getElementById('itemPrice').value;
    const image = document.getElementById('itemImage').value.trim();

    if (!name || !description || !price) {
        alert('Название, описание и цена обязательны');
        return;
    }

    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();

        await db.collection('market').add({
            name: name,
            description: description,
            price: parseInt(price),
            image: image || 'https://via.placeholder.com/80x80/001100/00ff00?text=АРТЕФАКТ',
            sellerId: currentUser.uid,
            sellerName: userData.callsign,
            timestamp: new Date()
        });

        // Clear form
        document.getElementById('itemName').value = '';
        document.getElementById('itemDescription').value = '';
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemImage').value = '';

        hideModal('addItemModal');
    } catch (error) {
        console.error('Add item error:', error);
    }
}

function loadMarketItems() {
    db.collection('market')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            marketItems.innerHTML = '';
            snapshot.forEach(doc => {
                const item = doc.data();
                displayMarketItem(item, doc.id);
            });
        });
}

function displayMarketItem(item, itemId) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'market-item';

    itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="market-item-image">
        <div class="market-item-info">
            <div class="market-item-title">${item.name}</div>
            <div class="market-item-description">${item.description}</div>
            <div class="market-item-price">${item.price} ₽</div>
        </div>
        <div class="market-item-actions">
            <button class="pda-button">КУПИТЬ</button>
            ${item.sellerId === currentUser.uid ? 
                `<button class="pda-button danger" onclick="deleteMarketItem('${itemId}')">УДАЛИТЬ</button>` : ''}
        </div>
    `;

    marketItems.appendChild(itemDiv);
}

async function deleteMarketItem(itemId) {
    if (!confirm('Удалить этот товар?')) return;

    try {
        await db.collection('market').doc(itemId).delete();
    } catch (error) {
        console.error('Delete item error:', error);
    }
}

// Profile Functions
async function loadProfile() {
    if (!currentUser) return;

    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();

        profileCallsign.textContent = userData.callsign;
        profileDate.textContent = new Date(userData.registrationDate).toLocaleDateString('ru-RU');

        // Show admin button if user is admin
        if (userData.isAdmin) {
            adminPanelBtn.style.display = 'block';
        } else {
            adminPanelBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Load profile error:', error);
    }
}

// Admin Functions
function handleAdminAuth() {
    const login = adminLoginInput.value.trim();
    const password = adminPasswordInput.value;

    if (login === 'admin' && password === '12345') {
        isAdmin = true;
        adminLogin.style.display = 'none';
        adminPanel.style.display = 'block';
        loadAdminData();
    } else {
        alert('Неверные данные администратора');
    }
}

async function loadAdminData() {
    // Load users
    const usersSnapshot = await db.collection('users').get();
    const adminUsers = document.getElementById('adminUsers');
    adminUsers.innerHTML = '';

    usersSnapshot.forEach(doc => {
        const user = doc.data();
        const userDiv = document.createElement('div');
        userDiv.className = 'admin-item';
        userDiv.innerHTML = `
            <div class="admin-item-info">
                <strong>${user.callsign}</strong> - ${user.email}
            </div>
            <div class="admin-item-actions">
                <button class="admin-delete-btn" onclick="deleteUser('${doc.id}')">Удалить</button>
            </div>
        `;
        adminUsers.appendChild(userDiv);
    });

    // Load messages
    const messagesSnapshot = await db.collection('chat').get();
    const adminMessages = document.getElementById('adminMessages');
    adminMessages.innerHTML = '';

    messagesSnapshot.forEach(doc => {
        const message = doc.data();
        const messageDiv = document.createElement('div');
        messageDiv.className = 'admin-item';
        messageDiv.innerHTML = `
            <div class="admin-item-info">
                <strong>${message.callsign}:</strong> ${message.message.substring(0, 50)}...
            </div>
            <div class="admin-item-actions">
                <button class="admin-delete-btn" onclick="deleteMessage('${doc.id}')">Удалить</button>
            </div>
        `;
        adminMessages.appendChild(messageDiv);
    });

    // Load items
    const itemsSnapshot = await db.collection('market').get();
    const adminItems = document.getElementById('adminItems');
    adminItems.innerHTML = '';

    itemsSnapshot.forEach(doc => {
        const item = doc.data();
        const itemDiv = document.createElement('div');
        itemDiv.className = 'admin-item';
        itemDiv.innerHTML = `
            <div class="admin-item-info">
                <strong>${item.name}</strong> - ${item.price} ₽ (${item.sellerName})
            </div>
            <div class="admin-item-actions">
                <button class="admin-delete-btn" onclick="deleteMarketItem('${doc.id}')">Удалить</button>
            </div>
        `;
        adminItems.appendChild(itemDiv);
    });
}

async function deleteUser(userId) {
    if (!confirm('Удалить этого пользователя?')) return;

    try {
        await db.collection('users').doc(userId).delete();
        loadAdminData();
    } catch (error) {
        console.error('Delete user error:', error);
    }
}

// Modal Functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Make functions globally accessible
window.deleteMessage = deleteMessage;
window.deleteMarketItem = deleteMarketItem;
window.deleteUser = deleteUser;
