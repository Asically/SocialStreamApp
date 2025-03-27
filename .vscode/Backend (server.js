// Real-time Chat
const chatHistory = [];

io.on('connection', (socket) => {
    socket.on('send-message', (data) => {
        chatHistory.push(data);
        io.emit('new-message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
