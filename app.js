require('dotenv').config();
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const connectDB = require('./src/config/database');

const productRoutes = require('./src/routes/product.routes');
const cartRoutes = require('./src/routes/cart.routes');
const viewsRoutes = require('./src/routes/views.routes');

const ProductService = require('./src/services/product.service');
const productService = new ProductService();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// HANDLEBARS
const exphbs = require('express-handlebars');

const hbs = exphbs.create({
  helpers: {
    eq: (a, b) => a == b,
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));
// ROUTES
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', viewsRoutes);

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
});

// START SERVER
const server = app.listen(PORT, async () => {
  await connectDB(process.env.MONGO_URL);
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log("MONGO_URL desde app.js:", process.env.MONGO_URL);
});

// SOCKET.IO
const io = new Server(server);
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Cliente conectado a WebSocket');

  socket.on('new-product', async (data) => {
    try {
      const newProd = await productService.create(data);
      io.emit('product-added', newProd);
    } catch (err) {
      console.error('Error creando producto via socket', err);
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

console.log("MONGO_URL desde app.js:", process.env.MONGO_URL);

