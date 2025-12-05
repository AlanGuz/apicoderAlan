const socket = io();

// Si el server emite product-added/product-deleted los agregamos/eliminamos
socket.on('product-added', (product) => {
    const list = document.getElementById('productList');
    if (!list) return;
    const li = document.createElement('li');
    li.id = `prod-${product._id || product.id}`;
    li.innerHTML = `<strong>${product.title}</strong> — $${product.price}`;
    list.appendChild(li);
});

socket.on('product-deleted', (id) => {
    const item = document.getElementById(`prod-${id}`);
    if (item) item.remove();
});

// FORM: en realtime view podrías usar esto para enviar por socket
const form = document.getElementById('productForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      code: document.getElementById('code').value,
      price: Number(document.getElementById('price').value),
      stock: Number(document.getElementById('stock').value),
      category: document.getElementById('category').value,
      thumbnails: document.getElementById('thumbnails').value ? document.getElementById('thumbnails').value.split(',').map(s => s.trim()) : [],
      status: true
    };
    socket.emit('new-product', product);
    form.reset();
  });
}
