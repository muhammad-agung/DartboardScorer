const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { SerialPort } = require('serialport');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//For PC
// const port = new SerialPort({
//   path: 'COM7',
//   baudRate: 9600,
// });

// for RPI
const port = new SerialPort({
  path: '/dev/ttyUSB0',
  baudRate: 9600,
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

port.on('data', (data) => {
  const numericData = data.toString();
  io.emit('arduinoData', numericData);
  console.log(numericData);
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
