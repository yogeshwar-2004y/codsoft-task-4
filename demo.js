document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Connect to WebSocket server

    const loginForm = document.getElementById('login-form');
    const chatContainer = document.getElementById('chat-container');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const userSpan = document.getElementById('user');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message');
    const chatMessages = document.getElementById('chat-messages');

    let currentUser = null;

    // Handle login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Send login credentials to server for authentication
        socket.emit('login', { username, password });
    });

    // Handle successful login
    socket.on('login-success', (user) => {
        currentUser = user;
        userSpan.textContent = currentUser.username;
        loginForm.reset();
        loginForm.style.display = 'none';
        chatContainer.style.display = 'block';
    });

    // Handle failed login
    socket.on('login-fail', () => {
        alert('Invalid username or password. Please try again.');
    });

    // Handle incoming messages
    socket.on('message', (data) => {
        displayMessage(data);
    });

    // Handle message form submission
    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();

        if (message !== '') {
            socket.emit('chat-message', { message, sender: currentUser.username });
            messageInput.value = '';
        }
    });

    // Display incoming messages
    function displayMessage(data) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        if (data.sender === currentUser.username) {
            messageDiv.classList.add('me');
        }
        messageDiv.textContent = `${data.sender}: ${data.message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }
});
