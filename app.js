const express = require('express');

const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API Products & Carts - Entrega 1. Usa /api/products y /api/carts');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
