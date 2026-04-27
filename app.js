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

// Данные о локациях
const locations = {
    cordon: {
        name: "Кордон",
        description: "Вход в Зону. Первое, что видят новички. Здесь находятся лагерь новичков и пост военных. Относительно безопасное место, но beware - мутанты и бандиты не дремлют. Идеальное место для старта.",
        image: "blob:https://gemini.google.com/20ff9b8b-14f7-4880-8938-4e715af50f02",
        danger: "НИЗКАЯ",
        artifacts: "ОБЫЧНЫЕ",
        mutants: "СВИНЬИ, ПСЫ"
    },
    garbage: {
        name: "Свалка",
        description: "Промышленная зона с кучами металлолома. Бандиты считают это своей территорией. Множество аномалий и артефактов. Здесь можно найти хорошие вещи, если сможешь отбиться от бандитов.",
        image: "blob:https://gemini.google.com/3b2e0071-c983-4303-b347-5a6456644fb7",
        danger: "СРЕДНЯЯ",
        artifacts: "ХОРОШИЕ",
        mutants: "СВИНЬИ, ПЛЕСЕНЬ"
    },
    agroprom: {
        name: "Агропром",
        description: "Подземный исследовательский комплекс. Множество секретов и опасностей. Здесь проводились эксперименты, которые привели к появлению странных созданий. Очень опасно для неподготовленных сталкеров.",
        image: "https://via.placeholder.com/600x250/0a0a0a/00ff41?text=АГРОПРОМ",
        danger: "ВЫСОКАЯ",
        artifacts: "РЕДКИЕ",
        mutants: "КРОВОСОСЫ, СНОРКИ"
    },
    darkvalley: {
        name: "Тёмная долина",
        description: "Территория контролируемая бандитами. Старый завод и заброшенные деревни. Множество укрытий и тайников. Не лучшее место для одиноких сталкеров.",
        image: "https://via.placeholder.com/600x250/0a0a0a/00ff41?text=ТЁМНАЯ ДОЛИНА",
        danger: "СРЕДНЯЯ",
        artifacts: "ОБЫЧНЫЕ",
        mutants: "ЗОМБИ, ПСЫ"
    },
    bar: {
        name: "Бар 100 Рентген",
        description: "Центральная точка для всех сталкеров. Здесь можно найти работу, информацию и отдохнуть. Бармен - лучший источник слухов. Здесь собираются все группировки.",
        image: "https://via.placeholder.com/600x250/0a0a0a/00ff41?text=БАР",
        danger: "НИЗКАЯ",
        artifacts: "НЕТ",
        mutants: "НЕТ"
    },
    yantar: {
        name: "Янтарь",
        description: "Научная станция посреди болот. Высокий уровень радиации и психоактивных выбросов. Ученые изучают Зону, но им постоянно нужна помощь. Множество уникальных аномалий.",
        image: "https://via.placeholder.com/600x250/0a0a0a/00ff41?text=ЯНТАРЬ",
        danger: "ВЫСОКАЯ",
        artifacts: "УНИКАЛЬНЫЕ",
        mutants: "ЗОМБИ, КОНТРОЛЛЕР"
    },
    military: {
        name: "Военные склады",
        description: "Охраняемая территория военных. Хорошее снаряжение, но очень опасно. Военные стреляют без предупреждения. Только опытные сталкеры решаются сюда заходить.",
        image: "https://via.placeholder.com/600x250/0a0a0a/00ff41?text=ВОЕННЫЕ СКЛАДЫ",
        danger: "ЭКСТРЕМАЛЬНАЯ",
        artifacts: "ОТЛИЧНЫЕ",
        mutants: "НЕТ"
    },
    pripyat: {
        name: "Припять",
        description: "Мёртвый город-призрак. Когда-то здесь жили семьи ученых и работников ЧАЭС. Теперь - логово монстров и место последнего испытания для сталкеров. Очень высокая радиация.",
        image: "https://via.placeholder.com/600x250/0a0a0a/00ff41?text=ПРИПЯТЬ",
        danger: "ЭКСТРЕМАЛЬНАЯ",
        artifacts: "УНИКАЛЬНЫЕ",
        mutants: "ЧЕРНОПЫХ, БЮВЕР"
    },
    chernobyl: {
        name: "ЧАЭС",
        description: "Сердце Зоны. Самый опасный и самый таинственный участок. Здесь находится Изгнанник и Монолит. Никто не знает, что скрывается в саркофаге. Легендарное место.",
        image: "https://via.placeholder.com/600x250/0a0a0a/00ff41?text=ЧАЭС",
        danger: "ЛЕТАЛЬНАЯ",
        artifacts: "ЛЕГЕНДАРНЫЕ",
        mutants: "МОНОЛИТ, ИЗГНАННИК"
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthState();
});

function initializeApp() {
    // Добавляем эффекты при загрузке
    animateRadiationLevel();
    animateTerminalLines();
    
    // Обновляем время каждую минуту
    setInterval(updateTime, 60000);
    
    // Эффект помех периодически
    setInterval(addGlitchEffect, 8000);
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
        updateUserInterface(user);
    });
}

function updateUserInterface(user) {
    const userInfo = document.getElementById('userInfo');
    const username = userInfo.querySelector('.stalker-name');
    
    if (user) {
        username.textContent = user.displayName || user.email;
        userInfo.style.display = 'flex';
        
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
        userInfo.style.display = 'none';
        
        // Блокируем чат
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const authWarning = document.getElementById('authWarning');
        
        messageInput.disabled = true;
        sendBtn.disabled = true;
        authWarning.style.display = 'block';
        
        // Отписываемся от чата
        if (chatListener) {
            chatListener();
            chatListener = null;
        }
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
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
    
    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        
        // Обновляем displayName
        await result.user.updateProfile({
            displayName: username
        });
        
        switchSection('home');
        showSystemMessage('Регистрация завершена. Добро пожаловать в Зону, ' + username);
    } catch (error) {
        errorDiv.textContent = 'Ошибка регистрации: ' + getErrorMessage(error.code);
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function logout() {
    auth.signOut().then(() => {
        switchSection('home');
        showSystemMessage('Выход из системы выполнен');
    });
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
    
    chatListener = db.collection('chatMessages')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .onSnapshot(function(snapshot) {
            chatMessages.innerHTML = '';
            
            snapshot.docs.reverse().forEach(doc => {
                const message = doc.data();
                addMessageToChat(message);
            });
            
            // Прокручиваем вниз
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || !currentUser) return;
    
    const messageData = {
        text: message,
        user: currentUser.displayName || currentUser.email,
        userId: currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
    
    messageDiv.className = 'user-log';
    messageDiv.innerHTML = `
        <span class="log-time">[${timestamp}]</span>
        <span class="log-text">&lt;${message.user}&gt; ${message.text}</span>
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

// Экспорт функций для глобального доступа
window.switchSection = switchSection;
window.showLocation = showLocation;
window.closeLocationModal = closeLocationModal;
window.logout = logout;
window.sendMessage = sendMessage;
