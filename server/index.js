const { Server } = require('socket.io');

const io = new Server(3001, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
});