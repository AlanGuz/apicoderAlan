const socket = io();


socket.on('product-added', (product) => {
    const list = document.getElementById('productList');

    const li = document.createElement('li');
    li.id = `prod-${product.id}`;
    li.innerHTML = `<strong>${product.title}</strong> — $${product.price}`;

    list.appendChild(li);
});

socket.on('product-deleted', (id) => {
    const item = document.getElementById(`prod-${id}`);
    if (item) item.remove();
});
