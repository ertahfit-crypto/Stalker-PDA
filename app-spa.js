// Stalker PDA Online - SPA Application

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVsfUAcq4wrYmfPV-KhA1_NhGxlh9e9GQ",
  authDomain: "stalker-pda-online.firebaseapp.com",
  projectId: "stalker-pda-online",
  storageBucket: "stalker-pda-online.firebasestorage.app",
  messagingSenderId: "699881348726",
  appId: "1:699881348726:web:1b389438115c937b00c957",
  measurementId: "G-HR2VQ6YWZY"
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
let currentPage = 'chat';

// Username Regex for validation
const usernameRegex = /^[a-zA-Z0-9@._-]+$/;

// DOM Elements
const authBtn = document.getElementById('authBtn');
const topUserCallsign = document.getElementById('topUserCallsign');
const messageInput = document.getElementById('messageInput');
const sendMessage = document.getElementById('sendMessage');
const zoneMap = document.getElementById('zoneMap');
const marketItems = document.getElementById('marketItems');
const addItemBtn = document.getElementById('addItemBtn');
const nicknameInput = document.getElementById('nicknameInput');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');
const userStatus = document.getElementById('userStatus');
const loginDate = document.getElementById('loginDate');
const rankSelect = document.getElementById('rankSelect');

// Auth Screen Elements
const authScreen = document.getElementById('authScreen');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginSubmit = document.getElementById('loginSubmit');
const registerCallsign = document.getElementById('registerCallsign');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerSubmit = document.getElementById('registerSubmit');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const authError = document.getElementById('authError');

// Modal Elements
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalFooter = document.getElementById('modalFooter');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    checkAuthState();
    initializeMap();
    loadMarketItems();
});

// Event Listeners
function initializeEventListeners() {
    // Auth button
    authBtn.addEventListener('click', showAuthScreen);
    
    // Auth screen events
    loginSubmit.addEventListener('click', handleLogin);
    registerSubmit.addEventListener('click', handleRegister);
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    
    // Enter key support for forms
    loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    registerPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleRegister();
    });
    
    // Chat events
    sendMessage.addEventListener('click', sendChatMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Market events
    addItemBtn.addEventListener('click', showAddItemModal);
    
    // Profile events
    saveProfileBtn.addEventListener('click', saveProfile);
    logoutBtn.addEventListener('click', handleLogout);
    uploadAvatarBtn.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', handleAvatarUpload);
    
    // Modal overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// SPA Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    currentPage = pageId;
    
    // Update menu buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="showPage('${pageId}')"]`)?.classList.add('active');
}

// Auth Screen Management
function showAuthScreen() {
    authScreen.style.display = 'flex';
    hideAuthError();
    showLoginForm();
}

function hideAuthScreen() {
    authScreen.style.display = 'none';
}

function showLoginForm() {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    hideAuthError();
    clearAuthForms();
}

function showRegisterForm() {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    hideAuthError();
    clearAuthForms();
}

function clearAuthForms() {
    // Clear login form
    loginEmail.value = '';
    loginPassword.value = '';
    
    // Clear register form
    registerCallsign.value = '';
    registerEmail.value = '';
    registerPassword.value = '';
}

function hideAuthError() {
    authError.classList.remove('show');
}

function showAuthError(message) {
    authError.textContent = message;
    authError.classList.add('show');
}

// Modal System
function showModal(title, body, footer = '') {
    modalTitle.textContent = title;
    modalBody.innerHTML = body;
    modalFooter.innerHTML = footer;
    modalOverlay.classList.add('show');
}

function closeModal() {
    modalOverlay.classList.remove('show');
}

function showCustomConfirm(message, onConfirm) {
    showModal('ПОДТВЕРЖДЕНИЕ', 
        `<p>${message}</p>`,
        `<button class="terminal-button" onclick="closeModal()">ОТМЕНА</button>
         <button class="terminal-button danger" onclick="confirmAction()">ПОДТВЕРДИТЬ</button>`
    );
    
    window.confirmAction = () => {
        closeModal();
        onConfirm();
        delete window.confirmAction;
    };
}

// Authentication Functions
async function handleLogin() {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    
    if (!email || !password) {
        showAuthError('Email и пароль обязательны');
        return;
    }
    
    if (!usernameRegex.test(email)) {
        showAuthError('Неверный формат email');
        return;
    }
    
    if (password.length < 6) {
        showAuthError('Пароль должен быть не менее 6 символов');
        return;
    }
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        hideAuthScreen();
    } catch (error) {
        showAuthError(getAuthErrorMessage(error));
    }
}

async function handleRegister() {
    const callsign = registerCallsign.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    
    if (!callsign || !email || !password) {
        showAuthError('Все поля обязательны');
        return;
    }
    
    if (!usernameRegex.test(email)) {
        showAuthError('Неверный формат email');
        return;
    }
    
    if (password.length < 6) {
        showAuthError('Пароль должен быть не менее 6 символов');
        return;
    }
    
    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        
        // Save user data
        await db.collection('users').doc(result.user.uid).set({
            callsign: callsign,
            email: email,
            registrationDate: new Date().toISOString(),
            isAdmin: false,
            avatar: null,
            rank: 'Новичок'
        });
        
        hideAuthScreen();
    } catch (error) {
        showAuthError(getAuthErrorMessage(error));
    }
}

function showAuthError(message) {
    authError.textContent = message;
    authError.classList.add('show');
}

function getAuthErrorMessage(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'Пользователь с таким email уже существует';
        case 'auth/user-not-found':
            return 'Пользователь не найден';
        case 'auth/wrong-password':
            return 'Неверный пароль';
        case 'auth/weak-password':
            return 'Пароль слишком слабый';
        case 'auth/invalid-email':
            return 'Неверный формат email';
        default:
            return 'Ошибка: ' + error.message;
    }
}

// Auth State Management
function checkAuthState() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            
            if (userData) {
                topUserCallsign.textContent = userData.callsign;
                userStatus.textContent = 'ОНЛАЙН';
                loginDate.textContent = new Date().toLocaleDateString('ru-RU');
                nicknameInput.value = userData.callsign;
                
                if (userData.avatar) {
                    avatarPreview.style.backgroundImage = `url(${userData.avatar})`;
                    avatarPreview.textContent = '';
                    avatarPreview.style.backgroundSize = 'cover';
                    avatarPreview.style.backgroundPosition = 'center';
                }
                
                if (userData.rank) {
                    rankSelect.value = userData.rank;
                } else {
                    rankSelect.value = 'Новичок';
                }
                
                // Enable UI elements
                messageInput.disabled = false;
                sendMessage.disabled = false;
                addItemBtn.disabled = false;
                nicknameInput.disabled = false;
                saveProfileBtn.disabled = false;
                uploadAvatarBtn.disabled = false;
                rankSelect.disabled = false;
                logoutBtn.style.display = 'block';
                authBtn.style.display = 'none';
                
                isAdmin = userData.isAdmin || false;
                
                // Hide auth screen and show main app
                hideAuthScreen();
                
                // Load chat messages
                loadChatMessages();
            }
        } else {
            currentUser = null;
            isAdmin = false;
            topUserCallsign.textContent = 'ГОСТЬ';
            userStatus.textContent = 'ГОСТЬ';
            loginDate.textContent = '-';
            
            // Disable UI elements
            messageInput.disabled = true;
            sendMessage.disabled = true;
            addItemBtn.disabled = true;
            nicknameInput.disabled = true;
            saveProfileBtn.disabled = true;
            uploadAvatarBtn.disabled = true;
            logoutBtn.style.display = 'none';
            authBtn.style.display = 'block';
            
            // Show auth screen
            showAuthScreen();
            
            // Clear chat
            document.getElementById('chatMessages').innerHTML = '<div class="system-message">Система: Авторизуйтесь для доступа к чату...</div>';
        }
    });
}

async function handleLogout() {
    showCustomConfirm('Выйти из системы?', async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

// Chat Functions
async function sendChatMessage() {
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
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '';
            
            snapshot.docs.reverse().forEach(doc => {
                const messageData = doc.data();
                displayChatMessage(messageData, doc.id);
            });
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
}

async function displayChatMessage(messageData, messageId) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    if (messageData.userId === currentUser.uid) {
        messageDiv.classList.add('own');
    }
    
    const time = new Date(messageData.timestamp.toDate()).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Получаем данные пользователя для отображения уровня и аватара
    let userRank = 'Новичок';
    let userAvatar = null;
    try {
        const userDoc = await db.collection('users').doc(messageData.userId).get();
        const userData = userDoc.data();
        if (userData) {
            if (userData.rank) {
                userRank = userData.rank;
            }
            if (userData.avatar) {
                userAvatar = userData.avatar;
            }
        }
    } catch (error) {
        console.error('Error getting user data:', error);
    }
    
    // Определяем CSS класс для ранга
    const rankClass = userRank.toLowerCase().replace('ый', '').replace('ник', '');
    
    // Создаем HTML для аватара
    let avatarHtml = '';
    if (userAvatar) {
        avatarHtml = `<img src="${userAvatar}" alt="${messageData.callsign}">`;
    } else {
        avatarHtml = messageData.callsign.charAt(0).toUpperCase();
    }
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-avatar">${avatarHtml}</div>
            <div class="message-body">
                <div class="message-header">
                    <span class="message-author ${rankClass}">${messageData.callsign}</span>
                    <span class="message-rank ${rankClass}">${userRank}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${messageData.message}</div>
            </div>
        </div>
        ${isAdmin || messageData.userId === currentUser.uid ? 
            `<button class="message-delete" onclick="deleteChatMessage('${messageId}')">×</button>` : ''}
    `;
    
    chatMessages.appendChild(messageDiv);
}

async function deleteChatMessage(messageId) {
    showCustomConfirm('Удалить это сообщение?', async () => {
        try {
            await db.collection('chat').doc(messageId).delete();
        } catch (error) {
            console.error('Delete message error:', error);
        }
    });
}

// Map Functions
function initializeMap() {
    const locations = [
        { name: 'Кордон', class: 'cordon' },
        { name: 'Свалка', class: 'garbage' },
        { name: 'Агропром', class: 'agroprom' },
        { name: 'Припять', class: 'pripyat' }
    ];
    
    locations.forEach(location => {
        const button = document.createElement('button');
        button.className = `location-button ${location.class}`;
        button.textContent = location.name;
        
        button.addEventListener('click', () => {
            showLocationModal(location.name);
        });
        
        zoneMap.appendChild(button);
    });
}

function showLocationModal(location) {
    const data = locationData[location];
    showModal(
        location,
        `<img src="${data.img}" alt="${location}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 4px; margin-bottom: 15px;">
         <p>${data.desc}</p>`,
        `<button class="terminal-button" onclick="closeModal()">ЗАКРЫТЬ</button>`
    );
}

// Market Functions
function showAddItemModal() {
    showModal(
        'ДОБАВИТЬ ПРЕДМЕТ',
        `<div class="input-group">
            <label>НАЗВАНИЕ:</label>
            <input type="text" id="itemName" class="terminal-input" placeholder="Название предмета">
        </div>
        <div class="input-group">
            <label>ОПИСАНИЕ:</label>
            <textarea id="itemDescription" class="terminal-input" placeholder="Описание предмета" style="min-height: 80px;"></textarea>
        </div>
        <div class="input-group">
            <label>ЦЕНА:</label>
            <div style="display: flex; gap: 10px;">
                <input type="number" id="itemPrice" class="terminal-input" placeholder="Цена" style="flex: 1;">
                <select id="itemCurrency" class="currency-select">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="ZONE">Зоны (☢)</option>
                </select>
            </div>
        </div>
        <div class="input-group">
            <label>ИЗОБРАЖЕНИЕ:</label>
            <input type="file" id="itemImage" accept="image/*" style="display: none;">
            <button class="terminal-button" onclick="document.getElementById('itemImage').click()">ВЫБРАТЬ ФАЙЛ</button>
            <div id="imagePreview" style="margin-top: 10px;"></div>
        </div>`,
        `<button class="terminal-button" onclick="closeModal()">ОТМЕНА</button>
         <button class="terminal-button" onclick="addMarketItem()">ДОБАВИТЬ</button>`
    );
    
    // Handle image preview
    document.getElementById('itemImage').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('imagePreview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 150px; border-radius: 4px;">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

async function addMarketItem() {
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    const price = document.getElementById('itemPrice').value;
    const currency = document.getElementById('itemCurrency').value;
    const imageFile = document.getElementById('itemImage').files[0];
    
    if (!name || !description || !price) {
        showCustomConfirm('Название, описание и цена обязательны', () => {});
        return;
    }
    
    try {
        let imageUrl = 'https://via.placeholder.com/80x80/001a0d/a65a2e?text=АРТЕФАКТ';
        
        // Upload image if provided
        if (imageFile) {
            const storageRef = storage.ref(`market/${Date.now()}_${imageFile.name}`);
            await storageRef.put(imageFile);
            imageUrl = await storageRef.getDownloadURL();
        }
        
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        
        await db.collection('market').add({
            name: name,
            description: description,
            price: parseInt(price),
            currency: currency,
            image: imageUrl,
            sellerId: currentUser.uid,
            sellerName: userData.callsign,
            timestamp: new Date()
        });
        
        closeModal();
    } catch (error) {
        console.error('Add item error:', error);
        showCustomConfirm('Ошибка при добавлении предмета', () => {});
    }
}

function loadMarketItems() {
    db.collection('market')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            marketItems.innerHTML = '';
            
            if (snapshot.empty) {
                marketItems.innerHTML = '<div class="system-message">Рынок пуст...</div>';
                return;
            }
            
            snapshot.forEach(doc => {
                const item = doc.data();
                displayMarketItem(item, doc.id);
            });
        });
}

function displayMarketItem(item, itemId) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'market-item';
    
    // Получаем символ валюты
    const currencySymbol = item.currency === 'USD' ? '$' : 
                          item.currency === 'EUR' ? '€' : '☢';
    
    itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="market-item-image">
        <div class="market-item-info">
            <div class="market-item-title">${item.name}</div>
            <div class="market-item-description">${item.description}</div>
            <div class="market-item-price">${item.price} ${currencySymbol}</div>
            <div class="market-item-seller">Продавец: ${item.sellerName}</div>
        </div>
        <div class="market-item-actions">
            <button class="terminal-button market-buy-btn">КУПИТЬ</button>
            ${item.sellerId === currentUser.uid || isAdmin ? 
                `<button class="terminal-button market-delete-btn" onclick="deleteMarketItem('${itemId}')">×</button>` : ''}
        </div>
    `;
    
    marketItems.appendChild(itemDiv);
}

async function deleteMarketItem(itemId) {
    showCustomConfirm('Удалить этот предмет?', async () => {
        try {
            await db.collection('market').doc(itemId).delete();
        } catch (error) {
            console.error('Delete item error:', error);
        }
    });
}

// Profile Functions
async function saveProfile() {
    const newCallsign = nicknameInput.value.trim();
    const rank = rankSelect.value;
    
    if (!newCallsign) {
        showCustomConfirm('Позывной не может быть пустым', () => {});
        return;
    }
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            callsign: newCallsign,
            rank: rank
        });
        
        topUserCallsign.textContent = newCallsign;
        showCustomConfirm('Профиль обновлен', () => {});
    } catch (error) {
        console.error('Save profile error:', error);
        showCustomConfirm('Ошибка при сохранении профиля', () => {});
    }
}

async function handleAvatarUpload() {
    const file = avatarInput.files[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showCustomConfirm('Выберите изображение', () => {});
        return;
    }
    
    try {
        // Создаем уникальное имя файла
        const fileName = `${currentUser.uid}_${Date.now()}_${file.name}`;
        const storageRef = storage.ref(`avatars/${fileName}`);
        
        // Загружаем файл
        await storageRef.put(file);
        
        // Получаем URL
        const imageUrl = await storageRef.getDownloadURL();
        
        // Сохраняем URL в Firestore
        await db.collection('users').doc(currentUser.uid).update({
            avatar: imageUrl
        });
        
        // Обновляем превью
        avatarPreview.style.backgroundImage = `url(${imageUrl})`;
        avatarPreview.textContent = '';
        avatarPreview.style.backgroundSize = 'cover';
        avatarPreview.style.backgroundPosition = 'center';
        
        // Обновляем topUserCallsign с новым аватаром (если нужно)
        showCustomConfirm('Аватар загружен', () => {});
        
    } catch (error) {
        console.error('Avatar upload error:', error);
        showCustomConfirm('Ошибка при загрузке аватара', () => {});
    }
}

// Make functions globally accessible
window.deleteChatMessage = deleteChatMessage;
window.deleteMarketItem = deleteMarketItem;
window.showPage = showPage;
