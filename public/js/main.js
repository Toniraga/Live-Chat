const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();

// get Username and room from Url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Join Chatroom 
socket.emit('joinRoom', { username, room });

// Get Room and Users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})


// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get Message Text
    const msg = e.target.elements.msg.value

    // Emit message To The Server
    socket.emit('chatMessage', msg);

    // Clear Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// Output message to DOM
function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${msg.username} <span>${msg.time}</span></p>
        <p class="text">
            ${msg.text}
        </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add Room Name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add Users To DOM
function outputUsers(users) {
    userList.innerHTML = `
      ${users.map(user => `<li> ${user.username} </li>`).join('')}
    `;
}