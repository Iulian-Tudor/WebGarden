window.onload = async () => {
    const res = await fetch('/product' + window.location.search);
    const product = await res.json();

    document.querySelector('.title').textContent = product.name;
    document.querySelector('.price').textContent = product.price + '$';
    document.querySelector('.description').textContent = product.user_description;
    document.querySelector('.flower-img').src = product.image_url;

    const productHandle = getHandle();

    document.querySelector('.cart-btn').onclick = async () => {
        await fetch('/cart_products', {
            method: 'POST',
            body: JSON.stringify(productHandle),
            headers: {
                'content-type': 'application/json'
            }
        });
        window.location.href = '/html/shopping_cart.html';
    }
}

function getHandle() {
    const dataRaw = window.location.search.split('?')[1];

    const data = {};
    for(const pair of dataRaw.split('&')) {
        const [key, value] = pair.split('=').map(decodeURIComponent);
        data[key] = value;
    }
    data['price'] = parseInt(data['price']);
    return data;
}
