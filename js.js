const express = require('express');
const http = require('http');

const app = express();

app.use(express.json());

const httpServer = http.createServer(app);

const server = require('socket.io');

const io = server(httpServer, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.post('/emit-event', (req, res) => {
    try {
        const { event, data } = req.body

        io.emit(event, data);

        res.status(200).json({
            success: true,
            message: 'Notification sent successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});