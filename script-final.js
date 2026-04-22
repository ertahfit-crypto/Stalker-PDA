// Firebase Auth Integration with Proper State Management

// Initialize global variables
window.currentUser = null;

// Firebase Auth state observer
onAuthStateChanged(getAuth(), (user) => {
    if (user) {
        // User is authenticated - set global state
        window.currentUser = {
            username: user.displayName || user.email,
            uid: user.uid,
            avatar: user.photoURL,
            level: 'newcomer'
        };
        
        console.log('👤 Пользователь авторизован:', user.displayName);
        
        // Start chat sync after successful login
        if (typeof startChatSync === 'function') {
            startChatSync();
        }
        if (typeof startReportsSync === 'function') {
            startReportsSync();
        }
        
        // Update UI with user data
        if (typeof updateUI === 'function') {
            updateUI();
        }
        
        // Hide login screen and show main screen
        showMainScreen();
        
    } else {
        // User is not authenticated - clear global state
        window.currentUser = null;
        console.log('📡 Пользователь не авторизован');
        
        // Show login screen
        showLoginScreen();
    }
});

// Chat Functions with Proper Auth
window.sendMessage = async function() {
    if (!window.currentUser) {
        console.error('📡 Пользователь не авторизован');
        showGlitchEffect('sendBtn', 'АВТОРИЗАЦИЯ');
        return;
    }
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message || !window.dbFunctions) return;

    // Clear input immediately for responsive UI
    input.value = '';

    const { collection, addDoc } = window.dbFunctions;

    try {
        // Check if user is authenticated
        const auth = window.getAuth();
        if (!auth) {
            console.error('📡 Пользователь не авторизован');
            showGlitchEffect('sendBtn', 'АВТОРИЗАЦИЯ');
            return;
        }
        
        await addDoc(collection(window.db, 'messages'), {
            author: (auth && auth.displayName) ? auth.displayName : (auth && auth.email) ? auth.email : 'Аноним',
            authorId: auth.uid,
            content: message,
            timestamp: Date.now(),
            level: 'newcomer',
            avatar: auth.photoURL || null
        });
        console.log("✅ Сообщение в базе");
    } catch (e) {
        console.error("❌ Ошибка ПДА:", e);
        input.value = message; // Restore text if failed
        if (typeof showGlitchEffect === 'function') {
            showGlitchEffect('sendBtn', 'ОШИБКА СЕТИ');
        }
    }
}

// Display Message with Proper Auth Check
function displayMessage(messageData) {
    if (!messageData || !window.currentUser) return;
    
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const messageElement = document.createElement('div');
    const time = new Date(messageData.timestamp).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Determine message type and apply appropriate class
    if (messageData.author === 'SYSTEM') {
        messageElement.className = 'system-message';
        messageElement.innerHTML = `<div class="system-text">${messageData.content}</div>`;
    } else {
        const isOwn = messageData.author === window.currentUser.username;
        messageElement.className = `user-message ${isOwn ? 'own-message' : 'other-message'}`;
        messageElement.dataset.messageId = messageData.id;

        const deleteButton = isOwn && messageData.id ?
            `<span class="delete-btn" onclick="deleteMessage('${messageData.id}')" style="color:#ff6b6b; cursor:pointer; margin-left:8px; font-size:11px; opacity:0.7;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">[X]</span>` : '';

        const authorName = messageData.author || 'Аноним';
        const avatarUrl = messageData.avatar || `https://picsum.photos/seed/${authorName}/30/30.jpg`;

        const userId = authorName.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        if (messageData.isVoice) {
            messageElement.innerHTML = `
                <div class="message-header">
                    <img src="${avatarUrl}" alt="${messageData.author}" class="message-avatar clickable-user" data-user="${userId}">
                    <div class="message-info" style="display:flex; align-items:center;">
                        <span class="message-author level-${messageData.level} clickable-user" data-user="${userId}">${authorName}</span>
                        <span class="message-time" style="color:#00ff00; font-weight:bold; margin-left:auto;">${time}</span>
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
                    <div class="message-info" style="display:flex; align-items:center;">
                        <span class="message-author level-${messageData.level} clickable-user" data-user="${userId}">${authorName}</span>
                        <span class="message-time" style="color:#00ff00; font-weight:bold; margin-left:auto;">${time}</span>
                        ${deleteButton}
                    </div>
                </div>
                <div class="message-content">${messageData.content}</div>
            `;
        }
    }

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Initialize Firebase and start sync when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure Firebase is ready
    setTimeout(() => {
        if (typeof startChatSync === 'function') {
            startChatSync();
        }
        if (typeof startReportsSync === 'function') {
            startReportsSync();
        }
    }, 500);
});
