// Full Public Access - No Auth Blocking

// Initialize currentUser from localStorage or fallback
window.currentUser = {
    username: localStorage.getItem('stalker_name') || 'erik',
    level: 'Сталкер',
    avatar: localStorage.getItem('stalker_avatar') || 'https://picsum.photos/seed/erik/100/100.jpg'
};

// Public messaging without auth restrictions
window.sendMessage = async function() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message || !window.dbFunctions) return;

    // Clear input immediately for responsive UI
    input.value = '';

    const { collection, addDoc } = window.dbFunctions;

    try {
        // Use public nickname from localStorage
        const author = window.currentUser ? window.currentUser.username : 'Сталкер';
        
        await addDoc(collection(window.db, 'messages'), {
            author: author,
            content: message,
            timestamp: Date.now(),
            level: window.currentUser ? window.currentUser.level : 'newcomer',
            avatar: window.currentUser ? window.currentUser.avatar : null
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

// Display Message with Public Identity
function displayMessage(messageData) {
    if (!messageData) return;
    
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
        const isOwn = messageData.author === (window.currentUser ? window.currentUser.username : 'Сталкер');
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
