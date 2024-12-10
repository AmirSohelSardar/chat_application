const socket = io('http://localhost:3000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

const audio = new Audio('ting.mp3');

// Function to append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll

    if (position === 'left') {
        audio.play();
    }
};

// Prompt user for their name when joining
const username = prompt("Enter your name to join ChatSphere");
socket.emit('new-user-joined', username);

// Listen for form submission to send messages
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''; // Clear input field
});

// When a new user joins, notify the chat
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'center');
});

// When a message is received, display it
socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});

// When a user leaves the chat, notify others
socket.on('left', (name) => {
    append(`${name} left the chat`, 'center');
});
