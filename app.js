const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');
const viewsRouter = require('./routers/viewsRouter');

const app = express();
const PORT = 8080;

// HANDLERS Y CONFIG
const exphbs = require('express-handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.send('API Products & Carts - Entrega 2 funcionando. Usá /api/products /api/carts o /home /realtimeproducts');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
});


const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const io = new Server(server);


app.set('io', io);

io.on('connection', (socket) => {
    console.log('Cliente conectado a WebSocket');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

